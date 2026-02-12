"use client";

import { LoaderUI } from "@/components/common";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { MeetingRoom, MeetingSetup } from "@/components/meetings";
import useGetCallById from "@/hooks/useGetCallById";
import { useUser } from "@clerk/nextjs";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

function MeetingPage() {
  const router = useRouter();
  const { id } = useParams();
  const { isLoaded } = useUser();
  const { call, isCallLoading } = useGetCallById(id);

  const [isSetupComplete, setIsSetupComplete] = useState(false);

  if (!isLoaded || isCallLoading) return <LoaderUI />;

  if (!call) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="space-y-3 text-center">
          <p className="text-2xl font-semibold">Meeting not found</p>
          <button
            onClick={() => router.push("/")}
            className="text-sm text-primary underline underline-offset-4"
          >
            Go back home
          </button>
        </div>
      </div>
    );
  }

  return (
    <StreamCall call={call}>
      <StreamTheme>
        <ErrorBoundary
          fallback={
            <div className="flex min-h-[calc(100vh-4rem-1px)] items-center justify-center px-4">
              <div className="max-w-md text-center space-y-3">
                <h2 className="text-xl font-semibold">
                  We couldn&apos;t load the meeting experience.
                </h2>
                <p className="text-sm text-muted-foreground">
                  This can happen if the video SDK fails to initialize or
                  browser permissions are denied. Please check your camera and
                  microphone permissions and try again.
                </p>
                <button
                  onClick={() => router.refresh()}
                  className="text-sm text-primary underline underline-offset-4"
                >
                  Retry
                </button>
              </div>
            </div>
          }
        >
          {!isSetupComplete ? (
            <MeetingSetup onSetupComplete={() => setIsSetupComplete(true)} />
          ) : (
            <MeetingRoom />
          )}
        </ErrorBoundary>
      </StreamTheme>
    </StreamCall>
  );
}
export default MeetingPage;
