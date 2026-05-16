# @carryfeed/cli

CLI wrapper for the hosted [CarryFeed](https://carryfeed.com) API.

Use it when an agent or script needs public X/Twitter profile, post, article, or media metadata with the source URL preserved.

## Quick Start

```bash
npx -y @carryfeed/cli health --compact
npx -y @carryfeed/cli resolve https://x.com/user/status/123 --compact
npx -y @carryfeed/cli media https://x.com/user/status/123 --compact
npx -y @carryfeed/cli profile NASA --statuses --count 5 --compact
npx -y @carryfeed/cli post 1234567890 --compact
```

The CLI calls `https://api.carryfeed.com` by default and prints JSON. Public links only; private, protected, deleted, restricted, or login-only content is not supported.

## Commands

```bash
carryfeed health [--base-url URL] [--compact]
carryfeed resolve <url-or-handle-or-id> [--provider fxtwitter|direct] [--no-cache] [--compact]
carryfeed media <post-url-or-id> [--provider fxtwitter|direct] [--no-cache] [--compact]
carryfeed profile <handle> [--statuses|--media] [--count 5] [--cursor CURSOR] [--no-cache] [--compact]
carryfeed post <id> [--handle HANDLE] [--provider fxtwitter|direct] [--no-cache] [--compact]
carryfeed download-url <media-url> [--filename NAME]
```

## Common Workflows

Resolve an unknown input:

```bash
npx -y @carryfeed/cli resolve https://x.com/user/status/123 --compact
npx -y @carryfeed/cli resolve NASA --compact
```

List media candidates from a public post:

```bash
npx -y @carryfeed/cli media https://x.com/user/status/123 --compact
```

Read a public profile and recent public posts:

```bash
npx -y @carryfeed/cli profile NASA --compact
npx -y @carryfeed/cli profile NASA --statuses --count 5 --compact
```

Read recent public profile media:

```bash
npx -y @carryfeed/cli profile NASA --media --count 5 --compact
```

Build a CarryFeed download proxy URL for a public media URL returned by CarryFeed:

```bash
npx -y @carryfeed/cli download-url "https://pbs.twimg.com/media/example.jpg" --filename example.jpg
```

## Options

- `--compact`: print compact JSON for tools and scripts.
- `--no-cache`: bypass CarryFeed edge cache when fresh data matters.
- `--base-url URL`: use another CarryFeed-compatible endpoint.
- `--count N`: request recent profile statuses or media, usually `5` to `10` for agents.
- `--cursor CURSOR`: continue a profile statuses or media request when the prior output includes a cursor.
- `--provider fxtwitter|direct`: leave unset unless debugging provider behavior.
