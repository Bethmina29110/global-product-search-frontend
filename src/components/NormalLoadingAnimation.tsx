export function NormalLoadingAnimation() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="rounded-2xl border border-border bg-card-gradient/30 p-5 space-y-4 h-[320px] flex flex-col justify-between">
          <div className="space-y-3">
            {/* Image Skeleton */}
            <div className="aspect-[4/3] w-full rounded-xl bg-surface/50" />
            
            {/* Text Skeletons */}
            <div className="h-4 w-3/4 rounded bg-surface/50" />
            <div className="h-3 w-1/2 rounded bg-surface/30" />
          </div>
          
          {/* Button Skeleton */}
          <div className="h-10 w-full rounded-xl bg-surface/50" />
        </div>
      ))}
    </div>
  );
}
