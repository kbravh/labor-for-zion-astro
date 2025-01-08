import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { logPageView } from "./utils/db";
import { getTitleAndSlugMaps } from "./utils/md";
import { Locale, LOCALES } from "@validation/i18n";

const headers = {
  "Access-Control-Allow-Origin": "https://laborforzion.com",
  "Content-Type": "application/json",
};

const isValidLocale = (locale: string | undefined): locale is Locale =>
  LOCALES.includes(locale as Locale);

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const { locale, slug, dev } = event.queryStringParameters || {};

  if (dev === "true") {
    return {
      statusCode: 200,
      body: JSON.stringify({ count: 1123 }),
      headers,
    };
  }

  if (!slug) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "No slug" }),
      headers,
    };
  }

  if (!locale) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "No locale" }),
      headers,
    };
  }

  if (!isValidLocale(locale)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Not a valid locale" }),
      headers,
    };
  }

  try {
    const { slugToTitle } = getTitleAndSlugMaps(locale);
    const set = new Set(Object.keys(slugToTitle));

    if (!set.has(slug)) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Slug not found" }),
        headers,
      };
    }

    const count = await logPageView({slug, locale});
    return {
      statusCode: 200,
      body: JSON.stringify({ count }),
      headers,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
        headers,
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Unknown error ocurred" }),
        headers,
      };
    }
  }
};
