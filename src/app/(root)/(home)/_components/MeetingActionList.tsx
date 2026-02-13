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

  const handleQuickAction = (title: string) => {
    switch (title) {
      case "New Call":
        setModalType("start");
        setShowModal(true);
        break;
      case "Join Interview":
        setModalType("join");
        setShowModal(true);
        break;
      default:
        router.push(`/${title.toLowerCase()}`);
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
