"use client";

import Link from 'next/link';
import { ProfessionalLayout } from '@/components/ProfessionalLayout';
import {
  ProfessionalCard,
  ProfessionalButton,
  StatsCard
} from '@/components/ProfessionalUI';
import {
  CloudArrowUpIcon,
  ChartBarIcon,
  MusicalNoteIcon,
  PlayIcon,
  TrendingUpIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  ClockIcon
} from '@/components/ui/Icons';

export default function Home() {
  const features = [
    {
      icon: <CloudArrowUpIcon className="h-8 w-8 text-blue-600" />,
      title: "Easy Upload",
      description: "Upload your music in minutes with our intuitive interface"
    },
    {
      icon: <GlobeAltIcon className="h-8 w-8 text-green-600" />,
      title: "Global Distribution",
      description: "Reach 180+ platforms worldwide including Spotify, Apple Music, and more"
    },
    {
      icon: <ChartBarIcon className="h-8 w-8 text-purple-600" />,
      title: "Real-time Analytics",
      description: "Track your streams, downloads, and revenue with detailed analytics"
    },
    {
      icon: <ShieldCheckIcon className="h-8 w-8 text-red-600" />,
      title: "Secure & Reliable",
      description: "Your music is protected with industry-standard security measures"
    }
  ];

  const stats = [
    { label: "Artists", value: "50,000+", icon: <MusicalNoteIcon className="h-6 w-6 text-blue-600" /> },
    { label: "Releases", value: "1M+", icon: <PlayIcon className="h-6 w-6 text-green-600" /> },
    { label: "Platforms", value: "180+", icon: <GlobeAltIcon className="h-6 w-6 text-purple-600" /> },
    { label: "Countries", value: "200+", icon: <TrendingUpIcon className="h-6 w-6 text-orange-600" /> }
  ];

  return (
    <ProfessionalLayout>
      <div className="space-y-16">
        {/* Hero Section */}
        <div className="text-center py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Distribute Your Music
              <span className="block text-blue-600">Worldwide</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Get your music on Spotify, Apple Music, and 180+ other platforms. 
              Track your success with real-time analytics and get paid for every stream.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ProfessionalButton variant="primary" size="lg" asChild>
                <Link href="/upload">
                  <CloudArrowUpIcon className="h-5 w-5 mr-2" />
                  Start Uploading
                </Link>
              </ProfessionalButton>
              <ProfessionalButton variant="outline" size="lg" asChild>
                <Link href="/dashboard">
                  <ChartBarIcon className="h-5 w-5 mr-2" />
                  View Dashboard
                </Link>
              </ProfessionalButton>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.label}
              value={stat.value}
              icon={stat.icon}
            />
          ))}
        </div>

        {/* Features Section */}
        <div className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Kushtunes?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide everything you need to succeed in the music industry
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <ProfessionalCard key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </ProfessionalCard>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="py-16 bg-gray-50 rounded-lg">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Get your music distributed in just a few simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Your Music</h3>
              <p className="text-gray-600">
                Upload your audio files and cover art through our secure platform
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">We Distribute</h3>
              <p className="text-gray-600">
                We send your music to all major streaming platforms and stores
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Track & Get Paid</h3>
              <p className="text-gray-600">
                Monitor your success and receive payments for your streams
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center py-16">
          <ProfessionalCard className="max-w-2xl mx-auto">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-gray-600 mb-6">
                Join thousands of artists who trust Kushtunes for their music distribution
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <ProfessionalButton variant="primary" size="lg" asChild>
                  <Link href="/upload">
                    <CloudArrowUpIcon className="h-5 w-5 mr-2" />
                    Upload Your First Track
                  </Link>
                </ProfessionalButton>
                <ProfessionalButton variant="outline" size="lg" asChild>
                  <Link href="/dashboard">
                    <ChartBarIcon className="h-5 w-5 mr-2" />
                    View Analytics
                  </Link>
                </ProfessionalButton>
              </div>
            </div>
          </ProfessionalCard>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 Kushtunes. All rights reserved.</p>
            <p className="mt-2 text-sm">
              Professional music distribution platform for artists worldwide
            </p>
          </div>
        </div>
      </div>
    </ProfessionalLayout>
  );
}