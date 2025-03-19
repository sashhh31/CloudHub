import { Box } from "lucide-react"

interface LoadingScreenProps {
  message?: string
}

export function LoadingScreen({ message = "Loading..." }: LoadingScreenProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center space-y-6">
        {/* Logo animation */}
        <div className="relative">
          <div className="flex h-16 w-16 items-center justify-center rounded-md bg-[#ff5631]">
            <Box className="h-10 w-10 text-white" />
          </div>
          <div className="absolute inset-0 animate-ping rounded-md bg-[#ff5631] opacity-75"></div>
        </div>

        {/* Loading text */}
        <h2 className="text-xl font-medium text-gray-800">{message}</h2>

        {/* Loading bar */}
        <div className="h-1.5 w-48 overflow-hidden rounded-full bg-gray-200">
          <div className="h-full animate-[loading_1.5s_ease-in-out_infinite] rounded-full bg-[#ff5631]"></div>
        </div>
      </div>
    </div>
  )
}

