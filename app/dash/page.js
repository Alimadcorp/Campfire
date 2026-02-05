import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import DashboardClient from "./Client";
import orgs from "@/lib/orgs";

export const metadata = {
  title: "Campfire Lahore Dashboard",
  description: "Brought to you by Alimad Corporations",
  openGraph: {
    title: "Campfire Lahore Dashboard",
    description: "Brought to you by Alimad Corporations",
    images: [
      {
        url: "https://i.ibb.co/mrM3x159/image.png",
      },
    ],
    type: "website",
  },
};

export default async function Dash() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user = session.user;
  console.log(user);

  const userData = orgs[user.slackId] || orgs["default"];

  return <DashboardClient user={user} data={userData} />;
}
