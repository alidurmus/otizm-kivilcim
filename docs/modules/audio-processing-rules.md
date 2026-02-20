# Ses Dosyası İşleme Kuralları - Audio Processing Rules

**Oluşturulma Tarihi:** 2025-01-07  
**Bölüm Bazlı Kural Sistemi:** Ses işlemi yapılmadan önce bu dokümant MUTLAKA okunacak  
**Kapsam:** Tüm modüller için ses dosyası oluşturma, test etme ve doğrulama

---

## 🎯 **ANA KURAL: HER SES İŞLEMİ ÖNCESİ BU DOSYAYI OKU**

### 📋 Ses İşlemi Workflow'u
```typescript
AUDIO_PROCESSING_WORKFLOW = {
  step1: 'READ_THIS_DOCUMENT',           // Bu kuralları oku
  step2: 'READ_MODULE_RULES',            // İlgili modül kurallarını oku
  step3: 'AUDIT_EXISTING_FILES',         // Mevcut dosyaları kontrol et
  step4: 'STT_TEST_CURRENT_FILES',       // STT ile mevcut dosyaları test et
  step5: 'IDENTIFY_CORRUPTED_FILES',     // Bozuk dosyaları tespit et
  step6: 'REGENERATE_PROBLEMATIC_FILES', // Sorunlu dosyaları yeniden oluştur
  step7: 'VERIFY_FILE_LOCATIONS',        // Dosya konumlarını doğrula
  step8: 'UPDATE_MODULE_CONSTANTS'       // Audio constants'ı güncelle
}
```

---

## 🔊 **VOICE SYSTEM HIERARCHY**

### 🎭 Primary Voice Characters (Gender-Balanced)
```typescript
VOICE_CHARACTERS = {
  // Ana Karakter (Default)
  primary: {
    name: 'Gülsu',
    voiceId: '9BWtsMINqrJLrRacOk9x',
    type: 'female',
    characteristics: 'Nazik ve sakin kadın sesi',
    usage: 'Default continuity character for all modules'
  },
  
  // Content-Type Specific Voices
  contentVoices: {
    letter: {
      name: 'Adam',
      voiceId: 'pNInz6obpgDQGcFmaJgB',
      type: 'male',
      characteristics: 'Sakin ve açık erkek ses',
      usage: 'Letter pronunciation (alphabet-reading, literacy)'
    },
    word: {
      name: 'Rachel',
      voiceId: 'XnGjMXGXI2yQECd8GJ0z',
      type: 'female',
      characteristics: 'Profesyonel kadın ses',
      usage: 'Word pronunciation, numbers (vocabulary, mathematics)'
    },
    sentence: {
      name: 'Antoni',
      voiceId: 'ErXwobaYiN019PkySvjV',
      type: 'male',
      characteristics: 'Hikaye anlatıcısı tonu',
      usage: 'Instructions, storytelling (social-communication, writing)'
    },
    celebration: {
      name: 'Josh',
      voiceId: 'VR6AewLTigWG4xSOukaG',
      type: 'male',
      characteristics: 'Genç ve eğlenceli',
      usage: 'Celebrations, games (mathematics, music, puzzle)'
    }
  }
}
```

### 🎯 Module-Specific Voice Assignments
```typescript
MODULE_VOICE_ASSIGNMENTS = {
  'mathematics': {
    primary: 'Gülsu',
    welcome: 'Antoni',
    numbers: 'Rachel',
    instructions: 'Antoni',
    celebrations: 'Josh'
  },
  'alphabet-reading': {
    primary: 'Adam',
    letters: 'Adam',
    instructions: 'Antoni',
    celebrations: 'Josh'
  },
  'social-communication': {
    primary: 'Gülsu',
    stories: 'Antoni',
    emotions: 'Gülsu',
    celebrations: 'Josh'
  }
  // ... diğer modüller
}
```

---

## 📁 **FILE ORGANIZATION RULES**

