"use client";

import Link from 'next/link';
import { SparklesIcon, MusicalNoteIcon, GlobeAltIcon, ChartBarIcon, ShieldCheckIcon, ArrowRightIcon, TrophyIcon, StarIcon } from '@/components/ui/Icons';
import { useEffect, useState } from 'react';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('kushtunes_token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const features = [
    {
      icon: <MusicalNoteIcon className="h-8 w-8 text-blue-400" />,
      title: "Upload & Distribute",
      description: "Get your music on Spotify, Apple Music, and 200+ platforms worldwide.",
      coins: "100"
    },
    {
      icon: <GlobeAltIcon className="h-8 w-8 text-purple-400" />,
      title: "Global Reach",
      description: "Reach fans everywhere with distribution to major streaming platforms.",
      coins: "150"
    },
    {
      icon: <ChartBarIcon className="h-8 w-8 text-yellow-400" />,
      title: "Real-time Analytics",
      description: "Track your streams, downloads, and earnings with detailed analytics.",
      coins: "200"
    },
    {
      icon: <ShieldCheckIcon className="h-8 w-8 text-green-400" />,
      title: "Keep 100% Rights",
      description: "You keep all your rights and royalties. No hidden fees.",
      coins: "300"
    },
    {
      icon: <SparklesIcon className="h-8 w-8 text-pink-400" />,
      title: "Premium Features",
      description: "Access to advanced tools like HyperFollow pages and playlist pitching.",
      coins: "500"
    },
    {
      icon: <TrophyIcon className="h-8 w-8 text-orange-400" />,
      title: "Fast Processing",
      description: "Your music goes live in 24-48 hours on most platforms.",
      coins: "250"
    }
  ];

  const stats = [
    { number: "200+", label: "Platforms", icon: "🎵" },
    { number: "1M+", label: "Artists", icon: "👥" },
    { number: "50M+", label: "Tracks", icon: "🎶" },
    { number: "24hrs", label: "Processing", icon: "⚡" }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Premium Dark Background with Patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 opacity-50"></div>
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.15) 1px, transparent 0)`,
        backgroundSize: '20px 20px'
      }}></div>
      
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="py-24 px-4 relative overflow-hidden">
          <div className="container mx-auto text-center">
            <div className="max-w-4xl mx-auto">
              {/* Coin Balance Display */}
              <div className="flex justify-center mb-8">
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full px-6 py-3 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-yellow-300 rounded-full flex items-center justify-center">
                      <span className="text-yellow-800 font-bold text-sm">₵</span>
                    </div>
                    <span className="text-yellow-900 font-bold text-lg">1,250 KUSHCOINS</span>
                  </div>
                </div>
              </div>

              <h1 className="text-6xl md:text-8xl font-extrabold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  KUSHTUNES
                </span>
              </h1>
              
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-10 shadow-2xl">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Play and Earn KUSHCOINS
                </h2>
                <p className="text-xl text-blue-100 mb-6">
                  Support us by uploading awesome music and earn a lot of coins!
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link href={isLoggedIn ? "/upload" : "/register"} passHref>
                    <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center space-x-2">
                      <span>{isLoggedIn ? "Upload Music" : "Enter Platform"}</span>
                      <ArrowRightIcon className="h-5 w-5" />
                    </button>
                  </Link>
                  {!isLoggedIn && (
                    <Link href="/login" passHref>
                      <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-xl text-lg border border-gray-600 transition-all duration-300">
                        Sign In
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gray-800/50 backdrop-blur-sm">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300">
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <div className="text-3xl font-bold text-blue-400 mb-2">{stat.number}</div>
                  <div className="text-gray-300 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Why Choose Kushtunes?
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                The most artist-friendly music distribution platform with transparent pricing and powerful tools.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-blue-500 transition-all duration-300 hover:transform hover:scale-105"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex justify-center">
                      {feature.icon}
                    </div>
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full px-3 py-1">
                      <span className="text-yellow-900 font-bold text-sm">+{feature.coins}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 bg-gray-800/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Choose Your Level
              </h2>
              <p className="text-xl text-gray-400">
                Level up your music distribution game
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
              {/* Free Plan */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 text-center hover:border-green-500 transition-all duration-300">
                <div className="text-4xl mb-4">🎵</div>
                <h3 className="text-2xl font-bold text-white mb-4">LEVEL 1</h3>
                <div className="text-4xl font-bold text-green-400 mb-6">
                  FREE
                </div>
                <ul className="text-left space-y-3 mb-8 text-gray-300">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    Upload unlimited singles
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    Keep 100% royalties
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    Basic analytics
                  </li>
                </ul>
                <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl w-full transition-all duration-300">
                  Start Free
                </button>
              </div>

              {/* Musician Plan */}
              <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm border-2 border-blue-500 rounded-2xl p-8 text-center relative hover:border-blue-400 transition-all duration-300 transform scale-105">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full px-4 py-1">
                  <span className="text-yellow-900 font-bold text-sm">MOST POPULAR</span>
                </div>
                <div className="text-4xl mb-4">🎤</div>
                <h3 className="text-2xl font-bold text-white mb-4">LEVEL 2</h3>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
                  $20
                </div>
                <ul className="text-left space-y-3 mb-8 text-gray-300">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                    Everything in Level 1
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                    Upload albums & EPs
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                    Advanced analytics
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                    HyperFollow pages
                  </li>
                </ul>
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl w-full transition-all duration-300">
                  Level Up
                </button>
              </div>

              {/* Label Plan */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 text-center hover:border-purple-500 transition-all duration-300">
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="text-2xl font-bold text-white mb-4">LEVEL 3</h3>
                <div className="text-4xl font-bold text-purple-400 mb-6">
                  $80
                </div>
                <ul className="text-left space-y-3 mb-8 text-gray-300">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                    Everything in Level 2
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                    Up to 100 artists
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                    Priority support
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                    Custom label pages
                  </li>
                </ul>
                <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl w-full transition-all duration-300">
                  Go Pro
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-gray-700 rounded-3xl p-12">
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Ready to Level Up?
              </h2>
              <p className="text-xl text-gray-400 mb-10">
                Join over 1 million artists who trust Kushtunes to distribute their music worldwide.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href={isLoggedIn ? "/upload" : "/register"} passHref>
                  <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center space-x-2">
                    <span>{isLoggedIn ? "Upload Your First Track" : "Start Your Journey"}</span>
                    <ArrowRightIcon className="h-5 w-5" />
                  </button>
                </Link>
                <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-xl text-lg border border-gray-600 transition-all duration-300">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 bg-gray-900/50 backdrop-blur-sm border-t border-gray-800">
          <div className="container mx-auto px-4 text-center">
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Kushtunes</h3>
              <p className="text-gray-400 max-w-2xl mx-auto">
                The most artist-friendly music distribution platform. Upload once, distribute everywhere.
              </p>
            </div>
            <div className="border-t border-gray-800 pt-8">
              <p className="text-gray-500">
                &copy; {new Date().getFullYear()} Kushtunes. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}