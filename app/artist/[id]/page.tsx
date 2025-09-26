'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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
  GlobeAltIcon,
  CalendarIcon,
  ShareIcon,
  HeartIcon,
  UserGroupIcon,
  ChartBarIcon,
  ExternalLinkIcon
} from '@/components/ui/Icons';

interface Artist {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  coverImage: string;
  location: string;
  genre: string;
  followers: number;
  monthlyListeners: number;
  socialLinks: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    youtube?: string;
    tiktok?: string;
  };
  verified: boolean;
  joinedDate: string;
}

interface Release {
  id: string;
  title: string;
  type: 'SINGLE' | 'EP' | 'ALBUM';
  coverUrl: string;
  releaseDate: string;
  streams: number;
  tracks: Track[];
}

interface Track {
  id: string;
  title: string;
  duration: number;
  streams: number;
}

export default function ArtistProfilePage() {
  const params = useParams();
  const artistId = params?.id as string;
  
  const [artist, setArtist] = useState<Artist | null>(null);
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);

  useEffect(() => {
    fetchArtistData();
  }, [artistId]);

  const fetchArtistData = async () => {
    try {
      // For now, use mock data since we don't have real artist profiles in the database
      const mockArtist = {
        id: artistId,
        name: "Alex Johnson",
        bio: "Independent artist from Los Angeles creating soulful electronic music that blends traditional instruments with modern production techniques. With over 5 years of experience in the music industry, Alex has performed at major festivals and collaborated with renowned producers.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
        coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=400&fit=crop",
        location: "Los Angeles, CA",
        genre: "Electronic Soul",
        followers: 12500,
        monthlyListeners: 45000,
        socialLinks: {
          instagram: "https://instagram.com/alexjohnsonmusic",
          twitter: "https://twitter.com/alexjohnsonmusic",
          youtube: "https://youtube.com/alexjohnsonmusic",
          tiktok: "https://tiktok.com/@alexjohnsonmusic"
        },
        verified: true,
        joinedDate: "2022-03-15"
      };

      const mockReleases: Release[] = [
        {
          id: "1",
          title: "Midnight Dreams",
          type: "ALBUM" as const,
          coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
          releaseDate: "2024-01-15",
          streams: 125000,
          tracks: [
            { id: "1", title: "Midnight Dreams", duration: 240, streams: 45000 },
            { id: "2", title: "City Lights", duration: 195, streams: 32000 },
            { id: "3", title: "Ocean Waves", duration: 210, streams: 28000 },
            { id: "4", title: "Sunset Boulevard", duration: 225, streams: 20000 }
          ]
        },
        {
          id: "2",
          title: "Electric Soul",
          type: "SINGLE" as const,
          coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop",
          releaseDate: "2023-11-20",
          streams: 89000,
          tracks: [
            { id: "5", title: "Electric Soul", duration: 195, streams: 89000 }
          ]
        }
      ];

      setArtist(mockArtist);
      setReleases(mockReleases);
    } catch (error) {
      console.error('Error fetching artist data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = () => {
    setFollowing(!following);
    // In production, this would make an API call to follow/unfollow
  };

  const handlePlayPause = (trackId: string) => {
    if (playingTrack === trackId) {
      setPlayingTrack(null);
    } else {
      setPlayingTrack(trackId);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${artist?.name} - Artist Profile`,
        text: `Check out ${artist?.name} on Kushtunes`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // Show toast notification
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

  if (!artist) {
    return (
      <ProfessionalLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Artist Not Found</h1>
          <p className="text-gray-600 mb-6">The artist you're looking for doesn't exist.</p>
          <ProfessionalButton variant="primary" asChild>
            <Link href="/">Go Home</Link>
          </ProfessionalButton>
        </div>
      </ProfessionalLayout>
    );
  }

  return (
    <ProfessionalLayout>
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="relative">
          <div 
            className="h-64 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl"
            style={{
              backgroundImage: artist.coverImage ? `url(${artist.coverImage})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40 rounded-t-2xl"></div>
          </div>
          
          <div className="relative -mt-16 px-6">
            <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6">
              <img
                src={artist.avatar}
                alt={artist.name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
              
              <div className="flex-1 text-white">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold">{artist.name}</h1>
                  {artist.verified && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center space-x-4 text-sm opacity-90 mb-4">
                  <span className="flex items-center">
                    <UserGroupIcon className="h-4 w-4 mr-1" />
                    {artist.followers.toLocaleString()} followers
                  </span>
                  <span className="flex items-center">
                    <ChartBarIcon className="h-4 w-4 mr-1" />
                    {artist.monthlyListeners.toLocaleString()} monthly listeners
                  </span>
                  <span className="flex items-center">
                    <GlobeAltIcon className="h-4 w-4 mr-1" />
                    {artist.location}
                  </span>
                  <span className="flex items-center">
                    <MusicalNoteIcon className="h-4 w-4 mr-1" />
                    {artist.genre}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <ProfessionalButton 
                    variant="primary" 
                    onClick={handleFollow}
                    className="bg-white text-gray-900 hover:bg-gray-100"
                  >
                    <HeartIcon className={`h-4 w-4 mr-2 ${following ? 'text-red-500 fill-current' : ''}`} />
                    {following ? 'Following' : 'Follow'}
                  </ProfessionalButton>
                  
                  <ProfessionalButton 
                    variant="outline" 
                    onClick={handleShare}
                    className="border-white text-white hover:bg-white hover:text-gray-900"
                  >
                    <ShareIcon className="h-4 w-4 mr-2" />
                    Share
                  </ProfessionalButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Bio */}
              <ProfessionalCard className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
                <p className="text-gray-700 leading-relaxed">{artist.bio}</p>
                <div className="mt-4 text-sm text-gray-500">
                  Joined {new Date(artist.joinedDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long' 
                  })}
                </div>
              </ProfessionalCard>

              {/* Releases */}
              <ProfessionalCard className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Releases</h2>
                {releases.length === 0 ? (
                  <div className="text-center py-8">
                    <MusicalNoteIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No releases yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {releases.map((release) => (
                      <div key={release.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <img
                          src={release.coverUrl}
                          alt={release.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{release.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{release.type}</span>
                            <span>{release.tracks.length} track{release.tracks.length !== 1 ? 's' : ''}</span>
                            <span>{release.streams.toLocaleString()} streams</span>
                            <span>{new Date(release.releaseDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <ProfessionalButton variant="outline" size="sm">
                          <PlayIcon className="h-4 w-4 mr-1" />
                          Play
                        </ProfessionalButton>
                      </div>
                    ))}
                  </div>
                )}
              </ProfessionalCard>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Social Links */}
              <ProfessionalCard className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect</h3>
                <div className="space-y-3">
                  {artist.socialLinks.instagram && (
                    <a
                      href={artist.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </div>
                      <span>Instagram</span>
                      <ExternalLinkIcon className="h-4 w-4 ml-auto" />
                    </a>
                  )}
                  
                  {artist.socialLinks.twitter && (
                    <a
                      href={artist.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                      </div>
                      <span>Twitter</span>
                      <ExternalLinkIcon className="h-4 w-4 ml-auto" />
                    </a>
                  )}

                  {artist.socialLinks.youtube && (
                    <a
                      href={artist.socialLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 text-gray-700 hover:text-red-600 transition-colors"
                    >
                      <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                      </div>
                      <span>YouTube</span>
                      <ExternalLinkIcon className="h-4 w-4 ml-auto" />
                    </a>
                  )}

                  {artist.socialLinks.tiktok && (
                    <a
                      href={artist.socialLinks.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 text-gray-700 hover:text-black transition-colors"
                    >
                      <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                        </svg>
                      </div>
                      <span>TikTok</span>
                      <ExternalLinkIcon className="h-4 w-4 ml-auto" />
                    </a>
                  )}
                </div>
              </ProfessionalCard>

              {/* Stats */}
              <ProfessionalCard className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Releases</span>
                    <span className="font-semibold">{releases.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Streams</span>
                    <span className="font-semibold">
                      {releases.reduce((sum, r) => sum + r.streams, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Followers</span>
                    <span className="font-semibold">{artist.followers.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Listeners</span>
                    <span className="font-semibold">{artist.monthlyListeners.toLocaleString()}</span>
                  </div>
                </div>
              </ProfessionalCard>
            </div>
          </div>
        </div>
      </div>
    </ProfessionalLayout>
  );
}
