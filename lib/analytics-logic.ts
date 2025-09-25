export interface StreamData {
  id: string;
  releaseId: string;
  trackId: string;
  platform: string;
  country: string;
  date: Date;
  streams: number;
  revenue: number;
  currency: string;
}

export interface AnalyticsSummary {
  totalStreams: number;
  totalRevenue: number;
  totalTracks: number;
  totalReleases: number;
  topCountries: Array<{ country: string; streams: number; revenue: number }>;
  topPlatforms: Array<{ platform: string; streams: number; revenue: number }>;
  monthlyGrowth: Array<{ month: string; streams: number; revenue: number }>;
}

export interface TrackAnalytics {
  trackId: string;
  trackTitle: string;
  totalStreams: number;
  totalRevenue: number;
  topCountries: Array<{ country: string; streams: number }>;
  topPlatforms: Array<{ platform: string; streams: number }>;
  dailyStreams: Array<{ date: string; streams: number }>;
}

export interface ReleaseAnalytics {
  releaseId: string;
  releaseTitle: string;
  totalStreams: number;
  totalRevenue: number;
  trackCount: number;
  tracks: TrackAnalytics[];
  releaseDate: Date;
  distributionDate?: Date;
}

// Calculate total streams
export function calculateTotalStreams(streamData: StreamData[]): number {
  return streamData.reduce((total, stream) => total + stream.streams, 0);
}

// Calculate total revenue
export function calculateTotalRevenue(streamData: StreamData[]): number {
  return streamData.reduce((total, stream) => total + stream.revenue, 0);
}

// Get top countries by streams
export function getTopCountries(streamData: StreamData[], limit: number = 10): Array<{ country: string; streams: number; revenue: number }> {
  const countryMap = new Map<string, { streams: number; revenue: number }>();
  
  streamData.forEach(stream => {
    const existing = countryMap.get(stream.country) || { streams: 0, revenue: 0 };
    countryMap.set(stream.country, {
      streams: existing.streams + stream.streams,
      revenue: existing.revenue + stream.revenue
    });
  });
  
  return Array.from(countryMap.entries())
    .map(([country, data]) => ({ country, ...data }))
    .sort((a, b) => b.streams - a.streams)
    .slice(0, limit);
}

// Get top platforms by streams
export function getTopPlatforms(streamData: StreamData[], limit: number = 10): Array<{ platform: string; streams: number; revenue: number }> {
  const platformMap = new Map<string, { streams: number; revenue: number }>();
  
  streamData.forEach(stream => {
    const existing = platformMap.get(stream.platform) || { streams: 0, revenue: 0 };
    platformMap.set(stream.platform, {
      streams: existing.streams + stream.streams,
      revenue: existing.revenue + stream.revenue
    });
  });
  
  return Array.from(platformMap.entries())
    .map(([platform, data]) => ({ platform, ...data }))
    .sort((a, b) => b.streams - a.streams)
    .slice(0, limit);
}

