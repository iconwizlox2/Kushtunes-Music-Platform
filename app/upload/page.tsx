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
import {
  CloudArrowUpIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PhotoIcon,
  PlayIcon,
  PauseIcon,
  TrashIcon,
  MusicalNoteIcon
} from '@/components/ui/Icons';

interface UploadState {
  step: number;
  audioFile: File | null;
  artworkFile: File | null;
  metadata: {
    title: string;
    artist: string;
    releaseDate: string;
    genre: string;
    language: string;
  };
  progress: number;
  isProcessing: boolean;
  error: string | null;
}

export default function UploadPage() {
  const [state, setState] = useState<UploadState>({
    step: 1,
    audioFile: null,
    artworkFile: null,
    metadata: {
      title: '',
      artist: '',
      releaseDate: '',
      genre: '',
      language: ''
    },
    progress: 0,
    isProcessing: false,
    error: null
  });

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleAudioFile = (file: File) => {
    setState(prev => ({ ...prev, audioFile: file, error: null }));
  };

  const handleArtworkFile = (file: File) => {
    setState(prev => ({ ...prev, artworkFile: file, error: null }));
  };

  const handleMetadataChange = (field: string, value: string) => {
    setState(prev => ({
      ...prev,
      metadata: { ...prev.metadata, [field]: value }
    }));
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleUpload = async () => {
    if (!state.audioFile || !state.artworkFile) {
      setState(prev => ({ ...prev, error: 'Please upload both audio and artwork files' }));
      return;
    }

    if (!state.metadata.title || !state.metadata.artist) {
      setState(prev => ({ ...prev, error: 'Please fill in all required fields' }));
      return;
    }

    setState(prev => ({ ...prev, isProcessing: true, step: 3, progress: 0 }));

    try {
      // Simulate file upload progress
      const progressInterval = setInterval(() => {
        setState(prev => {
          const newProgress = prev.progress + Math.random() * 15;
          if (newProgress >= 100) {
            clearInterval(progressInterval);
            return { ...prev, progress: 100, step: 4 };
          }
          return { ...prev, progress: newProgress };
        });
      }, 200);

      // In a real app, you would upload files here
      await new Promise(resolve => setTimeout(resolve, 3000));

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Upload failed. Please try again.',
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Audio Upload */}
              <ProfessionalCard>
                <div className="flex items-center mb-4">
                  <PlayIcon className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Audio File</h3>
                </div>
                <FileUpload
                  onFileSelect={handleAudioFile}
                  accept=".mp3,.wav,.flac"
                  maxSize={100}
                />
                {state.audioFile && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <MusicalNoteIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{state.audioFile.name}</p>
                          <p className="text-xs text-gray-500">
                            {(state.audioFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ProfessionalButton variant="ghost" size="sm" onClick={handlePlayPause}>
                          {isPlaying ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
                        </ProfessionalButton>
                        <ProfessionalButton
                          variant="ghost"
                          size="sm"
                          onClick={() => setState(prev => ({ ...prev, audioFile: null }))}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </ProfessionalButton>
                      </div>
                    </div>
                    <audio
                      ref={audioRef}
                      src={state.audioFile ? URL.createObjectURL(state.audioFile) : undefined}
                      onEnded={() => setIsPlaying(false)}
                      className="hidden"
                    />
                  </div>
                )}
              </ProfessionalCard>

              {/* Artwork Upload */}
              <ProfessionalCard>
                <div className="flex items-center mb-4">
                  <PhotoIcon className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Cover Art</h3>
                </div>
                <FileUpload
                  onFileSelect={handleArtworkFile}
                  accept=".jpg,.jpeg,.png"
                  maxSize={10}
                />
                {state.artworkFile && (
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
                disabled={!state.audioFile || !state.artworkFile}
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
                    Track Title *
                  </label>
                  <input
                    type="text"
                    value={state.metadata.title}
                    onChange={(e) => handleMetadataChange('title', e.target.value)}
                    className="form-input"
                    placeholder="Enter track title"
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
            <div className="max-w-md mx-auto">
              <ProgressBar progress={state.progress} />
            </div>
            <div className="text-sm text-gray-500">
              This may take a few minutes...
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center space-y-8">
            <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Release Uploaded Successfully!</h2>
              <p className="text-gray-600 mt-2">Your music is now being distributed to all platforms</p>
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
          {['Files', 'Metadata', 'Processing', 'Complete'].map((step, index) => (
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
              {index < 3 && (
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