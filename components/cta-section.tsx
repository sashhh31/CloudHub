import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Input } from "./ui/input"

export function CtaSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="mb-4">
          <Image src="/Logo1.png" alt="Logo" width={80} height={80} />

          </div>
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
          Sign up for News Letter 
          </h1>
          <div className="flex flex-col gap-2 min-[1000px]:flex-row mt-20">
          <Input
              className="border-2 bg-transparent border-black mt-12 w-[400px]"
              placeholder="Email"
              required
            />
          </div>
        </div>
      </div>
    </section>
  )
}

