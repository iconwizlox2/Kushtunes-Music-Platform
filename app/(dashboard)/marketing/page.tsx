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
  ShareIcon,
  LinkIcon,
  CalendarIcon,
  ChartBarIcon,
  EyeIcon,
  CopyIcon,
  ExternalLinkIcon,
  MusicalNoteIcon,
  PlayIcon
} from '@/components/ui/Icons';

interface Campaign {
  id: string;
  name: string;
  releaseId: string;
  releaseTitle: string;
  coverUrl: string;
  type: 'PRESAVE' | 'HYPERFOLLOW';
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'PAUSED';
  createdAt: string;
  startDate: string;
  endDate: string;
  stats: {
    clicks: number;
    conversions: number;
    conversionRate: number;
    platforms: { [key: string]: number };
  };
  links: {
    presaveUrl: string;
    hyperfollowUrl: string;
    qrCode: string;
  };
}

export default function MarketingPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('campaigns');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('/api/marketing/campaigns');
      const result = await response.json();
      
      if (result.success) {
        setCampaigns(result.data);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    // Show toast notification
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      case 'PAUSED': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
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
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Marketing Tools</h1>
            <p className="text-gray-600 mt-2">Create pre-save campaigns and HyperFollow pages to promote your releases</p>
          </div>
          <ProfessionalButton 
            variant="primary" 
            onClick={() => setShowCreateModal(true)}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Campaign
          </ProfessionalButton>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'campaigns', name: 'Campaigns', icon: ChartBarIcon },
              { id: 'presave', name: 'Pre-Save', icon: CalendarIcon },
              { id: 'hyperfollow', name: 'HyperFollow', icon: LinkIcon },
              { id: 'analytics', name: 'Analytics', icon: EyeIcon }
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
        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <ProfessionalCard className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <ChartBarIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
                    <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
                  </div>
                </div>
              </ProfessionalCard>

              <ProfessionalCard className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <EyeIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {campaigns.reduce((sum, c) => sum + c.stats.clicks, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </ProfessionalCard>

              <ProfessionalCard className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <ShareIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Conversions</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {campaigns.reduce((sum, c) => sum + c.stats.conversions, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </ProfessionalCard>

              <ProfessionalCard className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <CalendarIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg. Conversion</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {campaigns.length > 0 
                        ? (campaigns.reduce((sum, c) => sum + c.stats.conversionRate, 0) / campaigns.length).toFixed(1)
                        : 0}%
                    </p>
                  </div>
                </div>
              </ProfessionalCard>
            </div>

            {/* Campaigns List */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Your Campaigns</h2>
              
              {campaigns.length === 0 ? (
                <ProfessionalCard className="p-12 text-center">
                  <ChartBarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No campaigns yet</h3>
                  <p className="text-gray-600 mb-6">Create your first marketing campaign to promote your releases</p>
                  <ProfessionalButton 
                    variant="primary" 
                    onClick={() => setShowCreateModal(true)}
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Create Your First Campaign
                  </ProfessionalButton>
                </ProfessionalCard>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {campaigns.map((campaign) => (
                    <ProfessionalCard key={campaign.id} className="p-6">
                      <div className="flex items-start space-x-4">
                        <img
                          src={campaign.coverUrl}
                          alt={campaign.releaseTitle}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 truncate">
                                {campaign.name}
                              </h3>
                              <p className="text-sm text-gray-600">{campaign.releaseTitle}</p>
                              <div className="flex items-center mt-2 space-x-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                                  {campaign.status}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {campaign.type === 'PRESAVE' ? 'Pre-Save' : 'HyperFollow'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="mt-4 grid grid-cols-3 gap-4">
                            <div className="text-center">
                              <p className="text-lg font-semibold text-gray-900">{campaign.stats.clicks.toLocaleString()}</p>
                              <p className="text-xs text-gray-500">Clicks</p>
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-semibold text-gray-900">{campaign.stats.conversions.toLocaleString()}</p>
                              <p className="text-xs text-gray-500">Conversions</p>
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-semibold text-gray-900">{campaign.stats.conversionRate.toFixed(1)}%</p>
                              <p className="text-xs text-gray-500">Rate</p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="mt-4 flex items-center space-x-2">
                            <ProfessionalButton 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleCopyLink(campaign.links.presaveUrl)}
                            >
                              <CopyIcon className="h-4 w-4 mr-1" />
                              Copy Link
                            </ProfessionalButton>
                            <ProfessionalButton 
                              variant="outline" 
                              size="sm"
                              onClick={() => window.open(campaign.links.hyperfollowUrl, '_blank')}
                            >
                              <ExternalLinkIcon className="h-4 w-4 mr-1" />
                              View Page
                            </ProfessionalButton>
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

        {activeTab === 'presave' && (
          <div className="space-y-6">
            <ProfessionalCard className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Pre-Save Campaigns</h2>
              <div className="prose max-w-none">
                <p className="text-gray-600 mb-4">
                  Pre-save campaigns allow fans to save your upcoming release to their Spotify, Apple Music, and other streaming libraries before it's released. This helps boost your first-day streams and algorithmic performance.
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-blue-900 mb-2">How Pre-Save Works:</h3>
                  <ul className="list-disc list-inside text-blue-800 space-y-1">
                    <li>Fans click your pre-save link</li>
                    <li>They're redirected to their preferred streaming platform</li>
                    <li>Your release is automatically added to their library</li>
                    <li>They get notified when your music goes live</li>
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Benefits:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Higher first-day streams</li>
                      <li>Better algorithmic placement</li>
                      <li>Increased fan engagement</li>
                      <li>Automatic notifications</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Supported Platforms:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Spotify</li>
                      <li>Apple Music</li>
                      <li>Amazon Music</li>
                      <li>Deezer</li>
                    </ul>
                  </div>
                </div>
              </div>
            </ProfessionalCard>
          </div>
        )}

        {activeTab === 'hyperfollow' && (
          <div className="space-y-6">
            <ProfessionalCard className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">HyperFollow Pages</h2>
              <div className="prose max-w-none">
                <p className="text-gray-600 mb-4">
                  HyperFollow pages are custom landing pages that showcase your release with links to all major streaming platforms. They provide a professional way to promote your music across all platforms.
                </p>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-green-900 mb-2">HyperFollow Features:</h3>
                  <ul className="list-disc list-inside text-green-800 space-y-1">
                    <li>Custom branded landing page</li>
                    <li>Links to all streaming platforms</li>
                    <li>Social media integration</li>
                    <li>Analytics and tracking</li>
                    <li>Mobile-optimized design</li>
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Customization:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Custom colors and branding</li>
                      <li>Artist bio and photos</li>
                      <li>Social media links</li>
                      <li>Release information</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Analytics:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Click tracking</li>
                      <li>Platform preferences</li>
                      <li>Geographic data</li>
                      <li>Conversion rates</li>
                    </ul>
                  </div>
                </div>
              </div>
            </ProfessionalCard>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <ProfessionalCard className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Campaign Analytics</h2>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">📊 Interactive analytics dashboard showing campaign performance over time</p>
              </div>
            </ProfessionalCard>
          </div>
        )}
      </div>

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create New Campaign</h3>
            <p className="text-gray-600 mb-4">Campaign creation feature coming soon!</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </ProfessionalLayout>
  );
}
