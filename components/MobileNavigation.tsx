"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  HomeIcon, 
  CloudArrowUpIcon, 
  ChartBarIcon,
  MusicalNoteIcon 
} from "@/components/ui/Icons";

const navigation = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Upload", href: "/upload", icon: CloudArrowUpIcon },
  { name: "Dashboard", href: "/dashboard", icon: ChartBarIcon },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-slate-200 dark:bg-slate-950/95 dark:border-slate-800 sm:hidden">
      <div className="flex h-16 items-center justify-around">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors",
                isActive
                  ? "text-sky-600 dark:text-sky-400"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function MobileHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-slate-800 dark:bg-slate-950/70 sm:hidden">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <MusicalNoteIcon className="h-6 w-6 text-sky-600" />
          <span className="font-semibold tracking-tight text-slate-900 dark:text-slate-100">Kushtunes</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-md border border-slate-200 px-3 py-1.5 text-sm dark:border-slate-800">
            Menu
          </button>
        </div>
      </div>
    </header>
  );
}


