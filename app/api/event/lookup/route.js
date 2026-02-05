const id = process.env.NEXT_PUBLIC_EVENT_ID;
const cockpit = process.env.COCKPIT_URL;
const token = process.env.COCKPIT_TOKEN;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || searchParams.get("query");
  if (!query || query.length < 3) {
    return Response.json(
      { error: "Missing parameter 'q' or 'query'." },
      { status: 400 },
    );
  }
  const signups = await fetch(`${cockpit}/api/events/${id}/participants`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const signupsData = await signups.json();
  let output = {
    hits: 0,
    result: { signedUp: false, disabled: false },
    results: [],
  };
  for (const signup of signupsData) {
    const index =
      `${signup.id} ${signup.displayName} ${signup.legalFirstName} ${signup.legalLastName} ${signup.email}`
        .toLowerCase()
        .replaceAll(/\s+/g, " ");
    if (index.includes(query.toLowerCase())) {
      output.hits++;
      if (output.result.disabled === false && signup.disabled === false) {
        output.result = {
          signedUp: true,
          time: signup.createdTime,
          disabled: signup.disabled,
          volunteer: signup.isVolunteer,
        };
      }
      output.results.push({
        name: signup.displayName.trim(),
        time: signup.createdTime,
        disabled: signup.disabled,
        volunteer: signup.isVolunteer,
      });
    }
  }
  output.results = output.results.sort(
    (a, b) => new Date(b.time) - new Date(a.time),
  );
  return Response.json(output);
}
