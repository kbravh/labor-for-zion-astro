# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Labor for Zion is an Astro-based static site for religious content (primarily Latter-day Saint scripture study notes). It features:

- Multi-language support (English/Spanish)
- Digital garden/Zettelkasten-style note linking with double-bracket wiki links (`[[Note Title]]`)
- Video streaming with HLS transcoding
- Analytics tracking via custom web component
- Static asset hosting on AWS S3/CloudFront

## Commands

### Development
- `npm run dev` - Start dev server (http://localhost:4321)
- `npm run build` - Build for production (uses `--remote` flag for database)
- `npm run preview` - Preview production build
- `npm start` - Start standalone Node.js server from built output

### Testing
- `npm test` - Run Vitest tests
- `npm run test:visual` - Run tests with UI and coverage
- `npm run test:coverage` - Run tests with coverage report

### Code Quality
- `npm run check` - Run Biome linter/formatter with auto-fix

### Database
- `npm run db:push` - Push database schema to remote (Turso)

### Video Processing
- `npm run video:transcode <video_name.mp4>` - Transcode video in `video_input/` to HLS format, output to `video_output/video_name/`
- `npm run video:upload <video_name>` - Upload transcoded video to Cloudflare

### Maintenance
- `npm run upgrade` - Interactive dependency updates (npm-check-updates)
- `npm run upgrade:astro` - Run Astro upgrade helper

## Architecture

### Content System
- **Notes location**: `notes/[locale]/[year]/[month]/[filename].md`
  - Example: `notes/en/2022/09/bread-of-the-presence.md`
- **Frontmatter schema** (`src/validation/md.ts`):
  - Required: `title`, `description`, `date`, `language` (en/es)
  - Optional: `updated`, `aliases[]`, `tags[]`, `translations{}`
- **Wiki-style linking**: Use `[[Note Title]]` or `[[Note Title|Display Text]]` for internal links
- **Embed notes**: Use `![[Note Title]]` to embed another note's content
- **Link processing**: `src/utils/md/readAndParse.ts` handles converting bracket links to HTML links and resolving backlinks

### i18n
- Default locale: `en`, supported: `en`, `es` (configured in `astro.config.mjs`)
- Translations config in `src/utils/i18n/` and `src/validation/i18n.ts`
- Route structure: `/` (English), `/es/` (Spanish)
- Frontmatter `translations` field maps slugs across locales

### Data Flow
- `src/utils/md/dataStore.ts` - In-memory cache for note metadata per locale (slugs, topics, backlinks, etc.)
- `src/utils/md/readAndParse.ts` - Core utilities for reading/parsing markdown files and extracting links
- Note paths are walked recursively, supporting nested directory structures

### Database
- Turso (LibSQL) database via `@astrojs/db`
- Schema in `db/config.ts`
- Single `Analytics` table tracks page views with UTM params
- Actions defined in `src/actions/` for logging and retrieving views

### Analytics
- Custom web component `<close-encounter>` (see README)
- Data stored in Turso database `labor-for-zion`
- Track page views, UTM tags, referrer, screen resolution

### Styling
- Tailwind CSS v4 (configured via Vite plugin in `astro.config.mjs`)
- Config: `tailwind.config.mjs`
- Typography plugin for prose content

### Testing
- Vitest with jsdom environment
- Coverage provider: v8
- Test location: `src/tests/` mirrors `src/` structure
- Snapshot tests for scripture parsing

### Static Assets
- Fonts/images: S3 bucket `laborforzion-assets` → CloudFront at `https://assets.laborforzion.com`
- Videos: Cloudflare (HLS streaming with m3u8 manifests)

### Key Utilities
- **Scripture data**: JSON files in `src/data/` (Book of Mormon, D&C, Bible, PGP)
- **Scripture utilities**: `src/utils/scriptures.ts` for parsing references
- **SEO/OpenGraph**: `src/utils/seo.ts`, `src/utils/openGraph.ts`
- **RSS feeds**: Generated via `src/utils/rss.ts` at `/rss.xml` and `/es/rss.xml`

## Development Notes

- Node version: 22 (see `package.json` engines)
- Build adapter: `@astrojs/node` in standalone mode
- Sitemap auto-generates with last-modified dates for article pages
- Biome is the preferred code formatter/linter (not ESLint/Prettier)
