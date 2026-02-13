import { Skeleton } from "@/components/ui/skeleton";

export function HomeSkeleton() {
  return (
    <div className="container max-w-7xl mx-auto p-6">
   
      <div className="rounded-lg bg-card p-6 border shadow-sm mb-10">
        <Skeleton className="h-10 w-48 mb-2" />
        <Skeleton className="h-5 w-full max-w-md" />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="group relative bg-card rounded-xl border p-6 flex flex-col justify-between shadow-sm overflow-hidden"
          >
            <div className="mb-4">
              <Skeleton className="h-12 w-12 rounded-lg mb-4" />
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
