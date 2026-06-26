import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const file = formData.get('file') as Blob;
    
    if (!name || !file) {
      return NextResponse.json(
        { success: false, error: 'Voice name and file are required' }, 
        { status: 400 }
      );
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
       return NextResponse.json(
         { success: false, error: 'Server misconfiguration: API Key missing' }, 
         { status: 500 }
       );
    }

    // Prepare data for ElevenLabs API
    const elevenLabsFormData = new FormData();
    elevenLabsFormData.append('name', name);
    if (description) {
      elevenLabsFormData.append('description', description);
    }
    elevenLabsFormData.append('files', file); 
    // You can optionally pass labels
    elevenLabsFormData.append('labels', '{"type": "cloned", "app": "kivilcim"}');

    const response = await fetch('https://api.elevenlabs.io/v1/voices/add', {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        // FormData automatically sets the boundary header for multipart/form-data
      },
      body: elevenLabsFormData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('ElevenLabs Add Voice Error:', errorData);
      return NextResponse.json(
        { 
          success: false, 
          error: `ElevenLabs Error: ${response.status} ${response.statusText}`, 
          details: errorData 
        }, 
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, voiceId: data.voice_id });
    
  } catch (error: any) {
    console.error('Voice cloning error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clone voice', details: error.message },
      { status: 500 }
    );
  }
}
