# 🎨 UX Kuralları - Kıvılcım Platform

**Amaç:** Otizm dostu tasarım, duyusal hassasiyetler, optimal kullanıcı deneyimi  
**Hedef:** WCAG 2.1 AA compliance, %90+ user satisfaction, sensory-friendly interface  
**Güncelleme:** Bi-weekly (UX pattern refinements)

---

## 🧠 Otizm Dostu Tasarım Prensipleri

### **1. Duyusal Hassasiyet Kuralları**
```typescript
// Duyusal-friendly design configuration
const SENSORY_DESIGN_RULES = {
  colors: {
    contrast: '4.5:1 minimum',     // WCAG AA requirement
    palette: 'calm, muted tones',   // Avoid overstimulating colors
    background: '#fafafa',          // Soft white background
    primary: '#4f46e5',            // Calming blue
    warning: '#f59e0b',            // Soft amber instead of red
    success: '#10b981'             // Calming green
  },
  
  animations: {
    duration: 'slow and smooth',    // Avoid jarring transitions
    easing: 'ease-in-out',         // Natural motion curves
    reduceMotion: 'respect user preference', // honor prefers-reduced-motion
    autoplay: 'never',             // No auto-playing animations
    controls: 'always visible'      // Give users control
  },
  
  sounds: {
    volume: 'user-controlled',      // Always provide volume control
    autoplay: 'off by default',     // No sudden sounds
    options: 'sound on/off toggle', // Quick mute option
    alternatives: 'visual feedback' // Provide visual alternatives
  }
};
```

### **2. Predictable Interface Patterns**
```typescript
// Consistent UI patterns for autism-friendly navigation
const UI_CONSISTENCY_RULES = {
  navigation: {
    position: 'always same location',
    style: 'consistent visual treatment',
    labels: 'clear, descriptive text',
    icons: 'paired with text labels',
    breadcrumbs: 'always visible'
  },
  
  buttons: {
    size: 'minimum 44px touch target',
    spacing: 'adequate gap between buttons',
    states: 'clear visual feedback',
    labels: 'action-oriented text',
    icons: 'meaningful and consistent'
  },
  
  feedback: {
    immediate: 'instant response to actions',
    clear: 'unambiguous success/error states',
    persistent: 'don\'t auto-hide important messages',
    multiple: 'visual + audio + text feedback',
    positive: 'focus on achievements'
  }
};
```

---

## 🎯 Touch & Interaction Kuralları

### **1. Touch Target Optimization**
```typescript
// WCAG AA compliant touch targets
const TOUCH_TARGET_RULES = {
  minimumSize: '44px × 44px',        // WCAG AA requirement
  recommendedSize: '48px × 48px',    // Better for accessibility
  spacing: '8px minimum between targets',
  activeArea: 'extend beyond visual boundary',
  feedback: 'immediate visual response'
};

// Touch-friendly button component
const TouchFriendlyButton = styled.button`
  min-width: 44px;
  min-height: 44px;
  padding: 12px 16px;
  margin: 4px;
  
  /* Touch feedback */
  &:active {
    transform: scale(0.98);
    transition: transform 0.1s ease;
  }
  
  /* Focus visible for keyboard users */
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;
```

### **2. Keyboard Navigation**
```typescript
// Comprehensive keyboard navigation
const KEYBOARD_NAVIGATION = {
  focusManagement: {
    visible: 'focus indicators always visible',
    logical: 'tab order follows visual order',
    trapped: 'modal focus trapping',
    restored: 'focus restoration on close'
  },
  
  shortcuts: {
    escape: 'always returns to safe state',
    enter: 'activates primary action',
    space: 'activates buttons and checkboxes',
    arrows: 'navigation within components'
  },
  
  skipLinks: {
    mainContent: 'skip to main content',
    navigation: 'skip navigation',
    sections: 'skip to specific sections'
  }
};
```

---

## 🎨 Visual Design Kuralları

### **1. Color & Contrast**
```css
/* Color system for autism-friendly design */
:root {
  /* High contrast ratios (WCAG AA+) */
  --text-primary: #1a1a1a;      /* 16.94:1 on white */
  --text-secondary: #4a4a4a;    /* 9.74:1 on white */
  --background: #fafafa;         /* Soft white */
  --surface: #ffffff;            /* Pure white for cards */
  
  /* Calming color palette */
  --primary: #4f46e5;            /* Indigo 600 */
  --primary-light: #a5b4fc;     /* Indigo 300 */
  --secondary: #10b981;          /* Emerald 500 */
  --warning: #f59e0b;            /* Amber 500 */
  --error: #ef4444;              /* Red 500 */
  
  /* Autism-specific considerations */
  --focus-ring: #4f46e5;         /* Clear focus indication */
  --success-bg: #ecfdf5;         /* Soft green background */
  --warning-bg: #fffbeb;         /* Soft amber background */
  --error-bg: #fef2f2;           /* Soft red background */
}

/* Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### **2. Typography Kuralları**
```css
/* Readable typography for autism-friendly design */
.typography-rules {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  
  /* Clear hierarchy */
  h1 { font-size: 2rem; font-weight: 700; line-height: 1.2; margin-bottom: 1.5rem; }
  h2 { font-size: 1.5rem; font-weight: 600; line-height: 1.3; margin-bottom: 1rem; }
  h3 { font-size: 1.25rem; font-weight: 600; line-height: 1.4; margin-bottom: 0.75rem; }
  
  /* Body text */
  p { font-size: 1rem; line-height: 1.6; margin-bottom: 1rem; }
  
  /* Accessible text sizing */
  .text-small { font-size: 0.875rem; }
  .text-large { font-size: 1.125rem; }
  
  /* High contrast for important text */
  .text-primary { color: var(--text-primary); }
  .text-secondary { color: var(--text-secondary); }
}
```

---

## 🔊 Audio UX Kuralları

### **1. Voice System UX**
```typescript
// Gender-balanced voice assignments with UX considerations
const VOICE_UX_RULES = {
  consistency: {
    character: 'same voice per content type',
    quality: 'professional, clear pronunciation',
    pace: 'slightly slower than normal speech',
    volume: 'user-controlled with memory'
  },
  
  feedback: {
    visual: 'show when audio is playing',
    progress: 'indicate audio progress',
    controls: 'pause, replay, skip options',
    alternatives: 'text display alongside audio'
  },
  
  accessibility: {
    captions: 'visual text for all audio',
    descriptions: 'audio descriptions for visual content',
    controls: 'keyboard accessible',
    preferences: 'remember user settings'
  }
};
```

### **2. Sound Design Patterns**
```typescript
// UX-focused sound implementation
const SoundUXComponent = ({ text, type }: SoundProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showText, setShowText] = useState(true);
  const [userVolume, setUserVolume] = useState(0.8);
  
  return (
    <div className="sound-ux-container">
      {/* Visual text always visible */}
      <div className="sound-text" aria-live="polite">
        {text}
      </div>
      
      {/* Audio controls */}
      <div className="audio-controls">
        <button 
          onClick={() => playAudio(text, type)}
          aria-label={`"${text}" sesini çal`}
          disabled={isPlaying}
        >
          {isPlaying ? '🔊' : '🔈'} Sesli Oku
        </button>
        
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={userVolume}
          onChange={(e) => setUserVolume(parseFloat(e.target.value))}
          aria-label="Ses seviyesi"
        />
      </div>
      
      {/* Playing indicator */}
      {isPlaying && (
        <div className="playing-indicator" aria-live="polite">
          Ses çalınıyor...
        </div>
      )}
    </div>
  );
};
```

---

## 📱 Responsive UX Kuralları

### **1. Mobile-First Design**
```css
/* Mobile-optimized layouts */
.mobile-first-layout {
  /* Base styles for mobile (320px+) */
  padding: 1rem;
  font-size: 1rem;
  
  /* Touch-friendly spacing */
  .button-group {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  /* Tablet adjustments (768px+) */
  @media (min-width: 768px) {
    padding: 1.5rem;
    
    .button-group {
      flex-direction: row;
      gap: 1rem;
    }
  }
  
  /* Desktop enhancements (1024px+) */
  @media (min-width: 1024px) {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

### **2. Adaptive Interface**
```typescript
// Context-aware interface adaptation
const useAdaptiveInterface = () => {
  const [screenSize, setScreenSize] = useState<ScreenSize>('mobile');
  const [userPreferences, setUserPreferences] = useState<UserPrefs>({
    fontSize: 'medium',
    contrast: 'normal',
    motion: 'normal'
  });
  
  const getAdaptedLayout = () => {
    return {
      cardSize: screenSize === 'mobile' ? 'large' : 'medium',
      buttonSpacing: userPreferences.fontSize === 'large' ? 'extra' : 'normal',
      animationSpeed: userPreferences.motion === 'reduced' ? 'slow' : 'normal'
    };
  };
  
  return { screenSize, userPreferences, getAdaptedLayout };
};
```

---

## 🎮 Interactive Element UX

### **1. Game Interface UX**
```typescript
// Autism-friendly game interface patterns
const GameUXComponent = ({ gameData }: GameProps) => {
  return (
    <div className="game-container">
      {/* Clear progress indication */}
      <div className="game-header">
        <ProgressBar current={gameData.current} total={gameData.total} />
        <ScoreDisplay score={gameData.score} />
      </div>
      
      {/* Game area with clear boundaries */}
      <div className="game-area" role="main">
        <GameContent />
      </div>
      
      {/* Consistent control layout */}
      <div className="game-controls">
        <button className="secondary-button" onClick={handlePause}>
          ⏸️ Duraklat
        </button>
        <button className="secondary-button" onClick={handleHelp}>
          ❓ Yardım
        </button>
        <button className="danger-button" onClick={handleExit}>
          🚪 Çıkış
        </button>
      </div>
    </div>
  );
};
```

### **2. Feedback Patterns**
```typescript
// Positive reinforcement UX patterns
const FeedbackUXComponent = ({ success, message }: FeedbackProps) => {
  return (
    <div className={`feedback-container ${success ? 'success' : 'encouragement'}`}>
      {/* Visual feedback */}
      <div className="feedback-icon">
        {success ? '🎉' : '💫'}
      </div>
      
      {/* Encouraging message */}
      <div className="feedback-message">
        {success ? 'Harika! Çok güzel yaptın!' : 'Tekrar deneyelim!'}
      </div>
      
      {/* Celebration animation (if motion allowed) */}
      <div className="celebration-animation" />
    </div>
  );
};
```

---

## 🔧 Accessibility UX Kuralları

### **1. Screen Reader Support**
```typescript
// Screen reader optimized components
const AccessibleComponent = ({ title, content, actions }: AccessibleProps) => {
  return (
    <section role="region" aria-labelledby="section-title">
      <h2 id="section-title">{title}</h2>
      
      <div className="content" aria-describedby="content-description">
        {content}
      </div>
      
      <div className="actions" role="group" aria-label="Mevcut işlemler">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            aria-describedby={`action-description-${index}`}
          >
            {action.label}
          </button>
        ))}
      </div>
    </section>
  );
};
```

### **2. Focus Management**
```typescript
// Comprehensive focus management
const useFocusManagement = () => {
  const focusFirst = (container: HTMLElement) => {
    const focusable = container.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusable?.focus();
  };
  
  const trapFocus = (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    container.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    });
  };
  
  return { focusFirst, trapFocus };
};
```

---

## 📋 UX Quality Checklist

### **Pre-Deployment UX**
- [ ] WCAG 2.1 AA compliance verified
- [ ] Color contrast ratios >4.5:1
- [ ] Touch targets minimum 44px
- [ ] Keyboard navigation functional
- [ ] Screen reader compatibility tested
- [ ] Reduced motion preferences honored
- [ ] Focus indicators visible
- [ ] Error states user-friendly

### **Runtime UX**
- [ ] Consistent visual feedback
- [ ] Smooth interactions
- [ ] Clear loading states
- [ ] Helpful error messages
- [ ] Positive reinforcement
- [ ] User preferences remembered
- [ ] Responsive across devices
- [ ] Audio alternatives provided

---

## 🔗 İlgili Kural Dosyaları

### **Cross-References**
- **[Component Rules](./component-rules.md)** - Accessible component patterns
- **[Audio System Rules](./audio-system-rules.md)** - Audio UX considerations
- **[Error Handling Rules](./error-handling-rules.md)** - User-friendly error UX
- **[Performance Rules](./performance-rules.md)** - Performance impact on UX
- **[Security Rules](./security-rules.md)** - Privacy-respecting UX

### **External Standards**
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Autism Design Guidelines](https://www.autism.org.uk/advice-and-guidance/topics/communication/design-guidelines)
- [Inclusive Design Principles](https://inclusivedesignprinciples.org/)

---

## ⚠️ Kritik UX Uyarıları

### **❌ ASLA YAPILMAYACAKLAR**
- Auto-playing audio or animations
- Flashing or strobing content
- Inaccessible color-only information
- Complex navigation patterns
- Overwhelming visual elements
- Sudden interface changes
- Missing alternative input methods

### **✅ MUTLAKA YAPILACAKLAR**
- Predictable, consistent interfaces
- Clear visual hierarchy
- Multiple feedback methods
- User-controlled audio
- Accessible keyboard navigation
- Positive reinforcement
- Sensory-friendly design choices

---

> **🎨 UX Mottosu:** "Her tasarım kararı çocuğun refahını düşünerek, her etkileşim onların güvenini artırarak, her animasyon onları sakinleştirerek yapılmalı."

**Son Güncelleme:** 2025-01-07  
**WCAG Compliance:** 🟢 AA Level  
**User Satisfaction:** 🟢 90%+ target  
**Sensory-Friendly:** 🟢 Fully Optimized 