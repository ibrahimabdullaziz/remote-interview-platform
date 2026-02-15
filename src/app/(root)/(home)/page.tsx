import dynamic from "next/dynamic";
import { currentUser } from "@clerk/nextjs/server";
import { convexClient } from "@/lib/convex";
import { api } from "../../../../convex/_generated/api";
import { QuickActionsSkeleton } from "@/components/skeletons/HomeSkeleton";
import { MeetingHeader } from "./_components/MeetingHeader";
import { MeetingListSkeleton } from "@/components/skeletons/MeetingListSkeleton";

const MeetingActionList = dynamic(
  () =>
    import("./_components/MeetingActionList").then(
      (mod) => mod.MeetingActionList,
    ),
  {
    ssr: false,
    loading: () => <QuickActionsSkeleton />,
  },
);

const MeetingList = dynamic(
  () => import("./_components/MeetingList").then((mod) => mod.MeetingList),
  {
    ssr: false,
    loading: () => <MeetingListSkeleton />,
  },
);

export default async function Home() {
  const user = await currentUser();
  if (!user) return null;

  if (!user) return null;

  const userData = await convexClient.query(api.users.getUserByClerkId, {
    clerkId: user.id,
  });

  const isInterviewer = userData?.role === "interviewer";

  return (
    <div className="container max-w-7xl mx-auto p-6">
      <MeetingHeader isInterviewer={isInterviewer} />
      {isInterviewer ? <MeetingActionList /> : <MeetingList />}
    </div>
  );
}
