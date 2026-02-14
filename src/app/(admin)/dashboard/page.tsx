"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";
import { Header } from "./_components/Header";
import { InterviewList } from "./_components/InterviewList";

import { useUserRole } from "@/hooks/useUserRole";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoaderUI } from "@/components/common";

function DashboardPage() {
  const router = useRouter();
  const { isInterviewer, isLoading } = useUserRole();

  useEffect(() => {
    if (!isLoading && !isInterviewer) {
      router.push("/");
    }
  }, [isLoading, isInterviewer, router]);

  if (isLoading || !isInterviewer) {
    return <LoaderUI />;
  }

  return (
    <div className="container mx-auto py-10">
      <Header />
      <InterviewList />
    </div>
  );
}

export default DashboardPage;
