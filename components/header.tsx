"use client";
import { Logo } from "@/components/logo";

export function Header() {
  return (
    <header className="w-full border-b-2 border-gray-300 bg-gray-100 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32">
      <div className="container mx-auto flex h-14 sm:h-16 items-center">
        <Logo />
      </div>
    </header>
  );
}