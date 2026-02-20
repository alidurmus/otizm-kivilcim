import { NextRequest, NextResponse } from 'next/server';
import { AudioService } from '@/lib/services/audio-service';
import { AudioFileUpdate } from '@/lib/types/audio';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const audioFile = await AudioService.getAudioFileById(params.id);
    
    if (!audioFile) {
      return NextResponse.json(
        { error: 'Audio file not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(audioFile);
  } catch (error) {
    console.error('Error fetching audio file:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audio file' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: AudioFileUpdate = await request.json();
    
    const success = await AudioService.updateAudioFile(params.id, body);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update audio file' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Audio file updated successfully' }
    );
  } catch (error) {
    console.error('Error updating audio file:', error);
    return NextResponse.json(
      { error: 'Failed to update audio file' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await AudioService.deleteAudioFile(params.id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete audio file' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Audio file deleted successfully' }
    );
  } catch (error) {
    console.error('Error deleting audio file:', error);
    return NextResponse.json(
      { error: 'Failed to delete audio file' },
      { status: 500 }
    );
  }
} 