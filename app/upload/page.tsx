"use client";

import { useState, useRef } from 'react';
import Link from 'next/link';
import {
  CloudArrowUpIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PhotoIcon,
  PlayIcon,
  MusicalNoteIcon,
  GlobeAltIcon,
  PlusIcon,
  TrashIcon
} from '@/components/ui/Icons';
import DSPDistribution from '@/components/DSPDistribution';

interface Track {
  id: string;
  title: string;
  audioFile: File | null;
  validation: { valid: boolean; error?: string };
}

interface UploadState {
  step: number;
  tracks: Track[];
  artworkFile: File | null;
  metadata: {
    title: string;
    artist: string;
    releaseDate: string;
    genre: string;
    language: string;
    type: 'SINGLE' | 'EP' | 'ALBUM';
  };
  progress: number;
  isProcessing: boolean;
  error: string | null;
  uploadProgress: {
    audio: number;
    artwork: number;
    processing: number;
  };
  fileValidation: {
    artwork: { valid: boolean; error?: string };
  };
}

export default function UploadPage() {
  const [state, setState] = useState<UploadState>({
    step: 1,
    tracks: [{
      id: 'track-1',
      title: '',
      audioFile: null,
      validation: { valid: true }
    }],
    artworkFile: null,
    metadata: {
      title: '',
      artist: '',
      releaseDate: '',
      genre: '',
      language: '',
      type: 'SINGLE'
    },
    progress: 0,
    isProcessing: false,
    error: null,
    uploadProgress: {
      audio: 0,
      artwork: 0,
      processing: 0,
    },
    fileValidation: {
      artwork: { valid: true },
    },
  });

  // Track management functions
  const addTrack = () => {
    const newTrack: Track = {
      id: `track-${Date.now()}`,
      title: '',
      audioFile: null,
      validation: { valid: true }
    };
    setState(prev => ({
      ...prev,
      tracks: [...prev.tracks, newTrack]
    }));
  };

  const removeTrack = (trackId: string) => {
    if (state.tracks.length > 1) {
      setState(prev => ({
        ...prev,
        tracks: prev.tracks.filter(track => track.id !== trackId)
      }));
    }
  };

  const updateTrack = (trackId: string, updates: Partial<Track>) => {
    setState(prev => ({
      ...prev,
      tracks: prev.tracks.map(track =>
        track.id === trackId ? { ...track, ...updates } : track
      )
    }));
  };

  const handleTrackAudioFile = (trackId: string, file: File) => {
    const validation = validateAudioFile(file);
    updateTrack(trackId, { audioFile: file, validation });
  };

  const handleTrackTitleChange = (trackId: string, title: string) => {
    updateTrack(trackId, { title });
  };

  // File validation functions
  const validateAudioFile = (file: File) => {
    const MAX_AUDIO_SIZE = 50 * 1024 * 1024; // 50MB
    const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/wav', 'audio/flac'];

    if (!ALLOWED_AUDIO_TYPES.includes(file.type)) {
      return { valid: false, error: 'Please upload MP3, WAV, or FLAC files only' };
    }

    if (file.size > MAX_AUDIO_SIZE) {
      return { valid: false, error: 'File size must be less than 50MB' };
    }

    return { valid: true };
  };

  const validateImageFile = (file: File) => {
    const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
    const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return { valid: false, error: 'Please upload JPG, PNG, or WebP files only' };
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return { valid: false, error: 'File size must be less than 2MB' };
    }

    return { valid: true };
  };

  const handleArtworkFile = (file: File) => {
    const validation = validateImageFile(file);
    setState(prev => ({
      ...prev,
      artworkFile: file,
      fileValidation: {
        ...prev.fileValidation,
        artwork: validation
      }
    }));
  };

  const handleMetadataChange = (field: string, value: string) => {
    setState(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [field]: value
      }
    }));
  };

  const handleUpload = async () => {
    setState(prev => ({ ...prev, isProcessing: true, error: null }));

    try {
      const formData = new FormData();
      
      // Add tracks
      state.tracks.forEach((track, index) => {
        if (track.audioFile) {
          formData.append(`track_${index}`, track.audioFile);
          formData.append(`track_${index}_title`, track.title);
        }
      });

      // Add artwork
      if (state.artworkFile) {
        formData.append('artwork', state.artworkFile);
      }

      // Add metadata
      formData.append('title', state.metadata.title);
      formData.append('artist', state.metadata.artist);
      formData.append('releaseDate', state.metadata.releaseDate);
      formData.append('genre', state.metadata.genre);
      formData.append('language', state.metadata.language);
      formData.append('type', state.metadata.type);
      formData.append('userId', 'demo-user-id');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      console.log('Upload successful:', result);
      
      setState(prev => ({ ...prev, step: 4, isProcessing: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Upload failed',
        isProcessing: false
      }));
    }
  };

  const renderStepContent = () => {
    switch (state.step) {
      case 1:
        return (
          <div className="space-y-8">
            {/* Release Type Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <MusicalNoteIcon className="h-5 w-5 mr-2 text-primary-blue" />
                Release Type
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { type: 'SINGLE', label: 'Single', description: '1 track', icon: MusicalNoteIcon },
                  { type: 'EP', label: 'EP', description: '2-6 tracks', icon: GlobeAltIcon },
                  { type: 'ALBUM', label: 'Album', description: '7+ tracks', icon: GlobeAltIcon }
                ].map(({ type, label, description, icon: Icon }) => (
                  <div
                    key={type}
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      state.metadata.type === type
                        ? 'border-primary-blue bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                    onClick={() => handleMetadataChange('type', type)}
                  >
                    <div className="text-center">
                      <Icon className={`h-8 w-8 mx-auto mb-3 ${
                        state.metadata.type === type ? 'text-primary-blue' : 'text-gray-400'
                      }`} />
                      <h4 className="font-semibold text-gray-900">{label}</h4>
                      <p className="text-sm text-gray-600">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tracks Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <PlayIcon className="h-5 w-5 mr-2 text-primary-blue" />
                  Tracks ({state.tracks.length})
                </h3>
                <button
                  onClick={addTrack}
                  className="btn-primary flex items-center"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Track
                </button>
              </div>

              <div className="space-y-4">
                {state.tracks.map((track, index) => (
                  <div key={track.id} className="card">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">Track {index + 1}</h4>
                      {state.tracks.length > 1 && (
                        <button
                          onClick={() => removeTrack(track.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Track Title *
                        </label>
                        <input
                          type="text"
                          value={track.title}
                          onChange={(e) => handleTrackTitleChange(track.id, e.target.value)}
                          placeholder="Enter track title"
                          className="form-input"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Audio File *
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-blue transition-colors">
                          <CloudArrowUpIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                          <p className="text-gray-600 mb-2">
                            Drop files here, or <span className="text-primary-blue font-medium">browse</span>
                          </p>
                          <p className="text-sm text-gray-500">
                            .mp3, .wav, .flac (max 50MB)
                          </p>
                          <input
                            type="file"
                            accept="audio/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleTrackAudioFile(track.id, file);
                            }}
                            className="hidden"
                            id={`audio-${track.id}`}
                          />
                          <label
                            htmlFor={`audio-${track.id}`}
                            className="btn-secondary mt-4 cursor-pointer"
                          >
                            Choose File
                          </label>
                        </div>
                        {track.audioFile && (
                          <p className="text-sm text-green-600 mt-2">
                            ✓ {track.audioFile.name}
                          </p>
                        )}
                        {!track.validation.valid && (
                          <p className="text-sm text-red-600 mt-2">
                            {track.validation.error}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cover Art Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <PhotoIcon className="h-5 w-5 mr-2 text-primary-blue" />
                Cover Art
              </h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-blue transition-colors">
                <PhotoIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-2">
                  Drop files here, or <span className="text-primary-blue font-medium">browse</span>
                </p>
                <p className="text-sm text-gray-500">
                  .jpg, .jpeg, .png, .webp (max 2MB)
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleArtworkFile(file);
                  }}
                  className="hidden"
                  id="artwork"
                />
                <label
                  htmlFor="artwork"
                  className="btn-secondary mt-4 cursor-pointer"
                >
                  Choose File
                </label>
              </div>
              {state.artworkFile && (
                <p className="text-sm text-green-600">
                  ✓ {state.artworkFile.name}
                </p>
              )}
              {!state.fileValidation.artwork.valid && (
                <p className="text-sm text-red-600">
                  {state.fileValidation.artwork.error}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setState(prev => ({ ...prev, step: 2 }))}
                disabled={!state.tracks.some(t => t.audioFile && t.title)}
                className="btn-primary"
              >
                Continue to Metadata
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Release Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Release Title *
                </label>
                <input
                  type="text"
                  value={state.metadata.title}
                  onChange={(e) => handleMetadataChange('title', e.target.value)}
                  placeholder="Enter release title"
                  className="form-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Artist Name *
                </label>
                <input
                  type="text"
                  value={state.metadata.artist}
                  onChange={(e) => handleMetadataChange('artist', e.target.value)}
                  placeholder="Enter artist name"
                  className="form-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Release Date *
                </label>
                <input
                  type="date"
                  value={state.metadata.releaseDate}
                  onChange={(e) => handleMetadataChange('releaseDate', e.target.value)}
                  className="form-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Genre
                </label>
                <select
                  value={state.metadata.genre}
                  onChange={(e) => handleMetadataChange('genre', e.target.value)}
                  className="form-input"
                >
                  <option value="">Select genre</option>
                  <option value="Pop">Pop</option>
                  <option value="Rock">Rock</option>
                  <option value="Hip-Hop">Hip-Hop</option>
                  <option value="Electronic">Electronic</option>
                  <option value="Jazz">Jazz</option>
                  <option value="Classical">Classical</option>
                  <option value="Country">Country</option>
                  <option value="R&B">R&B</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  value={state.metadata.language}
                  onChange={(e) => handleMetadataChange('language', e.target.value)}
                  className="form-input"
                >
                  <option value="">Select language</option>
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Italian">Italian</option>
                  <option value="Portuguese">Portuguese</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setState(prev => ({ ...prev, step: 1 }))}
                className="btn-secondary"
              >
                Back to Files
              </button>
              <button
                onClick={() => setState(prev => ({ ...prev, step: 3 }))}
                disabled={!state.metadata.title || !state.metadata.artist || !state.metadata.releaseDate}
                className="btn-primary"
              >
                Continue to Processing
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-primary-blue rounded-full flex items-center justify-center mx-auto">
              <CheckCircleIcon className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Ready to Upload</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Your release is ready for distribution. Click the button below to upload your music to all platforms.
            </p>
            <div className="flex justify-center">
              <button
                onClick={handleUpload}
                disabled={state.isProcessing}
                className="btn-primary"
              >
                {state.isProcessing ? 'Uploading...' : 'Upload & Distribute'}
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Distribution</h3>
            <DSPDistribution releaseId="demo-release-id" />
            <div className="flex justify-end">
              <button
                onClick={() => setState(prev => ({ ...prev, step: 5 }))}
                className="btn-primary"
              >
                Complete Upload
              </button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircleIcon className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Upload Complete!</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Your music has been successfully uploaded and is being distributed to all platforms. You'll receive an email confirmation shortly.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/dashboard" className="btn-primary">
                View Dashboard
              </Link>
              <Link href="/upload" className="btn-secondary">
                Upload Another
              </Link>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen clean-bg-gray">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-primary-blue hover:text-primary-blue-dark transition-colors mb-4">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="heading-lg text-gray-900 mb-2">Upload Your Music</h1>
          <p className="text-gray-600">Get your tracks on Spotify, Apple Music, and 200+ platforms worldwide</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-8 mb-8">
          {['Files', 'Metadata', 'Processing', 'Distribution', 'Complete'].map((step, index) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  state.step > index + 1
                    ? 'bg-green-500 text-white'
                    : state.step === index + 1
                      ? 'bg-primary-blue text-white'
                      : 'bg-gray-200 text-gray-600'
                }`}
              >
                {state.step > index + 1 ? <CheckCircleIcon className="h-5 w-5" /> : index + 1}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">{step}</span>
              {index < 4 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  state.step > index + 1 ? 'bg-green-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Error Alert */}
        {state.error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700">{state.error}</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="card">
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
}