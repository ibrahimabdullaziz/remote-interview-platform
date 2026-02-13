import { MeetingCard } from "@/components/interviews";
import { MeetingListSkeleton } from "@/components/skeletons/MeetingListSkeleton";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Doc } from "../../../../../convex/_generated/dataModel";

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
            {interviews.map((interview: Doc<"interviews">) => (
              <MeetingCard key={interview._id} interview={interview} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            You have no scheduled interviews at the moment
          </div>
        )}
      </div>
    </>
  );
}
