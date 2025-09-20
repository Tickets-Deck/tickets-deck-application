import { Skeleton } from "@/app/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section Skeleton */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <Skeleton className="h-6 w-24 mx-auto mb-4" />
            <Skeleton className="h-12 w-full max-w-xl mx-auto mb-6" />
            <Skeleton className="h-6 w-full max-w-lg mx-auto mb-8" />
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Skeleton className="h-12 w-40 rounded-md" />
              <Skeleton className="h-12 w-40 rounded-md" />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Overview Skeleton */}
      <section className="py-12 bg-muted/30">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        </div>
      </section>

      {/* Features Grid Skeleton */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-96 mx-auto mb-4" />
            <Skeleton className="h-6 w-full max-w-lg mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
