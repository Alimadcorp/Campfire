import { Redis } from "@upstash/redis";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_URL_TOKEN,
});

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const channel = searchParams.get("channel");
    if (!channel) return Response.json({ error: "Missing channel" }, { status: 400 });

    const scansKey = `channel:${channel}:scans`;
    const raw = await redis.hgetall(scansKey);

    const records = [];
    if (raw && typeof raw === "object") {
        const keys = Object.keys(raw);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const val = raw[key];
            try {
                const record = typeof val === "string" ? JSON.parse(val) : val;
                records.push({ ...record, _scanId: key });
            } catch { }
        }
    }

    records.sort((a, b) => new Date(b.time) - new Date(a.time));

    return Response.json(records);
}
