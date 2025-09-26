"use client";

import Link from 'next/link';
import { MusicalNoteIcon, GlobeAltIcon, ChartBarIcon, ShieldCheckIcon, ArrowRightIcon, UsersIcon, PhotoIcon, PlayIcon, CurrencyDollarIcon, EyeIcon, StarIcon, SparklesIcon, RocketLaunchIcon, TrophyIcon, FireIcon } from '@/components/ui/Icons';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { JsonLd } from '@/components/JsonLd';
import { siteUrl } from '@/lib/env';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const base = siteUrl();

  useEffect(() => {
    const token = localStorage.getItem('kushtunes_token');
    if (token) {
      setIsLoggedIn(true);
    }
    setIsVisible(true);
  }, []);

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Kushtunes",
    url: base,
    logo: `${base}/logo.png`,
    sameAs: [
      "https://twitter.com/kushtunes",
      "https://instagram.com/kushtunes",
      "https://facebook.com/kushtunes"
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <JsonLd data={orgJsonLd} />
      
      {/* Header */}
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="max-w-6xl mx-auto">
            {/* Trust Badge */}
            <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-xl rounded-full text-white/90 text-sm font-semibold mb-8 border border-white/20 shadow-2xl">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                <span>Trusted by 50,000+ artists worldwide</span>
                <StarIcon className="h-4 w-4 text-yellow-400" />
              </div>
            </div>
            
            {/* Main Headline */}
            <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-none tracking-tight">
              <span className="block">Release</span>
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                unlimited
              </span>
              <span className="block text-5xl md:text-7xl">music everywhere.</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              Upload to all the biggest platforms, access our industry tools with an{' '}
              <span className="font-bold text-white bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                industry-low 10% commission
              </span>{' '}
              on royalties.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
              <Link href="/register">
                <button className="group relative px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10 flex items-center space-x-3">
                    <RocketLaunchIcon className="h-6 w-6" />
                    <span>Try for free</span>
                  </span>
                </button>
              </Link>
              <Link href="/login">
                <button className="px-12 py-4 bg-white/10 backdrop-blur-xl text-white font-bold text-lg rounded-2xl border-2 border-white/30 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                  <span className="flex items-center space-x-3">
                    <EyeIcon className="h-6 w-6" />
                    <span>Login</span>
                  </span>
                </button>
              </Link>
            </div>
            
            {/* Platform Logos */}
            <div className="space-y-6">
              <p className="text-white/60 text-sm font-bold uppercase tracking-widest">GET YOUR MUSIC ON</p>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 items-center">
                <div className="text-white font-bold text-lg hover:scale-110 transition-all duration-300 text-green-500 hover:text-white">Spotify</div>
                <div className="text-white font-bold text-lg hover:scale-110 transition-all duration-300 text-red-500 hover:text-white">Apple Music</div>
                <div className="text-white font-bold text-lg hover:scale-110 transition-all duration-300 text-orange-500 hover:text-white">Amazon Music</div>
                <div className="text-white font-bold text-lg hover:scale-110 transition-all duration-300 text-black hover:text-white">TikTok</div>
                <div className="text-white font-bold text-lg hover:scale-110 transition-all duration-300 text-blue-500 hover:text-white">Deezer</div>
                <div className="text-white font-bold text-lg hover:scale-110 transition-all duration-300 text-purple-500 hover:text-white">Beatport</div>
                <div className="text-white font-bold text-lg hover:scale-110 transition-all duration-300 text-pink-500 hover:text-white">Vevo</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-white relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-gray-900 mb-6">
              Why artists choose{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Kushtunes
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional tools designed for the modern music industry
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="group text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-xl group-hover:shadow-2xl">
                <MusicalNoteIcon className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Global Music Distribution</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Drop unlimited singles, EPs and albums on more global music stores than anywhere else.
              </p>
              <p className="text-sm text-gray-500 leading-relaxed">
                Release to the biggest music streaming, download and social platforms
              </p>
            </div>
            
            <div className="group text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-xl group-hover:shadow-2xl">
                <CurrencyDollarIcon className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Clear Pricing</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Simple plan with industry-low 10% commission on royalties—no setup fees, no annual contracts.
              </p>
              <p className="text-sm text-gray-500 leading-relaxed">
                Distribute worldwide with transparent pricing and no hidden fees
              </p>
            </div>
            
            <div className="group text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-xl group-hover:shadow-2xl">
                <ChartBarIcon className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Tools & Insights</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Track your music's performance across major platforms and learn where your fans are listening.
              </p>
              <p className="text-sm text-gray-500 leading-relaxed">
                Explore streaming insights, downloads and audience demographic data
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        <div className="container mx-auto text-center relative z-10">
          <div className="mb-20">
            <h2 className="text-5xl font-black text-gray-900 mb-6">
              Plans for every{' '}
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                artist, label and music pro.
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              No hidden fees. No long-term contracts. Just great value.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-500 to-gray-700 rounded-xl flex items-center justify-center mx-auto mb-6">
                <MusicalNoteIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">STARTER</h3>
              <p className="text-gray-600 mb-6">
                Upload as much music as you like to every music platform with our industry-low 10% commission.
              </p>
              <div className="text-4xl font-black text-gray-900 mb-8">
                $0<span className="text-lg text-gray-500">/year</span>
              </div>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                  Upload unlimited singles
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                  10% commission on royalties
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                  Basic analytics
                </li>
              </ul>
              <Link href="/register">
                <button className="w-full py-3 bg-gray-900 text-white font-bold text-lg rounded-xl hover:bg-gray-800 transition-all duration-300 hover:scale-105">
                  Sign Up
                </button>
              </Link>
            </div>
            
            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl shadow-2xl p-8 transform scale-105 hover:scale-110 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-6 right-6 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                MOST POPULAR
              </div>
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-6">
                <ChartBarIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">PRO</h3>
              <p className="text-white/90 mb-6">
                Access industry-leading tools designed to raise your profile and turn your music into more money.
              </p>
              <div className="text-4xl font-black text-white mb-8">
                $20<span className="text-lg text-white/70">/year</span>
              </div>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center text-white">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
                  Everything in Free
                </li>
                <li className="flex items-center text-white">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
                  Upload albums & EPs
                </li>
                <li className="flex items-center text-white">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
                  Advanced analytics
                </li>
                <li className="flex items-center text-white">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
                  HyperFollow pages
                </li>
              </ul>
              <Link href="/register">
                <button className="w-full py-3 bg-white text-blue-600 font-bold text-lg rounded-xl hover:bg-gray-100 transition-all duration-300 hover:scale-105">
                  Upgrade Now
                </button>
              </Link>
            </div>
            
            {/* Labels Plan */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                <UsersIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">LABELS</h3>
              <p className="text-gray-600 mb-6">
                Everything you need to manage multiple artists and unlock new revenue streams for your label.
              </p>
              <div className="text-4xl font-black text-gray-900 mb-8">
                $80<span className="text-lg text-gray-500">/year</span>
              </div>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                  Everything in Pro
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                  Up to 100 artists
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                  Priority support
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                  Custom label pages
                </li>
              </ul>
              <Link href="/register">
                <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105">
                  Launch a Label
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Hall of Fame Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
        <div className="container mx-auto text-center relative z-10">
          <div className="mb-20">
            <div className="inline-flex items-center px-6 py-3 bg-yellow-400/20 backdrop-blur-sm rounded-full text-yellow-400 text-sm font-bold mb-8 border border-yellow-400/30">
              <TrophyIcon className="h-5 w-5 mr-2" />
              HALL OF FAME
            </div>
            <h3 className="text-5xl font-black text-white mb-6">
              Some of the{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                biggest artists in the game
              </span>{' '}
              started their careers at Kushtunes.
            </h3>
            <p className="text-xl text-gray-400">Think you could be the next to join our Hall of Fame?</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 max-w-6xl mx-auto">
            {[
              { initials: 'AJ', name: 'Alex Johnson', achievement: '30Bn+ Streams', subtitle: 'Multiple Grammy Award Winner' },
              { initials: 'MS', name: 'Maria Santos', achievement: 'Two UK #1 Albums', subtitle: 'Brits Album Of Year Winner' },
              { initials: 'DC', name: 'David Chen', achievement: 'Multiple Grammy Award Winner', subtitle: '4Bn+ Streams' },
              { initials: 'EW', name: 'Emma Wilson', achievement: 'UMA 2022 Best Female Act', subtitle: '100M+ Streams' },
              { initials: 'JR', name: 'James Rodriguez', achievement: '3Bn+ Streams', subtitle: '3x Grammy Award Winner' },
              { initials: 'SK', name: 'Sophie Kim', achievement: 'NME Best Song 2020', subtitle: '1Bn+ Streams' }
            ].map((artist, index) => (
              <div key={index} className="text-center group">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-black text-xl group-hover:scale-110 transition-transform duration-500 shadow-2xl group-hover:shadow-3xl">
                  {artist.initials}
                </div>
                <h4 className="text-white font-bold text-lg mb-1">{artist.name}</h4>
                <p className="text-blue-400 font-bold text-sm mb-1">{artist.achievement}</p>
                <p className="text-gray-400 text-sm">{artist.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 bg-white relative overflow-hidden">
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-5xl font-black text-gray-900 mb-6">
            What{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Our Artists
            </span>{' '}
            Say.
          </h2>
          <p className="text-xl text-gray-600 mb-16 max-w-3xl mx-auto">
            Join thousands of satisfied artists who trust Kushtunes
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { 
                initial: 'S', 
                quote: "Being independent I want to be in charge of how I push my music out there. Kushtunes helped me keep control & still stay a boss.", 
                name: 'Sarkodie', 
                location: 'Artist, Ghana' 
              },
              { 
                initial: 'BZ', 
                quote: "With Kushtunes, I've been able to grow & really focus on my next steps as a musician.", 
                name: 'Big Zuu', 
                location: 'Artist, UK' 
              },
              { 
                initial: 'L', 
                quote: "With Kushtunes, I get to stay in control of my own music, but also get professional support when I need it.", 
                name: 'LOVAD', 
                location: 'Artist, Sweden' 
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-black text-lg">
                  {testimonial.initial}
                </div>
                <div className="text-4xl text-blue-600 mb-4">"</div>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed italic">
                  {testimonial.quote}
                </p>
                <div className="text-center">
                  <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                  <p className="text-gray-600">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-5xl font-black text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-white/80 mb-12 max-w-3xl mx-auto">
            Join thousands of artists who trust Kushtunes for their music distribution
          </p>
          <Link href="/register">
            <button className="group relative px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center space-x-3">
                <RocketLaunchIcon className="h-6 w-6" />
                <span>Join Kushtunes Today</span>
              </span>
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-16 px-4 relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MusicalNoteIcon className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-3">Kushtunes</h3>
            <p className="text-gray-400 mb-6">Professional music distribution platform for artists worldwide</p>
            <div className="text-gray-500 text-sm mb-6">© 2025 Kushtunes. All rights reserved.</div>
            <div className="flex justify-center space-x-6">
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform duration-300">
                Terms
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform duration-300">
                Privacy
              </Link>
              <Link href="/dmca" className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform duration-300">
                DMCA
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}