import { getServerSession } from "next-auth"
import { authOptions } from "../../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import TimetableClient from "./TimetableClient"

export default async function TimetablePage() {
    const session = await getServerSession(authOptions)
    if (!session) redirect("/login")

    const user = session.user

    // Pre-defined list of organizers for assignment (could be expanded)
    const users = [
        { name: "Muhammad Ali", role: "PoC" },
        { name: "Raham Bilal", role: "Lead Sponsor & Outreach" },
        { name: "Abdullah Abbas", role: "Logistics" },
        { name: "M Umar Shahbaz", role: "Workshop" },
        { name: "Ammar Ahmad", role: "The Developer" },
        { name: "Momina Nadeem", role: "Sponsors" },
        { name: "Aamina Nadeem", role: "Branding & Outreach" },
    ]

    return <TimetableClient user={user} availableUsers={users} />
}
