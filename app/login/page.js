"use client"
import { signIn } from "next-auth/react"

export default function Login() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '20px' }}>
      <h1>Login to Campfire</h1>
      <button
        onClick={() => signIn("slack")}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#4A154B',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Login with Slack
      </button>
    </div>
  )
}
