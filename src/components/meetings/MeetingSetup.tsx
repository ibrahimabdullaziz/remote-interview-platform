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

  const call = useCall();

  // Wait for call to be ready before allowing device operations
  useEffect(() => {
    if (!call) return;

    // Add a small delay to ensure SDK's device manager is initialized
    const timer = setTimeout(() => {
      setIsDeviceReady(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [call]);

  useEffect(() => {
    if (!call || !isDeviceReady) return;

    const updateCamera = async () => {
      try {
        if (isCameraDisabled) {
          await call.camera.disable();
        } else {
          await call.camera.enable();
        }
        setDeviceError(null);
      } catch (error) {
        console.error("Camera operation failed:", error);
        setDeviceError(
          "We couldn't access your camera. Check your browser permissions and device settings.",
        );
      }
    };

    updateCamera();
  }, [isCameraDisabled, call, isDeviceReady]);

  useEffect(() => {
    if (!call || !isDeviceReady) return;

    const updateMicrophone = async () => {
      try {
        if (isMicDisabled) {
          await call.microphone.disable();
        } else {
          await call.microphone.enable();
        }
        setDeviceError(null);
      } catch (error) {
        console.error("Microphone operation failed:", error);
        setDeviceError(
          "We couldn't access your microphone. Check your browser permissions and device settings.",
        );
      }
    };

    updateMicrophone();
  }, [isMicDisabled, call, isDeviceReady]);

  if (!call) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoaderUI />
      </div>
    );
  }

  const handleJoin = async () => {
    await call.join();
    onSetupComplete();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background/95">
      <div className="w-full max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* VIDEO PREVIEW CONTAINER */}
          <Card className="md:col-span-1 p-6 flex flex-col">
            <div>
              <h1 className="text-xl font-semibold mb-1">Camera Preview</h1>
              <p className="text-sm text-muted-foreground">
                Make sure you look good!
              </p>
            </div>

            {/* VIDEO PREVIEW */}
            <div className="mt-4 flex-1 min-h-[400px] rounded-xl overflow-hidden bg-muted/50 border relative">
              <div className="absolute inset-0">
                <VideoPreview className="h-full w-full" />
              </div>
            </div>
          </Card>

          {/* CARD CONTROLS */}

          <Card className="md:col-span-1 p-6">
            <div className="h-full flex flex-col">
              {/* MEETING DETAILS  */}
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

                <div className="spacey-6 mt-8">
                  {/* CAM CONTROL */}
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
                      disabled={!isDeviceReady}
                    />
                  </div>

                  {/* MIC CONTROL */}
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
                      disabled={!isDeviceReady}
                    />
                  </div>

                  {/* DEVICE SETTINGS */}
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

                {/* JOIN BTN */}
                <div className="space-y-3 mt-8">
                  <Button className="w-full" size="lg" onClick={handleJoin}>
                    Join Meeting
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Do not worry, our team is super friendly! We want you to
                    succeed.
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
