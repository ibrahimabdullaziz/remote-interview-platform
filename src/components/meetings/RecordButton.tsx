"use client";

import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import { CircleIcon, StopCircleIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import toast from "react-hot-toast";

export const RecordButton = () => {
  const call = useCall();
  const { useIsCallRecordingInProgress } = useCallStateHooks();
  const isRecording = useIsCallRecordingInProgress();
  const [isPending, setIsPending] = useState(false);

  if (!call) return null;

  const handleToggleRecording = async () => {
    if (isPending) return;
    setIsPending(true);

    try {
      if (isRecording) {
        await call.stopRecording();
        toast.success("Recording stopped");
      } else {
        await call.startRecording();
        toast.success("Recording started");
      }
    } catch (error) {
      console.error("Recording error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      if (errorMessage.includes("call is already being recorded")) {
        toast.error("Recording is already in progress");
      } else if (errorMessage.includes("call is not being recorded")) {
        toast.error("Recording already stopped");
      } else {
        toast.error("Failed to toggle recording. Please try again.");
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className={`size-10 rounded-full border-none transition-all duration-300 ${
        isRecording
          ? "bg-red-500/10 text-red-400/80 hover:bg-red-500/20 animate-pulse animate-duration-[3000ms] shadow-[0_0_20px_rgba(239,68,68,0.05)]"
          : "bg-zinc-800/80 text-zinc-500 hover:bg-zinc-700/90"
      }`}
      onClick={handleToggleRecording}
      disabled={isPending}
      aria-label={isRecording ? "Stop Recording" : "Start Recording"}
    >
      {isRecording ? (
        <StopCircleIcon className="size-[1.125rem] fill-current" />
      ) : (
        <CircleIcon className="size-[1.125rem]" />
      )}
    </Button>
  );
};
