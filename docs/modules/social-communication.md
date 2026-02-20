# Sosyal İletişim Modülü - Özel Kurallar

**Modül:** `/exercise/social-communication`  
**Öncelik:** Critical (Otizm için hayati modül)  
**Son Güncelleme:** 2025-01-07

## 📋 Modül Özeti

Duygu tanıma, sosyal hikayeler ve günlük iletişim becerilerini geliştirme modülü. Otizmli çocuklar için en kritik gelişim alanı.

## 🔊 Ses Sistemi Kuralları

### Primary Voice Assignment
```typescript
PRIMARY_VOICE: 'Gülsu' (9BWtsMINqrJLrRacOk9x) // Tutarlı karakter
STORYTELLER_VOICE: 'Antoni' (ErXwobaYiN019PkySvjV) // Sosyal hikayeler için
```

### Content-Type Voice Mapping
```typescript
VOICE_MAPPING: {
  sentence: 'Antoni',       // Sosyal hikaye anlatımı
  celebration: 'Josh',      // Başarı kutlamaları
  emotion: 'Rachel',        // Duygu tanımları
  instruction: 'Antoni'     // Yönlendirmeler
}
```

### Audio Content Requirements
- **Duygu Sesleri:** 6 temel duygu (mutlu, üzgün, kızgın, şaşırmış, korkmuş, heyecanlı)
- **Sosyal Hikayeler:** Günlük yaşam senaryoları
- **İletişim Kalıpları:** Nezaket ifadeleri, selamlaşma
- **Fallback:** Gülsu voice → Web Speech API
- **User Note:** Duygu içerikli audio'lar user tarafından yönetilir

## 🎨 UI/UX Kuralları

### Emotion Recognition Design
```typescript
UI_RULES: {
  emotionFaces: 'Clear, expressive, culturally appropriate faces',
  colorCoding: 'Consistent colors per emotion (happy=yellow, sad=blue)',
  simplicity: 'Minimal distractions, focus on emotion',
  feedback: 'Immediate visual + audio response'
}
```

### Social Story Guidelines
- **Visual Stories:** Picture-based storytelling
- **Progressive Disclosure:** Step-by-step story revelation
- **Interactive Elements:** Touch to continue, user-paced
- **Clear Outcomes:** Obvious social lesson at end

### Autism-Specific Design
- **Predictable Layout:** Same positions for same functions
- **Clear Boundaries:** Obvious interaction areas
- **Non-threatening:** Gentle, friendly character designs
- **Overstimulation Prevention:** Calm colors, minimal animation

## 📚 İçerik Kuralları

### Emotion Content Standards
```typescript
EMOTION_RULES: {
  basicEmotions: ['mutlu', 'üzgün', 'kızgın', 'şaşırmış', 'korkmuş', 'heyecanlı'],
  culturalContext: 'Turkish family and social situations',
  ageAppropriate: 'Content suitable for 3-12 age range',
  positiveFraming: 'Even negative emotions taught constructively'
}
```

### Social Scenarios
- **Home Environment:** Family interactions, daily routines
- **School Settings:** Classroom, playground, friendship
- **Public Spaces:** Shopping, transportation, community
- **Conflict Resolution:** Gentle problem-solving approaches

### Communication Patterns
```typescript
COMMUNICATION_CONTENT: {
  greetings: ['Merhaba', 'Günaydın', 'İyi günler'],
  politeness: ['Lütfen', 'Teşekkür ederim', 'Özür dilerim'],
  emotions: 'Simple expression of feelings',
  requests: 'Appropriate asking patterns'
}
```

## 🔧 Teknik Kuralları

### Emotional Intelligence Tracking
- **Recognition Accuracy:** Track emotion identification success
- **Response Time:** Monitor decision-making speed
- **Learning Patterns:** Identify difficult emotions for individual
- **Progress Visualization:** Clear advancement indicators

### State Management
```typescript
STATE_RULES: {
  currentEmotion: 'Track which emotion being learned',
  storyProgress: 'Save position in social stories',
  emotionMastery: 'Track mastered vs learning emotions',
  userResponses: 'Log emotional responses for patterns'
}
```

