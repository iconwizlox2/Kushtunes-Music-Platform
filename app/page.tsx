"use client";

import Link from 'next/link';
import { SparklesIcon, MusicalNoteIcon, GlobeAltIcon, ChartBarIcon, ShieldCheckIcon, ArrowRightIcon } from '@/components/ui/Icons';
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
      title: "Upload & Distribute",
      description: "Get your music on Spotify, Apple Music, and 200+ other platforms worldwide."
    },
    {
      icon: <GlobeAltIcon className="h-8 w-8 text-primary-blue" />,
      title: "Global Reach",
      description: "Reach fans everywhere with distribution to major streaming platforms and stores."
    },
    {
      icon: <ChartBarIcon className="h-8 w-8 text-primary-blue" />,
      title: "Real-time Analytics",
      description: "Track your streams, downloads, and earnings with detailed analytics dashboard."
    },
    {
      icon: <ShieldCheckIcon className="h-8 w-8 text-primary-blue" />,
      title: "Keep 100% Rights",
      description: "You keep all your rights and royalties. No hidden fees or long-term contracts."
    },
    {
      icon: <SparklesIcon className="h-8 w-8 text-primary-blue" />,
      title: "Premium Features",
      description: "Access to advanced tools like HyperFollow pages and playlist pitching."
    },
    {
      icon: <ArrowRightIcon className="h-8 w-8 text-primary-blue" />,
      title: "Fast Processing",
      description: "Your music goes live in 24-48 hours on most platforms. No waiting around."
    }
  ];

  const stats = [
    { number: "200+", label: "Platforms" },
    { number: "1M+", label: "Artists" },
    { number: "50M+", label: "Tracks" },
    { number: "24hrs", label: "Processing" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="hero-distrokid py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="heading-xl text-gray-900 mb-6 animate-fade-in">
              Get Your Music on{' '}
              <span className="text-gradient">Every Platform</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 animate-fade-in">
              Upload once, distribute everywhere. Keep 100% of your rights and royalties.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in">
              <Link href={isLoggedIn ? "/upload" : "/register"} passHref>
                <button className="btn-primary text-lg px-8 py-4">
                  {isLoggedIn ? "Upload Your Music" : "Start Distributing - It's Free"}
                  <ArrowRightIcon className="h-5 w-5" />
                </button>
              </Link>
              {!isLoggedIn && (
                <Link href="/login" passHref>
                  <button className="btn-secondary text-lg px-8 py-4">
                    Sign In
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto">
          <div className="grid-stats">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary-blue mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="heading-lg text-gray-900 mb-4">
              Why Choose Kushtunes?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The most artist-friendly music distribution platform with transparent pricing and powerful tools.
            </p>
          </div>
          
          <div className="grid-features">
            {features.map((feature, index) => (
              <div
                key={index}
                className="stats-distrokid hover-lift"
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
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="heading-lg text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              No hidden fees. No long-term contracts. Just great value.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="card text-center">
              <h3 className="heading-sm text-gray-900 mb-4">Free</h3>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                $0<span className="text-lg text-gray-500">/year</span>
              </div>
              <ul className="text-left space-y-3 mb-8">
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
            <div className="card-premium text-center relative">
              <div className="badge-primary absolute -top-3 left-1/2 transform -translate-x-1/2">
                Most Popular
              </div>
              <h3 className="heading-sm text-gray-900 mb-4">Musician</h3>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                $20<span className="text-lg text-gray-500">/year</span>
              </div>
              <ul className="text-left space-y-3 mb-8">
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
            <div className="card text-center">
              <h3 className="heading-sm text-gray-900 mb-4">Label</h3>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                $80<span className="text-lg text-gray-500">/year</span>
              </div>
              <ul className="text-left space-y-3 mb-8">
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

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="heading-lg text-gray-900 mb-6">
              Ready to Get Your Music Out There?
            </h2>
            <p className="text-xl text-gray-600 mb-10">
              Join over 1 million artists who trust Kushtunes to distribute their music worldwide.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href={isLoggedIn ? "/upload" : "/register"} passHref>
                <button className="btn-primary text-lg px-8 py-4">
                  {isLoggedIn ? "Upload Your First Track" : "Start Your Free Account"}
                  <ArrowRightIcon className="h-5 w-5" />
                </button>
              </Link>
              <button className="btn-ghost text-lg px-8 py-4">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4">Kushtunes</h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              The most artist-friendly music distribution platform. Upload once, distribute everywhere.
            </p>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} Kushtunes. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}