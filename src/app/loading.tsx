"use client";

import { Loader2Icon } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <Loader2Icon className="size-12 animate-spin text-emerald-500" />
    </div>
  );
}
