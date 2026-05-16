#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { CarryFeedClient, CarryFeedError } from "@carryfeed/sdk";

const VERSION = "0.1.1";
const DEFAULT_BASE_URL = "https://api.carryfeed.com";

if (process.argv.includes("--help") || process.argv.includes("-h")) {
  printHelp();
  process.exit(0);
}

if (process.argv.includes("--version") || process.argv.includes("-v")) {
  console.log(VERSION);
  process.exit(0);
}

const client = new CarryFeedClient({
  baseUrl: process.env.CARRYFEED_API_BASE_URL || DEFAULT_BASE_URL,
  headers: {
    "user-agent": `@carryfeed/mcp/${VERSION}`
  }
});

const server = new McpServer({
  name: "carryfeed",
  version: VERSION
});

const providerSchema = z
  .enum(["fxtwitter", "direct"])
  .optional()
  .describe("Optional resolver provider. Leave unset unless debugging provider behavior.");

const commonInput = {
  provider: providerSchema,
  aboutAccount: z.boolean().optional().describe("Include account context when supported."),
  noCache: z.boolean().optional().describe("Bypass CarryFeed edge cache when freshness matters.")
};

server.registerTool(
  "carryfeed_health",
  {
    description: "Check CarryFeed API health.",
    inputSchema: {}
  },
  async () => asToolResult(() => client.health())
);

server.registerTool(
  "carryfeed_resolve",
  {
    description:
      "Resolve a public X/Twitter profile, post, article-style link, or id with source-preserving public metadata.",
    inputSchema: {
      input: z.string().min(1).describe("Public X/Twitter URL, handle, or post id."),
      ...commonInput
    }
  },
  async ({ input, provider, aboutAccount, noCache }) =>
    asToolResult(() => client.resolve(input, { provider, aboutAccount, noCache }))
);

server.registerTool(
  "carryfeed_media",
  {
    description: "List public image, video, and GIF-style media candidates exposed by a public X/Twitter post.",
    inputSchema: {
      input: z.string().min(1).describe("Public post URL or post id."),
      provider: providerSchema,
      noCache: z.boolean().optional().describe("Bypass CarryFeed edge cache when freshness matters.")
    }
  },
  async ({ input, provider, noCache }) => asToolResult(() => client.resolveMedia(input, { provider, noCache }))
);

server.registerTool(
  "carryfeed_profile",
  {
    description: "Resolve public X/Twitter profile metadata by handle.",
    inputSchema: {
      handle: z.string().min(1).describe("Public X/Twitter handle, with or without @."),
      ...commonInput
    }
  },
  async ({ handle, provider, aboutAccount, noCache }) =>
    asToolResult(() => client.getProfile(handle, { provider, aboutAccount, noCache }))
);

server.registerTool(
  "carryfeed_profile_statuses",
  {
    description: "Fetch recent public statuses for a public X/Twitter profile.",
    inputSchema: {
      handle: z.string().min(1).describe("Public X/Twitter handle, with or without @."),
      count: z.number().int().min(1).max(20).optional().describe("Number of statuses to request. Prefer 5 to 10."),
      cursor: z.string().optional().describe("Pagination cursor returned by CarryFeed."),
      withReplies: z.boolean().optional().describe("Include replies when supported."),
      noCache: z.boolean().optional().describe("Bypass CarryFeed edge cache when freshness matters.")
    }
  },
  async ({ handle, count, cursor, withReplies, noCache }) =>
    asToolResult(() => client.getProfileStatuses(handle, { count, cursor, withReplies, noCache }))
);

server.registerTool(
  "carryfeed_profile_media",
  {
    description: "Fetch recent public media posts for a public X/Twitter profile.",
    inputSchema: {
      handle: z.string().min(1).describe("Public X/Twitter handle, with or without @."),
      count: z.number().int().min(1).max(20).optional().describe("Number of media posts to request. Prefer 5 to 10."),
      cursor: z.string().optional().describe("Pagination cursor returned by CarryFeed."),
      noCache: z.boolean().optional().describe("Bypass CarryFeed edge cache when freshness matters.")
    }
  },
  async ({ handle, count, cursor, noCache }) =>
    asToolResult(() => client.getProfileMedia(handle, { count, cursor, noCache }))
);

server.registerTool(
  "carryfeed_post",
  {
    description: "Resolve a public X/Twitter post by id, optionally with a known handle.",
    inputSchema: {
      id: z.string().min(1).describe("Public X/Twitter post id."),
      handle: z.string().optional().describe("Optional author handle when already known."),
      ...commonInput
    }
  },
  async ({ id, handle, provider, aboutAccount, noCache }) =>
    asToolResult(() => client.getPost(id, { handle, provider, aboutAccount, noCache }))
);

server.registerTool(
  "carryfeed_download_url",
  {
    description:
      "Build a CarryFeed download proxy URL for a public pbs.twimg.com or video.twimg.com media URL returned by CarryFeed.",
    inputSchema: {
      mediaUrl: z.string().url().describe("Public media URL returned by CarryFeed."),
      filename: z.string().optional().describe("Optional download filename.")
    }
  },
  async ({ mediaUrl, filename }) =>
    asToolResult(() => ({
      url: client.downloadUrl(mediaUrl, { filename })
    }))
);

main().catch(error => {
  console.error("Fatal CarryFeed MCP error:", error);
  process.exit(1);
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("CarryFeed MCP server running on stdio");
}

async function asToolResult(fn) {
  try {
    const payload = await fn();
    return jsonResult(payload);
  } catch (error) {
    return jsonResult(errorPayload(error), true);
  }
}

function jsonResult(payload, isError = false) {
  return {
    isError,
    content: [
      {
        type: "text",
        text: JSON.stringify(payload, null, 2)
      }
    ]
  };
}

function errorPayload(error) {
  if (error instanceof CarryFeedError) {
    return {
      ok: false,
      status: error.status,
      error: error.message,
      payload: error.payload
    };
  }

  return {
    ok: false,
    error: error?.message || String(error)
  };
}

function printHelp() {
  console.log(`CarryFeed MCP Server

Usage:
  carryfeed-mcp
  npx -y @carryfeed/mcp

Environment:
  CARRYFEED_API_BASE_URL   Optional API base URL. Defaults to ${DEFAULT_BASE_URL}

Tools:
  carryfeed_health
  carryfeed_resolve
  carryfeed_media
  carryfeed_profile
  carryfeed_profile_statuses
  carryfeed_profile_media
  carryfeed_post
  carryfeed_download_url

Scope:
  Public X/Twitter links only. Private, protected, deleted, restricted, or login-only content is not supported.
`);
}
