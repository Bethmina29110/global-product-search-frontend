export function NormalLoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-5 text-muted-foreground animate-in fade-in duration-500">
      <div className="relative flex items-center justify-center h-14 w-14">
        <div className="absolute inset-0 rounded-full border-4 border-surface-elevated"></div>
        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
      <p className="text-sm font-medium animate-pulse tracking-wide">Searching repository...</p>
    </div>
  );
}
