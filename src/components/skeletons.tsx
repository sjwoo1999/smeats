import { Card } from "./ui/card";
import { cn } from "@/lib/cn";

/**
 * Skeleton loading components
 * 1.2s pulse animation for loading states
 */

export function SkeletonLine({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse bg-neutral-200 dark:bg-neutral-700 rounded",
        className
      )}
      style={{ animationDuration: "1.2s" }}
    />
  );
}

export function SkeletonCard() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-square w-full">
        <SkeletonLine className="h-full w-full" />
      </div>
      <div className="p-4 space-y-3">
        <SkeletonLine className="h-5 w-3/4" />
        <SkeletonLine className="h-4 w-1/2" />
        <SkeletonLine className="h-6 w-1/3" />
      </div>
    </Card>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonOrderCard() {
  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="flex justify-between">
          <SkeletonLine className="h-5 w-24" />
          <SkeletonLine className="h-5 w-16" />
        </div>
        <SkeletonLine className="h-4 w-32" />
        <SkeletonLine className="h-4 w-full" />
      </div>
    </Card>
  );
}

export function SkeletonRecipeCard() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video w-full">
        <SkeletonLine className="h-full w-full" />
      </div>
      <div className="p-4 space-y-2">
        <SkeletonLine className="h-6 w-3/4" />
        <SkeletonLine className="h-4 w-1/2" />
      </div>
    </Card>
  );
}
