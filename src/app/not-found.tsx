"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CodeIcon } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="bg-emerald-500/10 p-6 rounded-2xl mb-6">
        <CodeIcon className="size-16 text-emerald-500" />
      </div>
      <h1 className="text-4xl font-bold mb-2">404 - Page Not Found</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        Oops! It looks like the page you're looking for doesn't exist or has
        been moved.
      </p>
      <Link href="/">
        <Button size="lg" className="rounded-full px-8">
          Back to Home
        </Button>
      </Link>
    </div>
  );
}
