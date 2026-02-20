# Matematik Dünyası Modülü - Özel Kurallar

**Modül:** `/exercise/mathematics`  
**Öncelik:** High (Ana eğitim modülü)  
**Son Güncelleme:** 2025-01-07

## 📋 Modül Özeti

1-10 arası sayıları, toplama-çıkarma işlemlerini ve temel matematik kavramlarını öğretme modülü.

## 🔊 Ses Sistemi Kuralları

### Primary Voice Assignment
```typescript
PRIMARY_VOICE: 'Gülsu' (9BWtsMINqrJLrRacOk9x) // Default karakter
WELCOME_VOICE: 'Antoni' (ErXwobaYiN019PkySvjV) // Hoş geldin mesajları için
```

### Content-Type Voice Mapping
```typescript
VOICE_MAPPING: {
  word: 'Rachel',           // Sayı telaffuzları (bir, iki, üç...)
  sentence: 'Antoni',       // Matematik yönergeleri
  celebration: 'Josh',      // Başarı kutlamaları
  number: 'Rachel'          // Özel: sayı içeriği
}
```

### Audio File Requirements
- **Konum:** `/public/audio/words/` (sayılar için)
- **Format:** `{sayi}.mp3` (bir.mp3, iki.mp3, etc.)
- **Özel Dosyalar:**
  - matematik-dunyasi-hosgeldin.mp3
  - sayi-tanima-hosgeldin.mp3
  - toplama-oyunu-hosgeldin.mp3
- **Fallback:** ElevenLabs SDK → Web Speech API
- **User Note:** Audio files managed manually by user

## 🎨 UI/UX Kuralları

### Visual Mathematics Principles
```typescript
UI_RULES: {
  numberDisplay: 'Large, clear numerals with visual objects',
  colorCoding: 'Consistent color per number (1=red, 2=blue, etc.)',
  objectCounting: 'Visual objects for quantity representation',
  dragAndDrop: 'Large touch targets for manipulation'
}
```

### Interaction Patterns
- **Number Recognition:** Click number → hear pronunciation
- **Counting Games:** Drag objects to count
- **Addition Games:** Visual + auditory feedback
- **Shape-Number Matching:** Spatial reasoning support

### Accessibility Requirements
- **Touch Targets:** Minimum 60px for math elements
- **Visual Clarity:** High contrast numbers and objects
- **Audio Feedback:** Every interaction has sound
- **Error Guidance:** Gentle redirection, no negative feedback

## 📚 İçerik Kuralları

### Mathematical Concepts
```typescript
CONTENT_STRUCTURE: {
  numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  operations: ['addition', 'subtraction', 'counting'],
  visualSupport: 'Objects, shapes, colors for every concept',
  progression: 'Linear 1→10, no jumping ahead'
}
```

### Turkish Language Integration
- **Number Names:** Tam Türkçe telaffuz (bir, iki, üç...)
- **Instructions:** Basit, açık Türkçe cümleler
- **Feedback:** Pozitif Türkçe geri bildirim
- **Cultural Context:** Türk çocuklarına uygun örnekler

### Difficulty Levels
1. **Temel (1-5):** Sayı tanıma ve basit sayma
2. **Orta (6-10):** Büyük sayılar ve basit toplama
3. **İleri:** Çıkarma ve problem çözme

## 🔧 Teknik Kuralları

### Performance Requirements
- **Game Load:** < 3s for math games
- **Visual Rendering:** Smooth animations for counting
- **Audio Sync:** Perfect sync between visual and audio
- **Memory Management:** Efficient object rendering

### State Management
```typescript
STATE_RULES: {
  currentNumber: 'Track active number being learned',
  gameProgress: 'Save progress per difficulty level',
  scoreTracking: 'Detailed analytics per math concept',
  audioPreference: 'Remember user voice preferences'
}
```

### Error Handling
- **Math Errors:** Guide to correct answer, don't just mark wrong
- **Audio Failures:** Visual-only math still functional
- **Component Errors:** Graceful degradation to basic number display
- **Network Issues:** Offline capability for basic counting

## 🧪 Test Kuralları

### Mathematical Accuracy Tests
```typescript
MATH_TESTS: {
  numberRecognition: 'All numbers 1-10 display correctly',
  audioAccuracy: 'Turkish number pronunciation correct',
  gameLogic: 'Addition/subtraction math is accurate',
  progressTracking: 'Difficulty advancement works properly'
}
```

### Autism-Specific Tests
- **Sensory Overload:** No flashing or rapid animations
- **Predictability:** Consistent interaction patterns
- **Clear Feedback:** Obvious success/retry indicators
- **Pacing:** User-controlled, no time pressure

### Performance Benchmarks
- **Number Game Load:** < 2s
- **Visual Animation:** 60fps smooth
- **Audio Response:** < 200ms from interaction
- **Memory Usage:** < 100MB for all math games

## 🚨 İşlem Kuralları

### Development Guidelines
```typescript
DEVELOPMENT_RULES: {
  voiceConsistency: 'Gülsu default, maintain character continuity',
  mathAccuracy: 'All calculations must be mathematically correct',
  visualClarity: 'Numbers and objects clearly distinguishable',
  audioFiles: 'User manages MP3 files - do not auto-generate'
}
```

### Content Guidelines
- **Mathematical Correctness:** Zero tolerance for math errors
- **Visual Representation:** Every number has visual objects
- **Audio Quality:** Clear pronunciation of Turkish numbers
- **Progression Logic:** Logical skill building sequence

### Deployment Rules
- **Math Validation:** All calculations verified before release
- **Audio Check:** Number pronunciation accuracy verified
- **Visual Consistency:** Color coding and object representation consistent
- **Accessibility:** Full keyboard and screen reader support

## ⚠️ Critical Warnings

### Do Not:
- ❌ Change Gülsu default voice without user approval
- ❌ Auto-generate math audio files (user handles manually)
- ❌ Introduce time pressure in any math activity
- ❌ Use negative feedback for wrong answers
- ❌ Skip visual representation for any number

### Always:
- ✅ Test math accuracy with Turkish number system
- ✅ Verify Gülsu voice for continuity
- ✅ Provide visual objects for counting
- ✅ Use positive reinforcement for learning
- ✅ Check autism-friendly design compliance

## 📊 Success Metrics

### Learning Outcomes
- **Number Recognition:** > 95% accuracy for 1-10
- **Counting Skills:** Objects counted correctly
- **Addition Accuracy:** Simple addition problems solved
- **Engagement Time:** > 20 minutes average session
- **Completion Rate:** > 85% for each difficulty level

### Technical Metrics
- **Audio Success Rate:** > 98% (including fallbacks)
- **Visual Performance:** 60fps animations
- **User Satisfaction:** > 4.5/5 rating
- **Accessibility Score:** 100% WCAG compliance
- **Error Rate:** < 1% incorrect math presentations

---

> **Bu kurallar matematik modülü için zorunludur.** Matematik dünyası modülü ile ilgili işlemler yaparken bu rehberi takip edin. Audio dosyaları user tarafından yönetilir.

## 🎯 Özel Notlar

### Kullanıcı Yönettikleri
- **Audio Files:** User kendisi oluşturacak/yönetecek
- **Voice Preferences:** User ses tercihlerini belirleyecek
- **Content Updates:** User onayı ile değişiklik

### Sistem Sorumluluklarım
- **UI/UX Design:** Autism-friendly matematik arayüzü
- **Game Logic:** Matematik oyun mantığı ve doğruluğu
- **Progress Tracking:** İlerleme takibi ve analitik
- **Error Handling:** Hata yönetimi ve fallback'ler 