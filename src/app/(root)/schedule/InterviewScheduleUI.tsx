"use client";

import { useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { Loader2Icon } from "lucide-react";
import { InterviewHeader } from "./_components/InterviewHeader";
import { ScheduleDialog } from "./_components/ScheduleDialog";
import { MeetingList } from "./_components/MeetingList";

/**
 * DEFINITIVE STABILITY FIX:
 * 1. Uses getAllInterviewsList (non-paginated) to avoid usePaginatedQuery crashes.
 * 2. Absolute loading guards.
 */
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

      <ScheduleDialog open={open} onOpenChange={setOpen} />

      <MeetingList interviews={safeInterviews} />
    </div>
  );
}

export default InterviewScheduleUI;
