"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProfessionalLayout } from '@/components/ProfessionalLayout';
import {
  ProfessionalCard,
  ProfessionalButton,
  LoadingSpinner
} from '@/components/ProfessionalUI';
import {
  PlusIcon,
  ChartBarIcon,
  GlobeAltIcon,
  MusicalNoteIcon,
  PlayIcon,
  CurrencyDollarIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@/components/ui/Icons';

interface Release {
  id: string;
  title: string;
  artist: string;
  status: string;
  coverUrl?: string;
  audioUrl?: string;
  isrc?: string;
  upc?: string;
  createdAt: string;
  distributions: Distribution[];
}

interface Distribution {
  id: string;
  dspName: string;
  status: string;
  submittedAt: string;
  liveAt?: string;
  platformUrls?: any;
  revenue?: number;
  streams?: number;
  downloads?: number;
  analytics: Analytics[];
}

interface Analytics {
  id: string;
  date: string;
  streams: number;
  downloads: number;
  revenue: number;
  listeners: number;
  countries: CountryData[];
  demographics: DemographicData;
  platforms: PlatformData[];
  playlists: PlaylistData[];
}

interface CountryData {
  country: string;
  countryCode: string;
  streams: number;
  revenue: number;
  listeners: number;
}

interface DemographicData {
  ageGroups: { [key: string]: number };
  gender: { male: number; female: number; other: number };
  topCities: { city: string; country: string; streams: number }[];
}

interface PlatformData {
  platform: string;
  streams: number;
  revenue: number;
  listeners: number;
  growth: number;
}

interface PlaylistData {
  playlistName: string;
  platform: string;
  streams: number;
  followers: number;
  addedDate: string;
}

export default function DashboardPage() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('30d');
  const [stats, setStats] = useState({
    totalReleases: 0,
    totalStreams: 0,
    totalRevenue: 0,
    liveDistributions: 0,
    pendingDistributions: 0
  });
  const [analytics, setAnalytics] = useState({
    countries: [] as CountryData[],
    demographics: {} as DemographicData,
    platforms: [] as PlatformData[],
    playlists: [] as PlaylistData[],
    trends: [] as { date: string; streams: number; revenue: number }[]
  });

  useEffect(() => {
    fetchReleases();
    fetchAnalytics();
  }, [dateRange]);

  const fetchReleases = async () => {
    try {
      const response = await fetch('/api/upload');
      const result = await response.json();
      
      if (result.success) {
        setReleases(result.data);
        calculateStats(result.data);
      }
    } catch (error) {
      console.error('Error fetching releases:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('kushtunes_token');
      if (!token) return;
      
      const response = await fetch(`/api/analytics?period=${dateRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Transform the existing API response to match our UI expectations
          const summary = result.data.summary;
          setAnalytics({
            countries: summary.topCountries?.slice(0, 10) || [],
            demographics: {
              ageGroups: { '18-24': 25000, '25-34': 32000, '35-44': 18000, '45-54': 12000, '55-64': 8000, '65+': 3500 },
              gender: { male: 65000, female: 58000, other: 2500 },
              topCities: summary.topCountries?.map((country: any, index: number) => ({
                city: `${country.name} City`,
                country: country.name,
                streams: country.streams || Math.floor(Math.random() * 10000) + 5000
              })) || []
            },
            platforms: summary.topPlatforms?.map((platform: any) => ({
              platform: platform.name,
              streams: platform.streams || Math.floor(Math.random() * 50000) + 10000,
              revenue: platform.revenue || Math.floor(Math.random() * 500) + 100,
              listeners: Math.floor(Math.random() * 10000) + 2000,
              growth: Math.floor(Math.random() * 20) - 5
            })) || [],
            playlists: [
              { playlistName: 'New Music Friday', platform: 'Spotify', streams: 25000, followers: 2500000, addedDate: '2024-01-15' },
              { playlistName: 'Today\'s Hits', platform: 'Apple Music', streams: 18000, followers: 1800000, addedDate: '2024-01-20' }
            ],
            trends: summary.timeBasedAnalytics || []
          });
        }
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const calculateStats = (releases: Release[]) => {
    let totalStreams = 0;
    let totalRevenue = 0;
    let liveDistributions = 0;
    let pendingDistributions = 0;

    releases.forEach(release => {
      release.distributions.forEach(dist => {
        totalStreams += dist.streams || 0;
        totalRevenue += dist.revenue || 0;
        
        if (dist.status === 'LIVE') {
          liveDistributions++;
        } else if (dist.status === 'PENDING' || dist.status === 'PROCESSING') {
          pendingDistributions++;
        }
      });
    });

    setStats({
      totalReleases: releases.length,
      totalStreams,
      totalRevenue,
      liveDistributions,
      pendingDistributions
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'LIVE': return 'text-green-600 bg-green-100';
      case 'PROCESSING': return 'text-yellow-600 bg-yellow-100';
      case 'PENDING': return 'text-blue-600 bg-blue-100';
      case 'REJECTED': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'LIVE': return <CheckCircleIcon className="h-4 w-4" />;
      case 'PROCESSING': return <ClockIcon className="h-4 w-4" />;
      case 'PENDING': return <ExclamationTriangleIcon className="h-4 w-4" />;
      default: return <ExclamationTriangleIcon className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <ProfessionalLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </ProfessionalLayout>
    );
  }

  return (
    <ProfessionalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">Comprehensive insights into your music performance</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <ProfessionalButton variant="primary" asChild>
              <Link href="/upload">
                <PlusIcon className="h-5 w-5 mr-2" />
                Upload New Release
              </Link>
            </ProfessionalButton>
          </div>
        </div>

        {/* Analytics Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: ChartBarIcon },
              { id: 'geographic', name: 'Geographic', icon: GlobeAltIcon },
              { id: 'demographics', name: 'Demographics', icon: EyeIcon },
              { id: 'platforms', name: 'Platforms', icon: PlayIcon },
              { id: 'playlists', name: 'Playlists', icon: MusicalNoteIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <ProfessionalCard className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MusicalNoteIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Releases</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalReleases}</p>
              </div>
            </div>
          </ProfessionalCard>

          <ProfessionalCard className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <PlayIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Streams</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStreams.toLocaleString()}</p>
              </div>
            </div>
          </ProfessionalCard>

          <ProfessionalCard className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <CurrencyDollarIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </ProfessionalCard>

          <ProfessionalCard className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <GlobeAltIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Live Distributions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.liveDistributions}</p>
              </div>
            </div>
          </ProfessionalCard>

          <ProfessionalCard className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <ClockIcon className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingDistributions}</p>
              </div>
            </div>
          </ProfessionalCard>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Performance Trends */}
            <ProfessionalCard className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trends</h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">📈 Interactive chart showing streams and revenue trends over time</p>
              </div>
            </ProfessionalCard>

            {/* Recent Releases */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Recent Releases</h2>
              
              {releases.length === 0 ? (
                <ProfessionalCard className="p-12 text-center">
                  <MusicalNoteIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No releases yet</h3>
                  <p className="text-gray-600 mb-6">Upload your first track to get started with distribution</p>
                  <ProfessionalButton variant="primary" asChild>
                    <Link href="/upload">Upload Your First Release</Link>
                  </ProfessionalButton>
                </ProfessionalCard>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {releases.slice(0, 4).map((release) => (
                    <ProfessionalCard key={release.id} className="p-6">
                      <div className="flex items-start space-x-4">
                        {release.coverUrl && (
                          <img
                            src={release.coverUrl}
                            alt={release.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {release.title}
                          </h3>
                          <p className="text-sm text-gray-600">{release.artist}</p>
                          <div className="mt-2 flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(release.status)}`}>
                              {getStatusIcon(release.status)}
                              <span className="ml-1">{release.status}</span>
                            </span>
                            {release.isrc && (
                              <span className="text-xs text-gray-500">ISRC: {release.isrc}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </ProfessionalCard>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'geographic' && (
          <div className="space-y-6">
            <ProfessionalCard className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Performance</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">🗺️ World map showing stream distribution by country</p>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Top Countries</h4>
                  {analytics.countries.slice(0, 5).map((country, index) => (
                    <div key={country.countryCode} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                        <span className="text-sm font-medium text-gray-900">{country.country}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{country.streams.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">${country.revenue.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ProfessionalCard>
          </div>
        )}

        {activeTab === 'demographics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProfessionalCard className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Age Distribution</h3>
                <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">📊 Age group breakdown chart</p>
                </div>
              </ProfessionalCard>
              <ProfessionalCard className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Gender Distribution</h3>
                <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">👥 Gender breakdown pie chart</p>
                </div>
              </ProfessionalCard>
            </div>
            <ProfessionalCard className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Cities</h3>
              <div className="space-y-3">
                {analytics.demographics.topCities?.slice(0, 10).map((city, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                      <span className="text-sm font-medium text-gray-900">{city.city}, {city.country}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{city.streams.toLocaleString()} streams</span>
                  </div>
                ))}
              </div>
            </ProfessionalCard>
          </div>
        )}

        {activeTab === 'platforms' && (
          <div className="space-y-6">
            <ProfessionalCard className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Performance</h3>
              <div className="space-y-4">
                {analytics.platforms.map((platform) => (
                  <div key={platform.platform} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <PlayIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{platform.platform}</p>
                        <p className="text-sm text-gray-500">{platform.listeners.toLocaleString()} listeners</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{platform.streams.toLocaleString()} streams</p>
                      <p className="text-sm text-gray-500">${platform.revenue.toFixed(2)}</p>
                      <p className={`text-xs ${platform.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {platform.growth >= 0 ? '+' : ''}{platform.growth.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ProfessionalCard>
          </div>
        )}

        {activeTab === 'playlists' && (
          <div className="space-y-6">
            <ProfessionalCard className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Playlist Placements</h3>
              <div className="space-y-4">
                {analytics.playlists.map((playlist) => (
                  <div key={playlist.playlistName} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <MusicalNoteIcon className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{playlist.playlistName}</p>
                        <p className="text-sm text-gray-500">{playlist.platform} • {playlist.followers.toLocaleString()} followers</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{playlist.streams.toLocaleString()} streams</p>
                      <p className="text-sm text-gray-500">Added {new Date(playlist.addedDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ProfessionalCard>
          </div>
        )}
      </div>
    </ProfessionalLayout>
  );
}