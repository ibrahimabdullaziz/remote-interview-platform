"use server";

import { api } from "../../convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import { Id } from "../../convex/_generated/dataModel";

export const addCommentAction = async (args: {
  interviewId: Id<"interviews">;
  content: string;
  rating: 1 | 2 | 3 | 4 | 5;
}) => {
  try {
    await fetchMutation(api.comments.addComment, args);
    return { success: true };
  } catch (error) {
    console.error("Failed to add comment:", error);
    return { success: false, error: "Failed to add comment" };
  }
};
