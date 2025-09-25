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
  PlusIcon,
  HeartIcon,
  ShareIcon,
  CommentIcon,
  UserGroupIcon,
  MusicalNoteIcon,
  PlayIcon,
  EyeIcon,
  CalendarIcon,
  GlobeAltIcon,
  SearchIcon,
  FilterIcon
} from '@/components/ui/Icons';

interface Artist {
  id: string;
  name: string;
  avatar: string;
  verified: boolean;
  followers: number;
  genre: string;
  location: string;
  latestRelease: string;
  isFollowing: boolean;
}

interface Post {
  id: string;
  artistId: string;
  artistName: string;
  artistAvatar: string;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'MUSIC';
  mediaUrl?: string;
  likes: number;
  comments: number;
  shares: number;
  createdAt: string;
  isLiked: boolean;
}

interface Event {
  id: string;
  title: string;
  artist: string;
  date: string;
  location: string;
  type: 'CONCERT' | 'LIVESTREAM' | 'MEET_AND_GREET';
  attendees: number;
  maxAttendees?: number;
  price: number;
  coverUrl: string;
}

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('feed');
  const [artists, setArtists] = useState<Artist[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCommunityData();
  }, []);

  const fetchCommunityData = async () => {
    try {
      // Fetch artists
      const artistsResponse = await fetch('/api/community/artists');
      if (artistsResponse.ok) {
        const artistsData = await artistsResponse.json();
        setArtists(artistsData.data);
      }

      // Fetch posts
      const postsResponse = await fetch('/api/community/posts');
      if (postsResponse.ok) {
        const postsData = await postsResponse.json();
        setPosts(postsData.data);
      }

      // Fetch events
      const eventsResponse = await fetch('/api/community/events');
      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json();
        setEvents(eventsData.data);
      }
    } catch (error) {
      console.error('Error fetching community data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (artistId: string) => {
    // Toggle follow status
    setArtists(prev => prev.map(artist => 
      artist.id === artistId 
        ? { ...artist, isFollowing: !artist.isFollowing, followers: artist.isFollowing ? artist.followers - 1 : artist.followers + 1 }
        : artist
    ));
  };

  const handleLike = async (postId: string) => {
    // Toggle like status
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const filteredArtists = artists.filter(artist =>
    artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    artist.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Community</h1>
            <p className="text-gray-600 mt-2">Connect with artists and discover new music</p>
          </div>
          <ProfessionalButton variant="primary">
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Post
          </ProfessionalButton>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'feed', name: 'Feed', icon: MusicalNoteIcon },
              { id: 'artists', name: 'Artists', icon: UserGroupIcon },
              { id: 'events', name: 'Events', icon: CalendarIcon },
              { id: 'discover', name: 'Discover', icon: EyeIcon }
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

        {/* Tab Content */}
        {activeTab === 'feed' && (
          <div className="space-y-6">
            {/* Create Post */}
            <ProfessionalCard className="p-6">
              <div className="flex items-center space-x-4">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
                  alt="Your avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <textarea
                    placeholder="What's on your mind? Share your latest music or thoughts..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                    <MusicalNoteIcon className="h-5 w-5" />
                    <span>Music</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600">
                    <EyeIcon className="h-5 w-5" />
                    <span>Image</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-purple-600">
                    <PlayIcon className="h-5 w-5" />
                    <span>Video</span>
                  </button>
                </div>
                <ProfessionalButton variant="primary">Post</ProfessionalButton>
              </div>
            </ProfessionalCard>

            {/* Posts Feed */}
            <div className="space-y-6">
              {posts.map((post) => (
                <ProfessionalCard key={post.id} className="p-6">
                  <div className="flex items-start space-x-4">
                    <img
                      src={post.artistAvatar}
                      alt={post.artistName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{post.artistName}</h3>
                        <span className="text-sm text-gray-500">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-4">{post.content}</p>
                      
                      {post.mediaUrl && (
                        <div className="mb-4">
                          {post.type === 'IMAGE' && (
                            <img
                              src={post.mediaUrl}
                              alt="Post content"
                              className="w-full max-w-md rounded-lg object-cover"
                            />
                          )}
                          {post.type === 'VIDEO' && (
                            <video
                              src={post.mediaUrl}
                              controls
                              className="w-full max-w-md rounded-lg"
                            />
                          )}
                          {post.type === 'MUSIC' && (
                            <div className="bg-gray-50 rounded-lg p-4 flex items-center space-x-4">
                              <PlayIcon className="h-8 w-8 text-blue-600" />
                              <div>
                                <p className="font-medium text-gray-900">New Track</p>
                                <p className="text-sm text-gray-500">Click to play</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex items-center space-x-6">
                        <button
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center space-x-2 ${
                            post.isLiked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
                          }`}
                        >
                          <HeartIcon className={`h-5 w-5 ${post.isLiked ? 'fill-current' : ''}`} />
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                          <CommentIcon className="h-5 w-5" />
                          <span>{post.comments}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600">
                          <ShareIcon className="h-5 w-5" />
                          <span>{post.shares}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </ProfessionalCard>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'artists' && (
          <div className="space-y-6">
            {/* Search */}
            <ProfessionalCard className="p-6">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search artists..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </ProfessionalCard>

            {/* Artists Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArtists.map((artist) => (
                <ProfessionalCard key={artist.id} className="p-6">
                  <div className="text-center">
                    <img
                      src={artist.avatar}
                      alt={artist.name}
                      className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
                    />
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{artist.name}</h3>
                      {artist.verified && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{artist.genre}</p>
                    <p className="text-sm text-gray-500 mb-4">{artist.location}</p>
                    <p className="text-sm text-gray-500 mb-4">{artist.followers.toLocaleString()} followers</p>
                    <p className="text-sm text-gray-500 mb-4">Latest: {artist.latestRelease}</p>
                    <ProfessionalButton
                      variant={artist.isFollowing ? "outline" : "primary"}
                      onClick={() => handleFollow(artist.id)}
                      className="w-full"
                    >
                      <HeartIcon className={`h-4 w-4 mr-2 ${artist.isFollowing ? 'fill-current' : ''}`} />
                      {artist.isFollowing ? 'Following' : 'Follow'}
                    </ProfessionalButton>
                  </div>
                </ProfessionalCard>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {events.map((event) => (
                <ProfessionalCard key={event.id} className="p-6">
                  <div className="flex space-x-4">
                    <img
                      src={event.coverUrl}
                      alt={event.title}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{event.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{event.artist}</p>
                      <div className="space-y-1 text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="h-4 w-4" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <GlobeAltIcon className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <UserGroupIcon className="h-4 w-4" />
                          <span>{event.attendees.toLocaleString()} attending</span>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="font-semibold text-gray-900">
                          {event.price === 0 ? 'Free' : `$${event.price}`}
                        </span>
                        <ProfessionalButton variant="primary" size="sm">
                          Attend
                        </ProfessionalButton>
                      </div>
                    </div>
                  </div>
                </ProfessionalCard>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'discover' && (
          <div className="space-y-6">
            <ProfessionalCard className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Discover New Music</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
                  <h3 className="font-semibold mb-2">Trending Now</h3>
                  <p className="text-sm opacity-90">Discover what's popular right now</p>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-lg p-6 text-white">
                  <h3 className="font-semibold mb-2">New Releases</h3>
                  <p className="text-sm opacity-90">Fresh music from emerging artists</p>
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-lg p-6 text-white">
                  <h3 className="font-semibold mb-2">Genre Mix</h3>
                  <p className="text-sm opacity-90">Explore different musical styles</p>
                </div>
              </div>
            </ProfessionalCard>
          </div>
        )}
      </div>
    </ProfessionalLayout>
  );
}
