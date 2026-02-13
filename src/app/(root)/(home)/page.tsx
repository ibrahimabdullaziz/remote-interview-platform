"use client";

import { useUserRole } from "@/hooks/useUserRole";
import { HomeSkeleton } from "@/components/skeletons/HomeSkeleton";
import { MeetingHeader } from "./_components/MeetingHeader";
import { MeetingActionList } from "./_components/MeetingActionList";
import { MeetingList } from "./_components/MeetingList";

export default function Home() {
  const { isInterviewer, isLoading } = useUserRole();

  if (isLoading) return <HomeSkeleton />;

  return (
    <div className="container max-w-7xl mx-auto p-6">
      <MeetingHeader />
      {isInterviewer ? <MeetingActionList /> : <MeetingList />}
    </div>
  );
}
