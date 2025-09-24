export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="kt" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <path fill="url(#kt)" d="M8 19c4-8 12-8 16 0 1 2-1 4-3 3-3-2-7-2-10 0-2 1-4-1-3-3Z" />
      <path fill="url(#kt)" d="M20 7v10a3 3 0 1 1-2-2V7h2Z" />
    </svg>
  );
}
