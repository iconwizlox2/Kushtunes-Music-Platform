import { NextRequest, NextResponse } from 'next/server';
import { AppleMusicAPI, getAppleMusicToken } from '@/lib/apple-music';

export async function POST(request: NextRequest) {
  try {
    const { action, ...data } = await request.json();

    if (!action) {
      return NextResponse.json(
        { success: false, message: 'Action is required' },
        { status: 400 }
      );
    }

    const developerToken = await getAppleMusicToken();
    const appleMusic = new AppleMusicAPI(developerToken);

    switch (action) {
      case 'search':
        const { query } = data;
        if (!query) {
          return NextResponse.json(
            { success: false, message: 'Search query is required' },
            { status: 400 }
          );
        }
        
        const tracks = await appleMusic.searchTracks(query);
        return NextResponse.json({
          success: true,
          data: tracks,
        });

      case 'getTrack':
        const { trackId } = data;
        if (!trackId) {
          return NextResponse.json(
            { success: false, message: 'Track ID is required' },
            { status: 400 }
          );
        }
        
        const track = await appleMusic.getTrack(trackId);
        return NextResponse.json({
          success: true,
          data: track,
        });

      case 'getTopTracks':
        const topTracks = await appleMusic.getTopTracks();
        return NextResponse.json({
          success: true,
          data: topTracks,
        });

      case 'getNewReleases':
        const newReleases = await appleMusic.getNewReleases();
        return NextResponse.json({
          success: true,
          data: newReleases,
        });

      case 'submit':
        const submissionResult = await appleMusic.submitToAppleMusic(data);
        return NextResponse.json(submissionResult);

      default:
        return NextResponse.json(
          { success: false, message: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Apple Music API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (!action) {
      return NextResponse.json(
        { success: false, message: 'Action is required' },
        { status: 400 }
      );
    }

    const developerToken = await getAppleMusicToken();
    const appleMusic = new AppleMusicAPI(developerToken);

    switch (action) {
      case 'topTracks':
        const topTracks = await appleMusic.getTopTracks();
        return NextResponse.json({
          success: true,
          data: topTracks,
        });

      case 'newReleases':
        const newReleases = await appleMusic.getNewReleases();
        return NextResponse.json({
          success: true,
          data: newReleases,
        });

      default:
        return NextResponse.json(
          { success: false, message: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Apple Music API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
