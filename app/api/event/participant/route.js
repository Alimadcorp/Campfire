import { Redis } from "@upstash/redis";
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_URL_TOKEN,
});

export async function GET(req) {
  let searchParams = new URL(req.url).searchParams;
  let id = searchParams.get("id");
  let signupsData = await redis.get("event");
  let participant = signupsData.participants.find((p) => p.id === id);
  let fillout = signupsData.fillout.find((p) => p.id == id);
  return Response.json({ ...participant, ...fillout });
}