### Sensitive Data Handling
- **Emotional Data:** Treated as highly sensitive
- **Privacy Protection:** No sharing of emotional responses
- **Consent Required:** Parent approval for emotion tracking
- **Data Minimization:** Only essential emotional learning data

## 🧪 Test Kuralları

### Emotion Recognition Tests
```typescript
EMOTION_TESTS: {
  faceRecognition: 'All 6 emotions correctly displayed',
  audioAccuracy: 'Emotion descriptions clear and accurate',
  culturalRelevance: 'Faces represent Turkish cultural context',
  ageAppropriateness: 'Content suitable for target age range'
}
```

### Social Story Validation
- **Story Completeness:** All stories have clear beginning, middle, end
- **Social Appropriateness:** Stories teach positive social behaviors
- **Interactive Elements:** All user interactions work properly
- **Audio Synchronization:** Voice matches story progression

### Autism-Specific Testing
- **Sensory Sensitivity:** No overwhelming visual/audio elements
- **Predictability:** Consistent interaction patterns
- **Clear Feedback:** Obvious success/learning indicators
- **Pacing Control:** User controls story and learning speed

## 🚨 İşlem Kuralları

### Content Development Guidelines
```typescript
DEVELOPMENT_RULES: {
  emotionAccuracy: 'All emotions must be correctly represented',
  culturalSensitivity: 'Turkish cultural context maintained',
  autismFriendly: 'Every design decision considers autism needs',
  positiveReinforcement: 'Only constructive feedback and guidance'
}
```

### Sensitive Content Handling
- **Emotion Validation:** Never dismiss or minimize emotions
- **Cultural Respect:** Honor Turkish family and social values
- **Trauma Awareness:** Avoid triggering or scary content
- **Individual Differences:** Accommodate different autism presentations

### Voice Character Consistency
- **Gülsu Continuity:** Maintain familiar character throughout
- **Antoni Storytelling:** Consistent narrative voice for stories
- **Emotional Tone:** Voice matches emotional content appropriately
- **User-Managed Audio:** User handles emotion-specific audio files

## ⚠️ Critical Warnings

### Do Not:
- ❌ Change emotional content without expert review
- ❌ Auto-generate emotion audio files (user manages manually)
- ❌ Use negative reinforcement for wrong emotion identification
- ❌ Include scary or overwhelming emotional content
- ❌ Break character consistency (Gülsu/Antoni voices)

### Always:
- ✅ Validate emotional accuracy with autism experts
- ✅ Test with Turkish cultural context
- ✅ Ensure autism-friendly design principles
- ✅ Provide clear, positive feedback
- ✅ Respect individual emotional processing speeds

## 📊 Success Metrics

### Learning Outcomes
- **Emotion Recognition:** > 85% accuracy for 6 basic emotions
- **Social Story Completion:** > 90% story completion rate
- **Communication Usage:** Evidence of learned phrases in daily use
- **Emotional Expression:** Increased emotional vocabulary
- **Social Interaction:** Improved real-world social behaviors

### Technical Metrics
- **Audio Success Rate:** > 98% (Gülsu voice + fallbacks)
- **Story Progression:** Smooth, uninterrupted story flow
- **User Engagement:** > 25 minutes average session
- **Accessibility Score:** 100% autism-friendly design compliance
- **Completion Rate:** > 80% module completion

---

> **Bu kurallar sosyal iletişim modülü için hayati önemdedir.** Otizmli çocukların sosyal gelişimi için en kritik modül. Her değişiklik otizm uzmanı onayı gerektirir.

## 🎯 Özel Hassasiyetler

### Otizm-Specific Considerations
- **Sensory Processing:** Gentle visual and audio presentation
- **Social Learning:** Structured, predictable learning environment
- **Emotional Safety:** Safe space for emotional exploration
- **Individual Pace:** No pressure, user-controlled progression

### Cultural Sensitivity
- **Turkish Family Values:** Respect for family hierarchy and values
- **Social Norms:** Appropriate Turkish social behaviors
- **Communication Styles:** Turkish politeness and communication patterns
- **Community Integration:** Helps child fit into Turkish society

### User Management Areas
- **Emotion Audio Files:** User controls emotional content audio
- **Cultural Adaptations:** User can adjust for family-specific values
- **Story Content:** User can customize social scenarios
- **Voice Preferences:** User manages emotional voice assignments 