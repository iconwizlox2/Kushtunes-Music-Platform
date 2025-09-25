'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProfessionalLayout } from '@/components/ProfessionalLayout';
import {
  ProfessionalCard,
  ProfessionalButton,
  LoadingSpinner
} from '@/components/ProfessionalUI';
import {
  MusicalNoteIcon,
  PlayIcon,
  PauseIcon,
  EyeIcon,
  GlobeAltIcon,
  CalendarIcon,
  ChartBarIcon,
  PlusIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon
} from '@/components/ui/Icons';

interface Release {
  id: string;
  title: string;
  artist: string;
  type: 'SINGLE' | 'EP' | 'ALBUM';
  status: 'DRAFT' | 'READY' | 'PROCESSING' | 'LIVE';
  coverUrl?: string;
  audioUrl?: string;
  genre?: string;
  language?: string;
  releaseDate?: string;
  createdAt: string;
  tracks: Track[];
  distributions: Distribution[];
}

interface Track {
  id: string;
  title: string;
  duration?: number;
  audioUrl: string;
}

interface Distribution {
  id: string;
  dsp: string;
  dspName: string;
  status: 'PENDING' | 'SUBMITTED' | 'PROCESSING' | 'LIVE' | 'REJECTED' | 'FAILED';
  liveAt?: string;
  platformUrls?: any;
  streams?: number;
  downloads?: number;
  revenue?: number;
}

