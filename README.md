# Labor for Zion

## Analytics

Analytics are handled by the `<hit-counter>`. It counts individual page views and utm tags. Data is stored in the Coolify postgres database `laborforzion`.

## Static assets

Static assets (like fonts) are stored in S3 (`laborforzion-assets`) and served by an AWS Cloudfront distribution at `https://assets.laborforzion.com`.

### Videos

The exception to this is videos for streaming. These are split into parts and have an m3u8 manifest generated.
1. Place the video to transcode in `video_input`.
2. Run `npm run video:transcode <video_name.mp4>`. The output will be placed into a folder called `video_output/video_name`.
3. Upload those files to Cloudflare by running `npm run video:upload <video_name>`.

