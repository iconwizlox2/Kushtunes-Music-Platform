interface AppleMusicTrack {
  id: string;
  type: 'songs';
  attributes: {
    name: string;
    artistName: string;
    albumName: string;
    durationInMillis: number;
    artwork: {
      width: number;
      height: number;
      url: string;
    };
    previews: Array<{
      url: string;
    }>;
    playParams: {
      id: string;
      kind: 'song';
    };
  };
}

interface AppleMusicRelease {
  id: string;
  type: 'albums';
  attributes: {
    name: string;
    artistName: string;
    releaseDate: string;
    trackCount: number;
    artwork: {
      width: number;
      height: number;
      url: string;
    };
  };
}

export class AppleMusicAPI {
  private developerToken: string;
  private userToken?: string;

  constructor(developerToken: string, userToken?: string) {
    this.developerToken = developerToken;
    this.userToken = userToken;
  }

  async searchTracks(query: string): Promise<AppleMusicTrack[]> {
    try {
      const response = await fetch(
        `https://api.music.apple.com/v1/catalog/us/search?term=${encodeURIComponent(query)}&types=songs&limit=25`,
        {
          headers: {
            'Authorization': `Bearer ${this.developerToken}`,
            'Music-User-Token': this.userToken || '',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Apple Music API error: ${response.status}`);
      }

      const data = await response.json();
      return data.results?.songs?.data || [];
    } catch (error) {
      console.error('Apple Music search error:', error);
      throw error;
    }
  }

  async getTrack(trackId: string): Promise<AppleMusicTrack | null> {
    try {
      const response = await fetch(
        `https://api.music.apple.com/v1/catalog/us/songs/${trackId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.developerToken}`,
            'Music-User-Token': this.userToken || '',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Apple Music API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data?.[0] || null;
    } catch (error) {
      console.error('Apple Music track fetch error:', error);
      throw error;
    }
  }

  async getArtistTracks(artistId: string): Promise<AppleMusicTrack[]> {
    try {
      const response = await fetch(
        `https://api.music.apple.com/v1/catalog/us/artists/${artistId}/songs?limit=25`,
        {
          headers: {
            'Authorization': `Bearer ${this.developerToken}`,
            'Music-User-Token': this.userToken || '',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Apple Music API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Apple Music artist tracks error:', error);
      throw error;
    }
  }

  async getTopTracks(): Promise<AppleMusicTrack[]> {
    try {
      const response = await fetch(
        'https://api.music.apple.com/v1/catalog/us/top-charts/songs?limit=25',
        {
          headers: {
            'Authorization': `Bearer ${this.developerToken}`,
            'Music-User-Token': this.userToken || '',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Apple Music API error: ${response.status}`);
      }

      const data = await response.json();
      return data.results?.songs || [];
    } catch (error) {
      console.error('Apple Music top tracks error:', error);
      throw error;
    }
  }

  async getNewReleases(): Promise<AppleMusicRelease[]> {
    try {
      const response = await fetch(
        'https://api.music.apple.com/v1/catalog/us/new-releases/albums?limit=25',
        {
          headers: {
            'Authorization': `Bearer ${this.developerToken}`,
            'Music-User-Token': this.userToken || '',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Apple Music API error: ${response.status}`);
      }

      const data = await response.json();
      return data.results?.albums || [];
    } catch (error) {
      console.error('Apple Music new releases error:', error);
      throw error;
    }
  }

  // Method to submit music to Apple Music (requires Apple Music Connect)
  async submitToAppleMusic(trackData: {
    title: string;
    artist: string;
    album?: string;
    genre: string;
    releaseDate: string;
    audioFile: File;
    artworkFile: File;
  }): Promise<{ success: boolean; message: string; submissionId?: string }> {
    try {
      // This would integrate with Apple Music Connect API
      // For now, we'll simulate the submission process
      
      const submissionData = {
        track: {
          name: trackData.title,
          artistName: trackData.artist,
          albumName: trackData.album || trackData.title,
          genre: trackData.genre,
          releaseDate: trackData.releaseDate,
        },
        files: {
          audio: trackData.audioFile.name,
          artwork: trackData.artworkFile.name,
        },
        submittedAt: new Date().toISOString(),
      };

      // In a real implementation, you would:
      // 1. Upload files to Apple Music Connect
      // 2. Submit metadata
      // 3. Handle review process
      // 4. Track submission status

      return {
        success: true,
        message: 'Music submitted to Apple Music successfully! Review process takes 1-2 weeks.',
        submissionId: `apple_${Date.now()}`,
      };
    } catch (error) {
      console.error('Apple Music submission error:', error);
      return {
        success: false,
        message: 'Failed to submit to Apple Music. Please try again.',
      };
    }
  }
}

// Helper function to get Apple Music developer token
export async function getAppleMusicToken(): Promise<string> {
  try {
    // In a real implementation, you would:
    // 1. Use your Apple Developer account
    // 2. Generate a JWT token
    // 3. Store it securely
    
    // For now, return a placeholder
    return process.env.APPLE_MUSIC_DEVELOPER_TOKEN || 'your-apple-music-token';
  } catch (error) {
    console.error('Apple Music token error:', error);
    throw error;
  }
}

// Helper function to format Apple Music track data
export function formatAppleMusicTrack(track: AppleMusicTrack) {
  return {
    id: track.id,
    title: track.attributes.name,
    artist: track.attributes.artistName,
    album: track.attributes.albumName,
    duration: Math.round(track.attributes.durationInMillis / 1000),
    artwork: track.attributes.artwork.url,
    preview: track.attributes.previews?.[0]?.url,
    playParams: track.attributes.playParams,
  };
}

// Helper function to format Apple Music release data
export function formatAppleMusicRelease(release: AppleMusicRelease) {
  return {
    id: release.id,
    title: release.attributes.name,
    artist: release.attributes.artistName,
    releaseDate: release.attributes.releaseDate,
    trackCount: release.attributes.trackCount,
    artwork: release.attributes.artwork.url,
  };
}
