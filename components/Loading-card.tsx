import { LoadingSpinner } from "@/components/loading-spinner"

interface LoadingCardProps {
  title?: string
  description?: string
}

export function LoadingCard({
  title = "Loading data",
  description = "Please wait while we fetch your information...",
}: LoadingCardProps) {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="flex flex-col items-center space-y-4 text-center">
        <LoadingSpinner size="lg" />
        <div className="space-y-2">
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  )
}

