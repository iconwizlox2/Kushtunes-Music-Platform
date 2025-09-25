import { randomBytes } from 'crypto';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  fileInfo?: {
    name: string;
    size: number;
    type: string;
    extension: string;
  };
}

export interface UploadProgress {
  fileId: string;
  fileName: string;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
}

// File validation constants
export const FILE_CONSTRAINTS = {
  AUDIO: {
    MAX_SIZE: 50 * 1024 * 1024, // 50MB
    ALLOWED_TYPES: ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/mp3'],
    ALLOWED_EXTENSIONS: ['.mp3', '.wav', '.flac']
  },
  IMAGE: {
    MAX_SIZE: 2 * 1024 * 1024, // 2MB
    ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp']
  }
};

// Validate audio file
export function validateAudioFile(file: File): FileValidationResult {
  const { MAX_SIZE, ALLOWED_TYPES, ALLOWED_EXTENSIONS } = FILE_CONSTRAINTS.AUDIO;
  
  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Please upload MP3, WAV, or FLAC files only'
    };
  }
  
  // Check file size
  if (file.size > MAX_SIZE) {
    return {
      valid: false,
      error: `File size must be less than ${Math.round(MAX_SIZE / (1024 * 1024))}MB`
    };
  }
  
  // Get file extension
  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: 'Invalid file extension'
    };
  }
  
  return {
    valid: true,
    fileInfo: {
      name: file.name,
      size: file.size,
      type: file.type,
      extension
    }
  };
}

// Validate image file
export function validateImageFile(file: File): FileValidationResult {
  const { MAX_SIZE, ALLOWED_TYPES, ALLOWED_EXTENSIONS } = FILE_CONSTRAINTS.IMAGE;
  
  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Please upload JPG, PNG, or WebP files only'
    };
  }
  
  // Check file size
  if (file.size > MAX_SIZE) {
    return {
      valid: false,
      error: `File size must be less than ${Math.round(MAX_SIZE / (1024 * 1024))}MB`
    };
  }
  
  // Get file extension
  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: 'Invalid file extension'
    };
  }
  
  return {
    valid: true,
    fileInfo: {
      name: file.name,
      size: file.size,
      type: file.type,
      extension
    }
  };
}

// Generate unique file ID
export function generateFileId(): string {
  return randomBytes(16).toString('hex');
}

// Generate safe filename
export function generateSafeFilename(originalName: string, fileId: string): string {
  const extension = originalName.split('.').pop()?.toLowerCase() || '';
  const sanitizedName = originalName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase();
  
  return `${fileId}_${sanitizedName}`;
}

// Create upload directory structure
export async function createUploadDirectories(userId: string): Promise<string> {
  const baseDir = join(process.cwd(), 'uploads');
  const userDir = join(baseDir, userId);
  const audioDir = join(userDir, 'audio');
  const imageDir = join(userDir, 'images');
  
  // Create directories if they don't exist
  if (!existsSync(baseDir)) await mkdir(baseDir, { recursive: true });
  if (!existsSync(userDir)) await mkdir(userDir, { recursive: true });
  if (!existsSync(audioDir)) await mkdir(audioDir, { recursive: true });
  if (!existsSync(imageDir)) await mkdir(imageDir, { recursive: true });
  
  return userDir;
}

// Save uploaded file
export async function saveUploadedFile(
  file: File,
  userId: string,
  fileType: 'audio' | 'image'
): Promise<{ success: boolean; filePath?: string; error?: string }> {
  try {
    const fileId = generateFileId();
    const safeFilename = generateSafeFilename(file.name, fileId);
    const userDir = await createUploadDirectories(userId);
    
    const filePath = join(userDir, fileType, safeFilename);
    
    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Write file to disk
    await writeFile(filePath, buffer);
    
    return {
      success: true,
      filePath: filePath.replace(process.cwd(), '')
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save file'
    };
  }
}

// Process audio file metadata
export async function processAudioMetadata(filePath: string): Promise<{
  duration?: number;
  bitrate?: number;
  sampleRate?: number;
  channels?: number;
  format?: string;
}> {
  // This would typically use a library like node-ffmpeg or music-metadata
  // For now, return mock data
  return {
    duration: 180, // 3 minutes
    bitrate: 320,
    sampleRate: 44100,
    channels: 2,
    format: 'mp3'
  };
}

// Process image metadata
export async function processImageMetadata(filePath: string): Promise<{
  width?: number;
  height?: number;
  format?: string;
  colorSpace?: string;
}> {
  // This would typically use a library like sharp or jimp
  // For now, return mock data
  return {
    width: 3000,
    height: 3000,
    format: 'jpeg',
    colorSpace: 'sRGB'
  };
}

// Generate file hash for deduplication
export async function generateFileHash(buffer: Buffer): Promise<string> {
  const crypto = await import('crypto');
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

// Check if file already exists (deduplication)
export async function checkFileExists(hash: string): Promise<boolean> {
  // This would check against a database of file hashes
  // For now, return false
  return false;
}

// Clean up temporary files
export async function cleanupTempFiles(filePaths: string[]): Promise<void> {
  const { unlink } = await import('fs/promises');
  
  for (const filePath of filePaths) {
    try {
      await unlink(filePath);
    } catch (error) {
      console.error(`Failed to delete temp file ${filePath}:`, error);
    }
  }
}

// Get file size in human readable format
export function formatFileSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

// Get file type category
export function getFileCategory(mimeType: string): 'audio' | 'image' | 'other' {
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.startsWith('image/')) return 'image';
  return 'other';
}

// Validate file upload progress
export function validateUploadProgress(progress: UploadProgress): boolean {
  return (
    progress.progress >= 0 &&
    progress.progress <= 100 &&
    ['uploading', 'processing', 'completed', 'error'].includes(progress.status)
  );
}

