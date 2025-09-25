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
  validation: { valid: boolean; error?: string; metadata?: any };
  isrc?: string;
  contributors?: Array<{ name: string; role: string; ipi?: string; cae?: string }>;
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
    upc?: string;
    label?: string;
    territories?: string[];
    excludedTerritories?: string[];
    copyrightYear?: number;
    pLine?: string;
    cLine?: string;
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
    artwork: { valid: boolean; error?: string; metadata?: any };
  };
  rights: {
    type: 'ORIGINAL' | 'COVER' | 'PUBLIC_DOMAIN' | 'SAMPLED';
    mechanicalLicense?: string;
    copyrightOwner?: string;
    attestation: boolean;
  };
  duplicateCheck: {
    isChecking: boolean;
    results: Array<{ similarity: number; trackId: string; title: string }>;
  };
}

export default function UploadPage() {
  const [state, setState] = useState<UploadState>({
    step: 1,
    tracks: [{
      id: 'track-1',
      title: '',
      audioFile: null,
      validation: { valid: true },
      contributors: []
    }],
    artworkFile: null,
    metadata: {
      title: '',
      artist: '',
      releaseDate: '',
      genre: '',
      language: '',
      type: 'SINGLE',
      territories: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'SE'],
      excludedTerritories: [],
      copyrightYear: new Date().getFullYear(),
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
    rights: {
      type: 'ORIGINAL',
      attestation: false,
    },
    duplicateCheck: {
      isChecking: false,
      results: [],
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

  const handleTrackAudioFile = async (trackId: string, file: File) => {
    const validation = await validateAudioFile(file);
    updateTrack(trackId, { audioFile: file, validation });
  };

  const handleTrackTitleChange = (trackId: string, title: string) => {
    updateTrack(trackId, { title });
  };

  // Enhanced audio file validation with professional standards
  const validateAudioFile = async (file: File) => {
    const MAX_AUDIO_SIZE = 100 * 1024 * 1024; // 100MB
    const ALLOWED_AUDIO_TYPES = [
      'audio/wav',       // WAV
      'audio/wave',      // WAV alternative
      'audio/flac',      // FLAC
      'audio/x-flac',    // FLAC alternative
    ];

    // Basic file type validation
    if (!ALLOWED_AUDIO_TYPES.includes(file.type)) {
      return { 
        valid: false, 
        error: 'Only WAV and FLAC files are accepted for professional distribution' 
      };
    }

    // File size validation
    if (file.size > MAX_AUDIO_SIZE) {
      return { 
        valid: false, 
        error: `File size must be less than ${Math.round(MAX_AUDIO_SIZE / (1024 * 1024))}MB` 
      };
    }

    // Audio quality validation (basic checks)
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // Check sample rate (must be 44.1kHz)
      if (audioBuffer.sampleRate !== 44100) {
        return {
          valid: false,
          error: `Sample rate must be 44.1kHz (current: ${audioBuffer.sampleRate}Hz)`
        };
      }

      // Check bit depth (16-24 bit)
      const bitDepth = audioBuffer.length > 0 ? Math.log2(audioBuffer.length) * 8 : 16;
      if (bitDepth < 16 || bitDepth > 24) {
        return {
          valid: false,
          error: `Bit depth must be 16-24 bit (current: ${Math.round(bitDepth)} bit)`
        };
      }

      // Basic clipping detection
      const channelData = audioBuffer.getChannelData(0);
      const maxAmplitude = Math.max(...Array.from(channelData).map(Math.abs));
      if (maxAmplitude >= 0.99) {
        return {
          valid: false,
          error: 'Audio appears to be clipped (amplitude too high). Please reduce gain.'
        };
      }

      audioContext.close();
      
      return { 
        valid: true,
        metadata: {
          sampleRate: audioBuffer.sampleRate,
          bitDepth: Math.round(bitDepth),
          duration: audioBuffer.duration,
          channels: audioBuffer.numberOfChannels,
          maxAmplitude: maxAmplitude
        }
      };
    } catch (error) {
      return {
        valid: false,
        error: 'Unable to analyze audio file. Please ensure it\'s a valid WAV or FLAC file.'
      };
    }
  };

  // Enhanced cover art validation with professional standards
  const validateImageFile = async (file: File) => {
    const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_IMAGE_TYPES = [
      'image/jpeg',      // JPEG
      'image/jpg',       // JPG
      'image/png',       // PNG
    ];

    // Basic file type validation
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return { 
        valid: false, 
        error: 'Only JPG and PNG files are accepted for cover art' 
      };
    }

    // File size validation
    if (file.size > MAX_IMAGE_SIZE) {
      return { 
        valid: false, 
        error: `File size must be less than ${Math.round(MAX_IMAGE_SIZE / (1024 * 1024))}MB` 
      };
    }

    // Image dimension and quality validation
    try {
      const img = new Image();
      const imageUrl = URL.createObjectURL(file);
      
      return new Promise((resolve) => {
        img.onload = () => {
          URL.revokeObjectURL(imageUrl);
          
          // Check dimensions (must be exactly 3000x3000)
          if (img.width !== 3000 || img.height !== 3000) {
            resolve({
              valid: false,
              error: `Cover art must be exactly 3000×3000 pixels (current: ${img.width}×${img.height})`
            });
            return;
          }

          // Check aspect ratio (must be square)
          if (img.width !== img.height) {
            resolve({
              valid: false,
              error: 'Cover art must be square (1:1 aspect ratio)'
            });
            return;
          }

          resolve({
            valid: true,
            metadata: {
              width: img.width,
              height: img.height,
              aspectRatio: img.width / img.height,
              fileSize: file.size
            }
          });
        };

        img.onerror = () => {
          URL.revokeObjectURL(imageUrl);
          resolve({
            valid: false,
            error: 'Unable to load image. Please ensure it\'s a valid JPG or PNG file.'
          });
        };

        img.src = imageUrl;
      });
    } catch (error) {
      return {
        valid: false,
        error: 'Unable to analyze image file. Please ensure it\'s a valid JPG or PNG file.'
      };
    }
  };

  const handleArtworkFile = async (file: File) => {
    const validation = await validateImageFile(file);
    setState(prev => ({
      ...prev,
      artworkFile: file,
      fileValidation: {
        ...prev.fileValidation,
        artwork: validation as { valid: boolean; error?: string; metadata?: any }
      }
    }));
  };

  // Metadata validation functions
  const validateMetadata = () => {
    const errors: string[] = [];

    // Title casing rules (Title Case)
    const titleCaseRegex = /^[A-Z][a-zA-Z0-9\s&'\-\.]+$/;
    if (state.metadata.title && !titleCaseRegex.test(state.metadata.title)) {
      errors.push('Release title must be in Title Case (e.g., "My Song Title")');
    }

    // No store names/brands in titles
    const storeNames = ['spotify', 'apple music', 'amazon', 'youtube', 'tiktok', 'instagram'];
    const titleLower = state.metadata.title.toLowerCase();
    if (storeNames.some(store => titleLower.includes(store))) {
      errors.push('Release title cannot contain store names or brands');
    }

    // Release date timing enforcement (≥10-14 days in future)
    const releaseDate = new Date(state.metadata.releaseDate);
    const today = new Date();
    const minDate = new Date(today.getTime() + (14 * 24 * 60 * 60 * 1000)); // 14 days from now
    
    if (releaseDate < minDate) {
      errors.push('Release date must be at least 14 days in the future');
    }

    // UPC validation (if provided)
    if (state.metadata.upc && !/^\d{12}$/.test(state.metadata.upc)) {
      errors.push('UPC must be exactly 12 digits');
    }

    // Genre validation
    const validGenres = [
      'Pop', 'Rock', 'Hip-Hop', 'R&B', 'Country', 'Electronic', 'Jazz', 'Classical',
      'Blues', 'Folk', 'Reggae', 'Latin', 'World', 'Alternative', 'Indie', 'Metal',
      'Punk', 'Soul', 'Funk', 'Disco', 'House', 'Techno', 'Trance', 'Dubstep'
    ];
    
    if (state.metadata.genre && !validGenres.includes(state.metadata.genre)) {
      errors.push(`Genre must be one of: ${validGenres.join(', ')}`);
    }

    return errors;
  };

  // Duplicate detection (mock implementation)
  const checkForDuplicates = async () => {
    setState(prev => ({
      ...prev,
      duplicateCheck: { ...prev.duplicateCheck, isChecking: true }
    }));

    // Mock duplicate check - in real implementation, this would use chromaprint
    const mockResults = [
      { similarity: 0.85, trackId: 'existing-1', title: 'Similar Track 1' },
      { similarity: 0.72, trackId: 'existing-2', title: 'Similar Track 2' }
    ].filter(result => result.similarity > 0.7);

    setTimeout(() => {
      setState(prev => ({
        ...prev,
        duplicateCheck: {
          isChecking: false,
          results: mockResults
        }
      }));
    }, 2000);
  };

  // Rights validation
  const validateRights = () => {
    const errors: string[] = [];

    if (!state.rights.attestation) {
      errors.push('You must attest to the rights information');
    }

    if (state.rights.type === 'COVER' && !state.rights.mechanicalLicense) {
      errors.push('Mechanical license information is required for cover songs');
    }

    if (state.rights.type === 'SAMPLED' && !state.rights.copyrightOwner) {
      errors.push('Copyright owner information is required for sampled content');
    }

    return errors;
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
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-white flex items-center">
                <MusicalNoteIcon className="h-8 w-8 mr-3 text-blue-400" />
                Release Type
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[
                  { type: 'SINGLE', label: 'Single', description: '1 track', icon: MusicalNoteIcon },
                  { type: 'EP', label: 'EP', description: '2-6 tracks', icon: GlobeAltIcon },
                  { type: 'ALBUM', label: 'Album', description: '7+ tracks', icon: GlobeAltIcon }
                ].map(({ type, label, description, icon: Icon }) => (
                  <div
                    key={type}
                    className={`p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                      state.metadata.type === type
                        ? 'border-blue-400/50 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm shadow-2xl'
                        : 'border-white/30 bg-white/10 backdrop-blur-sm hover:border-white/50 hover:bg-white/20'
                    }`}
                    onClick={() => handleMetadataChange('type', type)}
                  >
                    <div className="text-center">
                      <Icon className={`h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 mx-auto mb-3 sm:mb-4 ${
                        state.metadata.type === type ? 'text-blue-400' : 'text-white/70'
                      }`} />
                      <h4 className="font-bold text-white text-lg sm:text-xl mb-2">{label}</h4>
                      <p className="text-white/70 text-sm sm:text-base lg:text-lg">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tracks Section */}
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center">
                  <PlayIcon className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3 text-purple-400" />
                  Tracks ({state.tracks.length})
                </h3>
                <button
                  onClick={addTrack}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg sm:rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center text-sm sm:text-base"
                >
                  <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Add Track
                </button>
              </div>

              <div className="space-y-4">
                {state.tracks.map((track, index) => (
                  <div key={track.id} className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/20 p-4 sm:p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-white text-sm sm:text-base">Track {index + 1}</h4>
                      {state.tracks.length > 1 && (
                        <button
                          onClick={() => removeTrack(track.id)}
                          className="text-red-400 hover:text-red-300 p-1 transition-colors"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          Track Title *
                        </label>
                        <input
                          type="text"
                          value={track.title}
                          onChange={(e) => handleTrackTitleChange(track.id, e.target.value)}
                          placeholder="Enter track title"
                          className="form-input bg-white/10 border-white/20 text-white placeholder-white/50 focus:ring-blue-400 focus:border-blue-400 w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          Audio File *
                        </label>
                        <div className="border-2 border-dashed border-white/30 rounded-lg p-4 sm:p-6 lg:p-8 text-center hover:border-blue-400/50 transition-colors bg-white/5">
                          <CloudArrowUpIcon className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 mx-auto mb-3 sm:mb-4 text-white/60" />
                          <p className="text-white/80 mb-2 text-sm sm:text-base">
                            Drop files here, or <span className="text-blue-400 font-medium">browse</span>
                          </p>
                          <p className="text-xs sm:text-sm text-white/60">
                            WAV/FLAC only • 44.1kHz • 16-24 bit • No clipping
                          </p>
                          <p className="text-xs text-white/50 mt-1">
                            Professional quality required for distribution
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-20 sm:pt-32 pb-8">
        {/* Header */}
        <div className="mb-8 sm:mb-16">
          <Link href="/dashboard" className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-6 sm:mb-8 group">
            <ArrowLeftIcon className="h-5 w-5 mr-3 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">Back to Dashboard</span>
          </Link>
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-4 sm:mb-8 animate-fade-in leading-tight">
              Upload Your
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Music
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/80 max-w-4xl mx-auto font-light animate-fade-in px-4">
              Get your tracks on <span className="font-bold text-white">Spotify, Apple Music</span>, and 200+ platforms worldwide
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-1 sm:space-x-2 md:space-x-6 mb-8 sm:mb-16 px-2 sm:px-4">
          {['Files', 'Metadata', 'Processing', 'Distribution', 'Complete'].map((step, index) => (
            <div key={step} className="flex items-center">
              <div className="relative">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300 ${
                    state.step > index + 1
                      ? 'bg-gradient-to-r from-green-400 to-emerald-400 text-white shadow-2xl'
                      : state.step === index + 1
                        ? 'bg-gradient-to-r from-blue-400 to-purple-400 text-white shadow-2xl scale-110 animate-pulse'
                        : 'bg-white/20 backdrop-blur-sm text-white/60 border border-white/30'
                  }`}
                >
                  {state.step > index + 1 ? <CheckCircleIcon className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" /> : index + 1}
                </div>
                {state.step === index + 1 && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl sm:rounded-2xl blur-md opacity-50 animate-pulse"></div>
                )}
              </div>
              <span className={`ml-2 sm:ml-3 text-xs sm:text-sm font-bold transition-colors hidden sm:block ${
                state.step >= index + 1 ? 'text-white' : 'text-white/60'
              }`}>{step}</span>
              {index < 4 && (
                <div className={`w-4 sm:w-6 md:w-8 lg:w-16 h-1 mx-1 sm:mx-2 md:mx-4 rounded-full transition-all duration-300 ${
                  state.step > index + 1 ? 'bg-gradient-to-r from-green-400 to-emerald-400' : 'bg-white/30'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Error Alert */}
        {state.error && (
          <div className="mb-12 p-8 bg-red-500/20 backdrop-blur-md border border-red-400/30 rounded-3xl shadow-2xl animate-fade-in">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-400 mr-4" />
              <p className="text-red-200 font-semibold text-lg">{state.error}</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-12 animate-fade-in">
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
}