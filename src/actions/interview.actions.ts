"use server";

import { api } from "../../convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import { Id } from "../../convex/_generated/dataModel";
import { auth } from "@clerk/nextjs/server";

export const createInterviewAction = async (args: {
  title: string;
  description: string;
  startTime: number;
  status: "upcoming" | "live" | "completed";
  streamCallId: string;
  candidateId: string;
  interviewerIds: string[];
}) => {
  try {
    const { getToken } = await auth();
    const token = await getToken({ template: "convex" });
    const interviewId = await fetchMutation(
      api.interviews.createInterview,
      args,
      { token: token || undefined },
    );
    return { success: true, interviewId };
  } catch (error) {
    console.error("Failed to create interview:", error);
    return { success: false, error: "Failed to create interview" };
  }
};

export const updateInterviewStatusAction = async (args: {
  id: Id<"interviews">;
  status: "upcoming" | "live" | "completed" | "succeeded" | "failed";
}) => {
  try {
    const { getToken } = await auth();
    const token = await getToken({ template: "convex" });
    await fetchMutation(api.interviews.updateInterviewStatus, args, {
      token: token || undefined,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to update interview status:", error);
    return { success: false, error: "Failed to update interview status" };
  }
};

export const deleteInterviewAction = async (args: { id: Id<"interviews"> }) => {
  try {
    const { getToken } = await auth();
    const token = await getToken({ template: "convex" });
    await fetchMutation(api.interviews.deleteInterview, args, {
      token: token || undefined,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to delete interview:", error);
    return { success: false, error: "Failed to delete interview" };
  }
};
