import Link from "next/link"
import Image from "next/image"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t py-8 sm:py-12 md:py-16 lg:py-20 items-center">
      <div className="container px-4 md:px-6  items-center">
        <div className="grid gap-8 lg:ml-[450px] md:ml-[450px] sm:ml-[450px] sm:grid-cols-2 md:grid-cols-3 justify-center grid-cols-3 lg:grid-cols-6">
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Social</h3>
            <ul className="space-y-10 md:space-y-4">
              <li>
                <Link href="#" className="text-gray-500 hover:text-gray-900 inline-block transition-colors">
                  Dribbble
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 hover:text-gray-900 inline-block transition-colors">
                  Behance
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 hover:text-gray-900 inline-block transition-colors">
                  Discord
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col mr-3">
            <Image 
              src="/Logo1.png" 
              alt="Logo" 
              width={80} 
              height={80}
              className="w-16 h-16 sm:w-20 sm:h-20" 
            />
            <p className="mt-4 text-sm text-gray-500 ">
            AI Career Coach
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-500 hover:text-gray-900 inline-block transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 hover:text-gray-900 inline-block transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 hover:text-gray-900 inline-block transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 md:mt-12 pt-6 border-t md:mr-16 text-center text-sm text-gray-500">
          <p>All rights reserved. © {currentYear} @Urim software solutions</p>
        </div>
      </div>
    </footer>
  )
}