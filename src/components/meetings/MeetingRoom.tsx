import {
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
  ToggleAudioPublishingButton,
  ToggleVideoPublishingButton,
  ScreenShareButton,
  CancelCallButton,
} from "@stream-io/video-react-sdk";
import { LayoutListIcon, LoaderIcon, UsersIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { EndCallButton } from "@/components/meetings";

const CodeEditor = dynamic(() => import("@/components/CodeEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center">
      <LoaderIcon className="size-6 animate-spin text-muted-foreground" />
    </div>
  ),
});

const CallParticipantsList = dynamic(
  () =>
    import("@stream-io/video-react-sdk").then(
      (mod) => mod.CallParticipantsList,
    ),
  { ssr: false },
);

function MeetingRoom() {
  const [layout, setLayout] = useState<"grid" | "speaker">("speaker");
  const [showParticipants, setShowParticipants] = useState(false);
  const { useCallCallingState } = useCallStateHooks();

  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) {
    return (
      <div className="h-96 flex items-center justify-center">
        <LoaderIcon className="size-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem-1px)]">
      <ResizablePanelGroup direction="horizontal" className="hidden md:flex">
        <ResizablePanel
          defaultSize={35}
          minSize={25}
          maxSize={100}
          className="relative"
        >
          <VideoSection
            layout={layout}
            setLayout={setLayout}
            showParticipants={showParticipants}
            setShowParticipants={setShowParticipants}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={65} minSize={25}>
          <CodeEditor />
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* MOBILE VIEW */}
      <ResizablePanelGroup direction="vertical" className="flex md:hidden">
        <ResizablePanel defaultSize={40} minSize={30} className="relative">
          <VideoSection
            layout={layout}
            setLayout={setLayout}
            showParticipants={showParticipants}
            setShowParticipants={setShowParticipants}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={60} minSize={30}>
          <CodeEditor />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

function VideoSection({
  layout,
  setLayout,
  showParticipants,
  setShowParticipants,
}: {
  layout: "grid" | "speaker";
  setLayout: (l: "grid" | "speaker") => void;
  showParticipants: boolean;
  setShowParticipants: (s: boolean) => void;
}) {
  const router = useRouter();
  return (
    <>
      {/* VIDEO LAYOUT */}
      <div className="absolute inset-0 pointer-events-none">
        {layout === "grid" ? <PaginatedGridLayout /> : <SpeakerLayout />}

        {/* PARTICIPANTS LIST OVERLAY */}
        {showParticipants && (
          <div className="absolute right-0 top-0 h-full w-[300px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pointer-events-auto z-50">
            <CallParticipantsList onClose={() => setShowParticipants(false)} />
          </div>
        )}
      </div>

      {/* VIDEO CONTROLS */}
      <div className="absolute bottom-4 inset-x-0 p-4 pointer-events-none flex flex-col md:flex-row gap-4 justify-center items-center">
        <div className="flex flex-col md:flex-row gap-3 pointer-events-auto">
          {/* PRIMARY CONTROLS (Vertical sidebar on mobile, Horizontal on desktop) */}
          <div className="flex flex-col md:flex-row gap-3 bg-background/90 backdrop-blur-lg p-2 rounded-2xl border border-white/10 shadow-xl md:static fixed left-4 bottom-24 z-40">
            <ToggleAudioPublishingButton />
            <ToggleVideoPublishingButton />
            <ScreenShareButton />
            <CancelCallButton onLeave={() => router.push("/")} />
          </div>

          {/* SECONDARY CONTROLS (Horizontal pill) */}
          <div className="flex flex-row gap-3 bg-background/90 backdrop-blur-lg p-2 rounded-full border border-white/10 shadow-xl md:static fixed bottom-4 left-1/2 -translate-x-1/2 md:translate-x-0 z-40">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-10 rounded-full bg-transparent border-none hover:bg-white/10"
                  aria-label="Change Layout"
                >
                  <LayoutListIcon className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setLayout("grid")}>
                  Grid View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLayout("speaker")}>
                  Speaker View
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              size="icon"
              className="size-10 rounded-full bg-transparent border-none hover:bg-white/10"
              onClick={() => setShowParticipants(!showParticipants)}
              aria-label="Toggle Participants"
            >
              <UsersIcon className="size-4" />
            </Button>

            <EndCallButton />
          </div>
        </div>
      </div>
    </>
  );
}
export default MeetingRoom;
