"use client";

import Link from "next/link";
import { CloudArrowUpIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

interface FloatingActionButtonProps {
  href: string;
  className?: string;
  children?: React.ReactNode;
}

export function FloatingActionButton({ 
  href, 
  className,
  children 
}: FloatingActionButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-sky-600 text-white shadow-lg transition-all hover:bg-sky-700 hover:scale-105 active:scale-95 sm:hidden",
        className
      )}
    >
      {children || <CloudArrowUpIcon className="h-6 w-6" />}
    </Link>
  );
}

export function PullToRefresh({ onRefresh }: { onRefresh: () => void }) {
  return (
    <div className="flex justify-center py-4 sm:hidden">
      <button
        onClick={onRefresh}
        className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
      >
        Pull to refresh
      </button>
    </div>
  );
}


