import { NextRequest, NextResponse } from 'next/server';

// Yeni eklenen voice ID'ler
const NEW_VOICE_IDS = [
  'tMlsw9ihFf5L7S43dohH',
  'xyqF3vGMQlPk3e7yA4DI', 
  '9GYMX9eMWSq1yjiwXb7B',
  'V6TFTAE0gaN8LtBwl70x',
  'eUUtjbi66JcWz3T4Gvvo',
  'mBUB5zYuPwfVE6DTcEjf',
  'jbJMQWv1eS4YjQ6PCcn6'
];

interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  samples?: Array<{
    sample_id?: string;
    file_name?: string;
    mime_type?: string;
    size_bytes?: number;
    hash?: string;
  }>;
  category?: string;
  fine_tuning?: {
    language?: string;
    is_allowed_to_fine_tune?: boolean;
    finetuning_requested_at?: string;
    finetuning_state?: string;
    verification_attempts?: Array<{
      text?: string;
      date_unix?: number;
      accepted?: boolean;
      similarity?: number;
      levenshtein?: number;
      recording?: {
        recording_id?: string;
        mime_type?: string;
        size_bytes?: number;
        upload_date_unix?: number;
        transcription?: string;
      };
    }>;
    verification_failures?: string[];
    verification_attempts_count?: number;
    slice_ids?: string[];
    manual_verification?: {
      extra_text?: string;
      request_time_unix?: number;
      files?: Array<{
        file_id?: string;
        file_name?: string;
        mime_type?: string;
        size_bytes?: number;
      }>;
    };
    manual_verification_requested?: boolean;
  };
  labels?: { [key: string]: string };
  description?: string;
  preview_url?: string;
  available_for_tiers?: string[];
  settings?: {
    stability?: number;
    similarity_boost?: number;
    style?: number;
    use_speaker_boost?: boolean;
  };
  sharing?: {
    status?: string;
    history_item_sample_id?: string;
    original_voice_id?: string;
    public_owner_id?: string;
    liked_by_count?: number;
    cloned_by_count?: number;
    name?: string;
    description?: string;
    labels?: { [key: string]: string };
    review_status?: string;
    review_message?: string;
    enabled_in_library?: boolean;
    instagram_username?: string;
    twitter_username?: string;
    youtube_username?: string;
    tiktok_username?: string;
  };
  high_quality_base_model_ids?: string[];
  safety_control?: string;
  voice_verification?: {
    requires_verification?: boolean;
    is_verified?: boolean;
    verification_failures?: string[];
    verification_attempts_count?: number;
    language?: string;
  };
  owner_id?: string;
  permission_on_resource?: string;
}

// Helper function to detect gender from voice name
function detectGenderFromName(name: string): 'male' | 'female' | 'unknown' {
  const maleNames = ['adam', 'josh', 'antoni', 'daniel', 'ethan', 'marcus', 'david', 'mike', 'john'];
  const femaleNames = ['bella', 'rachel', 'domi', 'elli', 'sarah', 'alice', 'anna', 'emma', 'sophia'];
  
  const lowerName = name.toLowerCase();
  
  if (maleNames.some(male => lowerName.includes(male))) return 'male';
  if (femaleNames.some(female => lowerName.includes(female))) return 'female';
  
  return 'unknown';
}

export async function GET(_request: NextRequest) {
  try {
    // Fetching new voices from ElevenLabs API
    
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      console.error('❌ ElevenLabs API key not found');
      return NextResponse.json(
        { 
          success: false, 
          error: 'ElevenLabs API key not configured',
          newVoices: []
        },
        { status: 500 }
      );
    }

    // Fetch all voices from ElevenLabs API
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: {
        'Accept': 'application/json',
        'xi-api-key': apiKey,
      },
    });

    if (!response.ok) {
      console.error(`❌ ElevenLabs API error: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { 
          success: false, 
          error: `ElevenLabs API error: ${response.status}`,
          newVoices: []
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (!data.voices || !Array.isArray(data.voices)) {
      console.warn('⚠️ Invalid response format from ElevenLabs API');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid response format from ElevenLabs API',
          newVoices: []
        },
        { status: 500 }
      );
    }

    // Filter and format new voices
    const newVoices = data.voices
      .filter((voice: ElevenLabsVoice) => NEW_VOICE_IDS.includes(voice.voice_id))
      .map((voice: ElevenLabsVoice) => {
        // Generate fallback name if missing
        const voiceName = voice.name || `Voice_${voice.voice_id.slice(0, 8)}`;
        const description = voice.description || 
                          (voice.labels && Object.values(voice.labels).join(', ')) ||
                          'ElevenLabs voice';
        
        return {
          id: voice.voice_id,
          voice_id: voice.voice_id, // Keep both for compatibility
          name: voiceName,
          voice_name: voiceName, // Alternative field name
          description: description,
          category: voice.category || 'generated',
          language: voice.fine_tuning?.language || 'tr',
          isVerified: voice.voice_verification?.is_verified || false,
          labels: voice.labels || {},
          gender: detectGenderFromName(voiceName),
          settings: voice.settings || {
            stability: 0.7,
            similarity_boost: 0.8,
            style: 0.5,
            use_speaker_boost: true
          },
          preview_url: voice.preview_url,
          high_quality_base_model_ids: voice.high_quality_base_model_ids || []
        };
      });

    // Successfully processed new voices

    return NextResponse.json({
      success: true,
      newVoices: newVoices,
      totalRequested: NEW_VOICE_IDS.length,
      totalFound: newVoices.length,
      message: `Found ${newVoices.length} voices out of ${NEW_VOICE_IDS.length} requested`
    });

  } catch (error) {
    console.error('❌ Error in voices API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        newVoices: []
      },
      { status: 500 }
    );
  }
}

// POST endpoint for specific voice details
export async function POST(request: NextRequest) {
  try {
    const { voiceId } = await request.json();
    
    if (!voiceId) {
      return NextResponse.json(
        { success: false, error: 'Voice ID is required' },
        { status: 400 }
      );
    }

    // Fetching voice details
    
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'ElevenLabs API key not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(`https://api.elevenlabs.io/v1/voices/${voiceId}`, {
      headers: {
        'Accept': 'application/json',
        'xi-api-key': apiKey,
      },
    });

    if (!response.ok) {
      console.error(`❌ Voice details error: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { success: false, error: `Voice not found: ${response.status}` },
        { status: response.status }
      );
    }

    const voiceData = await response.json();

    // Format voice details with fallback name
    const formattedVoice = {
      id: voiceData.voice_id,
      name: voiceData.name || `Voice_${voiceData.voice_id.slice(0, 8)}`,
      description: voiceData.description || 'ElevenLabs voice',
      category: voiceData.category || 'generated',
      language: voiceData.fine_tuning?.language || 'tr',
      isVerified: voiceData.voice_verification?.is_verified || false,
      labels: voiceData.labels || {},
      gender: detectGenderFromName(voiceData.name || ''),
      settings: voiceData.settings,
      preview_url: voiceData.preview_url
    };

    return NextResponse.json({
      success: true,
      voice: formattedVoice
    });

  } catch (error) {
    console.error('❌ Error fetching voice details:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 