### 🗂️ Audio Directory Structure
```
/public/audio/
├── letters/          # Harf telaffuzları (29 Türk alfabesi)
├── words/           # Kelime ve sayı telaffuzları
├── sentences/       # Cümle ve yönlendirmeler  
├── celebrations/    # Kutlama mesajları
├── numbers/         # DEPRECATED - words/ kullan
└── voices/          # Character-specific audio files
    ├── gulsu/
    ├── adam/
    ├── rachel/
    ├── antoni/
    └── josh/
```

### 📏 File Size Validation Rules
```typescript
FILE_SIZE_VALIDATION = {
  // Minimum dosya boyutları (corruption detection)
  minimumSizes: {
    letter: 5000,      // 5KB - tek harf için minimum
    word: 8000,        // 8KB - kelime için minimum  
    sentence: 15000,   // 15KB - cümle için minimum
    celebration: 10000  // 10KB - kutlama için minimum
  },
  
  // Maximum dosya boyutları (quality control)
  maximumSizes: {
    letter: 25000,     // 25KB - tek harf için maksimum
    word: 50000,       // 50KB - kelime için maksimum
    sentence: 150000,  // 150KB - cümle için maksimum
    celebration: 100000 // 100KB - kutlama için maksimum
  },
  
  // Corruption indicators
  corruptionSigns: {
    tooSmall: '< 1KB indicates corrupted file',
    tooLarge: '> 200KB indicates quality issue',
    emptyFile: '0 bytes = file generation failure'
  }
}
```

---

## 🧪 **STT TESTING PROTOCOL**

### 🔍 Speech-to-Text Validation Process
```typescript
STT_TESTING_PROTOCOL = {
  // 1. Automated STT Testing
  automated: {
    tool: 'Web Speech API',
    languages: ['tr-TR', 'tr'],
    confidence: 0.8,
    action: 'Test all audio files for correct transcription'
  },
  
  // 2. Manual Verification  
  manual: {
    process: 'Human ear verification',
    focus: 'Turkish pronunciation accuracy',
    criteria: 'Clear, natural, autism-friendly tone'
  },
  
  // 3. Expected Transcriptions
  expectedResults: {
    'bir.mp3': 'bir',
    'iki.mp3': 'iki',
    'uch.mp3': 'üç',
    'dort.mp3': 'dört',
    'besh.mp3': 'beş',
    'alti.mp3': 'altı',
    'yedi.mp3': 'yedi',
    'sekiz.mp3': 'sekiz', 
    'dokuz.mp3': 'dokuz',
    'on.mp3': 'on'
  }
}
```

### 🔨 File Regeneration Criteria
```typescript
REGENERATION_CRITERIA = {
  // Kesinlikle yeniden oluşturulması gerekenler
  mustRegenerate: [
    'File size < 1KB',
    'STT transcription confidence < 0.6',
    'Audio duration < 0.5 seconds',
    'Audio contains noise/distortion',
    'Wrong content transcribed'
  ],
  
  // İyileştirme gerektiren durumlar
  shouldImprove: [
    'STT confidence 0.6-0.8 range',
    'Audio quality low but understandable',
    'Pronunciation slightly off',
    'Audio too fast/slow for autism-friendly pace'
  ]
}
```

---

## 🇹🇷 **TURKISH LANGUAGE SPECIFICATIONS**

### 📝 Turkish Character Mapping
```typescript
TURKISH_CHARACTER_MAPPING = {
  // URL-safe filename mapping for Turkish characters
  filenameMappings: {
    'ç': 'ch',
    'ğ': 'gh', 
    'ı': 'ii',
    'ö': 'oh',
    'ş': 'sh',
    'ü': 'uh'
  },
  
  // Expected pronunciation guide
  pronunciationGuide: {
    'bir': 'beer',
    'iki': 'ee-kee',
    'üç': 'uuch',
    'dört': 'doort',
    'beş': 'besh',
    'altı': 'al-tuh',
    'yedi': 'ye-dee',
    'sekiz': 'se-keez',
    'dokuz': 'do-kooz',
    'on': 'ohn'
  }
}
```

