import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import DashboardClient from "./Client"

export default async function Dash() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  const user = session.user

  const orgs = {
    "U0A9FR997HU": { note: "hi there raham imma eat u up" }
  }

  const userNote = orgs[user.slackId]?.note || null;

  return <DashboardClient user={user} note={userNote} />
}
