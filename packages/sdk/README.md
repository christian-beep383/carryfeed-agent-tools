# @carryfeed/sdk

JavaScript SDK wrapper for the hosted CarryFeed API.

```js
import { CarryFeedClient } from "@carryfeed/sdk";

const client = new CarryFeedClient();

await client.resolve("https://x.com/user/status/123");
await client.resolveMedia("https://x.com/user/status/123");
await client.getProfile("NASA");
await client.getProfileStatuses("NASA", { count: 5 });
```

The SDK calls `https://api.carryfeed.com` by default and only wraps public API endpoints.
