import { currentUser } from "@clerk/nextjs/server";
import { convexClient } from "@/lib/convex";
import { api } from "../../../../convex/_generated/api";
import { redirect } from "next/navigation";
import { Header } from "./_components/Header";
import { InterviewList } from "./_components/InterviewList";

async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect("/");

  const userData = await convexClient.query(api.users.getUserByClerkId, {
    clerkId: user.id,
  });

  if (!userData || userData.role !== "interviewer") {
    redirect("/");
  }

  return (
    <div className="container mx-auto py-10">
      <Header />
      <InterviewList />
    </div>
  );
}

export default DashboardPage;
