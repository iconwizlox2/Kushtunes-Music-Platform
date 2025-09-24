import Link from "next/link";
import { Logo } from "./Logo";
import { Button } from "./ui/Button";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-slate-800 dark:bg-slate-950/70">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-6 w-6" />
          <span className="font-semibold tracking-tight">Kushtunes</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm sm:flex">
          <Link href="/upload" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
            Upload
          </Link>
          <Link href="/dashboard" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
            Dashboard
          </Link>
          <a
            href="#"
            className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            aria-disabled
          >
            Docs
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild className="h-9 px-4 hidden sm:inline-flex">
            <Link href="/upload">Get started</Link>
          </Button>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

function MobileMenu() {
  return (
    <details className="relative sm:hidden">
      <summary className="cursor-pointer rounded-md border border-slate-200 px-3 py-1.5 text-sm dark:border-slate-800">
        Menu
      </summary>
      <div className="absolute right-0 mt-2 w-44 rounded-lg border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-800 dark:bg-slate-900">
        <a href="/upload" className="block rounded-md px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800">Upload</a>
        <a href="/dashboard" className="mt-1 block rounded-md px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800">Dashboard</a>
        <a className="mt-1 block rounded-md px-3 py-2 text-sm text-slate-400">Docs (soon)</a>
      </div>
    </details>
  );
}
