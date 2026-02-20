# Component Kuralları - Kıvılcım Platform

## ⚛️ React Component Ana Kuralları

### 🏗️ Component Architecture

#### **Component Hierarchy**
```typescript
// ZORUNLU component yapısı
components/
├── ui/                   # Temel UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   └── Modal.tsx
├── modules/              # Modül-specific components
│   ├── AlphabetReader.tsx
│   ├── VocabularyGame.tsx
│   └── MathCounter.tsx
├── layouts/              # Layout components
│   ├── PageLayout.tsx
│   └── DashboardLayout.tsx
└── shared/               # Paylaşılan components
    ├── AudioPlayer.tsx
    ├── ProgressBar.tsx
    └── ErrorBoundary.tsx
```

#### **Naming Conventions**
- **PascalCase:** Component names
- **camelCase:** Props and functions
- **kebab-case:** CSS classes and files
- **SCREAMING_SNAKE_CASE:** Constants

### 🎨 Autism-Friendly Component Design

#### **Visual Design Principles**
- **Calm Colors:** Parlak renkler YASAK
- **Clear Contrast:** WCAG AA compliance (4.5:1 minimum)
- **Consistent Layout:** Predictable component placement
- **Minimal Animation:** Smooth, purposeful transitions only

#### **Interaction Design**
```typescript
// ZORUNLU accessibility props
interface BaseComponent {
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'data-testid'?: string;
  role?: string;
}
```

### 📱 Touch-Friendly Component Kuralları

#### **Touch Target Standards**
- **Minimum Size:** 44px × 44px (WCAG guideline)
- **Spacing:** 8px minimum between touch targets
- **Hit Area:** Visual size ≤ actual touch area
- **Feedback:** Immediate visual/haptic feedback

#### **Mobile-First Components**
```typescript
// ZORUNLU responsive component pattern
const ResponsiveButton = styled.button`
  min-height: 44px;
  min-width: 44px;
  padding: 12px 16px;
  
  @media (max-width: 768px) {
    padding: 16px 20px;
    font-size: 16px; // Prevent zoom on iOS
  }
`;
```

### 🔊 Audio-Enabled Component Kuralları

#### **Voice Integration**
- **Consistent Voice:** Gender-balanced Turkish voices
- **Fallback Chain:** Static → ElevenLabs → Web Speech API
- **User Control:** Audio on/off toggle always available
- **Visual Feedback:** Speaking state visual indicators

#### **Audio Component Pattern**
```typescript
// ZORUNLU audio component pattern
interface AudioEnabledComponent {
  text: string;
  audioType: 'letter' | 'word' | 'sentence' | 'celebration';
  autoPlay?: boolean;
  showControls?: boolean;
  onAudioStart?: () => void;
  onAudioEnd?: () => void;
}
```

### 🧪 Component Testing Kuralları

#### **Test Requirements**
- **Unit Tests:** Every component >20 lines
- **Integration Tests:** Component interactions
- **Accessibility Tests:** Screen reader compatibility
- **Visual Tests:** Cross-browser rendering

#### **Test Patterns**
```typescript
// ZORUNLU component test pattern
describe('ComponentName', () => {
  test('should render correctly', () => {
    render(<ComponentName {...defaultProps} />);
    expect(screen.getByTestId('component-name')).toBeInTheDocument();
  });

  test('should handle audio interaction', async () => {
    const onAudioStart = jest.fn();
    render(<ComponentName onAudioStart={onAudioStart} />);
    
    await user.click(screen.getByRole('button', { name: /play audio/i }));
    expect(onAudioStart).toHaveBeenCalled();
  });

  test('should be accessible', () => {
    render(<ComponentName />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label');
  });
});
```

### 🔄 State Management Kuralları

#### **State Principles**
- **Local State:** Component-specific state with useState
- **Shared State:** Context for cross-component data
- **Server State:** SWR for API data
- **Form State:** React Hook Form for complex forms

#### **State Management Pattern**
```typescript
// ZORUNLU state management pattern
const useComponentState = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState(null);

  return {
    loading,
    error,
    data,
    actions: {
      setLoading,
      setError,
      setData
    }
  };
};
```

### 🎯 Error Boundary Kuralları

#### **Error Handling Requirements**
- **Module-Level:** Her modül kendi Error Boundary'si
- **Component-Level:** Critical components wrap edilmeli
- **User-Friendly:** Çocuk dostu hata mesajları
- **Recovery:** Automatic retry mechanisms

#### **Error Boundary Implementation**
```typescript
// ZORUNLU error boundary pattern
class ModuleErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorId: null };
  }

  static getDerivedStateFromError(error) {
    return { 
      hasError: true, 
      errorId: generateErrorId() 
    };
  }

  componentDidCatch(error, errorInfo) {
    logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <FriendlyErrorMessage onRetry={this.handleRetry} />;
    }

    return this.props.children;
  }
}
```

### 📊 Performance Component Kuralları

