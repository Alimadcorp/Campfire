import { Redis } from "@upstash/redis";
const redis = new Redis({
  url: process.env.ADMIN_REDIS,
  token: process.env.ADMIN_REDIS_TOKEN,
});

export async function GET() {
  const allData = await redis.get("event");
  const data = allData.event;
  let filtered = {
    id: data.id,
    name: data.displayName,
    city: data.eventName,
    slug: data.slug,
    country: data.country,
    location: { lat: data.lat, long: data.long },
    format: data.format,
    poc: { name: data.pocName, email: data.pocEmail },
    rm: { name: data.rmName, email: data.rmEmail },
    signups: data.numParticipants,
    goal: data.estimatedAttendeesCount * 2,
    progress: data.percentSignup,
    formLink: data.signupUrl,
    created: data.createdTime,
    venue: data.venue,
  };
  const signupsData = allData.participants;
  let deleted = signupsData.filter((e) => e.disabled).length;
  filtered.signups = signupsData.filter((e) => !e.disabled).length;
  let gals = 0,
    boys = 0,
    other = 0,
    volunteer = 0,
    ages = {};
  let mostRecent, mostRecentName;
  signupsData.forEach((signup) => {
    if (!signup.disabled) {
      if (signup.pronouns === "she/her") {
        gals++;
      } else if (signup.pronouns === "he/him") {
        boys++;
      } else {
        other++;
      }
      if (signup.isVolunteer) {
        volunteer++;
      }
    }
    if (ages[signup.age]) {
      ages[signup.age].base++;
      if (signup.disabled) {
        ages[signup.age].deleted++;
      } else {
        if (signup.pronouns === "he/him") {
          ages[signup.age].he++;
        } else if (signup.pronouns === "she/her") {
          ages[signup.age].she++;
        }
        if (signup.isVolunteer) {
          ages[signup.age].volunteer++;
        }
      }
    } else {
      ages[signup.age] = {
        base: 1,
        deleted: signup.disabled ? 1 : 0,
        he: signup.pronouns === "he/him" ? 1 : 0,
        she: signup.pronouns === "she/her" ? 1 : 0,
        volunteer: signup.isVolunteer ? 1 : 0,
      };
    }
    if (!mostRecent) {
      mostRecent = new Date(signup.createdTime);
      mostRecentName = signup.displayName;
    } else {
      if (new Date(signup.createdTime) > mostRecent) {
        mostRecent = new Date(signup.createdTime);
        mostRecentName = signup.displayName;
      }
    }
  });
  let participants = {
    total: signupsData.length,
    deleted,
    gals,
    boys,
    other,
    volunteer,
    ages,
    mostRecent,
    mostRecentName: mostRecentName.trim(),
    signupTimes: signupsData.map((s) => s.createdTime),
    referrals: signupsData.map((s) => s.referralContext),
    checkins: signupsData.filter((s) => s.checkinCompleted).length,
    dietaryRestrictions: signupsData.map((s) => s.dietaryRestrictions).filter(Boolean),
    shirtSizes: signupsData.map((s) => s.shirtSize).filter(Boolean),
    accommodations: signupsData.map((s) => s.additionalAccommodations).filter(Boolean),
    finalCheckins: Object.keys(allData.fillout).length,
  };
  filtered.participants = participants;
  filtered.lastUpdated = allData.lastUpdated;
  return Response.json(filtered);
}
