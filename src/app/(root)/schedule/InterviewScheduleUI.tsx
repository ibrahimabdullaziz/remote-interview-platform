"use client";

import dynamic from "next/dynamic";

import { useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { Loader2Icon } from "lucide-react";
import { InterviewHeader } from "./_components/InterviewHeader";
import { MeetingList } from "./_components/MeetingList";
const ScheduleDialog = dynamic(
  () =>
    import("./_components/ScheduleDialog").then((mod) => mod.ScheduleDialog),
  { ssr: false },
);

function InterviewScheduleUI() {
  const [open, setOpen] = useState(false);

  const interviews = useQuery(api.interviews.getAllInterviewsList);

  const isLoading = interviews === undefined;

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const safeInterviews = interviews ?? [];

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-8">
      <InterviewHeader onScheduleClick={() => setOpen(true)} />

      {open && <ScheduleDialog open={open} onOpenChange={setOpen} />}

      <MeetingList interviews={safeInterviews} />
    </div>
  );
}

export default InterviewScheduleUI;
