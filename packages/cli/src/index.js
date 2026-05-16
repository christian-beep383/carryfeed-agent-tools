#!/usr/bin/env node
import { CarryFeedClient, CarryFeedError } from "@carryfeed/sdk";

const args = process.argv.slice(2);

main(args).catch(error => {
  if (error instanceof CarryFeedError) {
    console.error(JSON.stringify({ ok: false, status: error.status, error: error.message }, null, 2));
  } else {
    console.error(JSON.stringify({ ok: false, error: error.message }, null, 2));
  }
  process.exitCode = 1;
});

async function main(argv) {
  if (argv.length === 0 || has(argv, "--help") || has(argv, "-h")) {
    printHelp();
    return;
  }

  const { command, positional, options } = parseArgs(argv);
  const client = new CarryFeedClient({ baseUrl: options.baseUrl || "https://api.carryfeed.com" });
  let payload;

  if (command === "health") {
    payload = await client.health();
  } else if (command === "resolve") {
    payload = await client.resolve(required(positional[0], "resolve requires a URL, handle, or post id."), commonOptions(options));
  } else if (command === "media") {
    payload = await client.resolveMedia(required(positional[0], "media requires a public post URL or id."), commonOptions(options));
  } else if (command === "profile") {
    const handle = required(positional[0], "profile requires a handle.");
    if (options.statuses) {
      payload = await client.getProfileStatuses(handle, timelineOptions(options));
    } else if (options.media) {
      payload = await client.getProfileMedia(handle, timelineOptions(options));
    } else {
      payload = await client.getProfile(handle, commonOptions(options));
    }
  } else if (command === "post") {
    payload = await client.getPost(required(positional[0], "post requires a post id."), commonOptions(options));
  } else if (command === "download-url") {
    payload = {
      url: client.downloadUrl(required(positional[0], "download-url requires a media URL."), {
        filename: options.filename
      })
    };
  } else {
    throw new Error(`Unknown command: ${command}`);
  }

  console.log(JSON.stringify(payload, null, options.compact ? 0 : 2));
}

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const positional = [];
  const options = {};

  for (let i = 0; i < rest.length; i += 1) {
    const token = rest[i];
    if (!token.startsWith("--")) {
      positional.push(token);
      continue;
    }

    const [rawKey, inlineValue] = token.slice(2).split("=", 2);
    const key = rawKey.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
    const booleanFlags = new Set(["statuses", "media", "withReplies", "aboutAccount", "noCache", "compact"]);
    if (booleanFlags.has(key)) {
      options[key] = inlineValue === undefined ? true : truthy(inlineValue);
    } else {
      options[key] = inlineValue ?? rest[++i];
    }
  }

  return { command, positional, options };
}

function commonOptions(options) {
  return {
    provider: options.provider,
    aboutAccount: options.aboutAccount,
    noCache: options.noCache,
    handle: options.handle
  };
}

function timelineOptions(options) {
  return {
    count: options.count ? Number(options.count) : undefined,
    cursor: options.cursor,
    withReplies: options.withReplies,
    noCache: options.noCache
  };
}

function required(value, message) {
  if (!value) throw new Error(message);
  return value;
}

function has(argv, flag) {
  return argv.includes(flag);
}

function truthy(value) {
  return /^(1|true|yes|on)$/i.test(String(value));
}

function printHelp() {
  console.log(`CarryFeed CLI

Usage:
  carryfeed health [--base-url URL]
  carryfeed resolve <url-or-handle-or-id> [--provider fxtwitter|direct]
  carryfeed media <post-url-or-id> [--provider fxtwitter|direct]
  carryfeed profile <handle> [--statuses|--media] [--count 5] [--cursor CURSOR]
  carryfeed post <id> [--handle HANDLE] [--provider fxtwitter|direct]
  carryfeed download-url <media-url> [--filename NAME]

Options:
  --base-url URL       API base URL. Defaults to https://api.carryfeed.com
  --no-cache           Bypass CarryFeed edge cache when supported
  --compact            Print compact JSON

Scope:
  Public X/Twitter links only. Private, protected, deleted, restricted, or login-only content is not supported.
`);
}
