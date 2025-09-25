import { randomBytes } from 'crypto';

export interface ReleaseMetadata {
  title: string;
  artist: string;
  releaseDate: string;
  genre: string;
  language: string;
  type: 'SINGLE' | 'EP' | 'ALBUM';
  label?: string;
  copyright?: string;
  upc?: string;
  isrc?: string;
}

export interface Track {
  id: string;
  title: string;
  trackNumber: number;
  duration: number;
  filePath: string;
  isrc?: string;
}

export interface Release {
  id: string;
  userId: string;
  metadata: ReleaseMetadata;
  tracks: Track[];
  artworkPath?: string;
  status: 'DRAFT' | 'SUBMITTED' | 'PROCESSING' | 'DISTRIBUTED' | 'REJECTED';
  createdAt: Date;
  updatedAt: Date;
  distributionDate?: Date;
  platforms: string[];
}

export interface DistributionPlatform {
  id: string;
  name: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'LIVE';
  submittedAt?: Date;
  approvedAt?: Date;
  liveAt?: Date;
  rejectionReason?: string;
}

// Generate release ID
export function generateReleaseId(): string {
  return 'REL_' + randomBytes(8).toString('hex').toUpperCase();
}

// Generate UPC (Universal Product Code)
export function generateUPC(): string {
  // Generate a 12-digit UPC
  const upc = Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
  return upc;
}

// Generate ISRC (International Standard Recording Code)
export function generateISRC(countryCode: string = 'US'): string {
  const year = new Date().getFullYear().toString().slice(-2);
  const registrant = randomBytes(3).toString('hex').toUpperCase();
  const designation = randomBytes(3).toString('hex').toUpperCase();
  
  return `${countryCode}${year}${registrant}${designation}`;
}

// Validate release metadata
export function validateReleaseMetadata(metadata: ReleaseMetadata): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!metadata.title || metadata.title.trim().length < 1) {
    errors.push('Release title is required');
  }
  
  if (!metadata.artist || metadata.artist.trim().length < 1) {
    errors.push('Artist name is required');
  }
  
  if (!metadata.releaseDate) {
    errors.push('Release date is required');
  } else {
    const releaseDate = new Date(metadata.releaseDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (releaseDate < today) {
      errors.push('Release date cannot be in the past');
    }
  }
  
  if (!metadata.genre) {
    errors.push('Genre is required');
  }
  
  if (!metadata.language) {
    errors.push('Language is required');
  }
  
  if (!['SINGLE', 'EP', 'ALBUM'].includes(metadata.type)) {
    errors.push('Invalid release type');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Validate track data
export function validateTrack(track: Track): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!track.title || track.title.trim().length < 1) {
    errors.push('Track title is required');
  }
  
  if (track.trackNumber < 1) {
    errors.push('Track number must be at least 1');
  }
  
  if (track.duration < 30) {
    errors.push('Track duration must be at least 30 seconds');
  }
  
  if (!track.filePath) {
    errors.push('Audio file is required');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Validate release for distribution
export function validateReleaseForDistribution(release: Release): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Validate metadata
  const metadataValidation = validateReleaseMetadata(release.metadata);
  if (!metadataValidation.valid) {
    errors.push(...metadataValidation.errors);
  }
  
  // Validate tracks
  if (release.tracks.length === 0) {
    errors.push('At least one track is required');
  }
  
  release.tracks.forEach((track, index) => {
    const trackValidation = validateTrack(track);
    if (!trackValidation.valid) {
      errors.push(`Track ${index + 1}: ${trackValidation.errors.join(', ')}`);
    }
  });
  
  // Validate artwork
  if (!release.artworkPath) {
    errors.push('Cover artwork is required');
  }
  
  // Validate release type vs track count
  if (release.metadata.type === 'SINGLE' && release.tracks.length !== 1) {
    errors.push('Single releases must have exactly 1 track');
  }
  
  if (release.metadata.type === 'EP' && (release.tracks.length < 2 || release.tracks.length > 6)) {
    errors.push('EP releases must have 2-6 tracks');
  }
  
  if (release.metadata.type === 'ALBUM' && release.tracks.length < 7) {
    errors.push('Album releases must have at least 7 tracks');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Calculate release duration
export function calculateReleaseDuration(tracks: Track[]): number {
  return tracks.reduce((total, track) => total + track.duration, 0);
}

// Format duration in MM:SS format
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Get release status color
export function getReleaseStatusColor(status: Release['status']): string {
  switch (status) {
    case 'DRAFT': return 'gray';
    case 'SUBMITTED': return 'blue';
    case 'PROCESSING': return 'yellow';
    case 'DISTRIBUTED': return 'green';
    case 'REJECTED': return 'red';
    default: return 'gray';
  }
}

// Get release status text
export function getReleaseStatusText(status: Release['status']): string {
  switch (status) {
    case 'DRAFT': return 'Draft';
    case 'SUBMITTED': return 'Submitted';
    case 'PROCESSING': return 'Processing';
    case 'DISTRIBUTED': return 'Live';
    case 'REJECTED': return 'Rejected';
    default: return 'Unknown';
  }
}

// Calculate distribution progress
export function calculateDistributionProgress(platforms: DistributionPlatform[]): {
  total: number;
  completed: number;
  percentage: number;
} {
  const total = platforms.length;
  const completed = platforms.filter(p => p.status === 'LIVE').length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return { total, completed, percentage };
}

// Generate release summary
export function generateReleaseSummary(release: Release): {
  trackCount: number;
  totalDuration: string;
  status: string;
  platforms: number;
} {
  const trackCount = release.tracks.length;
  const totalDuration = formatDuration(calculateReleaseDuration(release.tracks));
  const status = getReleaseStatusText(release.status);
  const platforms = release.platforms.length;
  
  return {
    trackCount,
    totalDuration,
    status,
    platforms
  };
}

// Check if release can be edited
export function canEditRelease(release: Release): boolean {
  return release.status === 'DRAFT' || release.status === 'REJECTED';
}

// Check if release can be deleted
export function canDeleteRelease(release: Release): boolean {
  return release.status === 'DRAFT';
}

// Get release type display name
export function getReleaseTypeDisplayName(type: ReleaseMetadata['type']): string {
  switch (type) {
    case 'SINGLE': return 'Single';
    case 'EP': return 'EP';
    case 'ALBUM': return 'Album';
    default: return 'Unknown';
  }
}

// Generate release filename
export function generateReleaseFilename(release: Release): string {
  const artist = release.metadata.artist.replace(/[^a-zA-Z0-9]/g, '_');
  const title = release.metadata.title.replace(/[^a-zA-Z0-9]/g, '_');
  const type = release.metadata.type.toLowerCase();
  
  return `${artist}_${title}_${type}_${release.id}`;
}

// Validate release date
export function validateReleaseDate(dateString: string): { valid: boolean; error?: string } {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (isNaN(date.getTime())) {
    return { valid: false, error: 'Invalid date format' };
  }
  
  if (date < today) {
    return { valid: false, error: 'Release date cannot be in the past' };
  }
  
  const maxFutureDate = new Date();
  maxFutureDate.setFullYear(maxFutureDate.getFullYear() + 2);
  
  if (date > maxFutureDate) {
    return { valid: false, error: 'Release date cannot be more than 2 years in the future' };
  }
  
  return { valid: true };
}

