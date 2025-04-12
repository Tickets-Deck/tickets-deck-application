import type React from "react"

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`animate-pulse rounded-md bg-primary-color/10" ${className}`} {...props} />
}

export { Skeleton }
