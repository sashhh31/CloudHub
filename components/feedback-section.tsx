import { Play, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import Image from "next/image"

export function FeedbackSection() {
  return (
    <section className="w-full bg-[#ff5631] py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="flex items-center justify-center">
           <Image src="/feedback.png" alt="Feedback" width={500} height={800} />

          </div>
          <div className="flex flex-col justify-center space-y-4">
            <div className="inline-block w-fit rounded-full bg-black px-3 py-1 text-sm text-white">Feedback</div>
            <h2 className="text-3xl  tracking-tighter text-white sm:text-4xl md:text-5xl">
              Objective scoring to gauge your CV alignment with industry standards.
            </h2>
            <p className="max-w-[600px] text-white md:text-base">
              Campsite has been instrumental in keeping designers aware of each others' work-in-progress in a way that
              was previously slowing us down. It's also one of the only channels where.
            </p>
            <div >
              <Button variant="ghost" className="flex items-center gap-2 text-white hover:text-gray-200 ">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
                  <Play className="h-3 w-3 fill-current text-[#ff5631]" />
                </div>
                <span>See how it works</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

