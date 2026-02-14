"use client";

import dynamic from "next/dynamic";
import { useUserRole } from "@/hooks/useUserRole";
import {
  HomeSkeleton,
  QuickActionsSkeleton,
} from "@/components/skeletons/HomeSkeleton";
import { MeetingHeader } from "./_components/MeetingHeader";
import { MeetingListSkeleton } from "@/components/skeletons/MeetingListSkeleton";

const MeetingActionList = dynamic(
  () =>
    import("./_components/MeetingActionList").then(
      (mod) => mod.MeetingActionList,
    ),
  {
    loading: () => <QuickActionsSkeleton />,
  },
);

const MeetingList = dynamic(
  () => import("./_components/MeetingList").then((mod) => mod.MeetingList),
  {
    loading: () => <MeetingListSkeleton />,
  },
);

export default function Home() {
  const { isInterviewer, isLoading } = useUserRole();

  if (isLoading) return <HomeSkeleton />;

  return (
    <div className="container max-w-7xl mx-auto p-6">
      <MeetingHeader isInterviewer={isInterviewer} />
      {isInterviewer ? <MeetingActionList /> : <MeetingList />}
    </div>
  );
}
