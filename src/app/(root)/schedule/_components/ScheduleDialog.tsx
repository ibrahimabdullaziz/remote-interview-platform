"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { createInterviewAction } from "@/actions/interview.actions";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserInfo } from "@/components/common";
import { Loader2Icon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { TIME_SLOTS } from "@/constants";
import { InterviewerSelector } from "./InterviewerSelector";
import { withErrorHandling } from "@/lib/errors";

interface ScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScheduleDialog({ open, onOpenChange }: ScheduleDialogProps) {
  const client = useStreamVideoClient();
  const { user } = useUser();
  const [isCreating, setIsCreating] = useState(false);

  // Using the new stability-safe query
  const users = useQuery(api.users.getAllUsers);

  const safeUsers = Array.isArray(users) ? users : [];
  const candidates = safeUsers.filter((u) => u.role === "candidate");
  const allInterviewers = safeUsers.filter((u) => u.role === "interviewer");

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    date: Date;
    time: string;
    candidateId: string;
    interviewerIds: string[];
  }>(() => {
    const now = new Date();
    now.setHours(now.getHours() + 1, 0, 0, 0);
    const defaultTime = `${now.getHours().toString().padStart(2, "0")}:00`;

    return {
      title: "",
      description: "",
      date: new Date(),
      time: defaultTime,
      candidateId: "",
      interviewerIds: [],
    };
  });

  // Safe side effect to set default interviewer
  useState(() => {
    if (user?.id && formData.interviewerIds.length === 0) {
      setFormData((prev) => ({ ...prev, interviewerIds: [user.id] }));
    }
  });

  const handleSchedule = async () => {
    if (!client || !user) return;
    if (!formData.candidateId || formData.interviewerIds.length === 0) {
      toast.error("Please select both candidate and at least one interviewer");
      return;
    }

    setIsCreating(true);

    await withErrorHandling(async () => {
      const { title, description, date, time, candidateId, interviewerIds } =
        formData;
      const [hours, minutes] = time.split(":");
      const meetingDate = new Date(date);
      meetingDate.setHours(parseInt(hours), parseInt(minutes), 0);

      if (meetingDate.getTime() <= Date.now()) {
        toast.error("Please select a future time for the interview");
        setIsCreating(false);
        return;
      }

      const id = crypto.randomUUID();
      const call = client.call("default", id);

      await call.getOrCreate({
        data: {
          starts_at: meetingDate.toISOString(),
          custom: {
            description: title,
            additionalDetails: description,
          },
        },
        ring: false,
        notify: false,
        members_limit: 10,
      });

      const result = await createInterviewAction({
        title,
        description,
        startTime: meetingDate.getTime(),
        status: "upcoming",
        streamCallId: id,
        candidateId,
        interviewerIds,
      });

      if (!result.success) throw new Error("Failed to create interview");

      onOpenChange(false);
      toast.success("Meeting scheduled successfully!");

      const resetDate = new Date();
      resetDate.setHours(resetDate.getHours() + 1, 0, 0, 0);
      const resetTime = `${resetDate.getHours().toString().padStart(2, "0")}:00`;

      setFormData({
        title: "",
        description: "",
        date: new Date(),
        time: resetTime,
        candidateId: "",
        interviewerIds: [user?.id || ""].filter(Boolean),
      });
    }, "CONVEX_MUTATION_FAILED");

    setIsCreating(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] h-[calc(100vh-200px)] overflow-auto">
        <DialogHeader>
          <DialogTitle>Schedule Interview</DialogTitle>
          <DialogDescription>
            Create a new interview session with candidates and interviewers.
          </DialogDescription>
        </DialogHeader>

        {users === undefined ? (
          <div className="flex justify-center py-12">
            <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                placeholder="Interview title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                placeholder="Interview description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="candidate" className="text-sm font-medium">
                Candidate
              </label>
              <Select
                value={formData.candidateId}
                onValueChange={(candidateId) =>
                  setFormData({ ...formData, candidateId })
                }
              >
                <SelectTrigger id="candidate">
                  <SelectValue placeholder="Select candidate" />
                </SelectTrigger>
                <SelectContent>
                  {candidates.map((candidate) => (
                    <SelectItem
                      key={candidate.clerkId}
                      value={candidate.clerkId}
                    >
                      <UserInfo user={candidate} />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <InterviewerSelector
              selectedIds={formData.interviewerIds}
              availableInterviewers={allInterviewers}
              onAdd={(id) =>
                setFormData((prev) => ({
                  ...prev,
                  interviewerIds: [...prev.interviewerIds, id],
                }))
              }
              onRemove={(id) =>
                setFormData((prev) => ({
                  ...prev,
                  interviewerIds: prev.interviewerIds.filter((i) => i !== id),
                }))
              }
              currentUserId={user?.id}
            />

            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) =>
                    date && setFormData({ ...formData, date })
                  }
                  disabled={(date) => date < new Date()}
                  className="rounded-md border"
                />
              </div>

              <div className="space-y-2 flex-1">
                <label htmlFor="time" className="text-sm font-medium">
                  Time
                </label>
                <Select
                  value={formData.time}
                  onValueChange={(time) => setFormData({ ...formData, time })}
                >
                  <SelectTrigger id="time">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSchedule} disabled={isCreating}>
                {isCreating ? (
                  <>
                    <Loader2Icon className="mr-2 size-4 animate-spin" />
                    Scheduling...
                  </>
                ) : (
                  "Schedule Interview"
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
