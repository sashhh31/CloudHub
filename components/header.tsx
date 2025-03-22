"use client";
import { Logo } from "@/components/logo";

export function Header() {

  return (
    <header className="w-full border-b-2 border-gray-300 bg-gray-100 px-32">
      <div className="container flex h-16 items-center px-4 md:px-6">
        <Logo />
      </div>
    </header>
  );
}
