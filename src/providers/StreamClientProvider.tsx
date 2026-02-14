"use client";

import { ReactNode, useEffect, useState, useRef } from "react";
import { StreamVideoClient, StreamVideo } from "@stream-io/video-react-sdk";
import { useUser } from "@clerk/nextjs";
import { LoaderUI } from "@/components/common";
import { streamTokenProvider } from "@/actions/stream.actions";

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [streamVideoClient, setStreamVideoClient] =
    useState<StreamVideoClient>();
  const { user, isLoaded } = useUser();
  const clientRef = useRef<StreamVideoClient | null>(null);

  useEffect(() => {
    if (!isLoaded || !user) return;

    let isMounted = true;

    const initClient = async () => {
      try {
        const client = StreamVideoClient.getOrCreateInstance({
          apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
          user: {
            id: user.id,
            name:
              user.firstName || user.lastName
                ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                : user.id,
            image: user.imageUrl,
          },
          tokenProvider: streamTokenProvider,
        });

        clientRef.current = client;

        if (isMounted) {
          setStreamVideoClient(client);
        }
      } catch (err) {
        console.error("Failed to initialize Stream Video Client:", err);
      }
    };

    initClient();

    return () => {
      isMounted = false;
      if (clientRef.current) {
        clientRef.current.disconnectUser();
        clientRef.current = null;
        setStreamVideoClient(undefined);
      }
    };
  }, [user?.id, isLoaded]);

  if (!streamVideoClient) return <LoaderUI />;

  return <StreamVideo client={streamVideoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;
