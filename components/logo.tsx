import Link from "next/link"
import { Box } from "lucide-react"
import Image from "next/image"
export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
    <Image src="/Logo.png" alt="Logo" width={30} height={30} />
    <h1 className="font-bold text-xl">
    KnowAI
    </h1>
    </Link>
  )
}

