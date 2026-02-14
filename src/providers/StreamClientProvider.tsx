"use client";

import { ReactNode, useEffect, useState } from "react";
import { StreamVideoClient, StreamVideo } from "@stream-io/video-react-sdk";
import { useUser } from "@clerk/nextjs";
import { LoaderUI } from "@/components/common";
import { streamTokenProvider } from "@/actions/stream.actions";
import { handleUnknownError, getErrorMessage, type AppError } from "@/lib/errorHandler";
import { ErrorDisplay } from "@/components/common/ErrorDisplay";

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [streamVideoClient, setStreamVideoClient] =
    useState<StreamVideoClient>();
  const [error, setError] = useState<AppError | null>(null);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user) return;

    let client: StreamVideoClient | undefined;

    try {
      client = new StreamVideoClient({
        apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
        user: {
          id: user.id,
          name:
            (user.firstName || "") +
            " " +
            (user.lastName || "") ||
            user.id,
          image: user.imageUrl,
        },
        tokenProvider: async () => {
          const token = await streamTokenProvider();
          return token;
        },
      });

      setStreamVideoClient(client);
      setError(null);
    } catch (e) {
      const appError = handleUnknownError(e);
      setError(appError);
    }

    return () => {
      if (client) {
        client.disconnectUser().catch((e) => handleUnknownError(e));
      }
      setStreamVideoClient(undefined);
    };
  }, [user?.id, isLoaded]);

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  if (!streamVideoClient) return <LoaderUI />;

  return <StreamVideo client={streamVideoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;
