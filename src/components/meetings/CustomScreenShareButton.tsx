"use client";

import {
  SfuModels,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { ScreenShareIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export const CustomScreenShareButton = () => {
  const call = useCall();
  const { useScreenShareState, useHasOngoingScreenShare } = useCallStateHooks();
  const { screenShare, optionsAwareIsMute } = useScreenShareState();
  const isSomeoneScreenSharing = useHasOngoingScreenShare();
  const amIScreenSharing = !optionsAwareIsMute;
  const isSharing = amIScreenSharing || isSomeoneScreenSharing;
  const [isPending, setIsPending] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Check if screen sharing is supported (mobile browsers often don't support it)
    if (
      typeof navigator !== "undefined" &&
      navigator.mediaDevices &&
      !navigator.mediaDevices.getDisplayMedia
    ) {
      setIsSupported(false);
    }
  }, []);

  if (!call) return null;

  const handleToggleScreenShare = async () => {
    if (!isSupported) {
      toast.error("Screen sharing is not supported on this device/browser");
      return;
    }

    if (isPending) return;
    setIsPending(true);

    try {
      if (amIScreenSharing) {
        await screenShare.disable();
        // Optional: explicit stopPublish if needed, but disable() usually handles it
      } else {
        await screenShare.enable();
      }
    } catch (error) {
      console.error("Screen share error:", error);
      toast.error("Failed to toggle screen share");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className={`size-10 rounded-full border-none transition-all duration-200 ${
        isSharing
          ? "bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30"
          : "bg-zinc-800/80 text-white hover:bg-zinc-700/90"
      } ${!isSupported ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={handleToggleScreenShare}
      disabled={
        isPending ||
        (isSomeoneScreenSharing && !amIScreenSharing) ||
        !isSupported
      }
      aria-label={amIScreenSharing ? "Stop sharing" : "Share screen"}
    >
      <ScreenShareIcon
        className={`size-[1.125rem] ${isSharing ? "fill-current" : ""}`}
      />
    </Button>
  );
};
