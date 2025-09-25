export default function Loading() {
  return (
    <div className="container mx-auto p-8">
      <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left side skeleton */}
        <div>
          <div className="h-8 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-full mb-6"></div>
          <div className="p-6 border rounded-lg bg-gray-200">
            <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          </div>
        </div>
        {/* Right side skeleton */}
        <div>
          <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="aspect-video bg-gray-300 rounded-md"></div>
        </div>
      </div>
    </div>
  );
}
