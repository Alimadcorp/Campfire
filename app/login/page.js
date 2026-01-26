"use client"
import { signIn } from "next-auth/react"

export default function Login() {
  return (
    <button onClick={() => signIn("slack")}>
      Login with Slack
    </button>
  )
}
