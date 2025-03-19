import Image from "next/image"
import { Button } from "@/components/ui/button"

export function ProjectSection() {
  return (
    <section className="w-full h-screen bg-[#ff5631] py-12 md:py-24 overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl lg:text-6xl">
            Keep every one in the loop
          </h2>
          <p className="mx-auto max-w-[700px] text-white md:text-xl">
            All good things starts with a homepage. Get inspired without breaking your wallet.
          </p>
          <Button className="rounded-full bg-white text-[#ff5631] hover:bg-gray-100">Start for free</Button>
          <div className="mt-8 w-full max-w-4xl justify-end">
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-[#1e1e1e] shadow-lg">
              <div className="flex h-8 items-center gap-2 border-b border-gray-700 bg-[#1e1e1e] px-4">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
              </div>
              <div className="items-end rounded-full border-none">
                <img
                  src="/group.png"
                  alt="Project dashboard"
                  width={800}
                  height={600}
                  className="border-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

