
const id = process.env.NEXT_PUBLIC_EVENT_ID;
const cockpit = process.env.COCKPIT_URL;
const token = process.env.COCKPIT_TOKEN;

export async function GET() {

    const res = await fetch(`${cockpit}/api/events/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    const data = await res.json();
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
        venue: data.venue
    }
    const signups = await fetch(`${cockpit}/api/events/${id}/participants`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    const signupsData = await signups.json();
    let deleted = signupsData.length - data.numParticipants;
    let gals = 0, boys = 0, other = 0, volunteer = 0, ages = {}, agesAll = {};
    let mostRecent, mostRecentName;
    signupsData.forEach(signup => {
        if (!signup.disabled) {
            if (ages[signup.age]) {
                ages[signup.age]++;
            } else {
                ages[signup.age] = 1;
            }
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
        if (agesAll[signup.age]) {
            agesAll[signup.age]++;
        } else {
            agesAll[signup.age] = 1;
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
        mostRecentName,
        agesAll,
        signupTimes: signupsData.map(s => s.createdTime),
        referrals: signupsData.map(s => s.referralContext)
    };
    filtered.participants = participants;
    return Response.json(filtered);
}