import { Redis } from "@upstash/redis";
const redis = new Redis({
    url: process.env.ADMIN_REDIS,
    token: process.env.ADMIN_REDIS_TOKEN,
});

const NOTES_KEY = "participantNotes";

export async function GET() {
    const notes = await redis.get(NOTES_KEY);
    return Response.json(notes || {});
}

export async function POST(req) {
    const body = await req.json();
    await redis.set(NOTES_KEY, body);
    return Response.json({ status: "success" });
}
