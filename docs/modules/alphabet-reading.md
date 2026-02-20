# Alfabe Okuma Modülü - Özel Kurallar

**Modül:** `/exercise/alphabet-reading`  
**Öncelik:** Critical (Temel modül)  
**Son Güncelleme:** 2025-01-07

## 📋 Modül Özeti

29 harflik Türk alfabesini öğretme modülü. Harf tanıma, sesletme ve quiz aktiviteleri içerir.

## 🔊 Ses Sistemi Kuralları

### Primary Voice Assignment
```typescript
PRIMARY_VOICE: 'Adam' (pNInz6obpgDQGcFmaJgB)
- Content Type: letter (harfler)
- Gender: Male
- Characteristics: Sakin, açık, net telaffuz
- Turkish Support: Full 29-letter support
```

### Content-Type Voice Mapping
```typescript
VOICE_MAPPING: {
  letter: 'Adam',        // Harf telaffuzları
  celebration: 'Josh',   // Başarı kutlamaları  
  sentence: 'Antoni',    // Yönlendirme cümleleri
  word: 'Rachel'         // Kelime örnekleri (varsa)
}
```

### Audio File Requirements
- **Konum:** `/public/audio/letters/`
- **Format:** `{turkishCharMapping}.mp3`
- **Türkçe Karakter Mapping:**
  - ç → ch.mp3, ğ → gh.mp3, ı → ii.mp3
  - ö → oh.mp3, ş → sh.mp3, ü → uh.mp3
- **Fallback:** ElevenLabs SDK → Web Speech API
- **Quality:** 128kbps, 44.1kHz, ~1.5s duration

## 🎨 UI/UX Kuralları

### Accessibility Requirements
- **Touch Targets:** Minimum 44px for letter buttons
- **Color Coding:** Sesli harfler (kırmızı), sessiz harfler (mavi)
- **High Contrast:** Autism-friendly color palette
- **Animation:** Minimal, non-distracting transitions
- **Font Size:** Large, clear typography

### Interaction Patterns
```typescript
INTERACTION_RULES: {
  letterClick: 'Immediate audio feedback',
  quizMode: '4-option multiple choice',
  progressVisual: 'Clear completion indicators',
  errorHandling: 'Gentle correction, no negative feedback'
}
```

### Layout Kuralları
- **Grid:** 6x5 responsive grid for 29 letters
- **Spacing:** Adequate spacing between letters (8px minimum)
- **Visual Hierarchy:** Active letter highlighted
- **Progress Bar:** Always visible, encouraging

## 📚 İçerik Kuralları

### Turkish Language Compliance
- **Alphabet:** Full 29-letter Turkish alphabet support
- **Pronunciation:** IPA phonetic accuracy required
- **Cultural Context:** Turkey-specific examples
- **Age Appropriateness:** 3-8 yaş arası için optimize

### Content Standards
```typescript
CONTENT_RULES: {
  letterIntroduction: 'Single letter focus',
  examples: 'Common Turkish words starting with letter',
  quizQuestions: 'Visual + audio combination',
  feedback: 'Positive reinforcement only'
}
```

### Difficulty Progression
1. **Büyük Harfler:** A, B, C... (uppercase only)
2. **Küçük Harfler:** a, b, c... (lowercase introduction)
3. **Karışık Mod:** Mixed case recognition

## 🔧 Teknik Kuralları

### Performance Requirements
- **Initial Load:** < 2s for alphabet grid
- **Audio Load:** < 300ms for letter sounds
- **Memory Usage:** < 50MB for all letters
- **Bundle Size:** Component < 100KB

### Error Handling
```typescript
ERROR_HANDLING: {
  audioFailure: 'Graceful fallback to visual-only mode',
  networkError: 'Cache available letters',
  componentError: 'Error boundary with recovery option',
  voiceAPIError: 'Web Speech API fallback'
}
```

### Data Management
- **State:** Local state for quiz progress
- **Persistence:** Progress saved to Firestore
- **Caching:** Audio files cached in browser
- **Analytics:** Letter-level interaction tracking

## 🧪 Test Kuralları

### E2E Test Requirements
```typescript
E2E_TESTS: {
  alphabetDisplay: 'All 29 letters render correctly',
  audioPlayback: 'Each letter plays correct sound',
  quizFunctionality: '4-option quiz works properly',
  progressTracking: 'Progress saves and loads correctly'
}
```

### Test Coverage Targets
- **Component Tests:** 100% critical paths
- **Audio Tests:** All 29 letters + fallbacks
- **Accessibility Tests:** WCAG 2.1 AA compliance
- **Cross-browser:** Chrome, Firefox, Safari, Edge

### Performance Tests
- **Load Time:** < 2s alphabet grid render
- **Audio Performance:** < 300ms letter sound start
- **Memory Leaks:** No memory growth after 100 interactions
- **Mobile Performance:** Smooth on low-end devices

## 🚨 İşlem Kuralları

### Development Guidelines
```typescript
DEVELOPMENT_RULES: {
  voiceChanges: 'Always test with Adam voice first',
  newFeatures: 'Autism-friendly design review required',
  codeChanges: 'Maintain 29-letter support',
  audioUpdates: 'User will handle MP3 files manually'
}
```

### Deployment Rules
- **Pre-deployment:** Audio file existence check
- **Voice Config:** Verify Adam voice availability
- **Accessibility:** Screen reader compatibility test
- **Mobile:** Touch interaction validation

### Maintenance Rules
- **Audio Files:** User manages manually - do not auto-generate
- **Voice System:** Adam primary, Josh celebration backup
- **Content Updates:** Turkish language expert review
- **Performance:** Monthly load time monitoring

## ⚠️ Critical Warnings

### Do Not:
- ❌ Change primary voice from Adam without user approval
- ❌ Auto-generate audio files (user handles manually)
- ❌ Modify Turkish character mappings without testing
- ❌ Remove accessibility features
- ❌ Change 29-letter alphabet structure

### Always:
- ✅ Test with Turkish characters (ç, ğ, ı, ö, ş, ü)
- ✅ Verify Adam voice for letter pronunciation
- ✅ Check accessibility compliance
- ✅ Validate autism-friendly design principles
- ✅ Test cross-browser compatibility

## 📊 Success Metrics

### Key Performance Indicators
- **Letter Recognition Rate:** > 90% after module completion
- **Audio Playback Success:** > 98% (including fallbacks)
- **User Engagement:** > 15 minutes average session
- **Completion Rate:** > 80% for full alphabet
- **Accessibility Score:** 95+ Lighthouse accessibility

### Quality Gates
- All 29 letters render correctly
- Audio system works with fallbacks
- Quiz functionality 100% operational
- Progress tracking accurate
- Mobile responsiveness perfect

---

> **Bu kurallar zorunludur.** Alfabe okuma modülü ile ilgili herhangi bir işlem yaparken bu kuralları okuyarak hareket edin. Kuralların değiştirilmesi için kullanıcı onayı gereklidir. 