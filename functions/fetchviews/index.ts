import type {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {fetchPageViews} from './utils/db';

const headers = {
  'Access-Control-Allow-Origin': 'https://laborforzion.com',
  'Content-Type': 'application/json',
};

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const pageViews = await fetchPageViews();
    return {
      statusCode: 200,
      body: JSON.stringify(pageViews),
      headers,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        statusCode: 500,
        body: JSON.stringify({error: error.message}),
        headers,
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({error: 'Unknown error ocurred'}),
        headers,
      };
    }
  }
};
