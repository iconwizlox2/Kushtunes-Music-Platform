"use client";

import { useState, useEffect } from 'react';
import { ModernLayout } from '@/components/ModernLayout';
import { 
  ChartBarIcon, 
  UsersIcon, 
  MusicalNoteIcon, 
  CurrencyDollarIcon,
  TrendingUpIcon,
  EyeIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@/components/ui/Icons';

interface AnalyticsData {
  overview: {
    totalUsers: number;
    totalReleases: number;
    totalStreams: number;
    totalRevenue: number;
    activeUsers: number;
    newUsersToday: number;
    releasesToday: number;
    revenueToday: number;
  };
  charts: {
    usersGrowth: Array<{ month: string; users: number }>;
    revenueGrowth: Array<{ month: string; revenue: number }>;
    topGenres: Array<{ genre: string; releases: number; streams: number }>;
    topCountries: Array<{ country: string; users: number; revenue: number }>;
  };
  recentActivity: Array<{
    id: string;
    type: string;
    message: string;
    timestamp: Date;
    status: string;
  }>;
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics');
      const data = await response.json();
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ModernLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-300">Loading analytics...</p>
          </div>
        </div>
      </ModernLayout>
    );
  }

  if (!analytics) {
    return (
      <ModernLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <p className="text-gray-300">Failed to load analytics</p>
          </div>
        </div>
      </ModernLayout>
    );
  }

  return (
    <ModernLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-20 float-animation blur-xl"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full opacity-20 float-animation-delayed blur-xl"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-20 float-animation blur-xl"></div>

        <div className="relative py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-500/30 px-4 py-2 text-sm font-medium text-blue-300 backdrop-blur-sm mb-6">
                <ChartBarIcon className="h-4 w-4" />
                Admin Dashboard
              </div>
              
              <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl mb-6">
                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Platform Analytics
                </span>
                <br />
                <span className="text-white">Real-time Insights</span>
              </h1>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="premium-card rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Total Users</p>
                    <p className="text-3xl font-bold text-white">{analytics.overview.totalUsers.toLocaleString()}</p>
                    <p className="text-green-400 text-sm">+{analytics.overview.newUsersToday} today</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <UsersIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="premium-card rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Total Releases</p>
                    <p className="text-3xl font-bold text-white">{analytics.overview.totalReleases.toLocaleString()}</p>
                    <p className="text-green-400 text-sm">+{analytics.overview.releasesToday} today</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                    <MusicalNoteIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="premium-card rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Total Streams</p>
                    <p className="text-3xl font-bold text-white">{(analytics.overview.totalStreams / 1000000).toFixed(1)}M</p>
                    <p className="text-green-400 text-sm">+12.5% this month</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <EyeIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="premium-card rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Total Revenue</p>
                    <p className="text-3xl font-bold text-white">${(analytics.overview.totalRevenue / 1000).toFixed(0)}K</p>
                    <p className="text-green-400 text-sm">+${analytics.overview.revenueToday} today</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
                    <CurrencyDollarIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {/* Users Growth Chart */}
              <div className="premium-card rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <TrendingUpIcon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Users Growth</h3>
                </div>
                <div className="h-64 flex items-end justify-between gap-2">
                  {analytics.charts.usersGrowth.map((item, index) => (
                    <div key={index} className="flex flex-col items-center gap-2">
                      <div 
                        className="w-8 bg-gradient-to-t from-blue-500 to-purple-600 rounded-t"
                        style={{ height: `${(item.users / 4000) * 200}px` }}
                      ></div>
                      <span className="text-xs text-gray-400">{item.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Revenue Growth Chart */}
              <div className="premium-card rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <CurrencyDollarIcon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Revenue Growth</h3>
                </div>
                <div className="h-64 flex items-end justify-between gap-2">
                  {analytics.charts.revenueGrowth.map((item, index) => (
                    <div key={index} className="flex flex-col items-center gap-2">
                      <div 
                        className="w-8 bg-gradient-to-t from-green-500 to-emerald-600 rounded-t"
                        style={{ height: `${(item.revenue / 30000) * 200}px` }}
                      ></div>
                      <span className="text-xs text-gray-400">{item.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Genres and Countries */}
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {/* Top Genres */}
              <div className="premium-card rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                    <MusicalNoteIcon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Top Genres</h3>
                </div>
                <div className="space-y-4">
                  {analytics.charts.topGenres.map((genre, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-white font-medium">{genre.genre}</p>
                          <p className="text-gray-400 text-sm">{genre.releases} releases</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">{(genre.streams / 1000000).toFixed(1)}M</p>
                        <p className="text-gray-400 text-sm">streams</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Countries */}
              <div className="premium-card rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
                    <UsersIcon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Top Countries</h3>
                </div>
                <div className="space-y-4">
                  {analytics.charts.topCountries.map((country, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-white font-medium">{country.country}</p>
                          <p className="text-gray-400 text-sm">{country.users} users</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">${(country.revenue / 1000).toFixed(0)}K</p>
                        <p className="text-gray-400 text-sm">revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="premium-card rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <InformationCircleIcon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Recent Activity</h3>
              </div>
              <div className="space-y-4">
                {analytics.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700">
                    <div className={`w-3 h-3 rounded-full ${
                      activity.status === 'success' ? 'bg-green-500' :
                      activity.status === 'processing' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-white">{activity.message}</p>
                      <p className="text-gray-400 text-sm">{activity.timestamp.toLocaleString()}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      activity.status === 'success' ? 'bg-green-500/20 text-green-400' :
                      activity.status === 'processing' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {activity.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModernLayout>
  );
}

