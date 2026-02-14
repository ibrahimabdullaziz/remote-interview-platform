"use client";

import { UserInfo } from "@/components/common";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { XIcon } from "lucide-react";
import { Doc } from "@convex/dataModel";

interface InterviewerSelectorProps {
  selectedIds: string[];
  availableInterviewers: Doc<"users">[];
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  currentUserId?: string;
}

export function InterviewerSelector({
  selectedIds,
  availableInterviewers,
  onAdd,
  onRemove,
  currentUserId,
}: InterviewerSelectorProps) {
  const selectedInterviewers = (availableInterviewers ?? []).filter((i) =>
    selectedIds.includes(i.clerkId),
  );

  const selectableInterviewers = (availableInterviewers ?? []).filter(
    (i) => !selectedIds.includes(i.clerkId),
  );

  return (
    <div className="space-y-2">
      <label htmlFor="interviewer-selector" className="text-sm font-medium">
        Interviewers
      </label>
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedInterviewers.map((interviewer) => (
          <div
            key={interviewer.clerkId}
            className="inline-flex items-center gap-2 bg-secondary px-2 py-1 rounded-md text-sm"
          >
            <UserInfo user={interviewer} />
            {interviewer.clerkId !== currentUserId && (
              <button
                type="button"
                onClick={() => onRemove(interviewer.clerkId)}
                className="hover:text-destructive transition-colors"
                aria-label={`Remove ${interviewer.name}`}
              >
                <XIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {selectableInterviewers.length > 0 && (
        <Select onValueChange={onAdd}>
          <SelectTrigger id="interviewer-selector" aria-label="Add interviewer">
            <SelectValue placeholder="Add interviewer" />
          </SelectTrigger>
          <SelectContent>
            {selectableInterviewers.map((interviewer) => (
              <SelectItem key={interviewer.clerkId} value={interviewer.clerkId}>
                <UserInfo user={interviewer} />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
