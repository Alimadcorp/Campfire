import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import DashboardClient from "./Client"
import orgs from "@/lib/orgs"

export default async function Dash() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  const user = session.user

  const userData = orgs[user.slackId] || orgs["default"]
  const userNote = userData.note
  const userRole = userData.role

  return <DashboardClient user={user} note={userNote} role={userRole} data={userData} />
}
