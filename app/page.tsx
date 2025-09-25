"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  CloudArrowUpIcon,
  ChartBarIcon,
  MusicalNoteIcon,
  PlayIcon,
  TrendingUpIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  ClockIcon,
  SparklesIcon,
  RocketLaunchIcon,
  ArrowRightIcon
} from '@/components/ui/Icons';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const features = [
    {
      icon: <CloudArrowUpIcon className="h-8 w-8 text-premium-green" />,
      title: "Lightning Upload",
      description: "Upload your music in seconds with our AI-powered interface"
    },
    {
      icon: <GlobeAltIcon className="h-8 w-8 text-premium-green" />,
      title: "Global Reach",
      description: "Distribute to 200+ platforms worldwide including Spotify, Apple Music, TikTok"
    },
    {
      icon: <ChartBarIcon className="h-8 w-8 text-premium-green" />,
      title: "Smart Analytics",
      description: "Real-time insights and AI-powered recommendations for your music"
    },
    {
      icon: <ShieldCheckIcon className="h-8 w-8 text-premium-green" />,
      title: "Blockchain Security",
      description: "Your music is protected with cutting-edge blockchain technology"
    }
  ];

  const stats = [
    { label: "Artists", value: "100K+", icon: <MusicalNoteIcon className="h-6 w-6 text-premium-green" /> },
    { label: "Releases", value: "2M+", icon: <PlayIcon className="h-6 w-6 text-premium-green" /> },
    { label: "Platforms", value: "200+", icon: <GlobeAltIcon className="h-6 w-6 text-premium-green" /> },
    { label: "Revenue", value: "$50M+", icon: <TrendingUpIcon className="h-6 w-6 text-premium-green" /> }
  ];

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      {/* Premium Hero Section */}
      <section className="hero-premium relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="container mx-auto px-6 py-20 text-center relative z-10">
          <div className={`animate-fade-in ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            {/* Main Branding */}
            <div className="mb-8">
              <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                KUSHTUNES
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Music meets the blockchain. Upload, distribute & earn with premium quality.
              </p>
            </div>

            {/* Hero Visual */}
            <div className="mb-12 relative">
              <div className="w-32 h-32 mx-auto mb-8 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-premium-green to-accent-green rounded-full opacity-20 blur-xl"></div>
                <div className="relative z-10 w-full h-full bg-gradient-to-r from-premium-green to-accent-green rounded-full flex items-center justify-center">
                  <MusicalNoteIcon className="h-16 w-16 text-black" />
                </div>
              </div>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link href="/upload">
                <button className="btn-premium px-8 py-4 text-lg font-semibold flex items-center gap-2">
                  <CloudArrowUpIcon className="h-5 w-5" />
                  Upload Music
                </button>
              </Link>
              <Link href="/register">
                <button className="btn-premium-outline px-8 py-4 text-lg font-semibold flex items-center gap-2">
                  <SparklesIcon className="h-5 w-5" />
                  Get Started
                </button>
              </Link>
            </div>

            {/* Learn More */}
            <div className="mb-8">
              <Link href="#features">
                <button className="text-gray-400 hover:text-premium-green transition-colors flex items-center gap-2 mx-auto">
                  <span>Learn How It Works</span>
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Stats Section */}
      <section className="py-20 bg-gradient-to-b from-transparent to-card-bg">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className={`stats-premium text-center animate-fade-in ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-center mb-3">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-premium-green mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Choose <span className="text-premium-green">Kushtunes</span>?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Experience the future of music distribution with our premium platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`premium-card p-8 text-center animate-fade-in ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium CTA Section */}
      <section className="py-20 bg-gradient-to-r from-premium-green/10 to-accent-green/10">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to <span className="text-premium-green">Launch</span> Your Music?
            </h2>
            <p className="text-xl text-gray-300 mb-12">
              Join thousands of artists who trust Kushtunes for their music distribution
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <button className="btn-premium px-8 py-4 text-lg font-semibold flex items-center gap-2">
                  <RocketLaunchIcon className="h-5 w-5" />
                  Start Your Journey
                </button>
              </Link>
              <Link href="/upload">
                <button className="btn-premium-outline px-8 py-4 text-lg font-semibold flex items-center gap-2">
                  <PlayIcon className="h-5 w-5" />
                  Upload Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="py-12 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-premium-green mb-4">KUSHTUNES</div>
            <p className="text-gray-400 mb-6">From the Nile to the World</p>
            <div className="flex justify-center gap-6">
              <Link href="/login" className="text-gray-400 hover:text-premium-green transition-colors">
                Sign In
              </Link>
              <Link href="/register" className="text-gray-400 hover:text-premium-green transition-colors">
                Register
              </Link>
              <Link href="/upload" className="text-gray-400 hover:text-premium-green transition-colors">
                Upload
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}