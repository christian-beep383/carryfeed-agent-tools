import { CarryFeedClient } from "../packages/sdk/src/index.js";

const client = new CarryFeedClient();
const input = process.argv[2] || "https://x.com/elonmusk/status/2046006033890566491";
const result = await client.resolve(input);

console.log(JSON.stringify(result, null, 2));
