"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { errorHandler } from "@/lib/errors";
import toast from "react-hot-toast";

// Configure global error handling ONLY on the client
// This prevents hydration mismatches and server-side errors
if (typeof window !== "undefined") {
  errorHandler.config = {
    logErrors: process.env.NODE_ENV === "development",
    onError: (error) => {
      toast.error(error.userMessage);
    },
  };
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
