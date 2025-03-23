import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Input } from "./ui/input"

export function CtaSection() {
  return (
    <section className="w-full py-8 sm:py-12 md:py-16 lg:py-24">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6 text-center max-w-3xl mx-auto">
          <div className="mb-2 sm:mb-4">
            <Image 
              src="/Logo1.png" 
              alt="Logo" 
              width={80} 
              height={80}
              className="w-16 h-16 sm:w-20 sm:h-20" 
            />
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tighter">
            Sign up for Newsletter
          </h1>
          
          <div className="w-full mt-6 sm:mt-8 md:mt-10 lg:mt-12">
            <form className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md mx-auto">
              <Input
                className="w-full border-2 bg-transparent border-black p-2"
                placeholder="Email"
                type="email"
                required
              />
              <Button 
                type="submit" 
                className="w-full sm:w-auto bg-black text-white hover:bg-gray-800"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}