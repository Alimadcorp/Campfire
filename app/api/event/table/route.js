import { Redis } from "@upstash/redis";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_URL_TOKEN,
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return Response.json({ error: "Not authenticated." }, { status: 401 });
  }
  const allowedSlackIds = ["U08LQFRBL6S", "U07UGRYER5G"]//, "U0A9FR997HU", "U09DRCKD0LT", "U09DTPWN726", "U07UGRYER5G", "U08RS7AEA77", "U0AAKAT78TD"]
  if (!allowedSlackIds.includes(session.user.slackId)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  let signupsData = await redis.get("event");
  return Response.json(signupsData);
}
