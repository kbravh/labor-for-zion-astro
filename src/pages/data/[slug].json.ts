import type {APIRoute} from 'astro';
import {logPageView} from '../../utils/db';
import {getTitleAndSlugMaps} from '../../utils/mdUtils';

export const prerender = false;

export const GET: APIRoute = async ({params}) => {
  if (import.meta.env.DEV) {
    return new Response(JSON.stringify({count: 1123}), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const {slug} = params;

  if (!slug) {
    return new Response(null, {
      status: 400,
      statusText: 'No slug',
    });
  }

  const {slugToTitle} = await getTitleAndSlugMaps();
  const set = new Set([...Object.keys(slugToTitle)]);

  if (!set.has(slug)) {
    return new Response(null, {
      status: 404,
      statusText: 'Slug not found',
    });
  }

  const count = await logPageView(slug);
  return new Response(
    JSON.stringify({
      count,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};
