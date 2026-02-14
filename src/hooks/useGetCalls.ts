import { useEffect, useState, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { handleUnknownError } from "@/lib/errors";

const useGetCalls = () => {
  const { user, isLoaded: isClerkLoaded } = useUser();
  const client = useStreamVideoClient();
  const [calls, setCalls] = useState<Call[]>([]);
  const [isCallsLoading, setIsCallsLoading] = useState(false);

  useEffect(() => {
    const loadCalls = async () => {
      if (!client || !user?.id) return;

      setIsCallsLoading(true);

      try {
        const { calls } = await client.queryCalls({
          sort: [{ field: "starts_at", direction: -1 }],
          filter_conditions: {
            starts_at: { $exists: true },
            $or: [
              { created_by_user_id: user.id },
              { members: { $in: [user.id] } },
            ],
          },
        });

        setCalls(calls);
      } catch (error) {
        handleUnknownError(error);
      } finally {
        setIsCallsLoading(false);
      }
    };

    loadCalls();
  }, [client, user?.id]);

  const now = new Date();

  const endedCalls = useMemo(() => {
    return calls.filter(({ state: { startsAt, endedAt } }: Call) => {
      return (startsAt && new Date(startsAt) < now) || !!endedAt;
    });
  }, [calls, now]);

  const upcomingCalls = useMemo(() => {
    return calls.filter(({ state: { startsAt } }: Call) => {
      return startsAt && new Date(startsAt) > now;
    });
  }, [calls, now]);

  const liveCalls = useMemo(() => {
    return calls.filter(({ state: { startsAt, endedAt } }: Call) => {
      return startsAt && new Date(startsAt) < now && !endedAt;
    });
  }, [calls, now]);

  return {
    calls,
    endedCalls,
    upcomingCalls,
    liveCalls,
    isLoading: !isClerkLoaded || isCallsLoading,
  };
};

export default useGetCalls;
