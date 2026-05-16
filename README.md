# CarryFeed Agent Tools

[![skills.sh](https://skills.sh/b/christian-beep383/carryfeed-agent-tools)](https://skills.sh/christian-beep383/carryfeed-agent-tools)
[![npm @carryfeed/sdk](https://img.shields.io/npm/v/@carryfeed/sdk?label=%40carryfeed%2Fsdk)](https://www.npmjs.com/package/@carryfeed/sdk)
[![npm @carryfeed/cli](https://img.shields.io/npm/v/@carryfeed/cli?label=%40carryfeed%2Fcli)](https://www.npmjs.com/package/@carryfeed/cli)

Public SDK, CLI, OpenAPI notes, and agent skill wrappers for the hosted [CarryFeed](https://carryfeed.com) API.

This repository is intentionally a wrapper layer. It does not include CarryFeed's internal resolver implementation, Worker source, direct X/Twitter client code, tokens, cookies, or scraping internals.

CarryFeed gives agents one stable, source-preserving way to read public X/Twitter links. Instead of driving a browser, handling login prompts, or losing source context in screenshots, agents can call a hosted API and receive public profile, post, article, and media metadata with the original URL kept beside the result.

Useful links:

- Website: [carryfeed.com](https://carryfeed.com)
- API health: [api.carryfeed.com/health](https://api.carryfeed.com/health)
- Agent discovery: [carryfeed.com/llms.txt](https://carryfeed.com/llms.txt)
- OpenAPI: [carryfeed.com/openapi.json](https://carryfeed.com/openapi.json)
- Video downloader: [carryfeed.com/twitter-video-downloader](https://carryfeed.com/twitter-video-downloader)
- Image downloader: [carryfeed.com/twitter-image-downloader](https://carryfeed.com/twitter-image-downloader)
- GIF downloader: [carryfeed.com/twitter-gif-downloader](https://carryfeed.com/twitter-gif-downloader)
- Viewer guide: [carryfeed.com/how-to-view-twitter-without-account](https://carryfeed.com/how-to-view-twitter-without-account)

## Packages

- `@carryfeed/sdk`: JavaScript SDK for the hosted CarryFeed API.
- `@carryfeed/cli`: CLI wrapper for agents and local scripts.
- `skills/carryfeed-twitter-tools`: Agent skill instructions for public X/Twitter link workflows.

## Public Scope

CarryFeed works with public X and Twitter links only. It is designed for public profile, post, article, and media metadata workflows. It does not unlock private, protected, deleted, restricted, or login-only content.

## Why Agents Use CarryFeed

- One hosted API instead of brittle browser automation.
- Public profile, post, article, image, video, and GIF-style media workflows in one place.
- Source URL, author context, text, and media candidates stay together.
- Clear public-only boundaries that help agents avoid overclaiming access.
- CORS-friendly API, OpenAPI notes, CLI examples, and an agent skill.
- Download helper for public `pbs.twimg.com` and `video.twimg.com` media URLs.

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
npx -y @carryfeed/cli resolve https://x.com/user/status/123 --compact
npx -y @carryfeed/cli media https://x.com/user/status/123 --compact
npx -y @carryfeed/cli profile NASA --statuses --count 5 --compact
```

## Agent Docs

See [docs/agents.md](docs/agents.md) for agent-facing usage, response expectations, and safety boundaries.

## Agent Skill

The repository includes `skills/carryfeed-twitter-tools`, a wrapper-only skill that tells agents to use `npx -y @carryfeed/cli` for public X/Twitter source context. SDK and OpenAPI details are kept for developers, while the skill gives agents one default path.

After this repository is public, agents that support the Skills CLI can install it with:

```bash
npx skills add christian-beep383/carryfeed-agent-tools --skill carryfeed-twitter-tools
```

For ClawHub, publish from the skill folder after the npm packages and public repository are ready:

```bash
clawhub skill publish . --slug carryfeed-twitter-tools --name "CarryFeed Twitter Tools" --version 0.1.0 --changelog "Initial release"
```

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
