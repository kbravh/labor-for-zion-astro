import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { logPageView } from './utils/db';
import { getTitleAndSlugMaps } from './utils/md';

// defining this outside the handler to abuse the cold start
const { slugToTitle } = getTitleAndSlugMaps();
const set = new Set(Object.keys(slugToTitle));

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (process.env.NODE_ENV === 'development') {
    return {
      statusCode: 200,
      body: JSON.stringify({ count: 1123 }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  const { slug } = event.queryStringParameters || {};

  if (!slug) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'No slug' }),
    };
  }

  if (!set.has(slug)) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Slug not found' }),
    };
  }

  try {
    const count = await logPageView(slug);
    return {
      statusCode: 200,
      body: JSON.stringify({ count }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({error: 'Unknown error ocurred'}),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    }
  }
};
