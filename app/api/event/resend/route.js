export async function POST(req) {
    try {
        const { email } = await req.json();

        const res = await fetch("https://cockpit.hackclub.com/#/resend", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        if (res.ok) {
            return Response.json({ success: true });
        } else {
            return Response.json({ error: "Failed to resend" }, { status: res.status });
        }
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
