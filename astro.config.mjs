import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import { getLastUpdatedDateFromSlug } from './src/utils/mdUtils.ts';
import { basename } from 'path';

// https://astro.build/config
export default defineConfig({
  site: 'https://laborforzion.com',
  integrations: [tailwind(), sitemap({
    filter: (page) => page !== 'https://laborforzion.com/views',
    serialize: item => {
      //Fetch the last modified date for articles
      if (/.*notes\/.+/.test(item.url)) {
        const slug = basename(item.url);
        const date = getLastUpdatedDateFromSlug(slug)
        if (!date) {
          return item;
        } else {
          return {
            ...item,
            lastmod: date
          }
        }
      }
    }
  })],
});
