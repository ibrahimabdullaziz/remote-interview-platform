import { currentUser } from "@clerk/nextjs/server";
import { convexClient } from "@/lib/convex";
import { api } from "../../../../convex/_generated/api";
import { redirect } from "next/navigation";
import InterviewScheduleUI from "./InterviewScheduleUI";

async function SchedulePage() {
  const user = await currentUser();
  if (!user) redirect("/");

  const userData = await convexClient.query(api.users.getUserByClerkId, {
    clerkId: user.id,
  });

  if (!userData || userData.role !== "interviewer") {
    redirect("/");
  }

  return <InterviewScheduleUI />;
}

export default SchedulePage;
