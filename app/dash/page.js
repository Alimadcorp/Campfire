import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

export default async function Dash() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  const user = session.user

  return (
    <div>
      <img src={user.image} width={64} />
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <p>{user.slackId}</p>
    </div>
  )
}
