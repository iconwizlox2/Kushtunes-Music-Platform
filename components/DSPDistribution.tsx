'use client';

import { useState } from 'react';
import { Button } from './ui/Button';

interface DSPDistributionProps {
  releaseId: string;
  onDistributionComplete?: () => void;
}

const DSP_OPTIONS = [
  { 
    id: 'CDBABY_ALL', 
    name: 'CD Baby (100+ Platforms)', 
    icon: '🌍', 
    color: 'bg-blue-600',
    description: 'Distribute to 100+ platforms worldwide',
    platforms: 'Spotify, Apple Music, Amazon Music, YouTube Music, Tidal, Deezer, Pandora, iTunes, Google Play, and 90+ more',
    cost: '$9.95 per single, $29 per album',
    difficulty: 'Easy'
  },
  { 
    id: 'AMUSE_FREE', 
    name: 'Amuse (Free - Major Platforms)', 
    icon: '🎵', 
    color: 'bg-green-600',
    description: 'Free distribution to major platforms',
    platforms: 'Spotify, Apple Music, Amazon Music, YouTube Music, Deezer, Tidal',
    cost: '100% FREE',
    difficulty: 'Easy'
  },
  { 
    id: 'SPOTIFY', 
    name: 'Spotify Direct', 
    icon: '🎧', 
    color: 'bg-green-500',
    description: 'Direct upload to Spotify',
    platforms: 'Spotify only',
    cost: 'Free (with API)',
    difficulty: 'Easy'
  },
  { 
    id: 'APPLE_MUSIC', 
    name: 'Apple Music Direct', 
    icon: '🍎', 
    color: 'bg-gray-800',
    description: 'Direct upload to Apple Music',
    platforms: 'Apple Music only',
    cost: 'Free (with API)',
    difficulty: 'Easy'
  },
  { 
    id: 'MANUAL_DISTRIBUTION', 
    name: 'Manual Distribution Guide', 
    icon: '📋', 
    color: 'bg-orange-500',
    description: 'Step-by-step guide for free distribution',
    platforms: '100+ platforms across multiple services',
    cost: '100% FREE',
    difficulty: 'Manual'
  },
];

