# CarryFeed Agent Guide

CarryFeed exposes public X/Twitter link workflows for agents. Use it when an agent needs source-context-preserving metadata for public profiles, posts, article-style links, and media files exposed by public posts.

## Use The Hosted API Through The SDK Or CLI

Preferred SDK:

```js
import { CarryFeedClient } from "@carryfeed/sdk";

const carryfeed = new CarryFeedClient();
const result = await carryfeed.resolve("https://x.com/user/status/123");
```

Preferred CLI:

```bash
npx @carryfeed/cli resolve https://x.com/user/status/123
npx @carryfeed/cli media https://x.com/user/status/123
npx @carryfeed/cli profile NASA --statuses --count 5
```

## Supported Workflows

- Resolve a public post URL or id.
- Resolve public profile metadata by handle.
- Resolve recent public profile statuses.
- Resolve recent public profile media.
- List media files exposed by a public post.
- Build a CarryFeed download proxy URL for `pbs.twimg.com` or `video.twimg.com` media.

## Boundaries

- Use public links only.
- Do not claim support for private, protected, deleted, restricted, suspended, or login-only content.
- Do not present CarryFeed as an official X/Twitter API.
- Do not use the wrapper for bulk scraping or account-backed automation.
- Keep source URLs near extracted text and media metadata.

## Current API Surface

The SDK wraps these hosted endpoints:

```text
GET https://api.carryfeed.com/health
GET https://api.carryfeed.com/api/resolve?url=
GET https://api.carryfeed.com/api/media?url=
GET https://api.carryfeed.com/api/profile/:handle
GET https://api.carryfeed.com/api/profile/:handle/statuses
GET https://api.carryfeed.com/api/profile/:handle/media
GET https://api.carryfeed.com/api/post/:id
GET https://api.carryfeed.com/download?url=
```

## Search Roadmap

Public keyword and hashtag search is planned, but it is not part of the first published SDK contract. When it is added, expose it as a clearly limited public search workflow such as `searchPublicPosts(query, { count, feed })`.

## Agent Response Pattern

When using CarryFeed in an answer, include:

- The source URL.
- The result type: profile, post, article, or media list.
- A short summary of public text or profile metadata.
- Media count and media types when present.
- Any limitation returned by the API.
