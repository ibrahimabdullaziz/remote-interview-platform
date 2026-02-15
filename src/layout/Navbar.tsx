import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import { CodeIcon, MenuIcon } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { DashboardBtn } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

        {/* Desktop Navigation */}
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

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center space-x-2 ml-auto">
          <ModeToggle />
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open Menu">
                <MenuIcon className="size-6" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[300px] h-full rounded-none right-0 left-auto translate-x-0 p-6 flex flex-col">
              <DialogHeader className="text-left border-b pb-4 mb-4">
                <DialogTitle>Menu</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <SignedIn>
                  <Link
                    href="/schedule"
                    className="text-lg font-medium hover:text-emerald-500 transition-colors"
                  >
                    Schedule Interview
                  </Link>
                  <DashboardBtn />
                </SignedIn>
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button className="w-full">Sign In</Button>
                  </SignInButton>
                </SignedOut>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
