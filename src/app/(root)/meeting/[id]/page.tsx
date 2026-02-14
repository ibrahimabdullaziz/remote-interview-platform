"use client";

import dynamic from "next/dynamic";
import { LoaderUI } from "@/components/common";
import { ErrorBoundary, ErrorDisplay, createError } from "@/lib/errors";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";
import useGetCallById from "@/hooks/useGetCallById";
import { useUser } from "@clerk/nextjs";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const MeetingSetup = dynamic(
  () => import("@/components/meetings/MeetingSetup"),
  { ssr: false, loading: () => <DashboardSkeleton /> },
);
const MeetingRoom = dynamic(() => import("@/components/meetings/MeetingRoom"), {
  ssr: false,
  loading: () => <DashboardSkeleton />,
});

function MeetingPage() {
  const router = useRouter();
  const { id } = useParams();
  const { isLoaded } = useUser();
  const { call, isCallLoading } = useGetCallById(id);

  const [isSetupComplete, setIsSetupComplete] = useState(false);

  if (!isLoaded || isCallLoading) return <LoaderUI />;

  if (!call) {
    const notFoundError = createError("STREAM_CONNECTION_FAILED", undefined, {
      meetingId: id,
      reason: "Meeting not found or has ended",
    });

    return (
      <ErrorDisplay
        error={notFoundError}
        onRetry={() => router.push("/meeting")}
        showIcon={true}
        className="h-screen"
      />
    );
  }

  return (
    <StreamCall call={call}>
      <StreamTheme>
        <ErrorBoundary
          maxRetries={3}
          onReset={() => {
            setIsSetupComplete(false);
          }}
          resetKeys={[Array.isArray(id) ? id[0] : id]}
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
