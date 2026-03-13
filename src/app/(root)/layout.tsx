import dynamic from "next/dynamic";

const StreamClientProvider = dynamic(
  () => import("@/providers/StreamClientProvider"),
  { ssr: false },
);

const DemoNoteModal = dynamic(
  () =>
    import("@/components/common/DemoNoteModal").then(
      (mod) => mod.DemoNoteModal,
    ),
  { ssr: false },
);

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <StreamClientProvider>
      {children}
      <DemoNoteModal />
    </StreamClientProvider>
  );
}
export default Layout;
