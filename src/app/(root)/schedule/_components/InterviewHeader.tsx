"use client";

import { Button } from "@/components/ui/button";

interface InterviewHeaderProps {
  onScheduleClick: () => void;
}

export function InterviewHeader({ onScheduleClick }: InterviewHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Interviews</h1>
        <p className="text-muted-foreground mt-1">
          Schedule and manage interviews
        </p>
      </div>

      <Button size="lg" onClick={onScheduleClick}>
        Schedule Interview
      </Button>
    </div>
  );
}
