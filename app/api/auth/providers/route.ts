import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const googleAvailable = !!(
      process.env.GOOGLE_CLIENT_ID && 
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_CLIENT_ID !== 'your-google-client-id' &&
      process.env.GOOGLE_CLIENT_SECRET !== 'your-google-client-secret'
    );

    return NextResponse.json({
      google: googleAvailable,
      providers: googleAvailable ? ['google'] : []
    });
  } catch (error) {
    return NextResponse.json({
      google: false,
      providers: []
    });
  }
}
