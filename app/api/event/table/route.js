import { Redis } from "@upstash/redis";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return Response.json({ error: "Not authenticated." }, { status: 401 });
  }
  const allowedSlackIds = process.env.ADWIN.split(",");
  if (!allowedSlackIds.includes(session.user.slackId)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  let signupsData = await redis.get("event");
  return Response.json(signupsData);
}
