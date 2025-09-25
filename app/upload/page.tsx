"use client";

import { useState, useRef } from 'react';
import Link from 'next/link';
import { ProfessionalLayout } from '@/components/ProfessionalLayout';
import {
  ProfessionalCard,
  ProfessionalButton,
  FileUpload,
  ProgressBar,
  Alert,
  LoadingSpinner
} from '@/components/ProfessionalUI';
import DSPDistribution from '@/components/DSPDistribution';
import {
  CloudArrowUpIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PhotoIcon,
  PlayIcon,
  PauseIcon,
  TrashIcon,
  MusicalNoteIcon,
  GlobeAltIcon,
  PlusIcon
} from '@/components/ui/Icons';

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
    if (state.tracks.length <= 1) return; // Don't allow removing the last track
    setState(prev => ({
      ...prev,
      tracks: prev.tracks.filter(track => track.id !== trackId)
    }));
  };

  const updateTrack = (trackId: string, field: keyof Track, value: any) => {
    setState(prev => ({
      ...prev,
      tracks: prev.tracks.map(track => 
        track.id === trackId ? { ...track, [field]: value } : track
      )
    }));
  };

  const handleTrackAudioFile = (trackId: string, file: File) => {
    const validation = validateAudioFile(file);
    updateTrack(trackId, 'audioFile', file);
    updateTrack(trackId, 'validation', validation);
  };

  const handleTrackTitleChange = (trackId: string, title: string) => {
    updateTrack(trackId, 'title', title);
  };

  // File validation functions
  const validateAudioFile = (file: File) => {
    const maxSize = 50 * 1024 * 1024; // 50MB (standard limit)
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/mp3'];
    
    if (file.size > maxSize) {
      return { valid: false, error: 'Audio file too large. Maximum size: 50MB' };
    }
    
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Invalid audio format. Allowed: MP3, WAV, FLAC' };
    }
    
    return { valid: true };
  };

  const validateImageFile = (file: File) => {
    const maxSize = 5 * 1024 * 1024; // 5MB (standard limit)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    if (file.size > maxSize) {
      return { valid: false, error: 'Image too large. Maximum size: 5MB' };
    }
    
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Invalid image format. Allowed: JPEG, PNG, WebP' };
    }
    
    return { valid: true };
  };

  const handleArtworkFile = (file: File) => {
    const validation = validateImageFile(file);
    setState(prev => ({ 
      ...prev, 
      artworkFile: file, 
      error: null,
      fileValidation: { ...prev.fileValidation, artwork: validation }
    }));
  };

  const handleMetadataChange = (field: string, value: string) => {
    setState(prev => ({
      ...prev,
      metadata: { ...prev.metadata, [field]: value }
    }));
  };

  const handleUpload = async () => {
    // Validate files
    if (!state.artworkFile) {
      setState(prev => ({ ...prev, error: 'Please upload artwork file' }));
      return;
    }

    if (!state.fileValidation.artwork.valid) {
      setState(prev => ({ ...prev, error: 'Please fix artwork validation errors before uploading' }));
      return;
    }

    // Validate tracks
    const hasValidTracks = state.tracks.every(track => 
      track.audioFile && track.validation.valid && track.title.trim()
    );

    if (!hasValidTracks) {
      setState(prev => ({ ...prev, error: 'Please upload audio files and add titles for all tracks' }));
      return;
    }

    if (!state.metadata.title || !state.metadata.artist) {
      setState(prev => ({ ...prev, error: 'Please fill in all required fields' }));
      return;
    }

    setState(prev => ({ 
      ...prev, 
      isProcessing: true, 
      step: 3, 
      progress: 0,
      uploadProgress: { audio: 0, artwork: 0, processing: 0 }
    }));

    try {
      const formData = new FormData();
      
      // Add artwork
      formData.append('artwork', state.artworkFile);
      
      // Add release metadata
      formData.append('title', state.metadata.title);
      formData.append('artist', state.metadata.artist);
      formData.append('type', state.metadata.type);
      formData.append('genre', state.metadata.genre);
      formData.append('language', state.metadata.language);
      formData.append('releaseDate', state.metadata.releaseDate);
      
      // Add tracks
      state.tracks.forEach((track, index) => {
        if (track.audioFile) {
          formData.append(`track_${index}_audio`, track.audioFile);
          formData.append(`track_${index}_title`, track.title);
        }
      });
      
      formData.append('trackCount', state.tracks.length.toString());

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setState(prev => {
          const newProgress = prev.progress + Math.random() * 10;
          const audioProgress = Math.min(prev.uploadProgress.audio + Math.random() * 5, 100);
          const artworkProgress = Math.min(prev.uploadProgress.artwork + Math.random() * 5, 100);
          const processingProgress = Math.min(prev.uploadProgress.processing + Math.random() * 3, 100);
          
          if (newProgress >= 100) {
            clearInterval(progressInterval);
            return { 
              ...prev, 
              progress: 100, 
              step: 4,
              uploadProgress: { audio: 100, artwork: 100, processing: 100 }
            };
          }
          
          return { 
            ...prev, 
            progress: newProgress,
            uploadProgress: { audio: audioProgress, artwork: artworkProgress, processing: processingProgress }
          };
        });
      }, 300);

      // Make actual API call
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setState(prev => ({
          ...prev,
          progress: 100,
          step: 4,
          isProcessing: false,
          uploadProgress: { audio: 100, artwork: 100, processing: 100 }
        }));
      } else {
        throw new Error(result.message || 'Upload failed');
      }

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Upload failed. Please try again.',
        isProcessing: false,
        step: 2
      }));
    }
  };

  const renderStepContent = () => {
    switch (state.step) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <CloudArrowUpIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Upload Your Music</h2>
              <p className="text-gray-600 mt-2">Get your music distributed to 180+ platforms worldwide</p>
            </div>

            <div className="space-y-6">
              {/* Release Type Selection */}
              <ProfessionalCard>
                <div className="flex items-center mb-4">
                  <MusicalNoteIcon className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Release Type</h3>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {(['SINGLE', 'EP', 'ALBUM'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => handleMetadataChange('type', type)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        state.metadata.type === type
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-2">
                          {type === 'SINGLE' ? '🎵' : type === 'EP' ? '📀' : '💿'}
                        </div>
                        <div className="font-medium">{type}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {type === 'SINGLE' ? '1 track' : type === 'EP' ? '2-6 tracks' : '7+ tracks'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </ProfessionalCard>

              {/* Tracks Section */}
              <ProfessionalCard>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <PlayIcon className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">Tracks ({state.tracks.length})</h3>
                  </div>
                  <ProfessionalButton
                    variant="outline"
                    size="sm"
                    onClick={addTrack}
                    disabled={state.tracks.length >= 20}
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add Track
                  </ProfessionalButton>
                </div>

                <div className="space-y-4">
                  {state.tracks.map((track, index) => (
                    <div key={track.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">Track {index + 1}</h4>
                        {state.tracks.length > 1 && (
                          <ProfessionalButton
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTrack(track.id)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </ProfessionalButton>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Track Title *
                          </label>
                          <input
                            type="text"
                            value={track.title}
                            onChange={(e) => handleTrackTitleChange(track.id, e.target.value)}
                            className="form-input"
                            placeholder="Enter track title"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Audio File *
                          </label>
                          <FileUpload
                            onFileSelect={(file) => handleTrackAudioFile(track.id, file)}
                            accept=".mp3,.wav,.flac"
                            maxSize={50}
                          />
                        </div>
                      </div>

                      {!track.validation.valid && (
                        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center">
                            <ExclamationTriangleIcon className="h-4 w-4 text-red-500 mr-2" />
                            <p className="text-sm text-red-700">{track.validation.error}</p>
                          </div>
                        </div>
                      )}

                      {track.audioFile && track.validation.valid && (
                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <MusicalNoteIcon className="h-5 w-5 text-green-600 mr-2" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{track.audioFile.name}</p>
                                <p className="text-xs text-gray-500">
                                  {(track.audioFile.size / (1024 * 1024)).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <ProfessionalButton
                              variant="ghost"
                              size="sm"
                              onClick={() => updateTrack(track.id, 'audioFile', null)}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </ProfessionalButton>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ProfessionalCard>

              {/* Artwork Upload */}
              <ProfessionalCard>
                <div className="flex items-center mb-4">
                  <PhotoIcon className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Cover Art</h3>
                </div>
                <FileUpload
                  onFileSelect={handleArtworkFile}
                  accept=".jpg,.jpeg,.png,.webp"
                  maxSize={10}
                />
                {!state.fileValidation.artwork.valid && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                      <ExclamationTriangleIcon className="h-4 w-4 text-red-500 mr-2" />
                      <p className="text-sm text-red-700">{state.fileValidation.artwork.error}</p>
                    </div>
                  </div>
                )}
                {state.artworkFile && state.fileValidation.artwork.valid && (
                  <div className="mt-4">
                    <img
                      src={URL.createObjectURL(state.artworkFile)}
                      alt="Cover art preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-sm text-gray-600">{state.artworkFile.name}</p>
                      <ProfessionalButton
                        variant="ghost"
                        size="sm"
                        onClick={() => setState(prev => ({ ...prev, artworkFile: null }))}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </ProfessionalButton>
                    </div>
                  </div>
                )}
              </ProfessionalCard>
            </div>

            <div className="flex justify-center">
              <ProfessionalButton
                variant="primary"
                size="lg"
                onClick={() => setState(prev => ({ ...prev, step: 2 }))}
                disabled={
                  !state.artworkFile || 
                  !state.tracks.some(track => track.audioFile && track.validation.valid)
                }
              >
                Continue to Metadata
              </ProfessionalButton>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <MusicalNoteIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Release Information</h2>
              <p className="text-gray-600 mt-2">Provide details about your release</p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Release Title *
                  </label>
                  <input
                    type="text"
                    value={state.metadata.title}
                    onChange={(e) => handleMetadataChange('title', e.target.value)}
                    className="form-input"
                    placeholder="Enter release title"
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
                    className="form-input"
                    placeholder="Enter artist name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Release Date
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
                    <option value="pop">Pop</option>
                    <option value="rock">Rock</option>
                    <option value="hip-hop">Hip-Hop</option>
                    <option value="electronic">Electronic</option>
                    <option value="jazz">Jazz</option>
                    <option value="classical">Classical</option>
                    <option value="country">Country</option>
                    <option value="r&b">R&B</option>
                    <option value="reggae">Reggae</option>
                    <option value="other">Other</option>
                  </select>
                </div>
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
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="it">Italian</option>
                  <option value="pt">Portuguese</option>
                  <option value="ar">Arabic</option>
                  <option value="zh">Chinese</option>
                  <option value="ja">Japanese</option>
                  <option value="ko">Korean</option>
                </select>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <ProfessionalButton
                variant="outline"
                onClick={() => setState(prev => ({ ...prev, step: 1 }))}
              >
                Back
              </ProfessionalButton>
              <ProfessionalButton
                variant="primary"
                onClick={handleUpload}
                disabled={!state.metadata.title || !state.metadata.artist}
              >
                Upload Release
              </ProfessionalButton>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="text-center space-y-8">
            <div className="mx-auto h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center">
              <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Processing Your Release</h2>
              <p className="text-gray-600 mt-2">We're preparing your music for distribution</p>
            </div>
            
            {/* Enhanced Progress Tracking */}
            <div className="max-w-md mx-auto space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Audio Upload</span>
                  <span className="text-gray-900">{Math.round(state.uploadProgress.audio)}%</span>
                </div>
                <ProgressBar progress={state.uploadProgress.audio} />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Image Processing</span>
                  <span className="text-gray-900">{Math.round(state.uploadProgress.artwork)}%</span>
                </div>
                <ProgressBar progress={state.uploadProgress.artwork} />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Database Processing</span>
                  <span className="text-gray-900">{Math.round(state.uploadProgress.processing)}%</span>
                </div>
                <ProgressBar progress={state.uploadProgress.processing} />
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-600">Overall Progress</span>
                  <span className="text-blue-600">{Math.round(state.progress)}%</span>
                </div>
                <ProgressBar progress={state.progress} />
              </div>
            </div>
            
            <div className="text-sm text-gray-500">
              {state.progress < 30 && "Uploading files..."}
              {state.progress >= 30 && state.progress < 70 && "Processing metadata..."}
              {state.progress >= 70 && state.progress < 100 && "Finalizing release..."}
              {state.progress === 100 && "Complete!"}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Release Uploaded Successfully!</h2>
              <p className="text-gray-600 mt-2">Now choose how to distribute your music to 100+ platforms</p>
            </div>
            
            <DSPDistribution 
              releaseId={`release_${Date.now()}`}
              onDistributionComplete={() => setState(prev => ({ ...prev, step: 5 }))}
            />
          </div>
        );

      case 5:
        return (
          <div className="text-center space-y-8">
            <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
              <GlobeAltIcon className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Distribution Complete!</h2>
              <p className="text-gray-600 mt-2">Your music is now being distributed to all selected platforms</p>
            </div>
            <div className="flex justify-center space-x-4">
              <ProfessionalButton variant="primary" asChild>
                <Link href="/dashboard">View Dashboard</Link>
              </ProfessionalButton>
              <ProfessionalButton variant="outline" onClick={() => window.location.reload()}>
                Upload Another
              </ProfessionalButton>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <ProfessionalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center">
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-600 mr-4">
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Upload Music</h1>
            <p className="text-gray-600">Distribute your music to 180+ platforms worldwide</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-8">
          {['Files', 'Metadata', 'Processing', 'Distribution', 'Complete'].map((step, index) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  state.step > index + 1
                    ? 'bg-green-600 text-white'
                    : state.step === index + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                }`}
              >
                {state.step > index + 1 ? <CheckCircleIcon className="h-5 w-5" /> : index + 1}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">{step}</span>
              {index < 4 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  state.step > index + 1 ? 'bg-green-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Error Alert */}
        {state.error && (
          <Alert type="error">
            {state.error}
          </Alert>
        )}

        {/* Main Content */}
        <ProfessionalCard className="p-8">
          {renderStepContent()}
        </ProfessionalCard>
      </div>
    </ProfessionalLayout>
  );
}