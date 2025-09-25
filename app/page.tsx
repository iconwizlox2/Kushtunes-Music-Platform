"use client";

import Link from 'next/link';
import { MusicalNoteIcon, GlobeAltIcon, ChartBarIcon, ShieldCheckIcon, ArrowRightIcon, UsersIcon, PhotoIcon } from '@/components/ui/Icons';
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
      icon: <MusicalNoteIcon className="h-8 w-8 text-primary-blue" />,
      title: "Upload Your Tracks",
      description: "Get your music on all major platforms. Earn +100 KUSHCOINS!",
    },
    {
      icon: <GlobeAltIcon className="h-8 w-8 text-primary-blue" />,
      title: "Global Distribution",
      description: "Reach fans worldwide on Spotify, Apple Music, and more. Earn +150 KUSHCOINS!",
    },
    {
      icon: <ChartBarIcon className="h-8 w-8 text-primary-blue" />,
      title: "Advanced Analytics",
      description: "Track your streams and earnings with detailed reports. Earn +200 KUSHCOINS!",
    },
    {
      icon: <ShieldCheckIcon className="h-8 w-8 text-primary-blue" />,
      title: "Keep 100% Royalties",
      description: "You keep every penny you earn. No hidden fees. Earn +100 KUSHCOINS!",
    },
    {
      icon: <UsersIcon className="h-8 w-8 text-primary-blue" />,
      title: "Artist Community",
      description: "Connect with other artists and grow your network. Earn +150 KUSHCOINS!",
    },
    {
      icon: <PhotoIcon className="h-8 w-8 text-primary-blue" />,
      title: "Custom Artist Pages",
      description: "Showcase your music with personalized profiles. Earn +200 KUSHCOINS!",
    },
  ];

  const stats = [
    { number: "1M+", label: "Artists" },
    { number: "50M+", label: "Tracks" },
    { number: "24hrs", label: "Processing" }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="premium-bg py-24 px-4 relative">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="heading-xl text-white mb-6 animate-fade-in">
              Play and Earn{' '}
              <span className="luxury-text-gradient animate-glow">KUSHCOINS</span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 animate-fade-in">
              Upload your music, distribute globally, and earn rewards.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in">
              <Link href={isLoggedIn ? "/upload" : "/register"} passHref>
                <button className="btn-primary animate-shimmer">
                  {isLoggedIn ? "Upload Your Music" : "Get Started - Level 1"}
                </button>
              </Link>
              {!isLoggedIn && (
                <Link href="/login" passHref>
                  <button className="btn-secondary">
                    Sign In
                  </button>
                </Link>
              )}
            </div>
            <div className="mt-12 text-2xl font-bold text-gaming-gold animate-pulse">
              1,250 KUSHCOINS
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-800 premium-pattern">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto mb-16">
            <h2 className="heading-lg text-white mb-4 animate-fade-in">
              Why Kushtunes is Your Next Level Up
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              The most artist-friendly music distribution platform with transparent pricing and powerful tools.
            </p>
          </div>

          <div className="grid-features">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`card hover-lift animate-fade-in ${
                  index % 2 === 0 ? 'animate-slide-in-left' : 'animate-slide-in-right'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-4 flex justify-center animate-float">
                  {feature.icon}
                </div>
                <h3 className="heading-sm text-white mb-3 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section (now Levels) */}
      <section className="py-20 premium-bg premium-pattern">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="heading-lg text-white mb-4 animate-fade-in">
              Unlock Your Potential: Choose Your Level
            </h2>
            <p className="text-xl text-gray-300 animate-fade-in">
              No hidden fees. No long-term contracts. Just great value.
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
            {/* Level 1 (Free Plan) */}
            <div className="card text-center animate-slide-in-left">
              <h3 className="heading-sm text-white mb-4">Level 1 (Free)</h3>
              <div className="text-4xl font-bold text-white mb-6">
                $0<span className="text-lg text-gray-400">/year</span>
              </div>
              <ul className="text-left space-y-3 mb-8 text-gray-300">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary-blue rounded-full mr-3"></div>
                  Upload unlimited singles
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary-blue rounded-full mr-3"></div>
                  Keep 100% royalties
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary-blue rounded-full mr-3"></div>
                  Basic analytics
                </li>
              </ul>
              <button className="btn-secondary w-full">
                Get Started Free
              </button>
            </div>

            {/* Level 2 (Musician Plan) */}
            <div className="card-premium text-center relative animate-fade-in animate-pulse">
              <div className="badge-primary absolute -top-3 left-1/2 transform -translate-x-1/2 animate-glow">
                MOST POPULAR
              </div>
              <h3 className="heading-sm text-white mb-4">Level 2 (Musician)</h3>
              <div className="text-4xl font-bold luxury-text-gradient mb-6">
                $20<span className="text-lg text-gray-400">/year</span>
              </div>
              <ul className="text-left space-y-3 mb-8 text-gray-300">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary-blue rounded-full mr-3"></div>
                  Everything in Level 1
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary-blue rounded-full mr-3"></div>
                  Upload albums & EPs
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary-blue rounded-full mr-3"></div>
                  Advanced analytics
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary-blue rounded-full mr-3"></div>
                  HyperFollow pages
                </li>
              </ul>
              <button className="btn-primary w-full animate-shimmer">
                Choose Level 2
              </button>
            </div>

            {/* Level 3 (Label Plan) */}
            <div className="card text-center animate-slide-in-right">
              <h3 className="heading-sm text-white mb-4">Level 3 (Label)</h3>
              <div className="text-4xl font-bold text-white mb-6">
                $80<span className="text-lg text-gray-400">/year</span>
              </div>
              <ul className="text-left space-y-3 mb-8 text-gray-300">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary-blue rounded-full mr-3"></div>
                  Everything in Level 2
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary-blue rounded-full mr-3"></div>
                  Up to 100 artists
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary-blue rounded-full mr-3"></div>
                  Priority support
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary-blue rounded-full mr-3"></div>
                  Custom label pages
                </li>
              </ul>
              <button className="btn-secondary w-full">
                Choose Level 3
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="container mx-auto text-center">
          <h2 className="heading-lg text-white mb-16 animate-fade-in">
            Kushtunes by the Numbers
          </h2>
          <div className="grid-stats">
            {stats.map((stat, index) => (
              <div key={index} className="card animate-fade-in" style={{ animationDelay: `${index * 0.15}s` }}>
                <p className="text-5xl font-extrabold luxury-text-gradient mb-2">{stat.number}</p>
                <p className="text-xl text-gray-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 premium-bg">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="heading-lg text-white mb-6 animate-fade-in">
              Ready to Level Up Your Music Career?
            </h2>
            <p className="text-xl text-gray-300 mb-10 animate-fade-in">
              Join thousands of artists already earning KUSHCOINS and distributing their sound globally.
            </p>
            <Link href={isLoggedIn ? "/upload" : "/register"} passHref>
              <button className="btn-primary animate-shimmer">
                {isLoggedIn ? "Start Uploading Now" : "Join Kushtunes Today"}
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 border-t border-gray-700">
        <p>&copy; {new Date().getFullYear()} Kushtunes. All rights reserved.</p>
      </footer>
    </div>
  );
}