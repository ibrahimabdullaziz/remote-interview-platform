"use client";

import { useState, useEffect } from "react";
import { X, Copy, Check, User, Shield } from "lucide-react";

const DEMO_EMAIL = "interviewer112233@gmail.com";
const DEMO_PASSWORD = "interviewer@123";
const STORAGE_KEY = "vsync-demo-note-dismissed";

export function DemoNoteModal() {
  const [visible, setVisible] = useState(false);
  const [copiedField, setCopiedField] = useState<"email" | "password" | null>(
    null,
  );

  useEffect(() => {
    const dismissed = sessionStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem(STORAGE_KEY, "true");
  };

  const copyToClipboard = async (text: string, field: "email" | "password") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      /* clipboard may not be available */
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] w-[360px] max-w-[calc(100vw-2.5rem)] animate-in slide-in-from-bottom-4 fade-in duration-500">
      <div className="relative rounded-2xl border border-border/60 bg-background/95 backdrop-blur-xl shadow-2xl shadow-black/10 dark:shadow-black/30 overflow-hidden">
        {/* Gradient accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

        {/* Close button */}
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-5 pt-4 space-y-4">
          {/* Header */}
          <div>
            <h3 className="text-base font-semibold flex items-center gap-2">
              <span className="text-lg">👋</span> Welcome to V-Sync Demo
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              This app has two roles — here&apos;s how to explore each:
            </p>
          </div>

          {/* Roles */}
          <div className="space-y-2.5">
            {/* Candidate role */}
            <div className="flex items-start gap-3 rounded-lg bg-muted/40 p-3">
              <div className="mt-0.5 rounded-full bg-blue-500/10 p-1.5">
                <User className="w-3.5 h-3.5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Candidate</p>
                <p className="text-xs text-muted-foreground">
                  Sign up with your own email to explore the candidate
                  experience.
                </p>
              </div>
            </div>

            {/* Interviewer role */}
            <div className="flex items-start gap-3 rounded-lg bg-emerald-500/5 border border-emerald-500/15 p-3">
              <div className="mt-0.5 rounded-full bg-emerald-500/10 p-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">
                  Interviewer{" "}
                  <span className="text-[10px] font-normal text-emerald-600 dark:text-emerald-400">
                    (all features)
                  </span>
                </p>
                <p className="text-xs text-muted-foreground mb-2">
                  Use the demo account below to see all features:
                </p>

                {/* Credentials */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 rounded-md bg-background px-2.5 py-1.5 text-xs font-mono border">
                    <span className="text-muted-foreground shrink-0">
                      Email:
                    </span>
                    <span className="truncate flex-1">{DEMO_EMAIL}</span>
                    <button
                      onClick={() => copyToClipboard(DEMO_EMAIL, "email")}
                      className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Copy email"
                    >
                      {copiedField === "email" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center gap-2 rounded-md bg-background px-2.5 py-1.5 text-xs font-mono border">
                    <span className="text-muted-foreground shrink-0">
                      Pass:
                    </span>
                    <span className="truncate flex-1">{DEMO_PASSWORD}</span>
                    <button
                      onClick={() => copyToClipboard(DEMO_PASSWORD, "password")}
                      className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Copy password"
                    >
                      {copiedField === "password" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Note about MFA */}
          <p className="text-[11px] text-muted-foreground/70 text-center">
            MFA is disabled — you&apos;ll be signed in instantly.
          </p>

          {/* Dismiss button */}
          <button
            onClick={dismiss}
            className="w-full rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-emerald-700 hover:to-teal-700 transition-all active:scale-[0.98]"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
