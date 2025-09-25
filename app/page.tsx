"use client";

import Link from 'next/link';
import { MusicalNoteIcon, GlobeAltIcon, ChartBarIcon, ShieldCheckIcon, ArrowRightIcon, UsersIcon, PhotoIcon, PlayIcon, CurrencyDollarIcon, EyeIcon } from '@/components/ui/Icons';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('kushtunes_token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleButtonClick = (action: string) => {
    console.log(`Button clicked: ${action}`);
  };

  const features = [
    {
      icon: <MusicalNoteIcon className="h-12 w-12 text-white" />,
      title: "Global Music Distribution",
      description: "Drop unlimited singles, EPs and albums on more global music stores than anywhere else.",
      highlight: "Release to the biggest music streaming, download and social platforms"
    },
    {
      icon: <CurrencyDollarIcon className="h-12 w-12 text-white" />,
      title: "Clear Pricing",
      description: "Simple plan with industry-low 10% commission on royalties—no setup fees, no annual contracts.",
      highlight: "Distribute worldwide with transparent pricing and no hidden fees"
    },
    {
      icon: <ChartBarIcon className="h-12 w-12 text-white" />,
      title: "Tools & Insights",
      description: "Track your music's performance across major platforms and learn where your fans are listening.",
      highlight: "Explore streaming insights, downloads and audience demographic data"
    }
  ];

  const hallOfFame = [
    { name: "Alex Johnson", achievement: "30Bn+ Streams", subtitle: "Multiple Grammy Award Winner" },
    { name: "Maria Santos", achievement: "Two UK #1 Albums", subtitle: "Brits Album Of Year Winner" },
    { name: "David Chen", achievement: "Multiple Grammy Award Winner", subtitle: "4Bn+ Streams" },
    { name: "Emma Wilson", achievement: "UMA 2022 Best Female Act", subtitle: "100M+ Streams" },
    { name: "James Rodriguez", achievement: "3Bn+ Streams", subtitle: "3x Grammy Award Winner" },
    { name: "Sophie Kim", achievement: "NME Best Song 2020", subtitle: "1Bn+ Streams" }
  ];

  const testimonials = [
    {
      quote: "Being independent I want to be in charge of how I push my music out there. Kushtunes helped me keep control & still stay a boss.",
      author: "Sarkodie",
      role: "Artist, Ghana"
    },
    {
      quote: "With Kushtunes, I've been able to grow & really focus on my next steps as a musician.",
      author: "Big Zuu",
      role: "Artist, UK"
    },
    {
      quote: "With Kushtunes, I get to stay in control of my own music, but also get professional support when I need it.",
      author: "LOVAD",
      role: "Artist, Sweden"
    }
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative pt-32 pb-32 px-4 overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 min-h-screen flex items-center">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
          </div>
          
          <div className="container mx-auto text-center relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-semibold mb-12 animate-fade-in border border-white/20">
                <span className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></span>
                Trusted by 50,000+ artists worldwide
              </div>
              
              <h1 className="text-7xl md:text-9xl font-black text-white mb-12 animate-fade-in leading-none tracking-tight">
                Release
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  unlimited
                </span>
                <span className="block text-6xl md:text-8xl">music everywhere.</span>
              </h1>
              
              <p className="text-2xl md:text-3xl text-white/80 mb-16 animate-fade-in max-w-4xl mx-auto leading-relaxed font-light">
                Upload to all the biggest platforms, access our industry tools with an <span className="font-bold text-white">industry-low 10% commission</span> on royalties.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-8 animate-fade-in-up mb-20">
                <Link href={isLoggedIn ? "/upload" : "/register"} passHref>
                  <button 
                    onClick={() => handleButtonClick(isLoggedIn ? "upload_music" : "try_for_free")}
                    className="group relative px-16 py-6 bg-white text-gray-900 font-bold text-xl rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                  >
                    <span className="relative z-10">
                      {isLoggedIn ? "Upload Music" : "Try for free"}
                    </span>
                  </button>
                </Link>
                
                <Link href="/login" passHref>
                  <button 
                    onClick={() => handleButtonClick("login")}
                    className="px-16 py-6 bg-transparent text-white font-bold text-xl rounded-2xl border-2 border-white/30 hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
                  >
                    Login
                  </button>
                </Link>
              </div>

              {/* Platform Logos */}
              <div className="animate-fade-in-up">
                <p className="text-white/60 text-sm font-bold mb-10 uppercase tracking-widest">GET YOUR MUSIC ON</p>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 items-center opacity-70">
                  <div className="text-white font-bold text-lg hover:opacity-100 transition-opacity">Spotify</div>
                  <div className="text-white font-bold text-lg hover:opacity-100 transition-opacity">Apple Music</div>
                  <div className="text-white font-bold text-lg hover:opacity-100 transition-opacity">Amazon Music</div>
                  <div className="text-white font-bold text-lg hover:opacity-100 transition-opacity">TikTok</div>
                  <div className="text-white font-bold text-lg hover:opacity-100 transition-opacity">Deezer</div>
                  <div className="text-white font-bold text-lg hover:opacity-100 transition-opacity">Beatport</div>
                  <div className="text-white font-bold text-lg hover:opacity-100 transition-opacity">Vevo</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32 px-4 bg-white">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-3 gap-16 max-w-7xl mx-auto">
              {features.map((feature, index) => (
                <div key={index} className="text-center group">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
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
        <section className="py-32 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container mx-auto text-center">
            <h2 className="text-6xl font-black text-gray-900 mb-8">
              Plans for every
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                artist, label and music pro.
              </span>
            </h2>
            <p className="text-2xl text-gray-600 mb-20 max-w-3xl mx-auto">
              No hidden fees. No long-term contracts. Just great value.
            </p>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Starter Plan */}
              <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-500 to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-8">
                  <MusicalNoteIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-4">STARTER</h3>
                <p className="text-gray-600 mb-8 text-lg">Upload as much music as you like to every music platform with our industry-low 10% commission.</p>
                <div className="text-6xl font-black text-gray-900 mb-8">$0<span className="text-2xl text-gray-500">/year</span></div>
                <ul className="text-left space-y-4 mb-12">
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Upload unlimited singles
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    10% commission on royalties
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Basic analytics
                  </li>
                </ul>
                <Link href="/register" passHref>
                  <button 
                    onClick={() => handleButtonClick("starter_plan")}
                    className="w-full py-4 bg-gray-900 text-white font-bold text-lg rounded-2xl hover:bg-gray-800 transition-colors duration-300"
                  >
                    Sign Up
                  </button>
                </Link>
              </div>

              {/* Pro Plan */}
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-12 shadow-2xl hover:shadow-3xl transition-all duration-300 group relative overflow-hidden">
                <div className="absolute top-6 right-6 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-bold">
                  NEW & UPGRADED
                </div>
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-8">
                  <ChartBarIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-black text-white mb-4">PRO</h3>
                <p className="text-white/90 mb-8 text-lg">Access industry-leading tools designed to raise your profile and turn your music into more money.</p>
                <div className="text-6xl font-black text-white mb-8">$20<span className="text-2xl text-white/70">/year</span></div>
                <ul className="text-left space-y-4 mb-12">
                  <li className="flex items-center text-white">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                    Everything in Free
                  </li>
                  <li className="flex items-center text-white">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                    Upload albums & EPs
                  </li>
                  <li className="flex items-center text-white">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                    Advanced analytics
                  </li>
                  <li className="flex items-center text-white">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                    HyperFollow pages
                  </li>
                </ul>
                <Link href="/register" passHref>
                  <button 
                    onClick={() => handleButtonClick("pro_plan")}
                    className="w-full py-4 bg-white text-blue-600 font-bold text-lg rounded-2xl hover:bg-gray-100 transition-colors duration-300"
                  >
                    Upgrade Now
                  </button>
                </Link>
              </div>

              {/* Label Plan */}
              <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
                  <UsersIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-4">LABELS</h3>
                <p className="text-gray-600 mb-8 text-lg">Everything you need to manage multiple artists and unlock new revenue streams for your label.</p>
                <div className="text-6xl font-black text-gray-900 mb-8">$80<span className="text-2xl text-gray-500">/year</span></div>
                <ul className="text-left space-y-4 mb-12">
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Everything in Pro
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Up to 100 artists
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Priority support
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Custom label pages
                  </li>
                </ul>
                <Link href="/register" passHref>
                  <button 
                    onClick={() => handleButtonClick("label_plan")}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-colors duration-300"
                  >
                    Launch a Label
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Hall of Fame Section */}
        <section className="py-32 px-4 bg-gray-900">
          <div className="container mx-auto text-center">
            <div className="mb-20">
              <h2 className="text-2xl font-bold text-gray-400 mb-4 uppercase tracking-widest">HALL OF FAME</h2>
              <h3 className="text-6xl font-black text-white mb-8">
                Some of the <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">biggest artists in the game</span> started their careers at Kushtunes.
              </h3>
              <p className="text-2xl text-gray-400">Think you could be the next to join our Hall of Fame?</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 max-w-7xl mx-auto">
              {hallOfFame.map((artist, index) => (
                <div key={index} className="text-center group">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white font-black text-2xl group-hover:scale-110 transition-transform duration-300">
                    {artist.name.split(' ').map(n => n[0]).join('')}
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
        <section className="py-32 px-4 bg-white">
          <div className="container mx-auto text-center">
            <h2 className="text-6xl font-black text-gray-900 mb-8">
              What <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Our Artists</span> Say.
            </h2>
            <p className="text-2xl text-gray-600 mb-20 max-w-3xl mx-auto">
              Join thousands of satisfied artists who trust Kushtunes
            </p>

            <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-gray-50 rounded-3xl p-12 hover:shadow-xl transition-all duration-300 group">
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
        <section className="py-32 px-4 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
          <div className="container mx-auto text-center">
            <h2 className="text-6xl font-black text-white mb-8">
              Ready to Get Started?
            </h2>
            <p className="text-2xl text-white/80 mb-12 max-w-3xl mx-auto">
              Join thousands of artists who trust Kushtunes for their music distribution
            </p>
            <Link href="/register" passHref>
              <button 
                onClick={() => handleButtonClick("final_cta")}
                className="px-16 py-6 bg-white text-gray-900 font-bold text-xl rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
              >
                Join Kushtunes Today
              </button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-white mb-4">Kushtunes</h3>
              <p className="text-gray-400 mb-8">Professional music distribution platform for artists worldwide</p>
              <div className="text-gray-500 text-sm">
                © 2025 Kushtunes. All rights reserved.
              </div>
              <div className="flex justify-center space-x-8 mt-4">
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms</Link>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy</Link>
                <Link href="/dmca" className="text-gray-400 hover:text-white transition-colors">DMCA</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