#### **Optimization Techniques**
- **React.memo:** Pure components memoization
- **useMemo:** Expensive calculations
- **useCallback:** Function reference stability
- **Code Splitting:** Lazy loading for large components

#### **Performance Patterns**
```typescript
// ZORUNLU performance optimization
const ExpensiveComponent = React.memo(({ data, onAction }) => {
  const processedData = useMemo(() => {
    return heavyDataProcessing(data);
  }, [data]);

  const handleAction = useCallback((id) => {
    onAction(id);
  }, [onAction]);

  return <div>{/* component content */}</div>;
});
```

### 🎨 Styling Component Kuralları

#### **CSS-in-JS Standards**
- **Tailwind CSS:** Utility-first approach
- **Custom Classes:** Component-specific styles
- **Dark Mode:** next-themes integration
- **Responsive:** Mobile-first breakpoints

#### **Styling Patterns**
```typescript
// ZORUNLU styling pattern
const StyledComponent = () => {
  return (
    <div className={cn(
      'base-styles',
      'responsive-styles',
      'dark:dark-mode-styles',
      'focus:focus-styles',
      'hover:hover-styles',
      className
    )}>
      {children}
    </div>
  );
};
```

### 🔐 Security Component Kuralları

#### **Input Validation**
- **Client-Side:** Immediate user feedback
- **Server-Side:** Zod schema validation
- **Sanitization:** XSS prevention
- **Type Safety:** TypeScript strict mode

#### **Secure Component Pattern**
```typescript
// ZORUNLU güvenlik pattern
const SecureInput = ({ value, onChange, validation }) => {
  const [isValid, setIsValid] = useState(true);
  const [sanitizedValue, setSanitizedValue] = useState('');

  const handleChange = (e) => {
    const input = e.target.value;
    const sanitized = sanitizeInput(input);
    const valid = validation.safeParse(sanitized).success;
    
    setSanitizedValue(sanitized);
    setIsValid(valid);
    onChange(sanitized);
  };

  return (
    <input
      value={sanitizedValue}
      onChange={handleChange}
      aria-invalid={!isValid}
      data-testid="secure-input"
    />
  );
};
```

### 📱 Progressive Web App Components

#### **PWA-Ready Components**
- **Offline Support:** Works without internet
- **Installation:** PWA install prompts
- **Notifications:** Service worker integration
- **Background Sync:** Offline data synchronization

#### **PWA Component Features**
```typescript
// ZORUNLU PWA features
const PWAComponent = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    // Online/offline detection
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div>
      {!isOnline && <OfflineIndicator />}
      {installPrompt && <InstallPrompt onInstall={handleInstall} />}
    </div>
  );
};
```

### 🌐 Internationalization (i18n) Kuralları

#### **Multi-Language Support**
- **Primary:** Turkish (tr)
- **Secondary:** English (en)
- **Context:** Cultural adaptation required
- **Accessibility:** Language-specific voice support

#### **i18n Component Pattern**
```typescript
// ZORUNLU i18n pattern
const MultiLanguageComponent = () => {
  const { t, locale } = useTranslation();
  const { speak } = useElevenLabs();

  const handleSpeak = (key: string) => {
    const text = t(key);
    const voiceId = locale === 'tr' ? TURKISH_VOICE_ID : ENGLISH_VOICE_ID;
    speak(text, 'sentence', voiceId);
  };

  return (
    <div>
      <p>{t('component.message')}</p>
      <button onClick={() => handleSpeak('component.message')}>
        {t('component.play_audio')}
      </button>
    </div>
  );
};
```

### 📏 Component Size Kuralları

#### **Size Guidelines**
- **Small Components:** <100 lines of code
- **Medium Components:** 100-300 lines
- **Large Components:** >300 lines (split recommended)
- **Complex Logic:** Extract to custom hooks

#### **Component Splitting Strategy**
```typescript
// ZORUNLU component splitting
// ❌ Large component (300+ lines)
const LargeComponent = () => {
  // Too much logic here
};

// ✅ Split into smaller components
const ComponentHeader = () => { /* header logic */ };
const ComponentBody = () => { /* body logic */ };
const ComponentFooter = () => { /* footer logic */ };

const WellStructuredComponent = () => {
  return (
    <>
      <ComponentHeader />
      <ComponentBody />
      <ComponentFooter />
    </>
  );
};
```

---

## 🔗 İlgili Kural Dosyaları

- **Testing Rules:** `docs/rules/testing-rules.md`
- **Audio System Rules:** `docs/rules/audio-system-rules.md`
- **Image Processing Rules:** `docs/rules/image-processing-rules.md`
- **Dashboard Rules:** `docs/rules/dashboard-rules.md`

---

> **Kritik Kural:** Tüm component'ler autism-friendly design prensiplerini desteklemeli ve accessibility standartlarına uymalıdır. Performance ve güvenlik asla ihmal edilemez.

**Son Güncelleme:** 2025-01-07  
**Durum:** Aktif ve zorunlu  
**Owner:** Frontend Development Team 