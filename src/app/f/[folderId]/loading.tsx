import { ChevronRight } from "lucide-react";

export default function Loading() {
  // Log to confirm this component is actually being rendered
  console.log("DriveLoading component rendered!");

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-gray-100">
      {/* Add a very visible indicator */}
      <div className="fixed top-0 right-0 left-0 z-50 bg-blue-600 py-2 text-center text-white">
        Loading Drive Contents... (This banner confirms loading.tsx is working)
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="mb-5 flex h-10 items-center justify-between">
          <div className="flex items-center">
            <div className="mr-2 h-4 w-20 animate-pulse rounded bg-gray-700"></div>
            <div className="flex items-center">
              <ChevronRight className="mx-2 text-gray-500" size={16} />
              <div className="h-4 w-24 animate-pulse rounded bg-gray-700"></div>
            </div>
          </div>
          <div className="h-8 w-8 animate-pulse rounded-full bg-gray-700"></div>
        </div>
        <div className="rounded-lg bg-gray-800 shadow-xl">
          <div className="border-b border-gray-700 px-6 py-4">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-400">
              <div className="col-span-6">Name</div>
              <div className="col-span-3">Type</div>
              <div className="col-span-3">Size</div>
            </div>
          </div>
          <ul>
            {/* Loading skeleton rows */}
            {Array.from({ length: 5 }).map((_, index) => (
              <li
                key={index}
                className={`border-b border-gray-700 px-6 py-3 last:border-b-0`}
              >
                <div className="grid grid-cols-12 items-center gap-4">
                  <div className="col-span-6 flex items-center">
                    <div className="mr-3 h-4 w-4 animate-pulse rounded bg-gray-700"></div>
                    <div className="h-4 w-32 animate-pulse rounded bg-gray-700"></div>
                  </div>
                  <div className="col-span-3">
                    <div className="h-4 w-16 animate-pulse rounded bg-gray-700"></div>
                  </div>
                  <div className="col-span-3">
                    <div className="h-4 w-12 animate-pulse rounded bg-gray-700"></div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4 h-10 w-28 animate-pulse rounded bg-gray-700"></div>
      </div>
    </div>
  );
}
