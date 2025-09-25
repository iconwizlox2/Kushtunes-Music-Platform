import React from 'react';

interface FileSizeHelperProps {
  file: File | null;
  maxSize: number; // in MB
  type: 'audio' | 'image';
}

export function FileSizeHelper({ file, maxSize, type }: FileSizeHelperProps) {
  if (!file) return null;

  const fileSizeMB = file.size / (1024 * 1024);
  const isLarge = fileSizeMB > maxSize * 0.8; // Warning at 80% of max size
  const isOversized = fileSizeMB > maxSize;

  const getSizeColor = () => {
    if (isOversized) return 'text-red-600';
    if (isLarge) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getSizeIcon = () => {
    if (isOversized) return '❌';
    if (isLarge) return '⚠️';
    return '✅';
  };

  return (
    <div className={`mt-2 text-xs ${getSizeColor()}`}>
      <div className="flex items-center justify-between">
        <span className="flex items-center">
          <span className="mr-1">{getSizeIcon()}</span>
          {fileSizeMB.toFixed(2)} MB
        </span>
        <span className="text-gray-500">
          Max: {maxSize}MB
        </span>
      </div>
      
      {isOversized && (
        <div className="mt-1 text-red-600 font-medium">
          File too large! Please compress or use a smaller file.
        </div>
      )}
      
      {isLarge && !isOversized && (
        <div className="mt-1 text-yellow-600">
          Large file - upload may take longer
        </div>
      )}
      
      {!isLarge && (
        <div className="mt-1 text-green-600">
          File size is optimal
        </div>
      )}
    </div>
  );
}

// File compression suggestions
export function CompressionTips({ type }: { type: 'audio' | 'image' }) {
  if (type === 'audio') {
    return (
      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Audio Compression Tips:</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Use MP3 at 320kbps for best quality</li>
          <li>• WAV files are uncompressed (larger)</li>
          <li>• FLAC provides lossless compression</li>
          <li>• Consider using audio editing software to reduce file size</li>
        </ul>
      </div>
    );
  }

  return (
    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <h4 className="text-sm font-medium text-blue-900 mb-2">Image Optimization Tips:</h4>
      <ul className="text-xs text-blue-800 space-y-1">
        <li>• Use JPEG for photos, PNG for graphics</li>
        <li>• Recommended size: 3000x3000 pixels</li>
        <li>• Compress images before uploading</li>
        <li>• WebP format offers better compression</li>
      </ul>
    </div>
  );
}
