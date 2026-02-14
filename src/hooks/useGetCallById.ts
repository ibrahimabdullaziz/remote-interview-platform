import { useEffect, useState } from "react";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { handleUnknownError } from "@/lib/errors";

const useGetCallById = (id: string | string[]) => {
  const [call, setCall] = useState<Call>();
  const [isCallLoading, setIsCallLoading] = useState(true);

  const client = useStreamVideoClient();

  const callId = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
    if (!client || !callId) return;

    const getCall = async () => {
      setIsCallLoading(true);
      try {
        const { calls } = await client.queryCalls({
          filter_conditions: { id: callId },
        });

        if (calls.length > 0) {
          setCall(calls[0]);
        } else {
          setCall(undefined);
        }
      } catch (error) {
        handleUnknownError(error);
        setCall(undefined);
      } finally {
        setIsCallLoading(false);
      }
    };

    getCall();
  }, [client, callId]);

  return { call, isCallLoading };
};

export default useGetCallById;
