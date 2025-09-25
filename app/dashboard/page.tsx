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
}

export default function DashboardPage() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalReleases: 0,
    totalStreams: 0,
    totalRevenue: 0,
    liveDistributions: 0,
    pendingDistributions: 0
  });

  useEffect(() => {
    fetchReleases();
  }, []);

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
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your music releases and distribution</p>
          </div>
          <ProfessionalButton variant="primary" asChild>
            <Link href="/upload">
              <PlusIcon className="h-5 w-5 mr-2" />
              Upload New Release
            </Link>
          </ProfessionalButton>
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

        {/* Releases List */}
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
              {releases.map((release) => (
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
                      
                      {/* Distribution Status */}
                      {release.distributions.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <p className="text-sm font-medium text-gray-700">Distributions:</p>
                          {release.distributions.map((dist) => (
                            <div key={dist.id} className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">{dist.dspName}</span>
                              <div className="flex items-center space-x-2">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(dist.status)}`}>
                                  {getStatusIcon(dist.status)}
                                  <span className="ml-1">{dist.status}</span>
                                </span>
                                {dist.streams && dist.streams > 0 && (
                                  <span className="text-xs text-gray-500">
                                    {dist.streams.toLocaleString()} streams
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </ProfessionalCard>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProfessionalLayout>
  );
}