"use client"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"

export default function Dash() {
  const { data: session, status } = useSession()

  if (status === "loading") return "Loading..."
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
