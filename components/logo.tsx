import Link from "next/link"
import Image from "next/image"

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-1 sm:gap-2">
      <Image 
        src="/Logo.png" 
        alt="Logo" 
        width={30} 
        height={30} 
        className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
      />
      <h1 className="font-bold text-lg sm:text-xl">
        KnowAI
      </h1>
    </Link>
  )
}