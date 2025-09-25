"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  MusicalNoteIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
  UserIcon
} from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('kushtunes_token');
    if (token) {
      setIsLoggedIn(true);
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
      } catch (e) {
        // Invalid token
        localStorage.removeItem('kushtunes_token');
        setIsLoggedIn(false);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('kushtunes_token');
    setIsLoggedIn(false);
    setUser(null);
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-gray-900/90 border-b border-gray-700/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:animate-pulse">
              <MusicalNoteIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">Kushtunes</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-300 hover:text-blue-400 font-medium transition-colors">
              Home
            </Link>
            <Link href="/upload" className="text-gray-300 hover:text-blue-400 font-medium transition-colors">
              Upload
            </Link>
            <Link href="/dashboard" className="text-gray-300 hover:text-blue-400 font-medium transition-colors">
              Dashboard
            </Link>
            <Link href="/releases" className="text-gray-300 hover:text-blue-400 font-medium transition-colors">
              Releases
            </Link>
            {isLoggedIn && user?.role === 'ADMIN' && (
              <Link href="/admin" className="text-gray-300 hover:text-blue-400 font-medium transition-colors">
                Admin
              </Link>
            )}
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Link href="/profile" passHref>
                  <Button intent="ghost" size="sm" asChild>
                    <span className="flex items-center text-gray-300 hover:text-blue-400">
                      <UserIcon className="h-4 w-4 mr-1" />
                      {user?.username || user?.email?.split('@')[0]}
                    </span>
                  </Button>
                </Link>
                <Button intent="ghost" size="sm" onClick={handleLogout}>
                  <ArrowRightOnRectangleIcon className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Button intent="ghost" size="sm" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button intent="solid" size="sm" asChild>
                  <Link href="/register">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-blue-400 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800/95 backdrop-blur-md py-4 border-t border-gray-700">
          <nav className="flex flex-col items-center space-y-4">
            <Link href="/" className="text-gray-300 hover:text-blue-400 font-medium transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
              Home
            </Link>
            <Link href="/upload" className="text-gray-300 hover:text-blue-400 font-medium transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
              Upload
            </Link>
            <Link href="/dashboard" className="text-gray-300 hover:text-blue-400 font-medium transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
              Dashboard
            </Link>
            <Link href="/releases" className="text-gray-300 hover:text-blue-400 font-medium transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
              Releases
            </Link>
            {isLoggedIn && user?.role === 'ADMIN' && (
              <Link href="/admin" className="text-gray-300 hover:text-blue-400 font-medium transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                Admin
              </Link>
            )}
            {isLoggedIn ? (
              <>
                <Link href="/profile" passHref>
                  <Button intent="ghost" size="sm" asChild>
                    <span className="flex items-center text-gray-300 hover:text-blue-400">
                      <UserIcon className="h-4 w-4 mr-1" />
                      {user?.username || user?.email?.split('@')[0]}
                    </span>
                  </Button>
                </Link>
                <Button intent="ghost" size="sm" onClick={handleLogout}>
                  <ArrowRightOnRectangleIcon className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button intent="ghost" size="sm" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button intent="solid" size="sm" asChild>
                  <Link href="/register">Sign Up</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}