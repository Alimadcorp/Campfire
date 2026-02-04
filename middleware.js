import { withAuth } from "next-auth/middleware"

export default withAuth({
})

export const middleware = withAuth({
})

export const config = { matcher: ["/api/((?!auth).*)"] }
