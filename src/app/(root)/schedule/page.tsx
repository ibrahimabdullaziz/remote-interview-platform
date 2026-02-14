"use client";

import { LoaderUI } from "@/components/common";
import { useUserRole } from "@/hooks/useUserRole";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import InterviewScheduleUI from "./InterviewScheduleUI";

function SchedulePage() {
  const router = useRouter();

  const { isInterviewer, isLoading } = useUserRole();

  useEffect(() => {
    if (!isLoading && !isInterviewer) {
      router.push("/");
    }
  }, [isLoading, isInterviewer, router]);

  if (isLoading) return <LoaderUI />;
  if (!isInterviewer) return null;

  return <InterviewScheduleUI />;
}
export default SchedulePage;