export default function ReleasesPage() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);

  useEffect(() => {
    const loadReleases = async () => {
      try {
        const token = localStorage.getItem('kushtunes_token');
        if (!token) {
          window.location.href = '/login';
          return;
        }

        const response = await fetch('/api/releases', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setReleases(result.data);
          } else {
            setError(result.message || 'Failed to load releases');
          }
        } else {
          setError('Failed to load releases');
        }
      } catch (error) {
        console.error('Releases load error:', error);
        setError('Failed to load releases');
      } finally {
        setLoading(false);
      }
    };

    loadReleases();
  }, []);

  const handlePlayPause = (trackId: string) => {
    if (playingTrack === trackId) {
      setPlayingTrack(null);
    } else {
      setPlayingTrack(trackId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'LIVE': return 'bg-green-100 text-green-800';
      case 'PROCESSING': return 'bg-yellow-100 text-yellow-800';
      case 'READY': return 'bg-blue-100 text-blue-800';
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDistributionStatusColor = (status: string) => {
    switch (status) {
      case 'LIVE': return 'bg-green-100 text-green-800';
      case 'PROCESSING': return 'bg-yellow-100 text-yellow-800';
      case 'SUBMITTED': return 'bg-blue-100 text-blue-800';
      case 'PENDING': return 'bg-gray-100 text-gray-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <ProfessionalLayout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </ProfessionalLayout>
    );
  }

  if (error) {
    return (
      <ProfessionalLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Releases</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <ProfessionalButton variant="primary" onClick={() => window.location.reload()}>
              Try Again
            </ProfessionalButton>
          </div>
        </div>
      </ProfessionalLayout>
    );
  }

  return (
    <ProfessionalLayout>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Releases</h1>
            <p className="text-gray-600 mt-2">Manage and track your music releases</p>
          </div>
          <ProfessionalButton variant="primary" asChild>
            <Link href="/upload">
              <PlusIcon className="h-5 w-5 mr-2" />
              Upload New Release
            </Link>
          </ProfessionalButton>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <ProfessionalCard className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MusicalNoteIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Releases</p>
                <p className="text-2xl font-bold text-gray-900">{releases.length}</p>
              </div>
            </div>
          </ProfessionalCard>

          <ProfessionalCard className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <GlobeAltIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Live Releases</p>
                <p className="text-2xl font-bold text-gray-900">
                  {releases.filter(r => r.status === 'LIVE').length}
                </p>
              </div>
            </div>
          </ProfessionalCard>

          <ProfessionalCard className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Streams</p>
                <p className="text-2xl font-bold text-gray-900">
                  {releases.reduce((sum, r) => 
                    sum + r.distributions.reduce((dSum, d) => dSum + (d.streams || 0), 0), 0
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          </ProfessionalCard>

          <ProfessionalCard className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CalendarIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {releases.filter(r => {
                    const releaseDate = new Date(r.createdAt);
                    const now = new Date();
                    return releaseDate.getMonth() === now.getMonth() && 
                           releaseDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
            </div>
          </ProfessionalCard>
        </div>

        {/* Releases List */}
        {releases.length === 0 ? (
          <ProfessionalCard className="p-12 text-center">
            <MusicalNoteIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Releases Yet</h3>
            <p className="text-gray-600 mb-6">Start your music journey by uploading your first release</p>
            <ProfessionalButton variant="primary" asChild>
              <Link href="/upload">
                <PlusIcon className="h-5 w-5 mr-2" />
                Upload Your First Release
              </Link>
            </ProfessionalButton>
          </ProfessionalCard>
        ) : (
          <div className="space-y-6">
            {releases.map((release) => (
              <ProfessionalCard key={release.id} className="p-6">
                <div className="flex items-start space-x-6">
                  {/* Cover Art */}
                  <div className="flex-shrink-0">
                    {release.coverUrl ? (
                      <img
                        src={release.coverUrl}
                        alt={release.title}
                        className="h-24 w-24 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-24 w-24 rounded-lg bg-gray-200 flex items-center justify-center">
                        <MusicalNoteIcon className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Release Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {release.title}
                        </h3>
                        <p className="text-sm text-gray-600">{release.artist}</p>
                        <div className="flex items-center mt-2 space-x-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(release.status)}`}>
                            {release.status}
                          </span>
                          <span className="text-xs text-gray-500">
                            {release.type} • {release.tracks.length} track{release.tracks.length !== 1 ? 's' : ''}
                          </span>
                          {release.genre && (
                            <span className="text-xs text-gray-500">{release.genre}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ProfessionalButton variant="outline" size="sm">
                          <EyeIcon className="h-4 w-4 mr-1" />
                          View
                        </ProfessionalButton>
                        <ProfessionalButton variant="outline" size="sm">
                          <ArrowRightIcon className="h-4 w-4 mr-1" />
                          Edit
                        </ProfessionalButton>
                      </div>
                    </div>

                    {/* Tracks */}
                    {release.tracks.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Tracks</h4>
                        <div className="space-y-2">
                          {release.tracks.map((track, index) => (
                            <div key={track.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <button
                                  onClick={() => handlePlayPause(track.id)}
                                  className="p-1 hover:bg-gray-200 rounded-full"
                                >
                                  {playingTrack === track.id ? (
                                    <PauseIcon className="h-4 w-4 text-gray-600" />
                                  ) : (
                                    <PlayIcon className="h-4 w-4 text-gray-600" />
                                  )}
                                </button>
                                <span className="text-sm text-gray-500">{index + 1}</span>
                                <span className="text-sm font-medium text-gray-900">{track.title}</span>
                                {track.duration && (
                                  <span className="text-xs text-gray-500">
                                    {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Distribution Status */}
                    {release.distributions.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Distribution</h4>
                        <div className="flex flex-wrap gap-2">
                          {release.distributions.map((dist) => (
                            <div key={dist.id} className="flex items-center space-x-2">
                              <span className="text-xs font-medium text-gray-700">{dist.dspName}</span>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getDistributionStatusColor(dist.status)}`}>
                                {dist.status}
                              </span>
                              {dist.streams && (
                                <span className="text-xs text-gray-500">
                                  {dist.streams.toLocaleString()} streams
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </ProfessionalCard>
            ))}
          </div>
        )}
      </div>
    </ProfessionalLayout>
  );
}
