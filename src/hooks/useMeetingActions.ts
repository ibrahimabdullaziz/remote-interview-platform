import { useRouter } from "next/navigation";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import toast from "react-hot-toast";
import { withErrorHandling, createError } from "@/lib/errorHandler";

const useMeetingActions = () => {
  const router = useRouter();
  const client = useStreamVideoClient();

  const createInstantMeeting = async () => {
    if (!client) {
      const error = createError("STREAM_CONNECTION_FAILED");
      toast.error(error.userMessage);
      return;
    }

    try {
      const id = crypto.randomUUID();
      const call = client.call("default", id);

      if (!call) throw new Error("Failed to create call object");

      console.log("Creating meeting with ID:", id);

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
        { meetingId: call?.id }
      );
    }
  };

  const joinMeeting = (callId: string) => {
    if (!client)
      return toast.error("Failed to join meeting. Please try again.");
    router.push(`/meeting/${callId}`);
  };

  return { createInstantMeeting, joinMeeting };
};

export default useMeetingActions;
