import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { updateInterviewStatusAction } from "@/actions/interview.actions";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { withErrorHandling } from "@/lib/errors";

function EndCallButton() {
  const call = useCall();
  const router = useRouter();
  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  const interview = useQuery(api.interviews.getInterviewByStreamCallId, {
    streamCallId: call?.id || "",
  });

  if (!call || !interview) return null;

  const isMeetingOwner = localParticipant?.userId === call.state.createdBy?.id;

  if (!isMeetingOwner) return null;

  const endCall = async () => {
    await withErrorHandling(
      async () => {
        await call.endCall();

        await updateInterviewStatusAction({
          id: interview._id,
          status: "completed",
        });

        router.push("/");
        toast.success("Meeting ended for everyone");
      },
      "CONVEX_MUTATION_FAILED",
      { interviewId: interview._id, callId: call.id },
    );
  };

  return (
    <Button variant={"destructive"} onClick={endCall}>
      End Meeting
    </Button>
  );
}
export default EndCallButton;
