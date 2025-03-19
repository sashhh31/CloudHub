interface LoadingSkeletonProps {
    className?: string
  }
  
  export function LoadingSkeleton({ className = "h-4 w-full" }: LoadingSkeletonProps) {
    return <div className={`animate-pulse rounded bg-gray-200 ${className}`}></div>
  }
  
  