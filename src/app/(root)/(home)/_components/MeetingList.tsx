"use client";

import { MeetingCard } from "@/components/interviews";
import { MeetingListSkeleton } from "@/components/skeletons/MeetingListSkeleton";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Doc } from "../../../../../convex/_generated/dataModel";
import { EmptyState } from "@/components/common/EmptyState";
import { CalendarIcon } from "lucide-react";

export function MeetingList() {
  const interviews = useQuery(api.interviews.getMyInterviews);

  if (interviews === undefined) {
    return <MeetingListSkeleton />;
  }

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold">Your Interviews</h1>
        <p className="text-muted-foreground mt-1">
          View and join your scheduled interviews
        </p>
      </div>

      <div className="mt-8">
        {interviews.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {interviews.map((interview: Doc<"interviews">, index: number) => (
              <div
                key={interview._id}
                className="animate-fade-in opacity-0 fill-mode-forwards"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: "forwards",
                }}
              >
                <MeetingCard interview={interview} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Scheduled Interviews"
            description="You have no upcoming interviews."
            actionLabel="Schedule Interview"
            actionLink="/schedule"
            icon={CalendarIcon}
          />
        )}
      </div>
    </>
  );
}
