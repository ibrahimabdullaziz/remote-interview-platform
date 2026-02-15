"use client";

import { MeetingCard } from "@/components/interviews";
import { Doc } from "@convex/dataModel";

interface MeetingListProps {
  interviews: Doc<"interviews">[];
}

export function MeetingList({ interviews }: MeetingListProps) {
  const safeInterviews = Array.isArray(interviews) ? interviews : [];

  if (safeInterviews.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No interviews scheduled
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {safeInterviews.map((interview, index) => (
          <div
            key={interview._id}
            className="animate-fade-in opacity-0"
            style={{
              animationDelay: `${index * 100}ms`,
              animationFillMode: "forwards",
            }}
          >
            <MeetingCard interview={interview} />
          </div>
        ))}
      </div>
    </div>
  );
}
