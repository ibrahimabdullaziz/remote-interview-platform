import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import toast from "react-hot-toast";
import { withErrorHandling, createError } from "@/lib/errors";

const useMeetingActions = () => {
  const router = useRouter();
  const client = useStreamVideoClient();

  const createInstantMeeting = useCallback(async () => {
    if (!client) {
      const error = createError("STREAM_CONNECTION_FAILED");
      toast.error(error.userMessage);
      return;
    }

    let call;
    try {
      const id = crypto.randomUUID();
      call = client.call("default", id);

      if (!call) throw new Error("Failed to create call object");

      
      await call.getOrCreate({
        data: {
          starts_at: new Date().toISOString(),
          custom: {
            description: "Instant Meeting",
          },
        },
        ring: false,
        notify: false,
        members_limit: 10,
      });

      router.push(`/meeting/${call.id}`);
      toast.success("Meeting Created");
    } catch (error) {
     
      await withErrorHandling(
        async () => { throw error; },
        "STREAM_CONNECTION_FAILED",
        { meetingId: call?.id, timestamp: new Date().toISOString() }
      );
    }
  }, [client, router]);

  
  const joinMeeting = useCallback((callId: string) => {
    if (!client) {
      const error = createError("STREAM_CONNECTION_FAILED");
      return toast.error(error.userMessage);
    }
    router.push(`/meeting/${callId}`);
  }, [client, router]);

  return { createInstantMeeting, joinMeeting };
};

export default useMeetingActions;