<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title><xsl:value-of select="/rss/channel/title"/> - RSS Feed</title>
        <meta name="description" content="{/rss/channel/description}"/>
        <style>
          /* Reset and Base Styles */
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          /* Font Faces */
          @font-face {
            font-family: 'Atkinson Hyperlegible';
            src: url('https://assets.laborforzion.com/fonts/AtkinsonRegular.woff2') format('woff2');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }

          @font-face {
            font-family: 'Atkinson Hyperlegible';
            src: url('https://assets.laborforzion.com/fonts/AtkinsonBold.woff2') format('woff2');
            font-weight: bold;
            font-style: normal;
            font-display: swap;
          }

          @font-face {
            font-family: 'Munken Sans';
            src: url('https://assets.laborforzion.com/fonts/MunkenSans.woff2') format('woff2');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }

          @font-face {
            font-family: 'Munken Sans';
            src: url('https://assets.laborforzion.com/fonts/MunkenSansBold.woff2') format('woff2');
            font-weight: bold;
            font-style: normal;
            font-display: swap;
          }

          /* Variables for colors */
          :root {
            --emerald-900: oklch(0.378 0.077 168.94);
            --emerald-800: oklch(0.432 0.095 166.913);
            --emerald-500: oklch(0.696 0.17 162.48);
            --slate-700: oklch(0.372 0.044 257.287);
            --slate-600: oklch(0.446 0.043 257.281);
            --slate-300: oklch(0.869 0.022 252.894);
            --slate-100: oklch(0.968 0.007 247.896);
            --white: #ffffff;
          }

          /* Body Styles */
          body {
            font-family: 'Atkinson Hyperlegible', Georgia, 'Times New Roman', serif;
            font-size: 1rem;
            line-height: 1.6;
            color: var(--slate-700);
            background-color: var(--white);
            max-width: 42rem;
            margin: 0 auto;
            padding: 2rem 1rem;
          }

          /* Typography */
          h1 {
            font-family: 'Munken Sans', 'Lucida Sans', 'Lucida Grande', sans-serif;
            font-size: 2.5rem;
            font-weight: bold;
            color: var(--emerald-900);
            margin-bottom: 1rem;
            line-height: 1.2;
          }

          h2 {
            font-family: 'Munken Sans', 'Lucida Sans', 'Lucida Grande', sans-serif;
            font-size: 1.5rem;
            font-weight: normal;
            color: var(--emerald-900);
            margin-bottom: 0.5rem;
            line-height: 1.3;
          }

          /* Links */
          a {
            color: var(--emerald-900);
            text-decoration: none;
          }

          a:hover {
            color: var(--emerald-800);
            text-decoration: underline;
          }

          a:focus {
            outline: 2px solid var(--emerald-500);
            outline-offset: 2px;
            border-radius: 2px;
          }

          /* Header Styles */
          header {
            margin-bottom: 3rem;
          }

          .description {
            font-size: 1rem;
            color: var(--slate-600);
            margin-bottom: 2rem;
          }

          /* RSS Info Box */
          .rss-info {
            background-color: var(--slate-100);
            padding: 1.5rem;
            border-radius: 0.5rem;
            margin-bottom: 3rem;
            border: 1px solid var(--slate-300);
          }

          .rss-info h3 {
            font-family: 'Munken Sans', 'Lucida Sans', 'Lucida Grande', sans-serif;
            font-size: 1.125rem;
            color: var(--emerald-900);
            margin-bottom: 0.75rem;
          }

          .rss-info p {
            font-size: 0.875rem;
            color: var(--slate-700);
            margin-bottom: 0.75rem;
            line-height: 1.5;
          }

          .rss-info p:last-child {
            margin-bottom: 0;
          }

          .rss-info a {
            color: var(--emerald-900);
            text-decoration: underline;
          }

          .preview-notice {
            background-color: var(--slate-100);
            padding: 1rem;
            border-radius: 0.5rem;
            margin-bottom: 2rem;
            font-size: 0.875rem;
            color: var(--slate-700);
            border-left: 4px solid var(--emerald-900);
          }

          .preview-notice strong {
            color: var(--emerald-900);
          }

          /* Feed Items */
          .feed-items {
            margin-top: 3rem;
          }

          article {
            padding-bottom: 2rem;
            margin-bottom: 2rem;
            border-bottom: 1px solid var(--slate-300);
          }

          article:last-child {
            border-bottom: none;
          }

          article h2 a {
            display: inline-block;
          }

          time {
            display: block;
            font-size: 0.875rem;
            color: var(--slate-600);
            margin-bottom: 0.75rem;
          }

          .item-description {
            font-size: 1rem;
            color: var(--slate-700);
            line-height: 1.6;
          }

          /* Responsive adjustments */
          @media (max-width: 640px) {
            h1 {
              font-size: 2rem;
            }

            h2 {
              font-size: 1.25rem;
            }

            body {
              padding: 1rem;
            }
          }
        </style>
      </head>
      <body>
        <header>
          <h1><xsl:value-of select="/rss/channel/title"/></h1>
          <p class="description"><xsl:value-of select="/rss/channel/description"/></p>

          <div class="preview-notice">
            <strong>Preview of RSS Feed</strong> - This is a web preview of the RSS feed. To subscribe, copy the URL from your browser's address bar and paste it into your RSS reader.
          </div>

          <div class="rss-info">
            <h3>What is RSS?</h3>
            <p>
              RSS (Really Simple Syndication) is a web feed that allows users and applications to access updates to websites in a standardized, computer-readable format.
            </p>
            <p>
              Subscribing to RSS feeds can allow you to track many different websites in a single news aggregator. You don't need an account with the site you're following, and the site can't track what you read or serve you ads.
            </p>
            <p>
              Learn more about RSS at <a href="https://aboutfeeds.com" target="_blank" rel="noopener noreferrer">About Feeds</a>.
            </p>
          </div>
        </header>

        <div class="feed-items">
          <xsl:apply-templates select="/rss/channel/item"/>
        </div>
      </body>
    </html>
  </xsl:template>

  <xsl:template match="item">
    <article>
      <h2>
        <a href="{link}">
          <xsl:value-of select="title"/>
        </a>
      </h2>
      <time>
        <xsl:value-of select="pubDate"/>
      </time>
      <p class="item-description">
        <xsl:value-of select="description"/>
      </p>
    </article>
  </xsl:template>

</xsl:stylesheet>