// Calculate monthly growth
export function calculateMonthlyGrowth(streamData: StreamData[]): Array<{ month: string; streams: number; revenue: number }> {
  const monthMap = new Map<string, { streams: number; revenue: number }>();
  
  streamData.forEach(stream => {
    const month = stream.date.toISOString().substring(0, 7); // YYYY-MM format
    const existing = monthMap.get(month) || { streams: 0, revenue: 0 };
    monthMap.set(month, {
      streams: existing.streams + stream.streams,
      revenue: existing.revenue + stream.revenue
    });
  });
  
  return Array.from(monthMap.entries())
    .map(([month, data]) => ({ month, ...data }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

// Calculate growth percentage
export function calculateGrowthPercentage(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

// Format currency
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount);
}

// Format number with commas
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

// Calculate average streams per day
export function calculateAverageStreamsPerDay(streamData: StreamData[]): number {
  if (streamData.length === 0) return 0;
  
  const dates = new Set(streamData.map(s => s.date.toISOString().split('T')[0]));
  const totalStreams = calculateTotalStreams(streamData);
  
  return Math.round(totalStreams / dates.size);
}

// Calculate revenue per stream
export function calculateRevenuePerStream(streamData: StreamData[]): number {
  const totalStreams = calculateTotalStreams(streamData);
  const totalRevenue = calculateTotalRevenue(streamData);
  
  return totalStreams > 0 ? totalRevenue / totalStreams : 0;
}

// Get analytics summary
export function generateAnalyticsSummary(streamData: StreamData[], releases: any[], tracks: any[]): AnalyticsSummary {
  const totalStreams = calculateTotalStreams(streamData);
  const totalRevenue = calculateTotalRevenue(streamData);
  const totalTracks = tracks.length;
  const totalReleases = releases.length;
  
  const topCountries = getTopCountries(streamData, 10);
  const topPlatforms = getTopPlatforms(streamData, 10);
  const monthlyGrowth = calculateMonthlyGrowth(streamData);
  
  return {
    totalStreams,
    totalRevenue,
    totalTracks,
    totalReleases,
    topCountries,
    topPlatforms,
    monthlyGrowth
  };
}

// Calculate track analytics
export function calculateTrackAnalytics(trackId: string, streamData: StreamData[], trackTitle: string): TrackAnalytics {
  const trackStreams = streamData.filter(s => s.trackId === trackId);
  
  const totalStreams = calculateTotalStreams(trackStreams);
  const totalRevenue = calculateTotalRevenue(trackStreams);
  
  const topCountries = getTopCountries(trackStreams, 5);
  const topPlatforms = getTopPlatforms(trackStreams, 5);
  
  // Group by date for daily streams
  const dailyMap = new Map<string, number>();
  trackStreams.forEach(stream => {
    const date = stream.date.toISOString().split('T')[0];
    dailyMap.set(date, (dailyMap.get(date) || 0) + stream.streams);
  });
  
  const dailyStreams = Array.from(dailyMap.entries())
    .map(([date, streams]) => ({ date, streams }))
    .sort((a, b) => a.date.localeCompare(b.date));
  
  return {
    trackId,
    trackTitle,
    totalStreams,
    totalRevenue,
    topCountries,
    topPlatforms,
    dailyStreams
  };
}

// Calculate release analytics
export function calculateReleaseAnalytics(releaseId: string, streamData: StreamData[], release: any): ReleaseAnalytics {
  const releaseStreams = streamData.filter(s => s.releaseId === releaseId);
  
  const totalStreams = calculateTotalStreams(releaseStreams);
  const totalRevenue = calculateTotalRevenue(releaseStreams);
  
  // Calculate analytics for each track
  const tracks = release.tracks.map((track: any) => 
    calculateTrackAnalytics(track.id, releaseStreams, track.title)
  );
  
  return {
    releaseId,
    releaseTitle: release.metadata.title,
    totalStreams,
    totalRevenue,
    trackCount: release.tracks.length,
    tracks,
    releaseDate: new Date(release.metadata.releaseDate),
    distributionDate: release.distributionDate ? new Date(release.distributionDate) : undefined
  };
}

// Generate performance insights
export function generatePerformanceInsights(analytics: AnalyticsSummary): string[] {
  const insights: string[] = [];
  
  // Growth insights
  if (analytics.monthlyGrowth.length >= 2) {
    const latest = analytics.monthlyGrowth[analytics.monthlyGrowth.length - 1];
    const previous = analytics.monthlyGrowth[analytics.monthlyGrowth.length - 2];
    
    const streamGrowth = calculateGrowthPercentage(latest.streams, previous.streams);
    const revenueGrowth = calculateGrowthPercentage(latest.revenue, previous.revenue);
    
    if (streamGrowth > 0) {
      insights.push(`Streams increased by ${streamGrowth}% this month`);
    }
    
    if (revenueGrowth > 0) {
      insights.push(`Revenue increased by ${revenueGrowth}% this month`);
    }
  }
  
  // Top performer insights
  if (analytics.topCountries.length > 0) {
    const topCountry = analytics.topCountries[0];
    insights.push(`${topCountry.country} is your top market with ${formatNumber(topCountry.streams)} streams`);
  }
  
  if (analytics.topPlatforms.length > 0) {
    const topPlatform = analytics.topPlatforms[0];
    insights.push(`${topPlatform.platform} generates the most streams with ${formatNumber(topPlatform.streams)}`);
  }
  
  return insights;
}

// Calculate conversion rate
export function calculateConversionRate(streams: number, listeners: number): number {
  return listeners > 0 ? Math.round((streams / listeners) * 100) / 100 : 0;
}

// Get time-based analytics
export function getTimeBasedAnalytics(streamData: StreamData[], period: 'daily' | 'weekly' | 'monthly'): Array<{ period: string; streams: number; revenue: number }> {
  const periodMap = new Map<string, { streams: number; revenue: number }>();
  
  streamData.forEach(stream => {
    let periodKey: string;
    
    switch (period) {
      case 'daily':
        periodKey = stream.date.toISOString().split('T')[0];
        break;
      case 'weekly':
        const weekStart = new Date(stream.date);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        periodKey = weekStart.toISOString().split('T')[0];
        break;
      case 'monthly':
        periodKey = stream.date.toISOString().substring(0, 7);
        break;
      default:
        periodKey = stream.date.toISOString().split('T')[0];
    }
    
    const existing = periodMap.get(periodKey) || { streams: 0, revenue: 0 };
    periodMap.set(periodKey, {
      streams: existing.streams + stream.streams,
      revenue: existing.revenue + stream.revenue
    });
  });
  
  return Array.from(periodMap.entries())
    .map(([period, data]) => ({ period, ...data }))
    .sort((a, b) => a.period.localeCompare(b.period));
}




