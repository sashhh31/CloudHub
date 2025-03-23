import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function FeedbackSection() {
  return (
    <section className="w-full bg-[#ff5631] py-8 sm:py-12 md:py-16 lg:py-24 overflow-hidden">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid gap-8 items-center lg:grid-cols-2 lg:gap-12">
          <div className="flex items-center justify-center order-2 lg:order-1">
            <div className="w-full max-w-sm sm:max-w-md md:max-w-lg">
              <Image 
                src="/feedback.png" 
                alt="Feedback" 
                width={500} 
                height={800}
                className="w-full h-auto object-contain"
                priority 
              />
            </div>
          </div>
          <div className="flex flex-col justify-center space-y-4 md:space-y-6 order-1 lg:order-2">
            <div className="inline-block w-fit rounded-full bg-black px-3 py-1 text-sm font-medium text-white">
              Feedback
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-white">
              Objective scoring to gauge your CV alignment with industry standards.
            </h2>
            <p className="max-w-[600px] text-sm sm:text-base md:text-lg text-white/90">
              Campsite has been instrumental in keeping designers aware of each others' work-in-progress in a way that
              was previously slowing us down. It's also one of the only channels where.
            </p>
            <div className="pt-2">
              <Button 
                variant="ghost" 
                className="flex items-center gap-2 text-white hover:text-white/80 hover:bg-white/10 px-0 sm:px-4"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white flex-shrink-0">
                  <Play className="h-3 w-3 fill-current text-[#ff5631]" />
                </div>
                <span className="text-sm sm:text-base">See how it works</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}