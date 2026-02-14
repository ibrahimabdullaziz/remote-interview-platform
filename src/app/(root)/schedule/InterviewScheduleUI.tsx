"use client";

import { usePaginatedQuery } from "convex/react";
import { useState } from "react";
import { api } from "@convex/api";
import { Loader2Icon } from "lucide-react";
import { InterviewHeader } from "./_components/InterviewHeader";
import { ScheduleDialog } from "./_components/ScheduleDialog";
import { MeetingList } from "./_components/MeetingList";

function InterviewScheduleUI() {
  const [open, setOpen] = useState(false);

  const { results: interviews, status: interviewsStatus } = usePaginatedQuery(
    api.interviews.getAllInterviews,
    {},
    { initialNumItems: 20 },
  );

  const { results: users, status: usersStatus } = usePaginatedQuery(
    api.users.getUsers,
    {},
    { initialNumItems: 100 },
  );

  const isLoading =
    interviewsStatus === "LoadingFirstPage" ||
    usersStatus === "LoadingFirstPage";

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-8">
      <InterviewHeader onScheduleClick={() => setOpen(true)} />

      <ScheduleDialog open={open} onOpenChange={setOpen} users={users || []} />

      {/* LOADING STATE & MEETING CARDS */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <MeetingList interviews={interviews || []} />
      )}
    </div>
  );
}

export default InterviewScheduleUI;
