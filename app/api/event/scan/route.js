export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const day = 2;
    if (!id || !day) return new Response("Missing parameters", { status: 400 });
    const data = await fetch(
        `https://cockpit.hackclub.com/api/events/rec5bXfCOC93cGPBe/scan`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.COCKPIT_TOKEN}`,
            },
            body: JSON.stringify({
                day,
                ticketUuid: id
            }),
        },
    );
    let json = await data.json();
    return Response.json(json);
}