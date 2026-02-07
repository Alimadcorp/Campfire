import { Redis } from "@upstash/redis";
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const id = process.env.NEXT_PUBLIC_EVENT_ID;
const cockpit = process.env.COCKPIT_URL;
const token = process.env.COCKPIT_TOKEN;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const bkp = searchParams.get("bkp");
  const pwd = searchParams.get("pwd");
  if (pwd !== process.env.NEXT_PUBLIC_CRON_SECRET) return new Response("Unauthorized");
  const event = await fetch(`${cockpit}/api/events/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const participants = await fetch(`${cockpit}/api/events/${id}/participants`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await event.json();
  const participantsData = await participants.json();
  redis.set(
    `event`,
    JSON.stringify({
      event: data,
      participants: participantsData,
      lastUpdated: new Date().toISOString(),
    }),
  );
  if (bkp == "1")
    redis.set(
      `_event`,
      JSON.stringify({
        event: data,
        participants: participantsData,
        lastUpdated: new Date().toISOString(),
      }),
    );
  return new Response("Success");
}
