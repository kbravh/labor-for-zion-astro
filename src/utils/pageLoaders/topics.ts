import { getArticles, getNoteTopics } from "@utils/md/readAndParse";
import type { Locale } from "@validation/i18n";
import type { GetStaticPaths } from "astro";
import slugify from "slugify";

export const topicGetStaticPaths = (locale: Locale) => (async ({ paginate }) => {
  const { articleTopics } = await getNoteTopics(locale);
  const results = await Promise.all(
    [...articleTopics].map(async (topic) => {
      const matchingPosts = await getArticles({ topic });
      return paginate(matchingPosts, {
        params: { topic: slugify(topic, { lower: true }) },
        pageSize: 5,
      });
    }),
  );
  return results.flat();
}) satisfies GetStaticPaths
