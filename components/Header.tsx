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
  XMarkIcon,
  MusicalNoteIcon
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
    <header className="nav-premium fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="relative">
              <MusicalNoteIcon className="h-8 w-8 text-premium-green group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 bg-premium-green/20 rounded-full blur-md group-hover:bg-premium-green/30 transition-colors"></div>
            </div>
            <span className="ml-3 text-xl font-bold text-white group-hover:text-premium-green transition-colors">
              KUSHTUNES
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/upload" className="text-gray-300 hover:text-premium-green transition-colors font-medium">
              Upload
            </Link>
            <Link href="/dashboard" className="text-gray-300 hover:text-premium-green transition-colors font-medium">
              Dashboard
            </Link>
            <Link href="/releases" className="text-gray-300 hover:text-premium-green transition-colors font-medium">
              Releases
            </Link>
            <Link href="/profile" className="text-gray-300 hover:text-premium-green transition-colors font-medium">
              Profile
            </Link>
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Link href="/profile" className="flex items-center space-x-2 text-gray-300 hover:text-premium-green transition-colors">
                  <div className="w-8 h-8 bg-premium-green/20 rounded-full flex items-center justify-center">
                    <UserIcon className="h-4 w-4 text-premium-green" />
                  </div>
                  <span className="font-medium">{user?.firstName || user?.username || 'Profile'}</span>
                </Link>
                <Button intent="ghost" size="sm" onClick={handleLogout} className="text-gray-300 hover:text-red-400">
                  <ArrowRightOnRectangleIcon className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button intent="ghost" size="sm" asChild className="text-gray-300 hover:text-premium-green">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button size="sm" asChild className="bg-premium-green hover:bg-accent-green text-black font-semibold">
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              intent="ghost"
              size="sm"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-gray-300"
            >
              {showMobileMenu ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-card-bg/95 backdrop-blur-lg border-t border-premium-green/20">
              <Link
                href="/upload"
                className="block px-3 py-2 text-gray-300 hover:text-premium-green transition-colors font-medium"
                onClick={() => setShowMobileMenu(false)}
              >
                Upload Music
              </Link>
              <Link
                href="/dashboard"
                className="block px-3 py-2 text-gray-300 hover:text-premium-green transition-colors font-medium"
                onClick={() => setShowMobileMenu(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/releases"
                className="block px-3 py-2 text-gray-300 hover:text-premium-green transition-colors font-medium"
                onClick={() => setShowMobileMenu(false)}
              >
                Releases
              </Link>
              <Link
                href="/profile"
                className="block px-3 py-2 text-gray-300 hover:text-premium-green transition-colors font-medium"
                onClick={() => setShowMobileMenu(false)}
              >
                Profile
              </Link>
              
              {isLoggedIn ? (
                <div className="pt-4 border-t border-gray-700">
                  <div className="px-3 py-2 text-gray-300 font-medium">
                    {user?.firstName || user?.username || 'Profile'}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-red-400 hover:text-red-300 transition-colors font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-700 space-y-2">
                  <Link
                    href="/login"
                    className="block px-3 py-2 text-gray-300 hover:text-premium-green transition-colors font-medium"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="block px-3 py-2 bg-premium-green text-black font-semibold rounded-lg mx-3 text-center"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}