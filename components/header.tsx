"use client";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs"; // Import Clerk's useAuth hook

export function Header() {
  const { isSignedIn } = useAuth(); // Check if the user is signed in

  return (
    <header className="w-full border-b bg-gray-100 px-32">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Logo />
        <div className="flex items-center gap-4">
          {!isSignedIn && (
            <>
              <Link href="/sign-in" className="text-sm font-medium">
                Login
              </Link>
              <Button asChild className="rounded-full bg-[#ff5631] hover:bg-[#e64a2a]">
                <Link href="/sign-up">Start for free</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
