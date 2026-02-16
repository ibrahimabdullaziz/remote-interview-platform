"use server";

import { StreamClient } from "@stream-io/node-sdk";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;
const apiSecret = process.env.STREAM_SECRET_KEY!;

export const deleteRecordingAction = async (
  callType: string,
  callId: string,
  sessionId: string,
  filename: string,
) => {
  const client = new StreamClient(apiKey, apiSecret);

  try {
    await client.video.call(callType, callId).deleteRecording({
      session: sessionId,
      filename,
    });
    return { success: true };
  } catch (error) {
    console.error("Delete recording error:", error);
    return { success: false, error: "Failed to delete recording" };
  }
};
