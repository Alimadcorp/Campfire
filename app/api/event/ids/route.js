import { Redis } from "@upstash/redis";
const redis = new Redis({
  url: process.env.ADMIN_REDIS,
  token: process.env.ADMIN_REDIS_TOKEN,
});

const MARKS_KEY = "participantMarks";

export async function GET() {
  const marks = await redis.get(MARKS_KEY);
  return Response.json(marks || {});
}

export async function POST(req) {
  const body = await req.json();
  await redis.set(MARKS_KEY, body);
  return Response.json({ status: "success" });
}
