import { Skeleton } from "@/components/ui/skeleton";

export function ConferenceSkeleton() {
  return (
    <div className="h-[calc(100vh-4rem-1px)] w-full flex overflow-hidden">
      <div className="flex-1 relative bg-muted/20 p-4 flex flex-col items-center justify-center space-y-4">
        <Skeleton className="size-64 rounded-full" />
        <div className="w-full max-w-md space-y-2">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 p-3 rounded-full border bg-card shadow-lg">
          <Skeleton className="size-10 rounded-full" />
          <Skeleton className="size-10 rounded-full" />
          <Skeleton className="size-10 rounded-full" />
          <div className="w-px h-6 bg-border mx-2" />
          <Skeleton className="size-10 rounded-full" />
          <Skeleton className="size-10 rounded-full" />
          <Skeleton className="w-24 h-10 rounded-lg" />
        </div>
      </div>

      <div className="w-[65%] border-l bg-card flex flex-col p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <Skeleton className="flex-1 w-full rounded-xl" />
      </div>
    </div>
  );
}
