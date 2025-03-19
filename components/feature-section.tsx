import Image from "next/image"
import { Check, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FeatureSectionProps {
  title: string
  description: string
  imageSrc: string
  imageAlt: string
  isImageRight: boolean
  bgColor?: string
}

export function FeatureSection({ title, description, imageSrc, imageAlt, isImageRight, bgColor }: FeatureSectionProps) {
  return (
    <section className={`w-full py-12 md:py-24 ${bgColor || "bg-white"}`}>
      <div className="container px-4 md:px-6">
        <div className={`grid gap-6 lg:grid-cols-2 lg:gap-12 ${isImageRight ? "" : "lg:grid-flow-dense"}`}>
          <div className="flex flex-col justify-center space-y-4">
            <div className="inline-block w-fit rounded-full bg-[#ff5631] px-3 py-1 text-sm text-white">Share</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{title}</h2>
            <p className="max-w-[600px] text-gray-500 md:text-xl">{description}</p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-[#ff5631]" />
                <span>Coded</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-[#ff5631]" />
                <span>100% Secure</span>
              </div>
            </div>
            <div>
              <Button variant="ghost" className="flex items-center gap-2 text-white hover:text-[#e64a2a]">
                <div className="w-8 h-8 bg-[#ff5631] rounded-full flex items-center justify-center">

                <Play className="h-5 w-5 fill-current" />
                </div>
                <span className="text-black text-bold">See how it works</span>
              </Button>
            </div>
          </div>
         
        </div>
      </div>
    </section>
  )
}

