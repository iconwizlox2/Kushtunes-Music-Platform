export interface EarningsData {
  id: string;
  userId: string;
  releaseId: string;
  trackId: string;
  platform: string;
  country: string;
  date: Date;
  streams: number;
  revenue: number;
  currency: string;
  payoutRate: number;
  netEarnings: number;
}

export interface PayoutData {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  requestedAt: Date;
  processedAt?: Date;
  paymentMethod: string;
  transactionId?: string;
  failureReason?: string;
}

export interface EarningsSummary {
  totalEarnings: number;
  totalStreams: number;
  averageRatePerStream: number;
  currency: string;
  monthlyEarnings: Array<{ month: string; earnings: number; streams: number }>;
  platformBreakdown: Array<{ platform: string; earnings: number; streams: number; rate: number }>;
  countryBreakdown: Array<{ country: string; earnings: number; streams: number; rate: number }>;
  pendingPayouts: number;
  availableBalance: number;
}

// Platform payout rates (per stream in USD)
export const PLATFORM_RATES = {
  'spotify': 0.0033,
  'apple-music': 0.0078,
  'youtube-music': 0.00069,
  'amazon-music': 0.0040,
  'deezer': 0.0019,
  'tidal': 0.0125,
  'pandora': 0.0013,
  'soundcloud': 0.0025,
  'youtube': 0.00069,
  'facebook': 0.00069,
  'instagram': 0.00069,
  'tiktok': 0.00069,
  'snapchat': 0.00069,
  'twitch': 0.00069,
  'other': 0.0020
};

// Country multipliers (relative to US rates)
export const COUNTRY_MULTIPLIERS = {
  'US': 1.0,
  'GB': 0.85,
  'CA': 0.80,
  'AU': 0.75,
  'DE': 0.70,
  'FR': 0.65,
  'IT': 0.60,
  'ES': 0.55,
  'NL': 0.70,
  'SE': 0.75,
  'NO': 0.80,
  'DK': 0.75,
  'FI': 0.70,
  'CH': 0.80,
  'AT': 0.70,
  'BE': 0.65,
  'IE': 0.75,
  'NZ': 0.70,
  'JP': 0.60,
  'KR': 0.55,
  'SG': 0.65,
  'HK': 0.60,
  'TW': 0.55,
  'MX': 0.40,
  'BR': 0.35,
  'AR': 0.30,
  'CL': 0.30,
  'CO': 0.25,
  'PE': 0.25,
  'IN': 0.20,
  'CN': 0.15,
  'RU': 0.25,
  'TR': 0.30,
  'ZA': 0.25,
  'NG': 0.15,
  'EG': 0.20,
  'KE': 0.15,
  'GH': 0.15,
  'MA': 0.20,
  'TN': 0.20,
  'DZ': 0.20,
  'LY': 0.20,
  'SD': 0.15,
  'ET': 0.15,
  'UG': 0.15,
  'TZ': 0.15,
  'ZM': 0.15,
  'ZW': 0.15,
  'BW': 0.20,
  'NA': 0.20,
  'SZ': 0.20,
  'LS': 0.20,
  'MW': 0.15,
  'MZ': 0.15,
  'MG': 0.15,
  'MU': 0.20,
  'SC': 0.20,
  'KM': 0.15,
  'DJ': 0.15,
  'SO': 0.15,
  'ER': 0.15,
  'SS': 0.15,
  'CF': 0.15,
  'TD': 0.15,
  'NE': 0.15,
  'ML': 0.15,
  'BF': 0.15,
  'CI': 0.15,
  'LR': 0.15,
  'SL': 0.15,
  'GN': 0.15,
  'GW': 0.15,
  'GM': 0.15,
  'SN': 0.15,
  'MR': 0.15,
  'CV': 0.20,
  'ST': 0.15,
  'GQ': 0.15,
  'GA': 0.15,
  'CG': 0.15,
  'CD': 0.15,
  'AO': 0.15,
  'BI': 0.15,
  'RW': 0.15,
  'other': 0.30
};

