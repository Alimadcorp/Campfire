import { Redis } from "@upstash/redis";
const redis = new Redis({
  url: process.env.ADMIN_REDIS,
  token: process.env.ADMIN_REDIS_TOKEN,
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