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
  features?: string[]
}

export function FeatureSection({ 
  title, 
  description, 
  imageSrc, 
  imageAlt, 
  isImageRight, 
  bgColor,
  features = ["Coded", "100% Secure"]
}: FeatureSectionProps) {
  return (
    <section className={`w-full py-8 sm:py-12 md:py-16 lg:py-24 ${bgColor || "bg-white"}`}>
      <div className="container px-4 md:px-6 mx-auto">
        <div className={`grid gap-8 lg:grid-cols-2 lg:gap-12 items-center ${
          isImageRight ? "lg:grid-flow-row" : "lg:grid-flow-dense"
        }`}>
          <div className={`flex flex-col justify-center space-y-4 md:space-y-6 ${
            isImageRight ? "lg:order-first" : "lg:order-last"
          }`}>
            <div className="inline-block w-fit rounded-full bg-[#ff5631] px-3 py-1 text-sm font-medium text-white">
              Share
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl">{title}</h2>
            <p className="max-w-[600px] text-base sm:text-lg text-gray-500 md:text-xl">{description}</p>
            <div className="flex flex-wrap gap-4 mt-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-[#ff5631] flex-shrink-0" />
                  <span className="text-sm sm:text-base">{feature}</span>
                </div>
              ))}
            </div>
            <div className="pt-2">
              <Button 
                variant="ghost" 
                className="flex items-center gap-2 text-[#ff5631] hover:text-[#e64a2a] px-0 hover:bg-transparent"
              >
                <Play className="h-4 w-4 sm:h-5 sm:w-5 fill-current flex-shrink-0" />
                <span className="text-sm sm:text-base">See how it works</span>
              </Button>
            </div>
          </div>
          <div className={`flex items-center justify-center ${
            isImageRight ? "lg:order-last" : "lg:order-first"
          }`}>
            <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-none">
              <Image
                src={imageSrc || "/placeholder.svg"}
                alt={imageAlt}
                width={600}
                height={600}
                className="rounded-lg object-cover w-full h-auto shadow-md"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}