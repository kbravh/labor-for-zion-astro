import rss from '@astrojs/rss';

export function get(context: any) {
  return rss({
    title: 'Labor for Zion',
    description: 'A blog about the gospel of Jesus Christ',
    site: context.site,
    items: [],
    customData: `<language>en-US</language>`
  })
}
