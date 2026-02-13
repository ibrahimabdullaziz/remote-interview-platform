import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Header() {
  return (
    <div className="flex items-center mb-8">
      <Link href="/schedule">
        <Button>Schedule New Interview</Button>
      </Link>
    </div>
  );
}
