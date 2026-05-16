# CarryFeed Twitter Tools Skill

Agent skill for resolving public X/Twitter source context through CarryFeed's hosted API, SDK, or CLI.

CarryFeed is useful when an agent needs public profile metadata, post text, article-style link context, or media candidates without browser login prompts. It keeps the original source URL beside the returned text, author context, and public media metadata.

## Install From GitHub

After the repository is public:

```bash
npx skills add christian-beep383/carryfeed-agent-tools --skill carryfeed-twitter-tools
```

## Publish To ClawHub

From this skill folder:

```bash
clawhub skill publish . --slug carryfeed-twitter-tools --name "CarryFeed Twitter Tools" --version 0.1.0 --changelog "Initial release"
```

## Boundaries

- Public X/Twitter links only.
- No private, protected, deleted, restricted, suspended, age-gated, or login-only content.
- No posting, liking, following, replying, account actions, surveillance, or bulk scraping.
- Public keyword and hashtag search is planned but not in the first published contract.

## Links

- Website: https://carryfeed.com
- API health: https://api.carryfeed.com/health
- Agent discovery: https://carryfeed.com/llms.txt
- OpenAPI: https://carryfeed.com/openapi.json
- SDK: https://www.npmjs.com/package/@carryfeed/sdk
- CLI: https://www.npmjs.com/package/@carryfeed/cli
