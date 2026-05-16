const DEFAULT_BASE_URL = "https://api.carryfeed.com";

export class CarryFeedError extends Error {
  constructor(message, { status, payload, url } = {}) {
    super(message);
    this.name = "CarryFeedError";
    this.status = status;
    this.payload = payload;
    this.url = url;
  }
}

export class CarryFeedClient {
  constructor({ baseUrl = DEFAULT_BASE_URL, fetchImpl = globalThis.fetch, headers = {} } = {}) {
    if (!fetchImpl) throw new Error("CarryFeedClient requires a fetch implementation.");
    this.baseUrl = String(baseUrl).replace(/\/+$/, "");
    this.fetch = fetchImpl;
    this.headers = headers;
  }

  async health() {
    return this.request("/health");
  }

  async resolve(input, options = {}) {
    return this.request("/api/resolve", {
      query: {
        url: input,
        provider: options.provider,
        v2: boolParam(options.v2),
        about_account: boolParam(options.aboutAccount),
        no_cache: boolParam(options.noCache)
      }
    });
  }

  async resolveMedia(input, options = {}) {
    return this.request("/api/media", {
      query: {
        url: input,
        provider: options.provider,
        no_cache: boolParam(options.noCache)
      }
    });
  }

  async getProfile(handle, options = {}) {
    return this.request(`/api/profile/${segment(cleanHandle(handle))}`, {
      query: {
        provider: options.provider,
        about_account: boolParam(options.aboutAccount),
        no_cache: boolParam(options.noCache)
      }
    });
  }

  async getProfileStatuses(handle, options = {}) {
    return this.request(`/api/profile/${segment(cleanHandle(handle))}/statuses`, {
      query: {
        count: options.count,
        cursor: options.cursor,
        with_replies: boolParam(options.withReplies),
        no_cache: boolParam(options.noCache)
      }
    });
  }

  async getProfileMedia(handle, options = {}) {
    return this.request(`/api/profile/${segment(cleanHandle(handle))}/media`, {
      query: {
        count: options.count,
        cursor: options.cursor,
        no_cache: boolParam(options.noCache)
      }
    });
  }

  async getPost(id, options = {}) {
    return this.request(`/api/post/${segment(id)}`, {
      query: {
        handle: options.handle,
        provider: options.provider,
        about_account: boolParam(options.aboutAccount),
        no_cache: boolParam(options.noCache)
      }
    });
  }

  downloadUrl(mediaUrl, { filename } = {}) {
    return buildUrl(this.baseUrl, "/download", { url: mediaUrl, filename }).toString();
  }

  async download(mediaUrl, options = {}) {
    const url = this.downloadUrl(mediaUrl, options);
    const response = await this.fetch(url, { headers: this.headers });
    if (!response.ok) {
      throw new CarryFeedError(`CarryFeed download failed with HTTP ${response.status}.`, {
        status: response.status,
        url
      });
    }
    return response;
  }

  async request(path, { query, method = "GET", body } = {}) {
    const url = buildUrl(this.baseUrl, path, query);
    const headers = {
      accept: "application/json",
      ...this.headers
    };
    const init = { method, headers };
    if (body !== undefined) {
      headers["content-type"] = "application/json";
      init.body = JSON.stringify(body);
    }

    const response = await this.fetch(url, init);
    const text = await response.text();
    const payload = parseJson(text);

    if (!response.ok) {
      throw new CarryFeedError(errorMessage(response, payload, text), {
        status: response.status,
        payload,
        url: url.toString()
      });
    }

    return payload;
  }
}

export function createCarryFeedClient(options) {
  return new CarryFeedClient(options);
}

function buildUrl(baseUrl, path, query = {}) {
  const url = new URL(path, `${baseUrl}/`);
  for (const [key, value] of Object.entries(query || {})) {
    if (value === undefined || value === null || value === false || value === "") continue;
    url.searchParams.set(key, String(value));
  }
  return url;
}

function parseJson(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

function errorMessage(response, payload, text) {
  if (payload?.error) return String(payload.error);
  if (payload?.message) return String(payload.message);
  return `CarryFeed API failed with HTTP ${response.status}: ${text.slice(0, 160)}`;
}

function boolParam(value) {
  return value === undefined ? undefined : value ? "1" : undefined;
}

function segment(value) {
  return encodeURIComponent(String(value));
}

function cleanHandle(handle) {
  return String(handle).trim().replace(/^@/, "");
}
