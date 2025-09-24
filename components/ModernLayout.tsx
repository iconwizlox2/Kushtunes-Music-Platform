"use client";

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { 
  MusicalNoteIcon, 
  CloudArrowUpIcon, 
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon
} from '@/components/ui/Icons';

// New Modern Layout Component
export function ModernLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50 dark:bg-slate-900/80 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <MusicalNoteIcon className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">Kushtunes</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/upload" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
                Upload
              </Link>
              <Link href="/dashboard" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link href="/login" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
                Admin
              </Link>
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300">
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              {sidebarOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
            <div className="px-4 py-4 space-y-4">
              <Link href="/" className="block text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                Home
              </Link>
              <Link href="/upload" className="block text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                Upload
              </Link>
              <Link href="/dashboard" className="block text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                Dashboard
              </Link>
              <Link href="/login" className="block text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                Admin
              </Link>
              <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg">
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-slate-600 dark:text-slate-400">
            <p>&copy; 2024 Kushtunes. From the Nile to the World.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// New Hero Section Component
export function ModernHero() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm font-medium mb-8">
            <MusicalNoteIcon className="h-4 w-4 mr-2" />
            From the Nile to the World
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6">
            Release your music
            <span className="block bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              worldwide—fast
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-12 max-w-3xl mx-auto">
            Kushtunes is the modern way to prep releases, manage your catalog, and get paid. 
            Built for creators across Africa and beyond.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/upload" className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300">
              <CloudArrowUpIcon className="h-5 w-5 mr-2" />
              Upload a track
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link href="/dashboard" className="inline-flex items-center px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300">
              <ChartBarIcon className="h-5 w-5 mr-2" />
              View Dashboard
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900 dark:text-white">10K+</div>
              <div className="text-slate-600 dark:text-slate-400">Artists</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900 dark:text-white">50K+</div>
              <div className="text-slate-600 dark:text-slate-400">Releases</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900 dark:text-white">100M+</div>
              <div className="text-slate-600 dark:text-slate-400">Streams</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900 dark:text-white">180+</div>
              <div className="text-slate-600 dark:text-slate-400">Countries</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// New Feature Cards Component
export function ModernFeatureCards() {
  const features = [
    {
      icon: <CloudArrowUpIcon className="h-8 w-8" />,
      title: "Mobile-first uploads",
      description: "Upload WAV/FLAC from your phone. We handle metadata & artwork validation for you.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <ChartBarIcon className="h-8 w-8" />,
      title: "Fast release prep",
      description: "Get UPC/ISRC, splits, territories, and release dates set in minutes.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <MusicalNoteIcon className="h-8 w-8" />,
      title: "Artist dashboard",
      description: "Track status and royalties. Withdraw to Mobile Money, PayPal, or crypto.",
      color: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Everything you need to release music
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            From upload to distribution, we've got you covered with modern tools
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 transition-all duration-300 hover:shadow-xl">
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// New CTA Section Component
export function ModernCTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to release your music?
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Join thousands of artists who trust Kushtunes for their music distribution needs.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/upload" className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300">
            <CloudArrowUpIcon className="h-5 w-5 mr-2" />
            Start uploading
          </Link>
          <Link href="/dashboard" className="inline-flex items-center px-8 py-4 bg-transparent text-white font-semibold rounded-xl border-2 border-white hover:bg-white hover:text-blue-600 transition-all duration-300">
            <ChartBarIcon className="h-5 w-5 mr-2" />
            View Dashboard
          </Link>
        </div>
      </div>
    </section>
  );
}

