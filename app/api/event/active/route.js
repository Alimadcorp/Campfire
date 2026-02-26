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

    const slackId = session.user.slackId;
    const image = session.user.image;
    const name = session.user.name;

    const activeKey = "campfire:admin_active";
    const now = Date.now();

    try {
        await redis.hset(activeKey, {
            [slackId]: JSON.stringify({ slackId, image, name, lastSeen: now })
        });

        const allActive = await redis.hgetall(activeKey);
        const activeAdmins = [];

        if (allActive) {
            const toDelete = [];
            for (const [id, dataStr] of Object.entries(allActive)) {
                try {
                    const data = typeof dataStr === 'string' ? JSON.parse(dataStr) : dataStr;
                    if (now - data.lastSeen > 90000) {
                        toDelete.push(id);
                    } else {
                        activeAdmins.push({ id, ...data });
                    }
                } catch (e) {
                    toDelete.push(id);
                }
            }
            if (toDelete.length > 0) {
                await redis.hdel(activeKey, ...toDelete);
            }
        }

        return Response.json({ activeAdmins });
    } catch (err) {
        console.error(err);
        return Response.json({ activeAdmins: [] });
    }
}