### 🎯 Quality Standards for Turkish Audio
```typescript
TURKISH_AUDIO_QUALITY = {
  pronunciation: {
    clarity: 'Crystal clear Turkish pronunciation',
    pace: 'Slow enough for autism-friendly comprehension',
    tone: 'Calm, patient, encouraging',
    accent: 'Standard Istanbul Turkish'
  },
  
  technical: {
    format: 'MP3',
    bitrate: '128kbps minimum',
    sampleRate: '44.1kHz',
    mono: 'Preferred for voice content',
    normalize: 'Audio levels normalized'
  }
}
```

---

## ⚠️ **CRITICAL OPERATION RULES**

### 🚨 Before Any Audio Operation
```typescript
PRE_OPERATION_CHECKLIST = [
  '✅ Read this audio processing rules document',
  '✅ Read target module-specific rules (docs/modules/{module}.md)',
  '✅ Identify target voice character for content type',
  '✅ Check existing file inventory',
  '✅ Backup existing files before regeneration',
  '✅ Verify ElevenLabs API key availability',
  '✅ Test API connection and character availability'
]
```

### 🔧 File Generation Process
```typescript
AUDIO_GENERATION_PROCESS = {
  step1: {
    action: 'CONTENT_ANALYSIS',
    detail: 'Analyze text content to determine type (letter/word/sentence/celebration)'
  },
  step2: {
    action: 'VOICE_SELECTION', 
    detail: 'Select appropriate voice character based on content type and module rules'
  },
  step3: {
    action: 'API_CALL',
    detail: 'Call ElevenLabs API with correct voice ID and text'
  },
  step4: {
    action: 'FILE_VALIDATION',
    detail: 'Check file size, duration, and basic audio properties'
  },
  step5: {
    action: 'STT_VERIFICATION',
    detail: 'Use Speech-to-Text to verify content accuracy'
  },
  step6: {
    action: 'FILE_PLACEMENT',
    detail: 'Place file in correct directory with proper naming'
  },
  step7: {
    action: 'CONSTANTS_UPDATE',
    detail: 'Update audio-constants.ts mapping if needed'
  }
}
```

### 🧹 File Cleanup and Maintenance
```typescript
MAINTENANCE_RULES = {
  // Regular cleanup tasks
  cleanup: {
    removeBackups: 'Remove -old.mp3 backup files after verification',
    consolidateVersions: 'Keep only the best version of each audio file',
    organizationCheck: 'Ensure files in correct directories'
  },
  
  // Quality assurance
  qualityCheck: {
    frequency: 'Weekly audio quality review',
    sttTest: 'Monthly STT accuracy verification',
    userFeedback: 'Monitor console errors and 404s'
  }
}
```

---

## 📊 **REPORTING AND LOGGING**

### 📈 Audio Operation Reporting
```typescript
AUDIO_OPERATION_REPORT = {
  // Operation summary format
  reportStructure: {
    operationDate: Date,
    moduleTarget: string,
    filesProcessed: number,
    filesGenerated: number,
    filesFixed: number,
    sttTestResults: object,
    qualityIssues: string[],
    recommendations: string[]
  },
  
  // Report location
  reportLocation: 'docs/reports/AUDIO-operation-YYYYMMDD-HHMMSS.md'
}
```

### 🔍 Issue Tracking
```typescript
ISSUE_TRACKING = {
  // Common issues and solutions
  commonIssues: {
    'File too small': 'Regenerate with proper voice character',
    'Wrong pronunciation': 'Check Turkish character mapping',
    'STT fails': 'Verify audio quality and Turkish language setting',
    '404 errors': 'Check file path and audio-constants.ts mapping'
  },
  
  // Escalation rules
  escalation: {
    criticalIssues: 'Report immediately in docs/reports/',
    recurringProblems: 'Update this rules document',
    newRequirements: 'Create new module rules'
  }
}
```

---

## 🎯 **SUCCESS CRITERIA**

