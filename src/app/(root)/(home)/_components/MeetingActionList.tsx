import { ActionCard } from "@/components/home";
import { QUICK_ACTIONS } from "@/constants";
import { useRouter } from "next/navigation";
import { useState } from "react";
import dynamic from "next/dynamic";

const MeetingModal = dynamic(
  () => import("@/components/meetings/MeetingModal"),
  {
    ssr: false,
  },
);

export function MeetingActionList() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"start" | "join">();
  const [clickedAction, setClickedAction] = useState<string | null>(null);

  const handleQuickAction = (title: string) => {
    setClickedAction(title);
    switch (title) {
      case "New Call":
        setModalType("start");
        setShowModal(true);
        setClickedAction(null);
        break;
      case "Join Interview":
        setModalType("join");
        setShowModal(true);
        setClickedAction(null);
        break;
      default:
        router.push(`/${title.toLowerCase()}`);
        // Keep loading state until navigation occurs
    }
  };

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {QUICK_ACTIONS.map((action) => (
          <ActionCard
            key={action.title}
            action={action}
            onClick={() => handleQuickAction(action.title)}
            loading={clickedAction === action.title}
            disabled={clickedAction !== null && clickedAction !== action.title}
          />
        ))}
      </div>

      <MeetingModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalType === "join" ? "Join Meeting" : "Start Meeting"}
        isJoinMeeting={modalType === "join"}
      />
    </>
  );
}
