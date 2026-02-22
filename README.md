Deployed by Vercel to https://campfire.alimad.co

This is an organizers portal

---

# How to Test

1. Fork/Clone this repo

2. Edit `.env.example` and rename to `.env.local`

3. Edit `/lib/orgs.js`

4. next dev

# How to Deploy

1. Fork/Clone this repo

2. Edit `.env.example`

3. Edit `/lib/orgs.js`

4. next build

5. Setup a cronjob to call `/cron?pwd=<process.env.NEXT_PUBLIC_CRON_SECRET>` every couple minutes

---

## App Routes

`/`

  - reditect to https://campfire.hackclub.com/lahore
  - log reference query param `r`

`/login`

  - login with Slack auth (for organizers), slack app token is already saved as SLACK_CLIENT_ID, SLACK_CLIENT_SECRET
  - required scopes: all profile scopes

`/api/auth/callback/:nextauth`

  - auth callbacks

`/api/event/ids`
  
  - GET/POST the participant mark state (you can mark participants in the PoC dashboard in order to keep track and stuff :3c)

`/api/event/cron`
  
  - accepts 
  - cache the cockpit signups so that we dont overload stuff

`/api/event/info`

  - get event info

`/api/event/lookup`

  - look for a specific signup with search param `q`

`/api/event/table`

  - the participants list. only visible to PoC

`/api/redis/latency`

  - for absolutely no reason, check redis get/set latency

`/api/timetable`

  - GET/POST the timetable. its kind of the run-of-show thingy

`/dash`

  - the dashboard :elmo-fire:
  - a lot of stats live here

`/dash/table`

  - the participants table. only visible to PoC

`/dash/timetable`

  - hmmmmmmm