// Calculate earnings for a single stream
export function calculateStreamEarnings(
  platform: string,
  country: string,
  streams: number = 1
): { revenue: number; rate: number } {
  const baseRate = PLATFORM_RATES[platform as keyof typeof PLATFORM_RATES] || PLATFORM_RATES.other;
  const countryMultiplier = COUNTRY_MULTIPLIERS[country as keyof typeof COUNTRY_MULTIPLIERS] || COUNTRY_MULTIPLIERS.other;
  
  const adjustedRate = baseRate * countryMultiplier;
  const revenue = adjustedRate * streams;
  
  return {
    revenue: Math.round(revenue * 100) / 100, // Round to 2 decimal places
    rate: adjustedRate
  };
}

// Calculate total earnings
export function calculateTotalEarnings(earningsData: EarningsData[]): number {
  return earningsData.reduce((total, earning) => total + earning.netEarnings, 0);
}

// Calculate monthly earnings
export function calculateMonthlyEarnings(earningsData: EarningsData[]): Array<{ month: string; earnings: number; streams: number }> {
  const monthMap = new Map<string, { earnings: number; streams: number }>();
  
  earningsData.forEach(earning => {
    const month = earning.date.toISOString().substring(0, 7); // YYYY-MM format
    const existing = monthMap.get(month) || { earnings: 0, streams: 0 };
    monthMap.set(month, {
      earnings: existing.earnings + earning.netEarnings,
      streams: existing.streams + earning.streams
    });
  });
  
  return Array.from(monthMap.entries())
    .map(([month, data]) => ({ month, ...data }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

// Calculate platform breakdown
export function calculatePlatformBreakdown(earningsData: EarningsData[]): Array<{ platform: string; earnings: number; streams: number; rate: number }> {
  const platformMap = new Map<string, { earnings: number; streams: number; totalRate: number; count: number }>();
  
  earningsData.forEach(earning => {
    const existing = platformMap.get(earning.platform) || { earnings: 0, streams: 0, totalRate: 0, count: 0 };
    platformMap.set(earning.platform, {
      earnings: existing.earnings + earning.netEarnings,
      streams: existing.streams + earning.streams,
      totalRate: existing.totalRate + earning.payoutRate,
      count: existing.count + 1
    });
  });
  
  return Array.from(platformMap.entries())
    .map(([platform, data]) => ({
      platform,
      earnings: data.earnings,
      streams: data.streams,
      rate: data.count > 0 ? data.totalRate / data.count : 0
    }))
    .sort((a, b) => b.earnings - a.earnings);
}

// Calculate country breakdown
export function calculateCountryBreakdown(earningsData: EarningsData[]): Array<{ country: string; earnings: number; streams: number; rate: number }> {
  const countryMap = new Map<string, { earnings: number; streams: number; totalRate: number; count: number }>();
  
  earningsData.forEach(earning => {
    const existing = countryMap.get(earning.country) || { earnings: 0, streams: 0, totalRate: 0, count: 0 };
    countryMap.set(earning.country, {
      earnings: existing.earnings + earning.netEarnings,
      streams: existing.streams + earning.streams,
      totalRate: existing.totalRate + earning.payoutRate,
      count: existing.count + 1
    });
  });
  
  return Array.from(countryMap.entries())
    .map(([country, data]) => ({
      country,
      earnings: data.earnings,
      streams: data.streams,
      rate: data.count > 0 ? data.totalRate / data.count : 0
    }))
    .sort((a, b) => b.earnings - a.earnings);
}

// Calculate average rate per stream
export function calculateAverageRatePerStream(earningsData: EarningsData[]): number {
  if (earningsData.length === 0) return 0;
  
  const totalEarnings = calculateTotalEarnings(earningsData);
  const totalStreams = earningsData.reduce((total, earning) => total + earning.streams, 0);
  
  return totalStreams > 0 ? Math.round((totalEarnings / totalStreams) * 10000) / 10000 : 0;
}

// Calculate available balance
export function calculateAvailableBalance(earningsData: EarningsData[], payoutData: PayoutData[]): number {
  const totalEarnings = calculateTotalEarnings(earningsData);
  const totalPayouts = payoutData
    .filter(payout => payout.status === 'COMPLETED')
    .reduce((total, payout) => total + payout.amount, 0);
  
  return Math.max(0, totalEarnings - totalPayouts);
}

// Calculate pending payouts
export function calculatePendingPayouts(payoutData: PayoutData[]): number {
  return payoutData
    .filter(payout => payout.status === 'PENDING' || payout.status === 'PROCESSING')
    .reduce((total, payout) => total + payout.amount, 0);
}

// Generate earnings summary
export function generateEarningsSummary(earningsData: EarningsData[], payoutData: PayoutData[]): EarningsSummary {
  const totalEarnings = calculateTotalEarnings(earningsData);
  const totalStreams = earningsData.reduce((total, earning) => total + earning.streams, 0);
  const averageRatePerStream = calculateAverageRatePerStream(earningsData);
  const monthlyEarnings = calculateMonthlyEarnings(earningsData);
  const platformBreakdown = calculatePlatformBreakdown(earningsData);
  const countryBreakdown = calculateCountryBreakdown(earningsData);
  const pendingPayouts = calculatePendingPayouts(payoutData);
  const availableBalance = calculateAvailableBalance(earningsData, payoutData);
  
  return {
    totalEarnings,
    totalStreams,
    averageRatePerStream,
    currency: 'USD',
    monthlyEarnings,
    platformBreakdown,
    countryBreakdown,
    pendingPayouts,
    availableBalance
  };
}

// Validate payout request
export function validatePayoutRequest(amount: number, availableBalance: number, minimumPayout: number = 10): { valid: boolean; error?: string } {
  if (amount < minimumPayout) {
    return { valid: false, error: `Minimum payout amount is $${minimumPayout}` };
  }
  
  if (amount > availableBalance) {
    return { valid: false, error: 'Insufficient balance for payout' };
  }
  
  if (amount <= 0) {
    return { valid: false, error: 'Payout amount must be greater than 0' };
  }
  
  return { valid: true };
}

// Calculate payout fees
export function calculatePayoutFees(amount: number, paymentMethod: string): { fee: number; netAmount: number } {
  const fees = {
    'paypal': 0.029, // 2.9% + $0.30
    'stripe': 0.029, // 2.9% + $0.30
    'bank-transfer': 0.01, // 1%
    'crypto': 0.005, // 0.5%
    'check': 0.02 // 2%
  };
  
  const feeRate = fees[paymentMethod as keyof typeof fees] || 0.029;
  const fee = Math.round(amount * feeRate * 100) / 100;
  const netAmount = Math.round((amount - fee) * 100) / 100;
  
  return { fee, netAmount };
}

// Format currency
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount);
}

// Get payout status color
export function getPayoutStatusColor(status: PayoutData['status']): string {
  switch (status) {
    case 'PENDING': return 'yellow';
    case 'PROCESSING': return 'blue';
    case 'COMPLETED': return 'green';
    case 'FAILED': return 'red';
    default: return 'gray';
  }
}

// Get payout status text
export function getPayoutStatusText(status: PayoutData['status']): string {
  switch (status) {
    case 'PENDING': return 'Pending';
    case 'PROCESSING': return 'Processing';
    case 'COMPLETED': return 'Completed';
    case 'FAILED': return 'Failed';
    default: return 'Unknown';
  }
}

// Calculate earnings growth
export function calculateEarningsGrowth(currentEarnings: number, previousEarnings: number): number {
  if (previousEarnings === 0) return currentEarnings > 0 ? 100 : 0;
  return Math.round(((currentEarnings - previousEarnings) / previousEarnings) * 100);
}

// Generate earnings insights
export function generateEarningsInsights(summary: EarningsSummary): string[] {
  const insights: string[] = [];
  
  // Top platform insight
  if (summary.platformBreakdown.length > 0) {
    const topPlatform = summary.platformBreakdown[0];
    insights.push(`${topPlatform.platform} generates ${formatCurrency(topPlatform.earnings)} (${Math.round((topPlatform.earnings / summary.totalEarnings) * 100)}% of total earnings)`);
  }
  
  // Top country insight
  if (summary.countryBreakdown.length > 0) {
    const topCountry = summary.countryBreakdown[0];
    insights.push(`${topCountry.country} is your top earning market with ${formatCurrency(topCountry.earnings)}`);
  }
  
  // Growth insight
  if (summary.monthlyEarnings.length >= 2) {
    const latest = summary.monthlyEarnings[summary.monthlyEarnings.length - 1];
    const previous = summary.monthlyEarnings[summary.monthlyEarnings.length - 2];
    
    const growth = calculateEarningsGrowth(latest.earnings, previous.earnings);
    if (growth > 0) {
      insights.push(`Earnings increased by ${growth}% this month`);
    }
  }
  
  return insights;
}






