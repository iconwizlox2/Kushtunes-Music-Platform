import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'audio' or 'artwork'

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      );
    }

    // Mock file validation
    const maxSize = type === 'audio' ? 500 * 1024 * 1024 : 10 * 1024 * 1024; // 500MB for audio, 10MB for artwork
    const allowedTypes = type === 'audio' 
      ? ['audio/wav', 'audio/flac', 'audio/mpeg'] 
      : ['image/jpeg', 'image/png'];

    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: `File too large. Maximum size: ${type === 'audio' ? '500MB' : '10MB'}` },
        { status: 400 }
      );
    }

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: `Invalid file type. Allowed: ${allowedTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Mock file upload - in production, upload to cloud storage
    const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const uploadResult = {
      id: fileId,
      filename: file.name,
      size: file.size,
      type: file.type,
      url: `https://storage.kushtunes.com/${fileId}`,
      uploadedAt: new Date().toISOString()
    };

    return NextResponse.json({ success: true, data: uploadResult });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'File upload failed' },
      { status: 500 }
    );
  }
}

