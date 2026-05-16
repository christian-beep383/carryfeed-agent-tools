# @carryfeed/cli

CLI wrapper for the hosted [CarryFeed](https://carryfeed.com) API.

Use it when an agent or script needs public X/Twitter profile, post, article, or media metadata with the source URL preserved.

```bash
npx @carryfeed/cli health
npx @carryfeed/cli resolve https://x.com/user/status/123
npx @carryfeed/cli media https://x.com/user/status/123
npx @carryfeed/cli profile NASA --statuses --count 5
npx @carryfeed/cli post 1234567890
```

The CLI calls `https://api.carryfeed.com` by default. Public links only; private, protected, deleted, restricted, or login-only content is not supported.