export default function DSPDistribution({ releaseId, onDistributionComplete }: DSPDistributionProps) {
  const [distributing, setDistributing] = useState<string | null>(null);
  const [distributions, setDistributions] = useState<any[]>([]);
  const [showManualGuide, setShowManualGuide] = useState(false);

  const handleDistribute = async (dsp: string) => {
    if (dsp === 'MANUAL_DISTRIBUTION') {
      setShowManualGuide(true);
      return;
    }

    setDistributing(dsp);
    
    try {
      const response = await fetch('/api/distribute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          releaseId,
          dsp
        }),
      });

      const result = await response.json();

      if (result.success) {
        setDistributions(prev => [...prev, result.data]);
        onDistributionComplete?.();
      } else {
        alert(`Distribution failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Distribution error:', error);
      alert('Distribution failed. Please try again.');
    } finally {
      setDistributing(null);
    }
  };

  const ManualDistributionGuide = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Free Distribution to 100+ Platforms</h3>
          <button 
            onClick={() => setShowManualGuide(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">🎵 Amuse (FREE - Best Option)</h4>
            <p className="text-green-700 mb-2">Distributes to: Spotify, Apple Music, Amazon Music, YouTube Music, Deezer, Tidal</p>
            <ol className="list-decimal list-inside text-green-700 space-y-1 text-sm">
              <li>Go to <a href="https://amuse.io" target="_blank" rel="noopener noreferrer" className="underline">amuse.io</a></li>
              <li>Sign up for free account</li>
              <li>Upload your music (audio + cover art)</li>
              <li>Select platforms to distribute to</li>
              <li>Click "Distribute" - your music goes live!</li>
            </ol>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">🎧 SoundCloud (FREE + Community)</h4>
            <p className="text-blue-700 mb-2">Distributes to: SoundCloud + paid distribution to other platforms</p>
            <ol className="list-decimal list-inside text-blue-700 space-y-1 text-sm">
              <li>Go to <a href="https://soundcloud.com" target="_blank" rel="noopener noreferrer" className="underline">soundcloud.com</a></li>
              <li>Sign up for free account</li>
              <li>Upload your music</li>
              <li>Use SoundCloud Pro for distribution to other platforms ($20/year)</li>
            </ol>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-800 mb-2">🎼 ReverbNation (FREE)</h4>
            <p className="text-purple-700 mb-2">Distributes to: Select platforms (limited but free)</p>
            <ol className="list-decimal list-inside text-purple-700 space-y-1 text-sm">
              <li>Go to <a href="https://reverbnation.com" target="_blank" rel="noopener noreferrer" className="underline">reverbnation.com</a></li>
              <li>Sign up for free account</li>
              <li>Upload your music</li>
              <li>Use their distribution service</li>
            </ol>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">💿 Bandcamp (FREE)</h4>
            <p className="text-yellow-700 mb-2">Distributes to: Bandcamp + direct sales to fans</p>
            <ol className="list-decimal list-inside text-yellow-700 space-y-1 text-sm">
              <li>Go to <a href="https://bandcamp.com" target="_blank" rel="noopener noreferrer" className="underline">bandcamp.com</a></li>
              <li>Sign up for free account</li>
              <li>Upload your music</li>
              <li>Set up direct sales to fans</li>
            </ol>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-2">💰 Paid Options (100+ Platforms)</h4>
            <ul className="list-disc list-inside text-red-700 space-y-1 text-sm">
              <li><strong>CD Baby</strong> - $9.95/single, $29/album (100+ platforms)</li>
              <li><strong>TuneCore</strong> - $9.99/single, $29.99/album (100+ platforms)</li>
              <li><strong>DistroKid</strong> - $19.99/year unlimited (100+ platforms)</li>
              <li><strong>Ditto Music</strong> - $19/year unlimited (100+ platforms)</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">🎯 Pro Tips for Free Distribution:</h4>
            <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
              <li>Use <strong>Amuse</strong> for major platforms (Spotify, Apple Music, etc.)</li>
              <li>Use <strong>SoundCloud</strong> for community building</li>
              <li>Use <strong>Bandcamp</strong> for direct sales</li>
              <li>Always use high-quality audio files (WAV or FLAC)</li>
              <li>Ensure cover art is at least 3000x3000 pixels</li>
              <li>Double-check all metadata for accuracy</li>
              <li>Plan your release date 2-4 weeks in advance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Distribute Your Music Worldwide
        </h3>
        <p className="text-gray-600 mt-2">
          Choose how to distribute your music to 100+ platforms
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DSP_OPTIONS.map((dsp) => (
          <div
            key={dsp.id}
            className={`${dsp.color} rounded-xl p-6 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}
          >
            <div className="text-center">
              <div className="text-4xl mb-3">{dsp.icon}</div>
              <h4 className="text-lg font-semibold mb-2">{dsp.name}</h4>
              <p className="text-sm opacity-90 mb-3">{dsp.description}</p>
              <div className="text-xs opacity-75 mb-2">
                <strong>Platforms:</strong> {dsp.platforms}
              </div>
              <div className="text-xs opacity-75 mb-4">
                <strong>Cost:</strong> {dsp.cost}
              </div>
              <Button
                onClick={() => handleDistribute(dsp.id)}
                disabled={distributing === dsp.id}
                className="w-full bg-white text-gray-800 hover:bg-gray-100 disabled:opacity-50"
              >
                {distributing === dsp.id ? 'Processing...' : 
                 dsp.id === 'MANUAL_DISTRIBUTION' ? 'View Guide' : 'Distribute'}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {distributions.length > 0 && (
        <div className="mt-8">
          <h4 className="text-lg font-semibold mb-4">Distribution Status</h4>
          <div className="space-y-2">
            {distributions.map((dist) => (
              <div key={dist.id} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                <span className="font-medium">{dist.dsp}</span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  dist.status === 'LIVE' ? 'bg-green-100 text-green-800' :
                  dist.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' :
                  dist.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {dist.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showManualGuide && <ManualDistributionGuide />}
    </div>
  );
}
