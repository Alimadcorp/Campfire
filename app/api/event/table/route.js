import { Redis } from "@upstash/redis";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
const redis = new Redis({
  url: process.env.ADMIN_REDIS,
  token: process.env.ADMIN_REDIS_TOKEN,
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return Response.json({ error: "Not authenticated." }, { status: 401 });
  }
  const allowedSlackIds = ["U08LQFRBL6S"];
  if (!allowedSlackIds.includes(session.user.slackId)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  let signupsData = await redis.get("event");
  return Response.json(signupsData);
}
