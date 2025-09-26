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

  const handleButtonClick = (action: string) => {
    console.log(`Button clicked: ${action}`);
  };

  const features = [
    {
      icon: <MusicalNoteIcon className="h-16 w-16 text-white" />,
      title: "Global Music Distribution",
      description: "Drop unlimited singles, EPs and albums on more global music stores than anywhere else.",
      highlight: "Release to the biggest music streaming, download and social platforms",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <CurrencyDollarIcon className="h-16 w-16 text-white" />,
      title: "Clear Pricing",
      description: "Simple plan with industry-low 10% commission on royalties—no setup fees, no annual contracts.",
      highlight: "Distribute worldwide with transparent pricing and no hidden fees",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      icon: <ChartBarIcon className="h-16 w-16 text-white" />,
      title: "Tools & Insights",
      description: "Track your music's performance across major platforms and learn where your fans are listening.",
      highlight: "Explore streaming insights, downloads and audience demographic data",
      gradient: "from-purple-500 to-pink-500"
    }
  ];

  const hallOfFame = [
    { name: "Alex Johnson", achievement: "30Bn+ Streams", subtitle: "Multiple Grammy Award Winner", initials: "AJ" },
    { name: "Maria Santos", achievement: "Two UK #1 Albums", subtitle: "Brits Album Of Year Winner", initials: "MS" },
    { name: "David Chen", achievement: "Multiple Grammy Award Winner", subtitle: "4Bn+ Streams", initials: "DC" },
    { name: "Emma Wilson", achievement: "UMA 2022 Best Female Act", subtitle: "100M+ Streams", initials: "EW" },
    { name: "James Rodriguez", achievement: "3Bn+ Streams", subtitle: "3x Grammy Award Winner", initials: "JR" },
    { name: "Sophie Kim", achievement: "NME Best Song 2020", subtitle: "1Bn+ Streams", initials: "SK" }
  ];

  const testimonials = [
    {
      quote: "Being independent I want to be in charge of how I push my music out there. Kushtunes helped me keep control & still stay a boss.",
      author: "Sarkodie",
      role: "Artist, Ghana",
      avatar: "S"
    },
    {
      quote: "With Kushtunes, I've been able to grow & really focus on my next steps as a musician.",
      author: "Big Zuu",
      role: "Artist, UK",
      avatar: "BZ"
    },
    {
      quote: "With Kushtunes, I get to stay in control of my own music, but also get professional support when I need it.",
      author: "LOVAD",
      role: "Artist, Sweden",
      avatar: "L"
    }
  ];

  const platforms = [
    { name: "Spotify", color: "text-green-500" },
    { name: "Apple Music", color: "text-red-500" },
    { name: "Amazon Music", color: "text-orange-500" },
    { name: "TikTok", color: "text-black" },
    { name: "Deezer", color: "text-blue-500" },
    { name: "Beatport", color: "text-purple-500" },
    { name: "Vevo", color: "text-pink-500" }
  ];

  return (
    <>
      <JsonLd data={orgJsonLd} />
      <Header />
      <div className="min-h-screen bg-white overflow-hidden">
        {/* Premium Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
            
            {/* Floating Elements */}
            <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-float-slow"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-float-slow" style={{animationDelay: '2s'}}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-float-slow" style={{animationDelay: '4s'}}></div>
            
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-y-12 scale-150"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 container mx-auto px-6 text-center">
            <div className="max-w-7xl mx-auto">
              {/* Trust Badge */}
              <div className={`inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-xl rounded-full text-white/90 text-sm font-semibold mb-12 border border-white/20 shadow-2xl transition-all duration-1000 ${isVisible ? 'animate-slide-in-top' : 'opacity-0'}`}>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span>Trusted by 50,000+ artists worldwide</span>
                  <StarIcon className="h-4 w-4 text-yellow-400" />
                </div>
              </div>

              {/* Main Headline */}
              <h1 className={`text-8xl md:text-9xl font-black text-white mb-12 leading-none tracking-tight transition-all duration-1000 ${isVisible ? 'animate-slide-in-bottom' : 'opacity-0 translate-y-20'}`}>
                <span className="block">Release</span>
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-shift">
                  unlimited
                </span>
                <span className="block text-7xl md:text-8xl">music everywhere.</span>
              </h1>

              {/* Subtitle */}
              <p className={`text-2xl md:text-3xl text-white/80 mb-16 max-w-5xl mx-auto leading-relaxed font-light transition-all duration-1000 delay-300 ${isVisible ? 'animate-slide-in-bottom' : 'opacity-0 translate-y-20'}`}>
                Upload to all the biggest platforms, access our industry tools with an{' '}
                <span className="font-bold text-white bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  industry-low 10% commission
                </span>{' '}
                on royalties.
              </p>

              {/* CTA Buttons */}
              <div className={`flex flex-col sm:flex-row justify-center gap-8 mb-20 transition-all duration-1000 delay-500 ${isVisible ? 'animate-slide-in-bottom' : 'opacity-0 translate-y-20'}`}>
                <Link href={isLoggedIn ? "/upload" : "/register"}>
                  <button 
                    onClick={() => handleButtonClick(isLoggedIn ? "upload_music" : "try_for_free")}
                    className="group relative px-16 py-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xl rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10 flex items-center space-x-3">
                      <RocketLaunchIcon className="h-6 w-6" />
                      <span>{isLoggedIn ? "Upload Music" : "Try for free"}</span>
                    </span>
                  </button>
                </Link>
                
                <Link href="/login">
                  <button 
                    onClick={() => handleButtonClick("login")}
                    className="px-16 py-6 bg-white/10 backdrop-blur-xl text-white font-bold text-xl rounded-2xl border-2 border-white/30 hover:bg-white/20 transition-all duration-300 hover:scale-105"
                  >
                    <span className="flex items-center space-x-3">
                      <EyeIcon className="h-6 w-6" />
                      <span>Login</span>
                    </span>
                  </button>
                </Link>
              </div>

              {/* Platform Logos */}
              <div className={`transition-all duration-1000 delay-700 ${isVisible ? 'animate-slide-in-bottom' : 'opacity-0 translate-y-20'}`}>
                <p className="text-white/60 text-sm font-bold mb-10 uppercase tracking-widest">GET YOUR MUSIC ON</p>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 items-center">
                  {platforms.map((platform, index) => (
                    <div 
                      key={index}
                      className={`text-white font-bold text-lg hover:scale-110 transition-all duration-300 ${platform.color} hover:text-white`}
                      style={{animationDelay: `${index * 0.1}s`}}
                    >
                      {platform.name}
                    </div>
                  ))}
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

        {/* Premium Features Section */}
        <section className="py-32 px-4 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-y-1"></div>
          
          <div className="container mx-auto relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-6xl font-black text-gray-900 mb-8">
                Why artists choose{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Kushtunes
                </span>
              </h2>
              <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
                Professional tools designed for the modern music industry
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 max-w-7xl mx-auto">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="group text-center hover-lift"
                  style={{animationDelay: `${index * 0.2}s`}}
                >
                  <div className={`w-32 h-32 bg-gradient-to-br ${feature.gradient} rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500 shadow-2xl group-hover:shadow-3xl`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 mb-6">{feature.title}</h3>
                  <p className="text-xl text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
                  <p className="text-lg text-gray-500 leading-relaxed">{feature.highlight}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Premium Pricing Section */}
        <section className="py-32 px-4 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform skew-y-1"></div>
          
          <div className="container mx-auto text-center relative z-10">
            <div className="mb-20">
              <h2 className="text-6xl font-black text-gray-900 mb-8">
                Plans for every{' '}
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  artist, label and music pro.
                </span>
              </h2>
              <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
                No hidden fees. No long-term contracts. Just great value.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Starter Plan */}
              <div className="card-premium-hover group">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-500 to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-8">
                  <MusicalNoteIcon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-4">STARTER</h3>
                <p className="text-gray-600 mb-8 text-lg">Upload as much music as you like to every music platform with our industry-low 10% commission.</p>
                <div className="text-6xl font-black text-gray-900 mb-8">$0<span className="text-2xl text-gray-500">/year</span></div>
                <ul className="text-left space-y-4 mb-12">
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
                  <button 
                    onClick={() => handleButtonClick("starter_plan")}
                    className="w-full py-4 bg-gray-900 text-white font-bold text-lg rounded-2xl hover:bg-gray-800 transition-all duration-300 hover:scale-105"
                  >
                    Sign Up
                  </button>
                </Link>
              </div>

              {/* Pro Plan - Featured */}
              <div className="card-premium-hover group relative overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600 text-white transform scale-105">
                <div className="absolute top-6 right-6 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-bold animate-pulse">
                  MOST POPULAR
                </div>
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-8">
                  <ChartBarIcon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-3xl font-black text-white mb-4">PRO</h3>
                <p className="text-white/90 mb-8 text-lg">Access industry-leading tools designed to raise your profile and turn your music into more money.</p>
                <div className="text-6xl font-black text-white mb-8">$20<span className="text-2xl text-white/70">/year</span></div>
                <ul className="text-left space-y-4 mb-12">
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
                  <button 
                    onClick={() => handleButtonClick("pro_plan")}
                    className="w-full py-4 bg-white text-blue-600 font-bold text-lg rounded-2xl hover:bg-gray-100 transition-all duration-300 hover:scale-105"
                  >
                    Upgrade Now
                  </button>
                </Link>
              </div>

              {/* Label Plan */}
              <div className="card-premium-hover group">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
                  <UsersIcon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-4">LABELS</h3>
                <p className="text-gray-600 mb-8 text-lg">Everything you need to manage multiple artists and unlock new revenue streams for your label.</p>
                <div className="text-6xl font-black text-gray-900 mb-8">$80<span className="text-2xl text-gray-500">/year</span></div>
                <ul className="text-left space-y-4 mb-12">
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
                  <button 
                    onClick={() => handleButtonClick("label_plan")}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105"
                  >
                    Launch a Label
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Hall of Fame Section */}
        <section className="py-32 px-4 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-y-1"></div>
          
          <div className="container mx-auto text-center relative z-10">
            <div className="mb-20">
              <div className="inline-flex items-center px-6 py-3 bg-yellow-400/20 backdrop-blur-sm rounded-full text-yellow-400 text-sm font-bold mb-8 border border-yellow-400/30">
                <TrophyIcon className="h-5 w-5 mr-2" />
                HALL OF FAME
              </div>
              <h3 className="text-6xl font-black text-white mb-8">
                Some of the{' '}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  biggest artists in the game
                </span>{' '}
                started their careers at Kushtunes.
              </h3>
              <p className="text-2xl text-gray-400">Think you could be the next to join our Hall of Fame?</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 max-w-7xl mx-auto">
              {hallOfFame.map((artist, index) => (
                <div 
                  key={index} 
                  className="text-center group hover-lift"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="w-28 h-28 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white font-black text-2xl group-hover:scale-110 transition-transform duration-500 shadow-2xl group-hover:shadow-3xl">
                    {artist.initials}
                  </div>
                  <h4 className="text-white font-bold text-lg mb-2">{artist.name}</h4>
                  <p className="text-blue-400 font-bold text-sm mb-1">{artist.achievement}</p>
                  <p className="text-gray-400 text-sm">{artist.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-32 px-4 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/30 to-transparent transform skew-y-1"></div>
          
          <div className="container mx-auto text-center relative z-10">
            <h2 className="text-6xl font-black text-gray-900 mb-8">
              What{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Our Artists
              </span>{' '}
              Say.
            </h2>
            <p className="text-2xl text-gray-600 mb-20 max-w-3xl mx-auto">
              Join thousands of satisfied artists who trust Kushtunes
            </p>

            <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index} 
                  className="card-premium-hover group"
                  style={{animationDelay: `${index * 0.2}s`}}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white font-black text-xl">
                    {testimonial.avatar}
                  </div>
                  <div className="text-6xl text-blue-600 mb-6">"</div>
                  <p className="text-xl text-gray-700 mb-8 leading-relaxed italic">
                    {testimonial.quote}
                  </p>
                  <div className="text-center">
                    <h4 className="font-bold text-gray-900 text-lg">{testimonial.author}</h4>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-32 px-4 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform skew-y-1"></div>
          
          <div className="container mx-auto text-center relative z-10">
            <h2 className="text-6xl font-black text-white mb-8">
              Ready to Get Started?
            </h2>
            <p className="text-2xl text-white/80 mb-12 max-w-3xl mx-auto">
              Join thousands of artists who trust Kushtunes for their music distribution
            </p>
            <Link href="/register">
              <button 
                onClick={() => handleButtonClick("final_cta")}
                className="group relative px-16 py-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xl rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center space-x-3">
                  <FireIcon className="h-6 w-6" />
                  <span>Join Kushtunes Today</span>
                </span>
              </button>
            </Link>
          </div>
        </section>

        {/* Premium Footer */}
        <footer className="bg-gray-900 py-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-y-1"></div>
          
          <div className="container mx-auto relative z-10">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <MusicalNoteIcon className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-4xl font-bold text-white mb-4">Kushtunes</h3>
              <p className="text-gray-400 mb-8 text-lg">Professional music distribution platform for artists worldwide</p>
              <div className="text-gray-500 text-sm mb-8">
                © 2025 Kushtunes. All rights reserved.
              </div>
              <div className="flex justify-center space-x-8">
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform duration-300">Terms</Link>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform duration-300">Privacy</Link>
                <Link href="/dmca" className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform duration-300">DMCA</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}