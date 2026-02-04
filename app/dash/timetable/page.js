import { getServerSession } from "next-auth"
import { authOptions } from "../../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import TimetableClient from "./TimetableClient"
import orgs from "@/lib/orgs"

export default async function TimetablePage() {
    const session = await getServerSession(authOptions)
    if (!session) redirect("/login")

    const user = session.user

    return <TimetableClient user={user} availableUsers={orgs} />
}
