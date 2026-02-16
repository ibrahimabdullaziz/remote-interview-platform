import {
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
  ToggleAudioPublishingButton,
  ToggleVideoPublishingButton,
  CancelCallButton,
} from "@stream-io/video-react-sdk";
import { LayoutListIcon, LoaderIcon, UsersIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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
import {
  EndCallButton,
  RecordButton,
  CustomScreenShareButton,
  CustomParticipantList,
} from "@/components/meetings";

const CodeEditor = dynamic(() => import("@/components/CodeEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center">
      <LoaderIcon className="size-6 animate-spin text-muted-foreground" />
    </div>
  ),
});

function MeetingRoom() {
  const [layout, setLayout] = useState<"grid" | "speaker">("speaker");
  const [showParticipants, setShowParticipants] = useState(false);
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  const [direction, setDirection] = useState<"horizontal" | "vertical">(
    "horizontal",
  );

  useEffect(() => {
    const handleResize = () => {
      setDirection(window.innerWidth < 768 ? "vertical" : "horizontal");
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (callingState !== CallingState.JOINED) {
    return (
      <div className="h-96 flex items-center justify-center">
        <LoaderIcon className="size-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem-1px)]">
      <ResizablePanelGroup direction={direction} className="h-full">
        <ResizablePanel
          defaultSize={direction === "horizontal" ? 35 : 40}
          minSize={direction === "horizontal" ? 25 : 30}
          maxSize={direction === "horizontal" ? 100 : 80}
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

        <ResizablePanel
          defaultSize={direction === "horizontal" ? 65 : 60}
          minSize={25}
        >
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
    <div className="relative h-full w-full overflow-hidden bg-background">
      <div className="absolute inset-0">
        {layout === "grid" ? <PaginatedGridLayout /> : <SpeakerLayout />}
      </div>

      {showParticipants && (
        <div className="absolute right-0 top-0 h-full z-50 animate-in slide-in-from-right duration-300 pointer-events-auto">
          <CustomParticipantList onClose={() => setShowParticipants(false)} />
        </div>
      )}

      <div className="absolute bottom-6 inset-x-0 z-40 flex justify-center items-center px-4 pointer-events-none">
        <div className="flex flex-wrap items-center justify-center gap-3 p-3 bg-background/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl pointer-events-auto max-w-full">
          <div className="flex items-center gap-2 pr-4 border-r border-white/10">
            <ToggleAudioPublishingButton />
            <ToggleVideoPublishingButton />
            <CustomScreenShareButton />
            <RecordButton />
            <CancelCallButton onLeave={() => router.push("/")} />
          </div>

          <div className="flex items-center gap-2 pl-2">
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
              <DropdownMenuContent align="end">
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
    </div>
  );
}
export default MeetingRoom;
