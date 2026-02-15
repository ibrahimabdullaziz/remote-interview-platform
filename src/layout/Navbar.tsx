"use client";

import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import { CodeIcon, MenuIcon } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { DashboardBtn } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useMountTransition } from "@/hooks/useMountTransition";
import { createPortal } from "react-dom";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <a
        href="#main-content"
        className="absolute left-[-9999px] top-4 z-[100] bg-background p-4 text-foreground shadow-lg transition-transform focus:left-4 focus:translate-y-0"
      >
        Skip to main content
      </a>
      <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-2xl mr-6 font-mono hover:opacity-80 transition-opacity"
        >
          <CodeIcon className="size-8 text-emerald-500" />
          <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            V-Sync
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-4 ml-auto">
          <ModeToggle />
          <SignedIn>
            <DashboardBtn />
            <UserButton afterSignOutUrl="/" />
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="outline">Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>

        <div className="flex md:hidden items-center space-x-2 ml-auto">
          <ModeToggle />
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <MobileMenu />
        </div>
      </div>
    </nav>
  );
}

function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const shouldRender = useMountTransition(isOpen, 300);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Open Menu"
        onClick={() => setIsOpen(true)}
      >
        <MenuIcon className="size-6" />
      </Button>

      {shouldRender &&
        createPortal(
          <div className="fixed inset-0 z-[10000] flex justify-end pointer-events-auto">
            <div
              className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
                isOpen ? "opacity-100" : "opacity-0"
              }`}
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            <div
              className={`relative z-50 h-full w-3/4 max-w-sm bg-background border-l shadow-2xl p-6 flex flex-col gap-6 overflow-y-auto ${
                isOpen ? "animate-slide-in-right" : "animate-slide-out-right"
              }`}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Menu</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <CodeIcon className="size-5" />{" "}
                </Button>
              </div>

              <div className="flex flex-col gap-4">
                <SignedIn>
                  <Link
                    href="/schedule"
                    className="text-lg font-medium hover:text-emerald-500 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Schedule Interview
                  </Link>
                  <div onClick={() => setIsOpen(false)}>
                    <DashboardBtn />
                  </div>
                </SignedIn>
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button className="w-full">Sign In</Button>
                  </SignInButton>
                </SignedOut>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

export default Navbar;
