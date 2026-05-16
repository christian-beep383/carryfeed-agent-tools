# @carryfeed/mcp

MCP server for CarryFeed's hosted public X/Twitter profile, post, article, and media API.

CarryFeed gives agents one source-preserving way to resolve public X/Twitter links without browser login flows or internal scraper code. This package is a wrapper around the hosted CarryFeed API; it does not include CarryFeed's internal resolver implementation.

## Install

Run directly with `npx`:

```bash
npx -y @carryfeed/mcp
```

Or install locally:

```bash
npm install @carryfeed/mcp
```

## MCP Config

```json
{
  "mcpServers": {
    "carryfeed": {
      "command": "npx",
      "args": ["-y", "@carryfeed/mcp"]
    }
  }
}
```

## Tools

- `carryfeed_health`: check API health.
- `carryfeed_resolve`: resolve a public X/Twitter profile, post, article-style link, or id.
- `carryfeed_media`: list media candidates exposed by a public post.
- `carryfeed_profile`: resolve public profile metadata by handle.
- `carryfeed_profile_statuses`: fetch recent public statuses for a profile.
- `carryfeed_profile_media`: fetch recent public media posts for a profile.
- `carryfeed_post`: resolve a public post by id.
- `carryfeed_download_url`: build a CarryFeed download proxy URL for returned media URLs.

## Environment

- `CARRYFEED_API_BASE_URL`: optional API base URL. Defaults to `https://api.carryfeed.com`.

## Boundaries

CarryFeed works with public X and Twitter links only. It does not unlock private, protected, deleted, restricted, or login-only content, and it is not an official X/Twitter API.

Links:

- Website: <https://carryfeed.com>
- API health: <https://api.carryfeed.com/health>
- Agent discovery: <https://carryfeed.com/llms.txt>
- CLI package: <https://www.npmjs.com/package/@carryfeed/cli>
- SDK package: <https://www.npmjs.com/package/@carryfeed/sdk>
