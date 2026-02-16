"use client";

import {
  useCall,
  useCallStateHooks,
  isPinned,
  StreamVideoParticipant,
} from "@stream-io/video-react-sdk";
import {
  MoreVerticalIcon,
  MicOffIcon,
  UserMinusIcon,
  PinIcon,
  VolumeXIcon,
  XIcon,
  MicIcon,
  VideoIcon,
  VideoOffIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import toast from "react-hot-toast";

export const CustomParticipantList = ({ onClose }: { onClose: () => void }) => {
  const call = useCall();
  const { useParticipants, useLocalParticipant } = useCallStateHooks();
  const participants = useParticipants();
  const localParticipant = useLocalParticipant();

  if (!call) return null;

  const isMeetingOwner = localParticipant?.userId === call.state.createdBy?.id;

  const handleMuteAll = async () => {
    try {
      await call.muteAllUsers("audio");
      toast.success("Muted all participants");
    } catch {
      toast.error("Failed to mute all");
    }
  };

  const handleKick = async (userId: string) => {
    try {
      await call.kickUser({ user_id: userId });
      toast.success("Participant removed");
    } catch {
      toast.error("Failed to kick participant");
    }
  };

  const handleMute = async (userId: string) => {
    try {
      await call.muteUser(userId, "audio");
      toast.success("Participant muted");
    } catch {
      toast.error("Failed to mute participant");
    }
  };

  const handleTogglePin = async (participant: StreamVideoParticipant) => {
    try {
      if (isPinned(participant)) {
        await call.unpin(participant.sessionId);
      } else {
        await call.pin(participant.sessionId);
      }
    } catch {
      toast.error("Failed to toggle pin");
    }
  };

  return (
    <div className="flex flex-col h-full bg-background border-l w-[300px]">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-semibold text-lg">
          Participants ({participants.length})
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="size-8"
        >
          <XIcon className="size-4" />
        </Button>
      </div>

      {isMeetingOwner && (
        <div className="p-2 border-b">
          <Button
            variant="outline"
            className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50/10 border-red-500/20"
            onClick={handleMuteAll}
          >
            <VolumeXIcon className="size-4" />
            Mute All
          </Button>
        </div>
      )}

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {participants.map((p) => (
            <div
              key={p.sessionId}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-800/50 group transition-colors"
            >
              <div className="flex items-center gap-3">
                <Avatar className="size-8 border border-white/10">
                  <AvatarImage src={p.image} />
                  <AvatarFallback className="bg-zinc-800 text-xs">
                    {p.name?.charAt(0) || p.userId.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium truncate max-w-[120px]">
                    {p.name || "Anonymous"}
                    {p.userId === localParticipant?.userId && " (Me)"}
                  </span>
                  <div className="flex gap-1.5 mt-0.5">
                    {p.audioStream ? (
                      <MicIcon className="size-3 text-emerald-500" />
                    ) : (
                      <MicOffIcon className="size-3 text-zinc-500" />
                    )}
                    {p.videoStream ? (
                      <VideoIcon className="size-3 text-emerald-500" />
                    ) : (
                      <VideoOffIcon className="size-3 text-zinc-500" />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {isPinned(p) && (
                  <PinIcon className="size-3 text-blue-500 fill-current" />
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVerticalIcon className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-40 bg-zinc-900 border-zinc-800"
                  >
                    <DropdownMenuItem
                      onClick={() => handleTogglePin(p)}
                      className="gap-2 cursor-pointer"
                    >
                      <PinIcon className="size-4" />
                      {isPinned(p) ? "Unpin" : "Pin"}
                    </DropdownMenuItem>

                    {isMeetingOwner &&
                      p.userId !== localParticipant?.userId && (
                        <>
                          <DropdownMenuItem
                            onClick={() => handleMute(p.userId)}
                            className="gap-2 cursor-pointer"
                          >
                            <MicOffIcon className="size-4" />
                            Mute
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleKick(p.userId)}
                            className="gap-2 cursor-pointer text-red-500 focus:text-red-500"
                          >
                            <UserMinusIcon className="size-4" />
                            Kick
                          </DropdownMenuItem>
                        </>
                      )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
