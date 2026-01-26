import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import DashboardClient from "./Client"

export default async function Dash() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  const user = session.user

  const orgs = {
    "U08LQFRBL6S": {
      name: "Muhammad Ali",
      role: "PoC",
      note: "hi there sir Alimad the great"
    },
    "U09DRCKD0LT": {
      name: "Raham Bilal",
      role: "Lead Sponsor & Outreach",
      note: "hi there raham imma eat u up"
    },
    "U09DTPWN726": {
      name: "Abdullah Abbas",
      role: "Logistics",
      note: "hi there abdullah. you little feminist"
    },
    "U07UGRYER5G": {
      name: "M Umar Shahbaz",
      role: "Workshop",
      note: "hi there sir umar the great :salute:"
    },
    "U0A9FR997HU": {
      name: "Campfire Lahore",
      role: "The Email",
      note: "welcome to campfire, mister.... campfire-"
    },
    "U0AAS97SZU3": {
      name: "Ammar Ahmad",
      role: "The Developer",
      note: "hi there fellow dev"
    },
    "U096NBE52JD": {
      name: "Momina Nadeem",
      role: "Sponsors",
      note: "hi there Momina!"
    },
    "U08RS7AEA77": {
      name: "Aamina Nadeem",
      role: "Branding & Outreach",
      note: "hi there miss Aamina!"
    },
    "default": {
      role: "Hacker",
      note: "Welcome to Campfire Lahore! You are not registered as dev sorry :<"
    }
  }

  const userData = orgs[user.slackId] || orgs["default"]
  const userNote = userData.note
  const userRole = userData.role

  return <DashboardClient user={user} note={userNote} role={userRole} />
}
