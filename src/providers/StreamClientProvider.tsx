"use client";

import { ReactNode, useEffect, useState } from "react";
import { StreamVideoClient, StreamVideo } from "@stream-io/video-react-sdk";
import { useUser } from "@clerk/nextjs";
import { LoaderUI } from "@/components/common";
import { streamTokenProvider } from "@/actions/stream.actions";

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [streamVideoClient, setStreamVideoClient] =
    useState<StreamVideoClient>();
  const [error, setError] = useState<string | null>(null);
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
          try {
            const token = await streamTokenProvider();
            console.log("Token generated successfully for user:", user.id);
            return token;
          } catch (e) {
            console.error("Token generation failed:", e);
            throw e;
          }
        },
      });

      console.log("Initializing StreamVideoClient for user:", user.id);

      setStreamVideoClient(client);
      setError(null);
    } catch (e) {
      console.error("Failed to initialize StreamVideoClient", e);
      setError(
        "We couldn't initialize the video client. Please refresh the page or try again later.",
      );
    }

    return () => {
      if (client) {
        client
          .disconnectUser()
          .catch((e) =>
            console.error("Failed to disconnect StreamVideoClient", e),
          );
      }
      setStreamVideoClient(undefined);
    };
  }, [user?.id, isLoaded]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <p className="max-w-md text-center text-sm text-muted-foreground">
          {error}
        </p>
      </div>
    );
  }

  if (!streamVideoClient) return <LoaderUI />;

  return <StreamVideo client={streamVideoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;
