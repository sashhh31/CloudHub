interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg"
    color?: string
  }
  
  export function LoadingSpinner({ size = "md", color = "#ff5631" }: LoadingSpinnerProps) {
    const sizeMap = {
      sm: "h-4 w-4",
      md: "h-8 w-8",
      lg: "h-12 w-12",
    }
  
    return (
      <div className="flex items-center justify-center">
        <div
          className={`animate-spin rounded-full border-t-2 border-b-2 border-transparent ${sizeMap[size]}`}
          style={{ borderTopColor: color, borderBottomColor: color }}
        ></div>
      </div>
    )
  }
  
  