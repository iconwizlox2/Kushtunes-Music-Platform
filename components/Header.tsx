"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon, MusicalNoteIcon, UserIcon, ArrowRightOnRectangleIcon, Cog6ToothIcon } from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('kushtunes_token');
    if (token) {
      setIsLoggedIn(true);
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
      } catch (error) {
        console.error('Error parsing token:', error);
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
            {isLoggedIn && (
              <Link href="/admin" className="text-gray-300 hover:text-blue-400 font-medium transition-colors">
                Admin
              </Link>
            )}
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary-blue rounded-full flex items-center justify-center">
                    <UserIcon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {user?.firstName || user?.username || 'User'}
                  </span>
                </div>
                <Link href="/profile">
                  <Button intent="ghost" size="sm">
                    <Cog6ToothIcon className="h-4 w-4 mr-1" />
                    Profile
                  </Button>
                </Link>
                <Button intent="ghost" size="sm" onClick={handleLogout}>
                  <ArrowRightOnRectangleIcon className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button intent="ghost" size="sm" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button intent="solid" size="sm" asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/upload" 
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Upload
              </Link>
              <Link 
                href="/dashboard" 
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                href="/releases" 
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Releases
              </Link>
              {isLoggedIn && (
                <Link 
                  href="/admin" 
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
            </nav>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              {isLoggedIn ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-blue rounded-full flex items-center justify-center">
                      <UserIcon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {user?.firstName || user?.username || 'User'}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <Link href="/profile">
                      <Button intent="ghost" size="sm" className="w-full justify-start">
                        <Cog6ToothIcon className="h-4 w-4 mr-2" />
                        Profile
                      </Button>
                    </Link>
                    <Button intent="ghost" size="sm" onClick={handleLogout} className="w-full justify-start">
                      <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <Button intent="ghost" size="sm" asChild className="w-full">
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button intent="solid" size="sm" asChild className="w-full">
                    <Link href="/register">Get Started</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}