import { currentUser } from "@clerk/nextjs/server";
import { convexClient } from "@/lib/convex";
import { api } from "../../../../convex/_generated/api";
import { redirect } from "next/navigation";
import InterviewScheduleUI from "./InterviewScheduleUI";
import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

async function SchedulePage() {
  const user = await currentUser();
  if (!user) redirect("/");

  const userData = await convexClient.query(api.users.getUserByClerkId, {
    clerkId: user.id,
  });

  if (!userData || userData.role !== "interviewer") {
    return (
      <div className="container max-w-lg mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="rounded-full bg-amber-500/10 p-5 mb-6">
          <ShieldAlert className="w-12 h-12 text-amber-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Interviewers Only</h1>
        <p className="text-muted-foreground max-w-sm mb-8">
          Interview scheduling is managed by interviewers. As a candidate, your
          interviews will be scheduled for you — sit tight!
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    );
  }

  return <InterviewScheduleUI />;
}

export default SchedulePage;
