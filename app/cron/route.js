import { Redis } from "@upstash/redis";
const redis = new Redis({
  url: process.env.ADMIN_REDIS,
  token: process.env.ADMIN_REDIS_TOKEN,
});

const id = process.env.NEXT_PUBLIC_EVENT_ID;
const cockpit = process.env.COCKPIT_URL;
const token = process.env.COCKPIT_TOKEN;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const bkp = searchParams.get("bkp");
  const pwd = searchParams.get("pwd");
  if (pwd !== process.env.NEXT_PUBLIC_CRON_SECRET)
    return new Response("Unauthorized");

  // Authorized

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
  const fillout = await fetch(
    "https://api.fillout.com/v1/api/forms/mP1AczzxTous/submissions?limit=150",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.FILLOUT_TOKEN}`,
      },
    },
  );
  const data = await event.json();
  let participantsData = await participants.json();
  for (let i = 0; i < participantsData.length; i++) {
    participantsData[i].phone = participantsData[i].phone
      .replace(/^\+10?/, "+92")
      .replace(/^\+920?/, "+92")
      .replace(/["\(\)\-\s]/g, "");
  }
  const filloutData = await fillout.json();
  console.log(filloutData.responses.length);
  let filloutSave = [];
  for (let i = 0; i < filloutData.responses.length; i++) {
    const response = filloutData.responses[i];
    const id = response.urlParameters[1].value;
    let save = { id };
    for (let i = 0; i < response.questions.length; i++) {
      const question = response.questions[i];
      if (question.name === "Your Email") {
        save.emailC = question.value;
      }
      if (question.name === "CNIC") {
        save.cnic = question.value.replaceAll("-", "");
      }
      if (question.name === "Game dev experience") {
        save.exp = question.value;
      }
      if (question.name === "Game engine") {
        save.engine = question.value;
      }
      if (question.name === "Discord username") {
        save.discord = question.value;
      }
      if (question.name === "What are your team member's names?") {
        save.team = question.value;
      }
    }
    filloutSave.push(save);
  }
  redis.set(
    `event`,
    JSON.stringify({
      event: data,
      participants: participantsData,
      fillout: filloutSave,
      lastUpdated: new Date().toISOString(),
    }),
  );
  if (bkp == "1")
    redis.set(
      `_event`,
      JSON.stringify({
        event: data,
        participants: participantsData,
        fillout: filloutSave,
        lastUpdated: new Date().toISOString(),
      }),
    );
  return Response("Success");
}
