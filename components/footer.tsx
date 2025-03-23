import Link from "next/link"
import Image from "next/image"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t py-8 sm:py-12 md:py-16 lg:py-20">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div className="flex flex-col items-start">
            <Image 
              src="/Logo1.png" 
              alt="Logo" 
              width={80} 
              height={80}
              className="w-16 h-16 sm:w-20 sm:h-20" 
            />
            <p className="mt-4 text-sm text-gray-500 max-w-xs">
              Empowering your career with AI-driven insights and personalized recommendations.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Social</h3>
            <ul className="space-y-2">
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
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-500 hover:text-gray-900 inline-block transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 hover:text-gray-900 inline-block transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 hover:text-gray-900 inline-block transition-colors">
                  Support
                </Link>
              </li>
            </ul>
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
        
        <div className="mt-8 sm:mt-12 pt-6 border-t text-center text-sm text-gray-500">
          <p>All rights reserved. © {currentYear} CloudHub</p>
        </div>
      </div>
    </footer>
  )
}