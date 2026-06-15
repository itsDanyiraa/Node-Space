export function EmptyState() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
      <div className="flex flex-col items-center gap-4 text-muted-foreground opacity-50 animate-pulse duration-2000">
        <div className="w-16 h-16 rounded-full border-2 border-dashed border-current flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-current/20" />
        </div>
        <p className="text-lg font-medium tracking-wide text-center px-6">
          Hold anywhere to create a node (or double-click on desktop)
        </p>
      </div>
    </div>
  );
}
