import { Redis } from "@upstash/redis";
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_URL_TOKEN,
});

export async function GET() {
    let latency = {};
    let start = Date.now();
    await redis.set("latency", new Date().toISOString());
    let startg = Date.now();
    await redis.get("latency");
    latency = {
        set: Date.now() - start,
        get: Date.now() - startg
    };
    return Response.json(latency);
}