### ✅ Audio Operation Success Metrics
```typescript
SUCCESS_METRICS = {
  fileGeneration: {
    sizeValidation: '100% of files meet size requirements',
    sttAccuracy: '>95% STT transcription accuracy',
    pronunciationQuality: 'Clear Turkish pronunciation verified',
    noConsoleErrors: 'Zero 404 audio errors in browser console'
  },
  
  userExperience: {
    audioPlayback: '100% audio files play successfully',
    fallbackSystem: 'Graceful degradation when audio fails',
    loadingTime: 'Audio loads within 2 seconds',
    autismFriendly: 'Calm, patient, encouraging tone maintained'
  }
}
```

---

## 🔗 **RELATED DOCUMENTATION**

- **[Matematik Modülü Kuralları](./mathematics.md)** - Matematik modülü özel ses kuralları
- **[Alfabe Okuma Modülü Kuralları](./alphabet-reading.md)** - Alfabe modülü ses kuralları  
- **[Audio Constants](../../lib/audio-constants.ts)** - Ses dosyası mapping'leri
- **[ElevenLabs Integration](../../lib/elevenlabs.ts)** - Ses sistemi entegrasyonu

---

> **⚡ BU KURALLAR ZORUNLUDUR**: Herhangi bir ses dosyası işlemi yapmadan önce bu dokümantı oku ve kuralları uygula. Ses kalitesi ve tutarlılığı platform başarısı için kritiktir.

**Güncellenme Sıklığı:** Her ses işlemi sonrasında kurallar güncellenebilir  
**Sahiplik:** Platform ses sistemi maintenance team  
**Versiyon:** v1.0 (2025-01-07) 

