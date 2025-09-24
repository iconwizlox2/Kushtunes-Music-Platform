"use client";

import { useState, useRef, useEffect } from 'react';
import { MobileOptimizedInput, MobileModal } from './MobileUI';
import { Button } from './ui/Button';
import { formatBytes } from '@/lib/utils';

interface MobileUploadFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function MobileUploadForm({ onSubmit, onCancel }: MobileUploadFormProps) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [releaseType, setReleaseType] = useState<"single" | "ep" | "album">("single");
  const [date, setDate] = useState("");
  const [audio, setAudio] = useState<File | null>(null);
  const [art, setArt] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioUrl = audio ? URL.createObjectURL(audio) : "";
  const artUrl = art ? URL.createObjectURL(art) : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onSubmit({
      title,
      artist,
      releaseType,
      date,
      audio,
      art
    });
    
    setIsUploading(false);
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return title.trim() && artist.trim();
      case 2:
        return date && audio && art;
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <MobileModal isOpen={true} onClose={onCancel} title="New Release">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step indicator */}
        <div className="flex items-center justify-center space-x-2 mb-6">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= currentStep
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
              }`}
            >
              {step}
            </div>
          ))}
        </div>

        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="space-y-4 mobile-fade-in">
            <MobileOptimizedInput
              label="Track Title"
              value={title}
              onChange={setTitle}
              placeholder="Enter track title"
              required
              autoComplete="off"
            />
            
            <MobileOptimizedInput
              label="Artist Name"
              value={artist}
              onChange={setArtist}
              placeholder="Enter artist name"
              required
              autoComplete="off"
            />
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Release Type
              </label>
              <select
                value={releaseType}
                onChange={(e) => setReleaseType(e.target.value as any)}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm transition-colors focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="single">Single</option>
                <option value="ep">EP</option>
                <option value="album">Album</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 2: Files */}
        {currentStep === 2 && (
          <div className="space-y-4 mobile-fade-in">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Release Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm transition-colors focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Audio File (WAV/FLAC)
              </label>
              <input
                type="file"
                accept=".wav,.flac,audio/wav,audio/flac"
                onChange={(e) => setAudio(e.target.files?.[0] ?? null)}
                required
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm transition-colors focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
              {audio && (
                <p className="text-xs text-slate-500">
                  {audio.name} • {formatBytes(audio.size)}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Artwork (min 3000×3000, JPG/PNG)
              </label>
              <input
                type="file"
                accept="image/png,image/jpeg"
                onChange={(e) => setArt(e.target.files?.[0] ?? null)}
                required
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm transition-colors focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
              {art && (
                <p className="text-xs text-slate-500">
                  {art.name} • {formatBytes(art.size)}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Preview */}
        {currentStep === 3 && (
          <div className="space-y-4 mobile-fade-in">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Preview</h3>
            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="h-16 w-16 overflow-hidden rounded-md bg-slate-200">
                  {artUrl ? (
                    <img src={artUrl} alt="Artwork preview" className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{title || "Untitled"}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{artist || "Unknown Artist"}</p>
                  {audioUrl ? (
                    <audio ref={audioRef} src={audioUrl} controls className="mt-2 w-full" />
                  ) : (
                    <p className="mt-2 text-xs text-slate-500">Upload audio to preview.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex gap-3 pt-4">
          {currentStep > 1 && (
            <Button
              type="button"
              intent="ghost"
              onClick={prevStep}
              className="flex-1"
            >
              Back
            </Button>
          )}
          
          {currentStep < 3 ? (
            <Button
              type="button"
              onClick={nextStep}
              disabled={!canProceed()}
              className="flex-1"
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isUploading || !canProceed()}
              className="flex-1"
            >
              {isUploading ? "Uploading..." : "Create Release"}
            </Button>
          )}
        </div>
      </form>
    </MobileModal>
  );
}


