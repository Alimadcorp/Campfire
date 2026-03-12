import { Redis } from "@upstash/redis";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_URL_TOKEN,
});

const NOTES_KEY = "participantNotes";
const ADWIN = "U08LQFRBL6S";

export async function GET() {
    const notes = await redis.get(NOTES_KEY);
    return Response.json(notes || {});
}

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        const user = session.user;
        const body = await req.json();

        if (body.action === "add") {
            const { id, text } = body;
            if (!text || !text.trim()) {
                return Response.json({ error: "Empty note" }, { status: 400 });
            }

            const newNote = {
                text: text.trim(),
                author: user.name || "Unknown",
                avatar: user.image || "",
                timestamp: Date.now(),
            };

            const script = `
        local data = redis.call("GET", KEYS[1])
        if type(data) ~= "string" or data == "" then
            data = "{}"
        end
        local obj = cjson.decode(data)
        local id = ARGV[1]
        local newNote = cjson.decode(ARGV[2])
        if type(obj[id]) ~= "table" then
            obj[id] = {}
        end
        table.insert(obj[id], newNote)
        local encoded = cjson.encode(obj)
        redis.call("SET", KEYS[1], encoded)
        return encoded
      `;
            const result = await redis.eval(script, [NOTES_KEY], [id, JSON.stringify(newNote)]);
            return Response.json(typeof result === "string" ? JSON.parse(result) : result);
        }

        if (body.action === "delete") {
            if (user.slackId !== ADWIN) {
                return Response.json({ error: "Unauthorized to delete" }, { status: 403 });
            }
            const { id, index } = body;
            const script = `
        local data = redis.call("GET", KEYS[1])
        if type(data) ~= "string" or data == "" then
            return "{}"
        end
        local obj = cjson.decode(data)
        local id = ARGV[1]
        local idx = tonumber(ARGV[2]) + 1
        if type(obj[id]) == "table" then
            table.remove(obj[id], idx)
        end
        local encoded = cjson.encode(obj)
        redis.call("SET", KEYS[1], encoded)
        return encoded
      `;
            const result = await redis.eval(script, [NOTES_KEY], [id, index.toString()]);
            return Response.json(typeof result === "string" ? JSON.parse(result) : result);
        }

        return Response.json({ error: "Invalid action" }, { status: 400 });
    } catch (err) {
        console.error("Notes error:", err);
        return Response.json({ error: "Server error" }, { status: 500 });
    }
}
