import { cn } from "@/lib/utils";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function LoadingSkeleton() {
  return (
    <Card className="relative px-2 h-[700px] w-[600px] max-w-lg mx-auto overflow-hidden bg-linear-to-br from-background via-background/95 to-rose-500/5 backdrop-blur-lg shadow-2xl rounded-3xl border border-rose-500/10">
      {/* Loading Progress Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-background/80 backdrop-blur-xs pt-4 pb-2 border-b border-rose-500/10">
        <div className="px-4 flex gap-1.5">
          {[1, 2, 3].map((_, index) => (
            <div
              key={index}
              className="h-1.5 flex-1 rounded-full bg-rose-500/10 overflow-hidden"
            >
              <div
                className={cn(
                  "h-full bg-linear-to-r from-gray-500 to-rose-600 animate-pulse",
                  index === 0 ? "w-full" : "w-0"
                )}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Loading Content */}

      <div className="h-full overflow-y-auto scrollbar-hide pt-16 pb-24">
        <div className="px-6">
          {/* Loading Title */}

          <div className="flex flex-col gap-2 mb-6 sticky top-0 pt-2 pb-4 bg-background/80 backdrop-blur-xs z-10">
            <Skeleton className="h-12 w-3/4 mx-auto bg-rose-500/10" />
          </div>

          {/* Loading Points */}

          <div className="space-y-4">
            {/* Numbered Point Skeletons */}

            {[1, 2, 3].map((_, index) => (
              <div
                key={`numbered-${index}`}
                className="group relative bg-linear-to-br from-gray-500/[0.08] to-gray-600/[0.03] p-4 rounded-2xl border border-gray-500/10"
              >
                <div className="relative flex gap-4 items-center">
                  <div className="flex items-center">
                    <Skeleton className="h-8 w-8 rounded-full bg-rose-500/10" />
                  </div>

                  <div className="flex-1">
                    <Skeleton className="h-6 w-full bg-rose-500/10" />
                  </div>
                </div>
              </div>
            ))}

            {/* Emoji Point Skeletons */}

            {[1, 2].map((_, index) => (
              <div
                key={`emoji-${index}`}
                className="group relative bg-linear-to-br from-gray-200/[0.08] to-gray-400/[0.03] p-4 rounded-2xl border border-gray-500/10"
              >
                <div className="relative flex items-center gap-3">
                  <Skeleton className="h-6 w-6 rounded-full bg-rose-500/10 shrink-0" />
                  <div className="h-6 w-full bg-rose-500/10"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Loading Navigation */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-xs border-t border-rose-500/10">
        <div className="flex justify-between items-center">
          <Skeleton className="rounded-full w-12 h-12 bg-linear-to-br from-rose-500/50 to-rose-600/50 " />

          <div className="flex gap-2">
            {[1, 2, 3].map((_, index) => (
              <Skeleton
                key={index}
                className="h-2 w-2 rounded-full bg-rose-500/20"
              />
            ))}
          </div>
          <Skeleton className="rounded-full w-12 h-12 bg-linear-to-br from-rose-500/50 to-rose-600/50" />
        </div>
      </div>
    </Card>
  );
}
