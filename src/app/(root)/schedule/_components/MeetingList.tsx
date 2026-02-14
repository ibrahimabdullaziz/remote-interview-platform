"use client";

import { MeetingCard } from "@/components/interviews";
import { Doc } from "@convex/dataModel";

interface MeetingListProps {
  interviews: Doc<"interviews">[];
}

export function MeetingList({ interviews }: MeetingListProps) {
  if (interviews.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No interviews scheduled
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {interviews.map((interview) => (
          <MeetingCard key={interview._id} interview={interview} />
        ))}
      </div>
    </div>
  );
}
