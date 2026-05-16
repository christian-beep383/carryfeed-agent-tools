# @carryfeed/sdk

JavaScript SDK wrapper for the hosted [CarryFeed](https://carryfeed.com) API.

CarryFeed gives agents and scripts a stable way to resolve public X/Twitter links without driving a browser or depending on a logged-in X session. It keeps source URLs, public text, author context, and media candidates together.

```js
import { CarryFeedClient } from "@carryfeed/sdk";

const client = new CarryFeedClient();

await client.resolve("https://x.com/user/status/123");
await client.resolveMedia("https://x.com/user/status/123");
await client.getProfile("NASA");
await client.getProfileStatuses("NASA", { count: 5 });
```

The SDK calls `https://api.carryfeed.com` by default and only wraps public API endpoints.

Links:

- Website: https://carryfeed.com
- Agent discovery: https://carryfeed.com/llms.txt
- API health: https://api.carryfeed.com/health
- Video downloader: https://carryfeed.com/twitter-video-downloader
- Twitter viewer guide: https://carryfeed.com/how-to-view-twitter-without-account
