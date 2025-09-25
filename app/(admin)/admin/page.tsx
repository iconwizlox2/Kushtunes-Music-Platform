"use client";

import { useState, useEffect } from 'react';
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
      <div className="min-h-screen clean-bg-gray flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen clean-bg-gray flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load analytics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen clean-bg-gray">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-4 py-2 text-sm font-medium text-primary-blue mb-6">
            <ChartBarIcon className="h-4 w-4" />
            Admin Dashboard
          </div>
          
          <h1 className="heading-lg text-gray-900 mb-6">
            Platform Analytics
            <span className="block text-gradient">Real-time Insights</span>
          </h1>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="card hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.overview.totalUsers.toLocaleString()}</p>
                <p className="text-green-600 text-sm">+{analytics.overview.newUsersToday} today</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary-blue flex items-center justify-center">
                <UsersIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="card hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Releases</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.overview.totalReleases.toLocaleString()}</p>
                <p className="text-green-600 text-sm">+{analytics.overview.releasesToday} today</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center">
                <MusicalNoteIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="card hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Streams</p>
                <p className="text-3xl font-bold text-gray-900">{(analytics.overview.totalStreams / 1000000).toFixed(1)}M</p>
                <p className="text-green-600 text-sm">+12.5% this month</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center">
                <EyeIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="card hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">${(analytics.overview.totalRevenue / 1000).toFixed(0)}K</p>
                <p className="text-green-600 text-sm">+${analytics.overview.revenueToday} today</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-yellow-500 flex items-center justify-center">
                <CurrencyDollarIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Users Growth Chart */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary-blue flex items-center justify-center">
                <TrendingUpIcon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Users Growth</h3>
            </div>
            <div className="h-64 flex items-end justify-between gap-2">
              {analytics.charts.usersGrowth.map((item, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div 
                    className="w-8 bg-primary-blue rounded-t"
                    style={{ height: `${(item.users / 1500) * 200}px` }}
                  ></div>
                  <span className="text-xs text-gray-600">{item.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Growth Chart */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center">
                <CurrencyDollarIcon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Revenue Growth</h3>
            </div>
            <div className="h-64 flex items-end justify-between gap-2">
              {analytics.charts.revenueGrowth.map((item, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div 
                    className="w-8 bg-green-600 rounded-t"
                    style={{ height: `${(item.revenue / 50000) * 200}px` }}
                  ></div>
                  <span className="text-xs text-gray-600">{item.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Genres and Countries */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Top Genres */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center">
                <MusicalNoteIcon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Top Genres</h3>
            </div>
            <div className="space-y-4">
              {analytics.charts.topGenres.map((genre, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium">{genre.genre}</p>
                      <p className="text-gray-600 text-sm">{genre.releases} releases</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-900 font-medium">{(genre.streams / 1000000).toFixed(1)}M</p>
                    <p className="text-gray-600 text-sm">streams</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Countries */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-yellow-500 flex items-center justify-center">
                <UsersIcon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Top Countries</h3>
            </div>
            <div className="space-y-4">
              {analytics.charts.topCountries.map((country, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-yellow-500 flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium">{country.country}</p>
                      <p className="text-gray-600 text-sm">{country.users} users</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-900 font-medium">${(country.revenue / 1000).toFixed(0)}K</p>
                    <p className="text-gray-600 text-sm">revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary-blue flex items-center justify-center">
              <InformationCircleIcon className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="space-y-4">
            {analytics.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
                <div className={`w-3 h-3 rounded-full ${
                  activity.status === 'success' ? 'bg-green-500' :
                  activity.status === 'processing' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-gray-900">{activity.message}</p>
                  <p className="text-gray-600 text-sm">{new Date(activity.timestamp).toLocaleString()}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  activity.status === 'success' ? 'bg-green-100 text-green-700' :
                  activity.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {activity.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}