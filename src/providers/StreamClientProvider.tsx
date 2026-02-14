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
  const initializedUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !user) return;

    let isMounted = true;

    const initClient = async () => {
      // Prevent re-initialization if client already exists for this user
      if (clientRef.current && initializedUserIdRef.current === user.id) {
        if (isMounted) setStreamVideoClient(clientRef.current);
        return;
      }

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
        initializedUserIdRef.current = user.id;

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
      // Thorough cleanup without recursive loops
      if (clientRef.current) {
        clientRef.current.disconnectUser();
        clientRef.current = null;
        initializedUserIdRef.current = null;
      }
      setStreamVideoClient(undefined);
    };
  }, [user?.id, isLoaded]);

  if (!streamVideoClient) return <LoaderUI />;

  return <StreamVideo client={streamVideoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;
