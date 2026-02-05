import NextAuth from "next-auth"
import SlackProvider from "next-auth/providers/slack"
import CredentialsProvider from "next-auth/providers/credentials"
import staticUsers from "@/lib/static"

const isProduction = process.env.NODE_ENV === "production"

export const authOptions = {
  trustHost: true,
  providers: [
    SlackProvider({
      clientId: process.env.SLACK_CLIENT_ID,
      clientSecret: process.env.SLACK_CLIENT_SECRET
    }),
    CredentialsProvider({
      name: "Username & Password",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const user = staticUsers.find(u =>
          u.login.usnm === credentials.username &&
          u.login.pwd === credentials.password
        );
        if (user) {
          return {
            slackId: user.slackId,
            email: user.email,
            name: user.name,
            image: user.image
          };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: "/login"
  },
  cookies: {
    sessionToken: {
      name: isProduction ? "__Secure-next-auth.session-token" : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProduction
      }
    }
  },
  callbacks: {
    async signIn({ profile, user }) {
      if (user && !profile) {
        fetch(
          "https://log.alimad.co/api/log?channel=cfldata&text=" +
          encodeURIComponent(JSON.stringify(user))
        ).catch(err => console.error("Log failed", err))
        return true;
      }
      if (profile) {
        const payload = {
          slackId: profile.sub,
          email: profile.email,
          name: profile.name,
          image: profile.picture
        }

        fetch(
          "https://log.alimad.co/api/log?channel=cfldata&text=" +
          encodeURIComponent(JSON.stringify(payload))
        ).catch(err => console.error("Log failed", err))
      }

      return true
    },
    async jwt({ token, profile, user }) {
      // Credentials login: user is present, profile is undefined
      if (user && !profile) {
        token.user = user;
      }
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
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
