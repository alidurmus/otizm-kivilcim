import { NextRequest, NextResponse } from 'next/server';
import { AudioService } from '@/lib/services/audio-service';
import { AudioFileCreate } from '@/lib/types/audio';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const module = searchParams.get('module');
    const stats = searchParams.get('stats');

    // Get statistics
    if (stats === 'true') {
      const audioStats = await AudioService.getAudioFileStats();
      return NextResponse.json(audioStats);
    }

    // Get by category
    if (category) {
      const audioFiles = await AudioService.getAudioFilesByCategory(category);
      return NextResponse.json(audioFiles);
    }

    // Get by module
    if (module) {
      const audioFiles = await AudioService.getAudioFilesByModule(module);
      return NextResponse.json(audioFiles);
    }

    // Get all audio files
    const audioFiles = await AudioService.getAllAudioFiles();
    return NextResponse.json(audioFiles);
  } catch (error) {
    console.error('Error fetching audio files:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audio files' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: AudioFileCreate = await request.json();
    
    // Validate required fields
    if (!body.title || !body.filename || !body.filePath || !body.category || !body.module) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const audioFileId = await AudioService.createAudioFile(body);
    
    return NextResponse.json(
      { id: audioFileId, message: 'Audio file created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating audio file:', error);
    return NextResponse.json(
      { error: 'Failed to create audio file' },
      { status: 500 }
    );
  }
} 