# Roadmap

## Phase 1: Technical Distribution

- Publish a public GitHub repository with wrapper-only code.
- Publish `@carryfeed/sdk`.
- Publish `@carryfeed/cli`.
- Ship `docs/agents.md`.
- Ship `skills/carryfeed-twitter-tools/SKILL.md`.
- Keep internal resolver implementation private.

## Phase 2: Stable API Facade

- Add stable `/v1/*` endpoints on `api.carryfeed.com`.
- Normalize response schema across profile, post, article, media, and download workflows.
- Enable production KV rate limits.
- Expand OpenAPI response schemas.

## Phase 3: Agent Search

Add a limited public search API after the wrapper launch.

Potential API:

```text
GET /v1/search?q=AI%20agent&feed=latest&count=10
GET /v1/search?q=%23buildinpublic&feed=latest&count=10
```

Potential SDK methods:

```js
client.searchPublicPosts("AI agent", { count: 10 });
client.searchPublicPosts("#buildinpublic", { feed: "latest" });
```

SEO and content keywords to analyze later:

- twitter search without account
- x search without login
- search twitter without account
- twitter hashtag search
- x hashtag search
- public twitter search
- public x search
- twitter search viewer
- search public tweets
- find public tweets by keyword

Potential page:

```text
/twitter-search-without-account
```

Positioning:

Public search for research, source discovery, and agent triage. Keep the page away from bulk scraping, surveillance, or private-account claims.
