import { NextRequest, NextResponse } from 'next/server';

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30d';
    
    // Mock data for demonstration - in production, this would come from your analytics database
    const mockAnalytics = {
      countries: [
        { country: 'United States', countryCode: 'US', streams: 125000, revenue: 450.50, listeners: 8500 },
        { country: 'United Kingdom', countryCode: 'GB', streams: 89000, revenue: 320.75, listeners: 6200 },
        { country: 'Germany', countryCode: 'DE', streams: 67000, revenue: 240.30, listeners: 4800 },
        { country: 'Canada', countryCode: 'CA', streams: 45000, revenue: 180.20, listeners: 3200 },
        { country: 'France', countryCode: 'FR', streams: 38000, revenue: 150.80, listeners: 2800 },
        { country: 'Australia', countryCode: 'AU', streams: 32000, revenue: 125.40, listeners: 2400 },
        { country: 'Netherlands', countryCode: 'NL', streams: 28000, revenue: 110.60, listeners: 2100 },
        { country: 'Sweden', countryCode: 'SE', streams: 25000, revenue: 95.30, listeners: 1900 },
        { country: 'Norway', countryCode: 'NO', streams: 22000, revenue: 85.70, listeners: 1700 },
        { country: 'Japan', countryCode: 'JP', streams: 18000, revenue: 72.40, listeners: 1500 }
      ] as CountryData[],
      
      demographics: {
        ageGroups: {
          '13-17': 8500,
          '18-24': 25000,
          '25-34': 32000,
          '35-44': 18000,
          '45-54': 12000,
          '55-64': 8000,
          '65+': 3500
        },
        gender: {
          male: 65000,
          female: 58000,
          other: 2500
        },
        topCities: [
          { city: 'New York', country: 'United States', streams: 15000 },
          { city: 'London', country: 'United Kingdom', streams: 12000 },
          { city: 'Los Angeles', country: 'United States', streams: 11000 },
          { city: 'Berlin', country: 'Germany', streams: 9500 },
          { city: 'Toronto', country: 'Canada', streams: 8800 },
          { city: 'Paris', country: 'France', streams: 8200 },
          { city: 'Sydney', country: 'Australia', streams: 7800 },
          { city: 'Amsterdam', country: 'Netherlands', streams: 7200 },
          { city: 'Stockholm', country: 'Sweden', streams: 6800 },
          { city: 'Oslo', country: 'Norway', streams: 6200 }
        ]
      } as DemographicData,
      
      platforms: [
        { platform: 'Spotify', streams: 180000, revenue: 650.40, listeners: 12000, growth: 12.5 },
        { platform: 'Apple Music', streams: 95000, revenue: 380.20, listeners: 6800, growth: 8.3 },
        { platform: 'YouTube Music', streams: 75000, revenue: 280.50, listeners: 5200, growth: 15.2 },
        { platform: 'Amazon Music', streams: 45000, revenue: 180.30, listeners: 3200, growth: 6.7 },
        { platform: 'Deezer', streams: 32000, revenue: 125.80, listeners: 2400, growth: 4.1 },
        { platform: 'Tidal', streams: 25000, revenue: 95.60, listeners: 1800, growth: 9.8 },
        { platform: 'SoundCloud', streams: 18000, revenue: 72.40, listeners: 1500, growth: 3.2 }
      ] as PlatformData[],
      
      playlists: [
        { 
          playlistName: 'New Music Friday', 
          platform: 'Spotify', 
          streams: 25000, 
          followers: 2500000, 
          addedDate: '2024-01-15' 
        },
        { 
          playlistName: 'Today\'s Hits', 
          platform: 'Apple Music', 
          streams: 18000, 
          followers: 1800000, 
          addedDate: '2024-01-20' 
        },
        { 
          playlistName: 'Indie Pop Hits', 
          platform: 'Spotify', 
          streams: 12000, 
          followers: 850000, 
          addedDate: '2024-01-25' 
        },
        { 
          playlistName: 'Fresh Finds', 
          platform: 'Spotify', 
          streams: 9500, 
          followers: 650000, 
          addedDate: '2024-02-01' 
        },
        { 
          playlistName: 'Alternative Rock', 
          platform: 'Apple Music', 
          streams: 8200, 
          followers: 420000, 
          addedDate: '2024-02-05' 
        }
      ] as PlaylistData[],
      
      trends: [
        { date: '2024-01-01', streams: 12000, revenue: 45.20 },
        { date: '2024-01-02', streams: 13500, revenue: 52.80 },
        { date: '2024-01-03', streams: 14800, revenue: 58.40 },
        { date: '2024-01-04', streams: 16200, revenue: 65.10 },
        { date: '2024-01-05', streams: 17500, revenue: 72.30 },
        { date: '2024-01-06', streams: 18900, revenue: 78.90 },
        { date: '2024-01-07', streams: 20300, revenue: 85.60 },
        { date: '2024-01-08', streams: 21800, revenue: 92.40 },
        { date: '2024-01-09', streams: 23400, revenue: 98.70 },
        { date: '2024-01-10', streams: 25100, revenue: 105.20 }
      ]
    };

    return NextResponse.json({
      success: true,
      data: mockAnalytics
    });

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
