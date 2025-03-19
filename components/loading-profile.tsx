import { LoadingSkeleton } from "@/components/loading-skeleton"

export function LoadingProfile() {
  return (
    <div className="space-y-6 rounded-lg border bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <LoadingSkeleton className="h-16 w-16 rounded-full" />
        <div className="flex-1 space-y-2">
          <LoadingSkeleton className="h-6 w-48" />
          <LoadingSkeleton className="h-4 w-32" />
        </div>
      </div>

      <div className="space-y-2">
        <LoadingSkeleton className="h-4 w-full" />
        <LoadingSkeleton className="h-4 w-full" />
        <LoadingSkeleton className="h-4 w-3/4" />
      </div>

      <div className="space-y-2">
        <LoadingSkeleton className="h-8 w-full rounded-md" />
        <LoadingSkeleton className="h-8 w-full rounded-md" />
      </div>
    </div>
  )
}

