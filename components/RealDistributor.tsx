'use client';

import { useState } from 'react';
import { REAL_DISTRIBUTORS } from '@/lib/real-distributors';

interface RealDistributorProps {
  releaseId: string;
  releaseData: any;
  onUploadComplete?: () => void;
}

export default function RealDistributor({ releaseId, releaseData, onUploadComplete }: RealDistributorProps) {
  const [selectedDistributor, setSelectedDistributor] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const handleRealUpload = async () => {
    if (!selectedDistributor || !apiKey) {
      alert('Please select a distributor and enter your API key');
      return;
    }

    setUploading(true);
    setUploadStatus('Uploading to distributor...');

    try {
      const response = await fetch('/api/real-distribute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          distributor: selectedDistributor,
          apiKey,
          releaseData
        }),
      });

      const result = await response.json();

      if (result.success) {
        setUploadStatus(`✅ Successfully uploaded to ${result.data.distributor}!`);
        setUploadStatus(`Submission ID: ${result.data.submissionId}`);
        onUploadComplete?.();
      } else {
        setUploadStatus(`❌ Upload failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('❌ Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
      <h3 className="text-xl font-bold text-slate-900 mb-6">
        🚀 Upload to Spotify via Real Distributors
      </h3>

      <div className="space-y-6">
        {/* Distributor Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Select Distributor
          </label>
          <select
            value={selectedDistributor}
            onChange={(e) => setSelectedDistributor(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Choose a distributor...</option>
            {Object.entries(REAL_DISTRIBUTORS).map(([key, config]) => (
              <option key={key} value={key}>
                {config.name} - {config.cost} - {config.platforms.length} platforms
              </option>
            ))}
          </select>
        </div>

        {/* API Key Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your distributor API key"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-slate-500 mt-1">
            Get your API key from your distributor dashboard
          </p>
        </div>

        {/* Distributor Info */}
        {selectedDistributor && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">
              {REAL_DISTRIBUTORS[selectedDistributor as keyof typeof REAL_DISTRIBUTORS].name}
            </h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>Cost:</strong> {REAL_DISTRIBUTORS[selectedDistributor as keyof typeof REAL_DISTRIBUTORS].cost}</p>
              <p><strong>Revenue Share:</strong> {Math.round(REAL_DISTRIBUTORS[selectedDistributor as keyof typeof REAL_DISTRIBUTORS].revenueShare * 100)}%</p>
              <p><strong>Platforms:</strong> {REAL_DISTRIBUTORS[selectedDistributor as keyof typeof REAL_DISTRIBUTORS].platforms.join(', ')}</p>
            </div>
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleRealUpload}
          disabled={uploading || !selectedDistributor || !apiKey}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <span>🚀 Upload to Spotify</span>
            </>
          )}
        </button>

        {/* Status */}
        {uploadStatus && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <p className="text-sm text-slate-700">{uploadStatus}</p>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-900 mb-2">📋 How to Get Started:</h4>
          <ol className="text-sm text-yellow-800 space-y-1 list-decimal list-inside">
            <li>Sign up with a distributor (DistroKid, CD Baby, Amuse, etc.)</li>
            <li>Get your API key from their dashboard</li>
            <li>Enter your API key above</li>
            <li>Click "Upload to Spotify" to distribute your music</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
