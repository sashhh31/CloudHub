import Image from "next/image"
import { Button } from "@/components/ui/button"

export function ProjectSection() {
  return (
    <section className="w-full min-h-screen bg-[#ff5631] py-8 sm:py-12 md:py-16 lg:py-24 overflow-hidden flex items-center">
      <div className="container px-4 sm:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6 md:space-y-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tighter text-white">
            Keep every one in the loop
          </h2>
          <p className="mx-auto max-w-[700px] text-sm sm:text-base md:text-lg lg:text-xl text-white/90">
            All good things starts with a homepage. Get inspired without breaking your wallet.
          </p>
          <Button className="rounded-full bg-white text-[#ff5631] hover:bg-gray-100 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-2.5">
            Start for free
          </Button>
          
          <div className="mt-4 sm:mt-6 md:mt-8 lg:mt-12 w-full max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl mx-auto">
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-[#1e1e1e] shadow-lg">
              <div className="flex h-6 sm:h-8 items-center gap-2 border-b border-gray-700 bg-[#1e1e1e] px-3 sm:px-4">
                <div className="flex gap-1 sm:gap-1.5">
                  <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-red-500"></div>
                  <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-green-500"></div>
                </div>
              </div>
              <div className="relative w-full">
                <Image
                  src="/Group.png"
                  alt="Project dashboard"
                  width={800}
                  height={600}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}