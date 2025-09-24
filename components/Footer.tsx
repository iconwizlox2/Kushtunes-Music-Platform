import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-8 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-slate-500 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2">
          <Logo className="h-5 w-5" />
          <span className="font-semibold text-slate-700 dark:text-slate-200">Kushtunes</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="#" className="hover:underline">Terms</Link>
          <Link href="#" className="hover:underline">Privacy</Link>
          <Link href="#" className="hover:underline">Contact</Link>
        </nav>
      </div>
    </footer>
  );
}
