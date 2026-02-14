"use server";

import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";
import { createError } from "@/lib/errorHandler";

export const streamTokenProvider = async () => {
  const user = await currentUser();

  if (!user) {
    const error = createError("AUTH_UNAUTHORIZED");
    throw error;
  }

  try {
    const streamClient = new StreamClient(
      process.env.NEXT_PUBLIC_STREAM_API_KEY!,
      process.env.STREAM_SECRET_KEY!,
    );

    const token = streamClient.generateUserToken({ user_id: user.id });
    return token;
  } catch (error) {
    const appError = createError(
      "STREAM_TOKEN_INVALID",
      error instanceof Error ? error : undefined,
      { userId: user.id }
    );
    throw appError;
  }
};
