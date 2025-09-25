'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { Logo } from "./Logo";
import { Button } from "./ui/Button";
import { 
  UserIcon, 
  ArrowRightOnRectangleIcon, 
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon
} from "./ui/Icons";

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('kushtunes_token');
    const userData = localStorage.getItem('kushtunes_user');
    
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('kushtunes_token');
    localStorage.removeItem('kushtunes_user');
    setIsLoggedIn(false);
    setUser(null);
    window.location.href = '/';
  };

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
          <Link href="/releases" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
            Releases
          </Link>
        </nav>
        
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/profile" className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Profile" className="h-8 w-8 rounded-full" />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
                      <UserIcon className="h-4 w-4 text-slate-500" />
                    </div>
                  )}
                  <span>{user?.firstName || user?.username || 'Profile'}</span>
                </Link>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <ArrowRightOnRectangleIcon className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          )}
          
          <button
            className="sm:hidden p-2"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? (
              <XMarkIcon className="h-5 w-5" />
            ) : (
              <Bars3Icon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="sm:hidden border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="px-4 py-2 space-y-1">
            <Link 
              href="/upload" 
              className="block px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md"
              onClick={() => setShowMobileMenu(false)}
            >
              Upload Music
            </Link>
            <Link 
              href="/dashboard" 
              className="block px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md"
              onClick={() => setShowMobileMenu(false)}
            >
              Dashboard
            </Link>
            <Link 
              href="/releases" 
              className="block px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md"
              onClick={() => setShowMobileMenu(false)}
            >
              My Releases
            </Link>
            {isLoggedIn ? (
              <>
                <Link 
                  href="/profile" 
                  className="block px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <div className="flex items-center gap-2">
                    <Cog6ToothIcon className="h-4 w-4" />
                    Profile Settings
                  </div>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setShowMobileMenu(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <ArrowRightOnRectangleIcon className="h-4 w-4" />
                    Logout
                  </div>
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="block px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Sign In
                </Link>
                <Link 
                  href="/register" 
                  className="block px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
