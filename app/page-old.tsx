"use client";

import Link from 'next/link';
import { MusicalNoteIcon, GlobeAltIcon, ChartBarIcon, ShieldCheckIcon, ArrowRightIcon, UsersIcon, PhotoIcon } from '@/components/ui/Icons';
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
    // Track button clicks for analytics
    console.log(`Button clicked: ${action}`);
    // You can add analytics tracking here
  };

  const features = [
    {
      icon: <MusicalNoteIcon className="h-8 w-8 text-primary-blue" />,
      title: "Multi-Track Upload",
      description: "Upload singles, EPs, and albums with advanced file validation and processing",
    },
    {
      icon: <GlobeAltIcon className="h-8 w-8 text-primary-blue" />,
      title: "Smart Distribution",
      description: "Automatic UPC/ISRC generation and platform-specific optimization",
    },
    {
      icon: <ChartBarIcon className="h-8 w-8 text-primary-blue" />,
      title: "Advanced Analytics",
      description: "Real-time streaming data, revenue tracking, and performance insights",
    },
    {
      icon: <ShieldCheckIcon className="h-8 w-8 text-primary-blue" />,
      title: "Transparent Earnings",
      description: "Platform-specific payout rates with country-based multipliers",
    },
    {
      icon: <UsersIcon className="h-8 w-8 text-primary-blue" />,
      title: "Instant Payouts",
      description: "Request payouts with automatic fee calculations and processing",
    },
    {
      icon: <PhotoIcon className="h-8 w-8 text-primary-blue" />,
      title: "Professional Tools",
      description: "Release management, metadata validation, and distribution tracking",
    },
  ];

  const stats = [
    { number: "50,000+", label: "Artists" },
    { number: "1M+", label: "Releases" },
    { number: "180+", label: "Platforms" },
    { number: "200+", label: "Countries" }
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 mb-8 animate-fade-in">
              <MusicalNoteIcon className="h-4 w-4 mr-2 text-blue-600" />
              Trusted by 50,000+ artists worldwide
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 animate-fade-in">
              Professional Music
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Distribution Platform
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 animate-fade-in max-w-3xl mx-auto leading-relaxed">
              Upload singles, EPs, and albums with advanced validation. Track earnings with platform-specific rates and request instant payouts.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6 animate-fade-in">
              <Link href={isLoggedIn ? "/upload" : "/register"} passHref>
                <button 
                  onClick={() => handleButtonClick(isLoggedIn ? "upload_music" : "get_started_free")}
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  <span className="relative z-10">
                    {isLoggedIn ? "Upload Your Music" : "Get Started Free"}
                  </span>
                  <ArrowRightIcon className="h-5 w-5 ml-2 inline-block group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              </Link>
              {!isLoggedIn && (
                <Link href="/login" passHref>
                  <button 
                    onClick={() => handleButtonClick("sign_in")}
                    className="px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-white hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                  >
                    Sign In
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 group-hover:-translate-y-2">
                  <p className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">{stat.number}</p>
                  <p className="text-lg font-medium text-gray-700">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6 animate-fade-in">
              Why Choose <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Kushtunes</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in">
              We provide everything you need to succeed in the music industry
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-up border border-white/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-6 flex justify-center">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-4 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6 animate-fade-in">
              Simple, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Transparent</span> Pricing
            </h2>
            <p className="text-xl text-gray-600 animate-fade-in">
              No hidden fees. No long-term contracts. Just great value.
            </p>
          </div>

          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center animate-fade-in-up hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-white/20">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Free</h3>
              <div className="text-5xl font-bold text-gray-900 mb-6">
                $0<span className="text-xl text-gray-500">/year</span>
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
              <Link href={isLoggedIn ? "/upload" : "/register"} passHref>
                <button 
                  onClick={() => handleButtonClick("free_plan")}
                  className="w-full px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors duration-300"
                >
                  Get Started Free
                </button>
              </Link>
            </div>

            {/* Musician Plan */}
            <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 text-center relative animate-fade-in-up hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-blue-200">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  MOST POPULAR
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Musician</h3>
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                $20<span className="text-xl text-gray-500">/year</span>
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
              <Link href={isLoggedIn ? "/upload" : "/register"} passHref>
                <button 
                  onClick={() => handleButtonClick("musician_plan")}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  Choose Musician
                </button>
              </Link>
            </div>

            {/* Label Plan */}
            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center animate-fade-in-up hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-white/20">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Label</h3>
              <div className="text-5xl font-bold text-gray-900 mb-6">
                $80<span className="text-xl text-gray-500">/year</span>
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
              <Link href={isLoggedIn ? "/upload" : "/register"} passHref>
                <button 
                  onClick={() => handleButtonClick("label_plan")}
                  className="w-full px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors duration-300"
                >
                  Choose Label
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6 animate-fade-in">
              How It <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-xl text-gray-600 animate-fade-in">
              Get your music distributed in just a few simple steps
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-12">
            <div className="text-center group animate-fade-in-up">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Upload Your Music</h3>
              <p className="text-gray-600 leading-relaxed">Upload your audio files and cover art through our secure platform</p>
            </div>
            <div className="text-center group animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">We Distribute</h3>
              <p className="text-gray-600 leading-relaxed">We send your music to all major streaming platforms and stores</p>
            </div>
            <div className="text-center group animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Track & Get Paid</h3>
              <p className="text-gray-600 leading-relaxed">Monitor your success and receive payments for your streams</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6 animate-fade-in">
              What Artists <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Say</span>
            </h2>
            <p className="text-xl text-gray-600 animate-fade-in">
              Join thousands of satisfied artists who trust Kushtunes
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  A
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-gray-900">Alex Johnson</h4>
                  <p className="text-gray-600 text-sm">Independent Artist</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                "Kushtunes made it incredibly easy to distribute my music globally. The analytics are detailed and the payout process is transparent. I've earned more in 6 months than I did in 2 years with other platforms."
              </p>
              <div className="flex text-yellow-400 mt-4">
                {'★'.repeat(5)}
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  M
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-gray-900">Maria Santos</h4>
                  <p className="text-gray-600 text-sm">Electronic Producer</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                "The upload process is smooth and the platform handles all the technical details. My tracks are now on 180+ platforms worldwide. The customer support is also excellent!"
              </p>
              <div className="flex text-yellow-400 mt-4">
                {'★'.repeat(5)}
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  D
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-gray-900">David Chen</h4>
                  <p className="text-gray-600 text-sm">Hip-Hop Artist</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                "From the Nile to the World - this platform truly delivers on that promise. My music has reached audiences I never thought possible. The revenue tracking is crystal clear."
              </p>
              <div className="flex text-yellow-400 mt-4">
                {'★'.repeat(5)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6 animate-fade-in">
              Frequently Asked <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Questions</span>
            </h2>
            <p className="text-xl text-gray-600 animate-fade-in">
              Everything you need to know about Kushtunes
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg animate-fade-in-up">
              <h3 className="text-xl font-bold text-gray-900 mb-4">How much does it cost?</h3>
              <p className="text-gray-600 leading-relaxed">
                We offer a free plan for unlimited singles, and paid plans starting at $20/year for albums and EPs. No hidden fees, no long-term contracts.
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-xl font-bold text-gray-900 mb-4">How long does distribution take?</h3>
              <p className="text-gray-600 leading-relaxed">
                Most platforms receive your music within 24-48 hours. Streaming services typically take 1-2 weeks to go live, while stores may take 2-4 weeks.
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Do I keep my rights?</h3>
              <p className="text-gray-600 leading-relaxed">
                Yes! You retain 100% ownership of your music and master recording rights. We only distribute your music, we don't own it.
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <h3 className="text-xl font-bold text-gray-900 mb-4">How do I get paid?</h3>
              <p className="text-gray-600 leading-relaxed">
                We collect royalties from all platforms and pay you monthly. You can request instant payouts anytime with automatic fee calculations.
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <h3 className="text-xl font-bold text-gray-900 mb-4">What file formats do you accept?</h3>
              <p className="text-gray-600 leading-relaxed">
                We accept WAV, FLAC, AIFF, and high-quality MP3 files. Cover art should be JPEG or PNG, minimum 3000x3000 pixels.
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Can I distribute covers?</h3>
              <p className="text-gray-600 leading-relaxed">
                Yes, but you need proper licensing. We can help you obtain mechanical licenses for cover songs through our licensing partners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold text-white mb-8 animate-fade-in">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/90 mb-12 animate-fade-in leading-relaxed">
              Join thousands of artists who trust Kushtunes for their music distribution
            </p>
            <Link href={isLoggedIn ? "/upload" : "/register"} passHref>
              <button 
                onClick={() => handleButtonClick(isLoggedIn ? "start_uploading_now" : "join_kushtunes_today")}
                className="group px-10 py-5 bg-white text-gray-900 font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <span className="relative z-10">
                  {isLoggedIn ? "Start Uploading Now" : "Join Kushtunes Today"}
                </span>
                <ArrowRightIcon className="h-6 w-6 ml-3 inline-block group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gray-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 bg-gray-900 text-white">
        <div className="container mx-auto text-center">
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-2">Kushtunes</h3>
            <p className="text-gray-400">Professional music distribution platform for artists worldwide</p>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <p className="text-gray-400 mb-2">&copy; {new Date().getFullYear()} Kushtunes. All rights reserved.</p>
            <div className="flex justify-center space-x-6 text-sm text-gray-500">
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/dmca" className="hover:text-white transition-colors">DMCA</Link>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
}