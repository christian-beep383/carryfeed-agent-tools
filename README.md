# CarryFeed Agent Tools

Public SDK, CLI, OpenAPI notes, and agent skill wrappers for the hosted CarryFeed API.

This repository is intentionally a wrapper layer. It does not include CarryFeed's internal resolver implementation, Worker source, direct X/Twitter client code, tokens, cookies, or scraping internals.

## Packages

- `@carryfeed/sdk`: JavaScript SDK for the hosted CarryFeed API.
- `@carryfeed/cli`: CLI wrapper for agents and local scripts.
- `skills/carryfeed-twitter-tools`: Agent skill instructions for public X/Twitter link workflows.

## Public Scope

CarryFeed works with public X and Twitter links only. It is designed for public profile, post, article, and media metadata workflows. It does not unlock private, protected, deleted, restricted, or login-only content.

## Quick Start

```bash
npm install @carryfeed/sdk
```

```js
import { CarryFeedClient } from "@carryfeed/sdk";

const carryfeed = new CarryFeedClient();
const post = await carryfeed.resolve("https://x.com/user/status/123");
const media = await carryfeed.resolveMedia("https://x.com/user/status/123");
const profile = await carryfeed.getProfile("NASA");
```

CLI:

```bash
npx @carryfeed/cli resolve https://x.com/user/status/123
npx @carryfeed/cli media https://x.com/user/status/123
npx @carryfeed/cli profile NASA --statuses --count 5
```

## Agent Docs

See [docs/agents.md](docs/agents.md) for agent-facing usage, response expectations, and safety boundaries.

## Roadmap

Twitter/X search and hashtag search are planned as a later API surface. See [docs/roadmap.md](docs/roadmap.md).

## Publishing

The npm scope is `@carryfeed`.

Dry-run package contents:

```bash
npm run pack:sdk
npm run pack:cli
```

Publish when logged in as an npm user with write access to the `carryfeed` organization:

```bash
npm run publish:sdk
npm run publish:cli
```

Recommended first GitHub remote:

```bash
git remote add origin https://github.com/christian-beep383/carryfeed-agent-tools.git
```
