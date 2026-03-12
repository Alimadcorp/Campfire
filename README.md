Deployed by Vercel to https://campfire.alimad.co

This `was` an organizer's portal

There are two main things here, first, the `quickstream` folder contains a Flutter app that scans QR codes and streams them to a websocket. `socket` contains the recieving socket which forwards them to listeners. The rest of the folders and files are a nextjs app, and route `/dash/scan` is the listener that connects to the socket.

This project was partially vibe coded using Googol Antigravity :]

(Now depracated and unavailable, but here are some working screenshots of the thing:)

[Heres a working video of QuickStream](https://static.alimad.co/hehe.mov)

<div align="center">

<img src="https://github.com/user-attachments/assets/8888e031-6b86-453e-ae4a-f3561217bed0" width="900"/>

<img src="https://github.com/user-attachments/assets/76d87c9e-2137-4780-8c74-2801f8816dfc" width="900"/>

<img src="https://github.com/user-attachments/assets/97738bb0-999e-405d-a63b-d7f11a954141" width="500"/>

</div>

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

`/dash/scan`

  - for scanning in the particopants. works together with `quickstream`

  - hmmmmmmm
