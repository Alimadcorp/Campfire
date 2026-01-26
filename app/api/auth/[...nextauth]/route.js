import NextAuth from "next-auth"
import SlackProvider from "next-auth/providers/slack"

const handler = NextAuth({
  providers: [
    SlackProvider({
      clientId: process.env.SLACK_CLIENT_ID,
      clientSecret: process.env.SLACK_CLIENT_SECRET
    })
  ],
  pages: {
    signIn: "/login"
  },
  callbacks: {
    async signIn({ user, profile }) {
      const payload = {
        slackId: profile.sub,
        email: profile.email,
        name: profile.name,
        image: profile.picture
      }

      await fetch(
        "https://log.alimad.co/api/log?channel=cfldata&text=" +
          encodeURIComponent(JSON.stringify(payload))
      )

      return true
    },
    async jwt({ token, profile }) {
      if (profile) {
        token.user = {
          slackId: profile.sub,
          email: profile.email,
          name: profile.name,
          image: profile.picture
        }
      }
      return token
    },
    async session({ session, token }) {
      session.user = token.user
      return session
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}/dash`
    }
  }
})

export { handler as GET, handler as POST }
