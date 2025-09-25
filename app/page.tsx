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
      title: "Easy Upload",
      description: "Upload your music in minutes with our intuitive interface",
    },
    {
      icon: <GlobeAltIcon className="h-8 w-8 text-primary-blue" />,
      title: "Global Distribution",
      description: "Reach fans worldwide on Spotify, Apple Music, and 180+ platforms",
    },
    {
      icon: <ChartBarIcon className="h-8 w-8 text-primary-blue" />,
      title: "Real-time Analytics",
      description: "Track your streams, downloads, and revenue with detailed analytics",
    },
    {
      icon: <ShieldCheckIcon className="h-8 w-8 text-primary-blue" />,
      title: "Keep 100% Royalties",
      description: "You keep every penny you earn. No hidden fees, ever.",
    },
    {
      icon: <UsersIcon className="h-8 w-8 text-primary-blue" />,
      title: "Artist Community",
      description: "Connect with other artists and grow your network",
    },
    {
      icon: <PhotoIcon className="h-8 w-8 text-primary-blue" />,
      title: "Custom Artist Pages",
      description: "Showcase your music with personalized profiles",
    },
  ];

  const stats = [
    { number: "50,000+", label: "Artists" },
    { number: "1M+", label: "Releases" },
    { number: "180+", label: "Platforms" },
    { number: "200+", label: "Countries" }
  ];

  return (
    <div className="min-h-screen clean-bg">
      {/* Hero Section */}
      <section className="py-20 px-4 clean-bg">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="heading-xl text-gray-900 mb-6 animate-fade-in">
              Distribute Your Music
              <span className="block text-gradient">Worldwide</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 animate-fade-in max-w-2xl mx-auto">
              Get your music on Spotify, Apple Music, and 180+ other platforms. Track your success with real-time analytics and get paid for every stream.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in">
              <Link href={isLoggedIn ? "/upload" : "/register"} passHref>
                <button className="btn-primary">
                  {isLoggedIn ? "Upload Your Music" : "Get Started Free"}
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
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 clean-bg-gray">
        <div className="container mx-auto">
          <div className="grid-stats">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <p className="text-4xl font-bold text-primary-blue mb-2">{stat.number}</p>
                <p className="text-lg text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 clean-bg">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="heading-lg text-gray-900 mb-4 animate-fade-in">
              Why Choose Kushtunes?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in">
              We provide everything you need to succeed in the music industry
            </p>
          </div>

          <div className="grid-features">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card hover-lift animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="heading-sm text-gray-900 mb-3 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 clean-bg-gray">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="heading-lg text-gray-900 mb-4 animate-fade-in">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 animate-fade-in">
              No hidden fees. No long-term contracts. Just great value.
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="card text-center animate-fade-in-up">
              <h3 className="heading-sm text-gray-900 mb-4">Free</h3>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                $0<span className="text-lg text-gray-500">/year</span>
              </div>
              <ul className="text-left space-y-3 mb-8 text-gray-600">
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

            {/* Musician Plan */}
            <div className="card-premium text-center relative animate-fade-in-up">
              <div className="badge-primary absolute -top-3 left-1/2 transform -translate-x-1/2">
                MOST POPULAR
              </div>
              <h3 className="heading-sm text-gray-900 mb-4">Musician</h3>
              <div className="text-4xl font-bold text-primary-blue mb-6">
                $20<span className="text-lg text-gray-500">/year</span>
              </div>
              <ul className="text-left space-y-3 mb-8 text-gray-600">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary-blue rounded-full mr-3"></div>
                  Everything in Free
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
              <button className="btn-primary w-full">
                Choose Musician
              </button>
            </div>

            {/* Label Plan */}
            <div className="card text-center animate-fade-in-up">
              <h3 className="heading-sm text-gray-900 mb-4">Label</h3>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                $80<span className="text-lg text-gray-500">/year</span>
              </div>
              <ul className="text-left space-y-3 mb-8 text-gray-600">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary-blue rounded-full mr-3"></div>
                  Everything in Musician
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
                Choose Label
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 clean-bg">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="heading-lg text-gray-900 mb-4 animate-fade-in">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 animate-fade-in">
              Get your music distributed in just a few simple steps
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
            <div className="text-center animate-fade-in-up">
              <div className="mx-auto w-16 h-16 bg-primary-blue rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="heading-sm text-gray-900 mb-4">Upload Your Music</h3>
              <p className="text-gray-600">Upload your audio files and cover art through our secure platform</p>
            </div>
            <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="mx-auto w-16 h-16 bg-primary-blue rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="heading-sm text-gray-900 mb-4">We Distribute</h3>
              <p className="text-gray-600">We send your music to all major streaming platforms and stores</p>
            </div>
            <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="mx-auto w-16 h-16 bg-primary-blue rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="heading-sm text-gray-900 mb-4">Track & Get Paid</h3>
              <p className="text-gray-600">Monitor your success and receive payments for your streams</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 clean-bg-gray">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="heading-lg text-gray-900 mb-6 animate-fade-in">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-600 mb-10 animate-fade-in">
              Join thousands of artists who trust Kushtunes for their music distribution
            </p>
            <Link href={isLoggedIn ? "/upload" : "/register"} passHref>
              <button className="btn-primary">
                {isLoggedIn ? "Start Uploading Now" : "Join Kushtunes Today"}
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 clean-bg border-t border-gray-200">
        <div className="container mx-auto text-center">
          <p className="text-gray-600 mb-2">&copy; {new Date().getFullYear()} Kushtunes. All rights reserved.</p>
          <p className="text-sm text-gray-500">Professional music distribution platform for artists worldwide</p>
        </div>
      </footer>
    </div>
  );
}