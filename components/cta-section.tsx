import { Button } from "@/components/ui/button"
import Image from "next/image"

export function CtaSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="mb-4">
          <Image src="/logo1.png" alt="Logo" width={80} height={80} />

          </div>
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
            Increase your visibility and alignment
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">Start for free, flexible for all teams.</p>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Button variant="outline" className="rounded-full">
              Request a demo
            </Button>
            <Button className="rounded-full bg-[#ff5631] hover:bg-[#e64a2a]">Start for free</Button>
          </div>
        </div>
      </div>
    </section>
  )
}

