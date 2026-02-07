Deployed by Vercel to https://campfire.alimad.co

Project is connected, push will lead to instant deployment

This is the organizers portal

---

## App Routes

`/`

  - reditect to https://campfire.hackclub.com/lahore
  - log reference query param `r`

`/login`

  - login with Slack auth (for organizers), slack app token is already saved as SLACK_CLIENT_ID, SLACK_CLIENT_SECRET
  - required scopes: all profile scopes

`/api/auth/callback/slack`

  - auth callbacks

`/api/event/cron`

  - perform a cronjob

`/api/event/info`

  - get event info

`/api/event/lookup`

  - look for a specific signup with search param `q`

`/dash`

  - the dashboard :elmo-fire:
  - idk what to add here yet

`/dash/timetable`

  - hmmmmmmm
