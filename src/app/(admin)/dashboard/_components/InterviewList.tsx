import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarIcon,
  CheckCircle2Icon,
  ClockIcon,
  XCircleIcon,
} from "lucide-react";
import { CommentDialog } from "@/components/interviews";
import { INTERVIEW_CATEGORY } from "@/constants";
import { getCandidateInfo, groupInterviews } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Doc, Id } from "../../../../../convex/_generated/dataModel";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { withErrorHandling } from "@/lib/errors";

type Interview = Doc<"interviews">;

export function InterviewList() {
  const users = useQuery(api.users.getUsers);
  const interviews = useQuery(api.interviews.getAllInterviews);
  const updateStatus = useMutation(api.interviews.updateInterviewStatus);
  const removeInterview = useMutation(api.interviews.deleteInterview);

  const handleStatusUpdate = async (
    interviewId: Id<"interviews">,
    status: "upcoming" | "completed" | "succeeded" | "failed",
  ) => {
    await withErrorHandling(
      async () => {
        await updateStatus({ id: interviewId, status });
        toast.success(`Interview marked as ${status}`);
      },
      "CONVEX_MUTATION_FAILED",
      { interviewId, status },
    );
  };

  const handleDelete = async (id: Id<"interviews">) => {
    if (!confirm("Are you sure you want to delete this interview?")) return;

    await withErrorHandling(
      async () => {
        await removeInterview({ id });
        toast.success("Interview deleted");
      },
      "CONVEX_MUTATION_FAILED",
      { interviewId: id },
    );
  };

  if (!interviews || !users) return null;

  const groupedInterviews = groupInterviews(interviews);

  return (
    <div className="space-y-8">
      {INTERVIEW_CATEGORY.map(
        (category) =>
          (groupedInterviews[category.id]?.length ?? 0) > 0 && (
            <section key={category.id}>
              {/* CATEGORY TITLE */}
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-semibold">{category.title}</h2>
                <Badge variant={category.variant}>
                  {groupedInterviews[category.id]?.length}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(groupedInterviews[category.id] ?? []).map(
                  (interview: Interview) => {
                    const candidateInfo = getCandidateInfo(
                      users,
                      interview.candidateId,
                    );
                    const startTime = new Date(interview.startTime);

                    return (
                      <Card
                        key={interview._id}
                        className="hover:shadow-md transition-all"
                      >
                        {/* CANDIDATE INFO */}
                        <CardHeader className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={candidateInfo.image} />
                              <AvatarFallback>
                                {candidateInfo.initials}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base">
                                {candidateInfo.name}
                              </CardTitle>
                              <p className="text-sm text-muted-foreground">
                                {interview.title}
                              </p>
                            </div>
                          </div>
                        </CardHeader>

                        {/* DATE &  TIME */}
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="h-4 w-4" />
                              {format(startTime, "MMM dd")}
                            </div>
                            <div className="flex items-center gap-1">
                              <ClockIcon className="h-4 w-4" />
                              {format(startTime, "hh:mm a")}
                            </div>
                          </div>
                        </CardContent>

                        {/* PASS & FAIL BUTTONS */}
                        <CardFooter className="p-4 pt-0 flex flex-col gap-3">
                          {interview.status === "completed" && (
                            <div className="flex gap-2 w-full">
                              <Button
                                className="flex-1"
                                aria-label="Pass Candidate"
                                onClick={() =>
                                  handleStatusUpdate(interview._id, "succeeded")
                                }
                              >
                                <CheckCircle2Icon className="h-4 w-4 mr-2" />
                                Pass
                              </Button>
                              <Button
                                variant="destructive"
                                className="flex-1"
                                aria-label="Fail Candidate"
                                onClick={() =>
                                  handleStatusUpdate(interview._id, "failed")
                                }
                              >
                                <XCircleIcon className="h-4 w-4 mr-2" />
                                Fail
                              </Button>
                            </div>
                          )}
                          <div className="flex gap-2 w-full">
                            <CommentDialog interviewId={interview._id} />
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-muted-foreground hover:text-destructive"
                              title="Delete Interview"
                              aria-label="Delete Interview"
                              onClick={() => handleDelete(interview._id)}
                            >
                              <XCircleIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    );
                  },
                )}
              </div>
            </section>
          ),
      )}
    </div>
  );
}
