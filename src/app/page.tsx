import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { LogIn, LogOut, User } from "lucide-react";

export default function Home() {
  return (
    <div>
      <SignedOut>
        <SignInButton>
          <Button>Sign In</Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
}