### 🔍 **FILE VALIDATION CRITERIA**\n\n#### **Minimum File Size Requirements**\n```typescript\nconst MINIMUM_SIZES = {\n  letter: 3000,     // Turkish letters minimum 3KB\n  word: 8000,       // Turkish words minimum 8KB  \n  sentence: 15000,  // Turkish sentences minimum 15KB\n  celebration: 12000 // Celebration messages minimum 12KB\n};\n```\n\n#### **Current Test Results - Mathematics Module**\n**Test Date:** 2025-01-07 09:25:30\n**Total Files:** 11 tested\n**Status:** ✅ 9 passed, ❌ 2 failed\n\n**FAILED FILES (Need Regeneration):**\n- `matematik-dunyasi-hosgeldin.mp3` - 158 bytes (min: 15KB) ❌ CRITICAL\n- `besh.mp3` - 5,060 bytes (min: 8KB) ❌ NEEDS REGENERATION\n\n**PASSED FILES:**\n- `bir.mp3` - 11,747 bytes ✅\n- `iki.mp3` - 10,911 bytes ✅\n- `uch.mp3` - 12,583 bytes ✅\n- `dort.mp3` - 13,419 bytes ✅\n- `alti.mp3` - 11,747 bytes ✅\n- `yedi.mp3` - 10,911 bytes ✅\n- `sekiz.mp3` - 18,435 bytes ✅\n- `dokuz.mp3` - 20,525 bytes ✅\n- `on.mp3` - 9,658 bytes ✅\n\n### 🎭 **VOICE CHARACTER ASSIGNMENT RULES**\n\n#### **Mathematics Module Voice Mapping**\n```typescript\nconst MATH_VOICE_RULES = {\n  sentences: {\n    voiceId: 'ErXwobaYiN019PkySvjV',  // Antoni\n    character: 'Antoni',\n    usage: 'Welcome messages, instructions, explanations'\n  },\n  words: {\n    voiceId: '21m00Tcm4TlvDq8ikWAM',  // Rachel\n    character: 'Rachel',\n    usage: 'Number words (bir, iki, üç, etc.)'\n  },\n  celebrations: {\n    voiceId: 'TxGEqnHWrfWFTfGW9XjX',  // Josh\n    character: 'Josh',\n    usage: 'Success messages, encouragement'\n  },\n  fallback: {\n    voiceId: '9BWtsMINqrJLrRacOk9x',  // Gülsu\n    character: 'Gülsu',\n    usage: 'Default character for consistency'\n  }\n};\n```\n\n### 📂 **DIRECTORY STRUCTURE VALIDATION**\n\n#### **Required Audio Directories**\n```bash\npublic/audio/\n├── letters/          # Turkish alphabet (29 files)\n├── words/            # Turkish words and numbers\n├── sentences/        # Module welcome messages\n├── celebrations/     # Success and encouragement\n└── modules/          # Module-specific audio\n    ├── mathematics/  # Math module audio\n    ├── alphabet/     # Alphabet module audio\n    └── social/       # Social communication audio\n```\n\n#### **Mathematics Module Audio Location Check**\n```typescript\nconst MATH_AUDIO_LOCATIONS = {\n  'matematik-dunyasi-hosgeldin.mp3': 'public/audio/sentences/', // ❌ CORRUPTED\n  'bir.mp3': 'public/audio/words/',   // ✅ VALID\n  'iki.mp3': 'public/audio/words/',   // ✅ VALID\n  'uch.mp3': 'public/audio/words/',   // ✅ VALID\n  'dort.mp3': 'public/audio/words/',  // ✅ VALID\n  'besh.mp3': 'public/audio/words/',  // ❌ TOO SMALL\n  'alti.mp3': 'public/audio/words/',  // ✅ VALID\n  'yedi.mp3': 'public/audio/words/',  // ✅ VALID\n  'sekiz.mp3': 'public/audio/words/', // ✅ VALID\n  'dokuz.mp3': 'public/audio/words/', // ✅ VALID\n  'on.mp3': 'public/audio/words/'     // ✅ VALID\n};\n```\n\n### 🚨 **CRITICAL ACTIONS REQUIRED**\n\n#### **Immediate Actions**\n1. **matematik-dunyasi-hosgeldin.mp3** (CRITICAL)\n   - Current: 158 bytes (CORRUPTED)\n   - Required: Generate with Antoni voice\n   - Text: \"Matematik Dünyası modülüne hoş geldin! Sayıları öğren ve temel matematik becerilerini geliştir.\"\n   - Location: `public/audio/sentences/`\n\n2. **besh.mp3** (NEEDS REGENERATION)\n   - Current: 5,060 bytes (TOO SMALL)\n   - Required: Generate with Rachel voice\n   - Text: \"beş\"\n   - Location: `public/audio/words/`\n\n#### **Quality Assurance Steps**\n1. Run STT test: `node scripts/audio-stt-test.js`\n2. Validate file sizes meet minimum requirements\n3. Test audio playback in browser\n4. Verify correct voice character assignment\n5. Update audio constants if needed\n\n### 📋 **REGENERATION COMMANDS**\n\n#### **Manual Regeneration (User Preferred)**\n```bash\n# User will handle audio file generation manually\n# Follow voice character assignments from mathematics module rules\n# Ensure minimum file size requirements are met\n```\n\n#### **Validation Commands**\n```bash\n# Test audio files\nnpm run audio:test\n\n# Validate file sizes\nnpm run audio:validate\n\n# Check directory structure\nnpm run audio:check-structure\n```\n\n### 📊 **REPORTING SYSTEM**\n\n#### **Auto-Generated Reports**\n- **audio-test-report.json** - Latest STT test results\n- **docs/reports/FAIL-report-[DATE].md** - Error reports\n- **docs/modules/audio-processing-rules.md** - This document\n\n#### **Report Update Triggers**\n- New audio files added\n- Existing files modified\n- STT test failures detected\n- Voice character rule changes\n\n---\n\n## 🎯 **NEXT STEPS**\n\n1. **User Action Required:** Regenerate 2 corrupted audio files\n2. **Voice Assignment:** Follow mathematics module voice rules\n3. **Validation:** Run STT test after regeneration\n4. **Documentation:** Update audio constants if needed\n5. **Testing:** Verify playback in mathematics module\n\n**Status:** ⚠️ **WAITING FOR USER AUDIO REGENERATION**\n\n---\n\n**Rule Enforcement:** This document MUST be read before any audio processing operations. 