"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";
import { Header } from "./_components/Header";
import { InterviewList } from "./_components/InterviewList";

function DashboardPage() {
  const users = useQuery(api.users.getUsers);
  const interviews = useQuery(api.interviews.getAllInterviews);

  if (!interviews || !users) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="container mx-auto py-10">
      <Header />
      <InterviewList />
    </div>
  );
}

export default DashboardPage;
