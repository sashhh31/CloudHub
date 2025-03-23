import { Box } from "lucide-react"

interface LoadingScreenProps {
  message?: string
}

export function LoadingScreen({ message = "Loading..." }: LoadingScreenProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      <div className="flex flex-col items-center space-y-6">
        {/* Logo animation - responsive sizing */}
        <div className="relative">
          <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-md bg-[#ff5631]">
            <Box className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
          </div>
          <div className="absolute inset-0 animate-ping rounded-md bg-[#ff5631] opacity-75"></div>
        </div>

        {/* Loading text - responsive font size */}
        <h2 className="text-lg sm:text-xl font-medium text-gray-800 text-center">{message}</h2>

        {/* Loading bar - responsive width */}
        <div className="h-1.5 w-full max-w-xs sm:max-w-sm md:max-w-md overflow-hidden rounded-full bg-gray-200">
          <div className="h-full animate-[loading_1.5s_ease-in-out_infinite] rounded-full bg-[#ff5631]"></div>
        </div>
      </div>
    </div>
  )
}