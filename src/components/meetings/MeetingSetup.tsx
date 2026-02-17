"use client";

import {
  DeviceSettings,
  useCall,
  VideoPreview,
} from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { CameraIcon, MicIcon, SettingsIcon } from "lucide-react";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { LoaderUI } from "@/components/common";

function MeetingSetup({ onSetupComplete }: { onSetupComplete: () => void }) {
  const [isCameraDisabled, setIsCameraDisabled] = useState(true);
  const [isMicDisabled, setIsMicDisabled] = useState(false);
  const [isDeviceReady, setIsDeviceReady] = useState(false);
  const [deviceError, setDeviceError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);

  const call = useCall();

  useEffect(() => {
    if (!call) return;

    const timer = setTimeout(() => {
      setIsDeviceReady(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [call]);

  useEffect(() => {
    if (!call || !isDeviceReady) return;

    const updateDevices = async () => {
      try {
        // Ensure devices are initialized before toggling
        if (isCameraDisabled) await call.camera?.disable();
        else await call.camera?.enable();

        if (isMicDisabled) await call.microphone?.disable();
        else await call.microphone?.enable();

        setDeviceError(null);
      } catch (error) {
        console.error("Device sync failed:", error);
        // Clean error message for user
        const message =
          error instanceof Error ? error.message : "Unknown device error";
        if (message.includes("find")) {
          // Ignore specific Stream SDK race condition error
          return;
        }
        setDeviceError(message);
      }
    };

    updateDevices();
  }, [isCameraDisabled, isMicDisabled, call, isDeviceReady]);

  if (!call) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoaderUI />
      </div>
    );
  }

  const handleJoin = async () => {
    if (isJoining) return;

    setIsJoining(true);
    try {
      if (call.state.callingState !== "joined") {
        await call.join();
      }
      onSetupComplete();
    } catch (error) {
      console.error("Error joining call:", error);
      setDeviceError("Failed to join the meeting. Please try again.");
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background/95">
      <div className="w-full max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* VIDEO PREVIEW */}
          <Card className="md:col-span-1 p-6 flex flex-col">
            <div>
              <h1 className="text-xl font-semibold mb-1">Camera Preview</h1>
              <p className="text-sm text-muted-foreground">
                Make sure you look good!
              </p>
            </div>
            <div className="mt-4 flex-1 min-h-[400px] rounded-xl overflow-hidden bg-muted/50 border relative flex items-center justify-center">
              {deviceError ? (
                <div className="flex flex-col items-center justify-center gap-3 px-6 text-center text-destructive">
                  <div className="size-20 rounded-full bg-destructive/10 flex items-center justify-center border-2 border-dashed border-destructive/30">
                    <SettingsIcon className="size-10" />
                  </div>
                  <div>
                    <p className="font-semibold">Camera Error</p>
                    <p className="text-xs opacity-80 max-w-[200px]">
                      {deviceError}
                    </p>
                  </div>
                </div>
              ) : isCameraDisabled ? (
                <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground animate-in fade-in duration-300">
                  <div className="size-20 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-muted-foreground/30">
                    <CameraIcon className="size-10" />
                  </div>
                  <p className="text-sm font-medium">Camera is off</p>
                </div>
              ) : (
                <div className="absolute inset-0">
                  <VideoPreview className="h-full w-full object-cover" />
                </div>
              )}
            </div>
          </Card>

          <Card className="md:col-span-1 p-6">
            <div className="h-full flex flex-col">
              <div>
                <h2 className="text-xl font-semibold mb-1">Meeting Details</h2>
                <p className="text-sm text-muted-foreground break-all">
                  {call.id}
                </p>
              </div>

              <div className="flex-1 flex flex-col justify-between">
                {deviceError && (
                  <div className="mt-4 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                    {deviceError}
                  </div>
                )}

                <div className="space-y-6 mt-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <CameraIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Camera</p>
                        <p className="text-sm text-muted-foreground">
                          {isCameraDisabled ? "Off" : "On"}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={!isCameraDisabled}
                      onCheckedChange={(checked) =>
                        setIsCameraDisabled(!checked)
                      }
                      disabled={!isDeviceReady || isJoining}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <MicIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Microphone</p>
                        <p className="text-sm text-muted-foreground">
                          {isMicDisabled ? "Off" : "On"}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={!isMicDisabled}
                      onCheckedChange={(checked) => setIsMicDisabled(!checked)}
                      disabled={!isDeviceReady || isJoining}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <SettingsIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Settings</p>
                        <p className="text-sm text-muted-foreground">
                          Configure devices
                        </p>
                      </div>
                    </div>
                    <DeviceSettings />
                  </div>
                </div>

                <div className="space-y-3 mt-8">
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleJoin}
                    disabled={isJoining}
                  >
                    {isJoining ? "Joining..." : "Join Meeting"}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Don&apos;t worry, our team is super friendly!
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
export default MeetingSetup;
