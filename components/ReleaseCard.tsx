import { MobileOptimizedImage, MobileCard } from "./MobileUI";
import { type Release } from "@/lib/store";

export function ReleaseCard({ release }: { release: Release }) {
  const handleSwipeLeft = () => {
    // In a real app, this could trigger a delete action
    console.log('Swiped left on', release.title);
  };

  const handleSwipeRight = () => {
    // In a real app, this could trigger a favorite action
    console.log('Swiped right on', release.title);
  };

  const handleClick = () => {
    // In a real app, this would navigate to release details
    console.log('Clicked on', release.title);
  };

  return (
    <MobileCard
      onSwipeLeft={handleSwipeLeft}
      onSwipeRight={handleSwipeRight}
      onClick={handleClick}
      className="group overflow-hidden rounded-2xl border border-slate-200/50 bg-white/80 backdrop-blur-sm shadow-soft hover:shadow-hover transition-all duration-500 card-hover dark:border-slate-800/50 dark:bg-slate-900/80"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        {release.cover ? (
          <MobileOptimizedImage
            src={release.cover}
            alt={`${release.title} cover`}
            className="h-full w-full group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-indigo-400 to-purple-500" />
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        
        {/* Status badge */}
        <span className="absolute left-4 top-4 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-slate-900 shadow-soft dark:bg-slate-900/80 dark:text-slate-100">
          {release.status.charAt(0).toUpperCase() + release.status.slice(1)}
        </span>
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1 truncate">{release.title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 truncate">
          {release.artist}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Release date: {release.date}
        </p>
        
        <div className="flex gap-3">
          <button
            className="flex-1 rounded-xl border border-slate-200/50 bg-white/50 backdrop-blur-sm px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-white/80 hover:shadow-soft transition-all duration-300 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800/80 touch-feedback"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Edit clicked');
            }}
          >
            Edit
          </button>
          <button
            className="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-soft hover:shadow-hover hover:scale-105 transition-all duration-300 touch-feedback"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Deliver clicked');
            }}
          >
            Deliver
          </button>
        </div>
      </div>
    </MobileCard>
  );
}
