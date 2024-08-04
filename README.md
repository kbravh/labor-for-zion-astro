# Labor for Zion

## Functions
Functions in `/functions` are deployed on pushes to `main` via GitHub actions. These are configured in `.github/workflows/deploy_site.yml`.

Functions are currently used to record and view page views. This data is stored in MongoDB Cloud.

## Static assets
Static assets (like fonts) are stored in S3 (`laborforzion-assets`) and served by an AWS Cloudfront distribution at `https://assets.laborforzion.com`.
