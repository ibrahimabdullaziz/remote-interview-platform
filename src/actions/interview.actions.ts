"use server";

import { api } from "../../convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import { Id } from "../../convex/_generated/dataModel";

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
    const interviewId = await fetchMutation(
      api.interviews.createInterview,
      args,
    );
    return { success: true, interviewId };
  } catch (error) {
    console.error("Failed to create interview:", error);
    return { success: false, error: "Failed to create interview" };
  }
};

export const updateInterviewStatusAction = async (args: {
  id: Id<"interviews">;
  status: "upcoming" | "completed" | "succeeded" | "failed";
}) => {
  try {
    await fetchMutation(api.interviews.updateInterviewStatus, args);
    return { success: true };
  } catch (error) {
    console.error("Failed to update interview status:", error);
    return { success: false, error: "Failed to update interview status" };
  }
};

export const deleteInterviewAction = async (args: { id: Id<"interviews"> }) => {
  try {
    await fetchMutation(api.interviews.deleteInterview, args);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete interview:", error);
    return { success: false, error: "Failed to delete interview" };
  }
};
