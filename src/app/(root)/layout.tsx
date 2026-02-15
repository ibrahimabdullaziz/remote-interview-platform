import dynamic from "next/dynamic";

const StreamClientProvider = dynamic(
  () => import("@/providers/StreamClientProvider"),
  { ssr: false },
);

function Layout({ children }: { children: React.ReactNode }) {
  return <StreamClientProvider>{children}</StreamClientProvider>;
}
export default Layout;
