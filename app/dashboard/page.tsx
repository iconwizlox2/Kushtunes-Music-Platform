"use client";

import { useState, useEffect } from 'react';
import { ProfessionalLayout } from '@/components/ProfessionalLayout';
import {
  ProfessionalCard,
  ProfessionalButton,
  StatsCard,
  Table,
  Badge,
  LoadingSpinner
} from '@/components/ProfessionalUI';
import {
  CloudArrowUpIcon,
  EyeIcon,
  DollarSignIcon,
  TrendingUpIcon,
  MusicalNoteIcon,
  PlayIcon,
  PauseIcon,
  TrashIcon,
  PencilIcon,
  ChartBarIcon
} from '@/components/ui/Icons';

interface Release {
  id: string;
  title: string;
  artist: string;
  status: 'draft' | 'processing' | 'ready' | 'live';
  releaseDate: string;
  coverUrl?: string;
  streams: number;
  downloads: number;
  revenue: number;
  platforms: string[];
}

interface Analytics {
  totalReleases: number;
  totalStreams: number;
  totalDownloads: number;
  totalRevenue: number;
  monthlyGrowth: {
    streams: number;
    downloads: number;
    revenue: number;
  };
}

export default function Dashboard() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch releases
      const releasesResponse = await fetch('/api/releases');
      const releasesData = await releasesResponse.json();
      
      // Fetch analytics
      const analyticsResponse = await fetch('/api/analytics');
      const analyticsData = await analyticsResponse.json();
      
      setReleases(releasesData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { variant: 'default' as const, label: 'Draft' },
      processing: { variant: 'warning' as const, label: 'Processing' },
      ready: { variant: 'info' as const, label: 'Ready' },
      live: { variant: 'success' as const, label: 'Live' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (loading) {
    return (
      <ProfessionalLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
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
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Overview of your music distribution</p>
          </div>
          <ProfessionalButton variant="primary" size="lg">
            <CloudArrowUpIcon className="h-5 w-5 mr-2" />
            New Release
          </ProfessionalButton>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Releases"
            value={analytics?.totalReleases || 0}
            change="+2 this month"
            changeType="positive"
            icon={<MusicalNoteIcon className="h-8 w-8 text-blue-600" />}
          />
          <StatsCard
            title="Total Streams"
            value={formatNumber(analytics?.totalStreams || 0)}
            change={`+${analytics?.monthlyGrowth.streams || 0}%`}
            changeType="positive"
            icon={<PlayIcon className="h-8 w-8 text-green-600" />}
          />
          <StatsCard
            title="Total Downloads"
            value={formatNumber(analytics?.totalDownloads || 0)}
            change={`+${analytics?.monthlyGrowth.downloads || 0}%`}
            changeType="positive"
            icon={<TrendingUpIcon className="h-8 w-8 text-purple-600" />}
          />
          <StatsCard
            title="Total Revenue"
            value={formatCurrency(analytics?.totalRevenue || 0)}
            change={`+${analytics?.monthlyGrowth.revenue || 0}%`}
            changeType="positive"
            icon={<DollarSignIcon className="h-8 w-8 text-yellow-600" />}
          />
        </div>

        {/* Recent Releases */}
        <ProfessionalCard>
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Releases</h2>
          </div>
          <div className="overflow-x-auto">
            <Table
              headers={['Release', 'Status', 'Streams', 'Downloads', 'Revenue', 'Actions']}
              rows={releases.map((release) => [
                <div key={release.id} className="flex items-center">
                  {release.coverUrl ? (
                    <img
                      src={release.coverUrl}
                      alt={release.title}
                      className="h-10 w-10 rounded-lg object-cover mr-3"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center mr-3">
                      <MusicalNoteIcon className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-gray-900">{release.title}</div>
                    <div className="text-sm text-gray-500">{release.artist}</div>
                  </div>
                </div>,
                getStatusBadge(release.status),
                formatNumber(release.streams),
                formatNumber(release.downloads),
                formatCurrency(release.revenue),
                <div key={`actions-${release.id}`} className="flex space-x-2">
                  <ProfessionalButton variant="ghost" size="sm">
                    <PencilIcon className="h-4 w-4" />
                  </ProfessionalButton>
                  <ProfessionalButton variant="ghost" size="sm">
                    <TrashIcon className="h-4 w-4" />
                  </ProfessionalButton>
                </div>
              ])}
            />
          </div>
        </ProfessionalCard>

        {/* Platform Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProfessionalCard>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Platform Distribution</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[
                  { platform: 'Spotify', percentage: 45, color: 'bg-green-500' },
                  { platform: 'Apple Music', percentage: 25, color: 'bg-gray-800' },
                  { platform: 'YouTube Music', percentage: 15, color: 'bg-red-500' },
                  { platform: 'Amazon Music', percentage: 10, color: 'bg-orange-500' },
                  { platform: 'Other', percentage: 5, color: 'bg-gray-400' }
                ].map((item) => (
                  <div key={item.platform} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{item.platform}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${item.color}`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-500 w-8">{item.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ProfessionalCard>

          <ProfessionalCard>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Revenue Breakdown</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[
                  { source: 'Streaming', amount: 1250.50, percentage: 65 },
                  { source: 'Downloads', amount: 450.25, percentage: 23 },
                  { source: 'Sync Licensing', amount: 200.00, percentage: 10 },
                  { source: 'Other', amount: 25.75, percentage: 2 }
                ].map((item) => (
                  <div key={item.source} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{item.source}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-blue-500"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-500 w-16">{formatCurrency(item.amount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ProfessionalCard>
        </div>

        {/* Quick Actions */}
        <ProfessionalCard>
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ProfessionalButton variant="outline" className="w-full justify-center">
                <CloudArrowUpIcon className="h-5 w-5 mr-2" />
                Upload New Track
              </ProfessionalButton>
              <ProfessionalButton variant="outline" className="w-full justify-center">
                <ChartBarIcon className="h-5 w-5 mr-2" />
                View Analytics
              </ProfessionalButton>
              <ProfessionalButton variant="outline" className="w-full justify-center">
                <MusicalNoteIcon className="h-5 w-5 mr-2" />
                Manage Releases
              </ProfessionalButton>
            </div>
          </div>
        </ProfessionalCard>
      </div>
    </ProfessionalLayout>
  );
}