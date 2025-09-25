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

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('kushtunes_token');
    if (token) {
      setIsLoggedIn(true);
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
      } catch (e) {
        localStorage.removeItem('kushtunes_token');
        setIsLoggedIn(false);
      }
    }

    // Handle scroll effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('kushtunes_token');
    setIsLoggedIn(false);
    setUser(null);
    window.location.href = '/';
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                <MusicalNoteIcon className="h-7 w-7 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                Kushtunes
              </span>
              <span className="text-xs font-medium text-gray-500 -mt-1">Music Distribution</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link href="/" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 rounded-xl hover:bg-blue-50 relative group">
              <span className="relative z-10">Home</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link href="/upload" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 rounded-xl hover:bg-blue-50 relative group">
              <span className="relative z-10">Upload</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link href="/analytics" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 rounded-xl hover:bg-blue-50 relative group">
              <span className="relative z-10">Analytics</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link href="/dashboard" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 rounded-xl hover:bg-blue-50 relative group">
              <span className="relative z-10">Dashboard</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link href="/releases" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 rounded-xl hover:bg-blue-50 relative group">
              <span className="relative z-10">Releases</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link href="/earnings" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 rounded-xl hover:bg-blue-50 relative group">
              <span className="relative z-10">Earnings</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link href="/marketing" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 rounded-xl hover:bg-blue-50 relative group">
              <span className="relative z-10">Marketing</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link href="/community" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 rounded-xl hover:bg-blue-50 relative group">
              <span className="relative z-10">Community</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            {isLoggedIn && user?.role === 'ADMIN' && (
              <Link href="/admin" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 rounded-xl hover:bg-blue-50 relative group">
                <span className="relative z-10">Admin</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            )}
          </nav>

          {/* User Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <Link href="/profile" className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 rounded-xl hover:bg-blue-50 group">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <UserIcon className="h-4 w-4 text-white" />
                  </div>
                  <span className="relative z-10">{user?.username || user?.email?.split('@')[0]}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-red-600 font-semibold transition-all duration-300 rounded-xl hover:bg-red-50 group"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login" className="px-6 py-2 text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 rounded-xl hover:bg-blue-50">
                  Sign In
                </Link>
                <Link href="/register" className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white hover:scale-105 transition-all duration-300 shadow-lg"
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
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200/50 shadow-xl">
          <div className="container mx-auto px-6 py-6">
            <nav className="flex flex-col space-y-2">
              <Link 
                href="/" 
                className="px-4 py-3 text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 rounded-xl hover:bg-blue-50 flex items-center space-x-3"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <MusicalNoteIcon className="h-4 w-4 text-white" />
                </div>
                <span>Home</span>
              </Link>
              <Link 
                href="/upload" 
                className="px-4 py-3 text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 rounded-xl hover:bg-blue-50 flex items-center space-x-3"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <MusicalNoteIcon className="h-4 w-4 text-white" />
                </div>
                <span>Upload</span>
              </Link>
              <Link 
                href="/analytics" 
                className="px-4 py-3 text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 rounded-xl hover:bg-blue-50 flex items-center space-x-3"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <MusicalNoteIcon className="h-4 w-4 text-white" />
                </div>
                <span>Analytics</span>
              </Link>
              <Link 
                href="/dashboard" 
                className="px-4 py-3 text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 rounded-xl hover:bg-blue-50 flex items-center space-x-3"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <MusicalNoteIcon className="h-4 w-4 text-white" />
                </div>
                <span>Dashboard</span>
              </Link>
              <Link 
                href="/releases" 
                className="px-4 py-3 text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 rounded-xl hover:bg-blue-50 flex items-center space-x-3"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <MusicalNoteIcon className="h-4 w-4 text-white" />
                </div>
                <span>Releases</span>
              </Link>
              <Link 
                href="/earnings" 
                className="px-4 py-3 text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 rounded-xl hover:bg-blue-50 flex items-center space-x-3"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <MusicalNoteIcon className="h-4 w-4 text-white" />
                </div>
                <span>Earnings</span>
              </Link>
              <Link 
                href="/marketing" 
                className="px-4 py-3 text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 rounded-xl hover:bg-blue-50 flex items-center space-x-3"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <MusicalNoteIcon className="h-4 w-4 text-white" />
                </div>
                <span>Marketing</span>
              </Link>
              <Link 
                href="/community" 
                className="px-4 py-3 text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 rounded-xl hover:bg-blue-50 flex items-center space-x-3"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <MusicalNoteIcon className="h-4 w-4 text-white" />
                </div>
                <span>Community</span>
              </Link>
              {isLoggedIn && user?.role === 'ADMIN' && (
                <Link 
                  href="/admin" 
                  className="px-4 py-3 text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 rounded-xl hover:bg-blue-50 flex items-center space-x-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-700 rounded-lg flex items-center justify-center">
                    <Cog6ToothIcon className="h-4 w-4 text-white" />
                  </div>
                  <span>Admin</span>
                </Link>
              )}
              
              {/* Mobile User Actions */}
              <div className="pt-4 border-t border-gray-200 mt-4">
                {isLoggedIn ? (
                  <div className="space-y-2">
                    <Link 
                      href="/profile" 
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 rounded-xl hover:bg-blue-50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <UserIcon className="h-4 w-4 text-white" />
                      </div>
                      <span>{user?.username || user?.email?.split('@')[0]}</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-red-600 font-semibold transition-all duration-300 rounded-xl hover:bg-red-50 w-full"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link 
                      href="/login" 
                      className="block px-4 py-3 text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 rounded-xl hover:bg-blue-50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link 
                      href="/register" 
                      className="block px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}