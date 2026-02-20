# 🚨 Error Handling Kuralları - Kıvılcım Platform

**Amaç:** Graceful error handling, user-friendly experiences, system stability  
**Hedef:** <1% error rate, 100% error boundary coverage, meaningful error messages  
**Güncelleme:** Weekly (error pattern analysis)

---

## 🛡️ Error Boundary Kuralları

### **1. Component Error Boundaries**
```typescript
// Zorunlu error boundary wrapper
class ModuleErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to monitoring service
    console.error('Module Error:', error, errorInfo);
    
    // Report to error tracking
    this.reportError(error, errorInfo);
  }

  reportError = (error: Error, errorInfo: ErrorInfo) => {
    // Send to error monitoring service
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      userId: this.props.userId,
      moduleId: this.props.moduleId,
      timestamp: new Date().toISOString()
    };
    
    // Report to analytics
    this.sendErrorReport(errorReport);
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          onRetry={() => this.setState({ hasError: false, error: null })}
          moduleId={this.props.moduleId}
        />
      );
    }

    return this.props.children;
  }
}
```

### **2. Route-Level Error Boundaries**
```typescript
// Route error boundary pattern
const RouteErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundary
      FallbackComponent={({ error, resetErrorBoundary }) => (
        <div className="error-container">
          <h2>Bu sayfada bir sorun oluştu</h2>
          <p>Lütfen sayfayı yenilemeyi deneyin.</p>
          <button onClick={resetErrorBoundary}>
            Tekrar Dene
          </button>
        </div>
      )}
      onError={(error, errorInfo) => {
        console.error('Route Error:', error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
};
```

---

## 🔄 Fallback Strategies

### **1. Audio System Fallback**
```typescript
// 4-tier audio fallback chain
const useAudioFallback = () => {
  const [currentMethod, setCurrentMethod] = useState<AudioMethod>('static');
  
  const playAudio = async (text: string, type: AudioType) => {
    try {
      // Tier 1: Static MP3 files
      if (currentMethod === 'static') {
        return await playStaticAudio(text, type);
      }
    } catch (error) {
      console.log('Static audio failed, trying ElevenLabs SDK...');
      setCurrentMethod('elevenlabs');
    }
    
    try {
      // Tier 2: ElevenLabs SDK
      if (currentMethod === 'elevenlabs') {
        return await playElevenLabsAudio(text, type);
      }
    } catch (error) {
      console.log('ElevenLabs SDK failed, trying API route...');
      setCurrentMethod('api');
    }
    
    try {
      // Tier 3: API Route
      if (currentMethod === 'api') {
        return await playApiAudio(text, type);
      }
    } catch (error) {
      console.log('API route failed, trying Web Speech API...');
      setCurrentMethod('webspeech');
    }
    
    try {
      // Tier 4: Web Speech API
      return await playWebSpeechAudio(text);
    } catch (error) {
      console.error('All audio methods failed:', error);
      // Silent fallback - show visual feedback only
      showVisualFeedback(text);
    }
  };
  
  return { playAudio, currentMethod };
};
```

### **2. Network Error Fallback**
```typescript
// Network request with retry logic
const useNetworkFallback = () => {
  const fetchWithRetry = async (
    url: string, 
    options: RequestInit, 
    maxRetries: number = 3
  ) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await fetch(url, options);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return response;
      } catch (error) {
        console.log(`Attempt ${i + 1} failed:`, error);
        
        if (i === maxRetries - 1) {
          throw error;
        }
        
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  };
  
  return { fetchWithRetry };
};
```

### **3. Data Loading Fallback**
```typescript
// Data loading with graceful degradation
const useDataFallback = <T>(
  primaryFetcher: () => Promise<T>,
  fallbackData: T
) => {
  const [data, setData] = useState<T>(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const result = await primaryFetcher();
        setData(result);
        setError(null);
      } catch (err) {
        console.error('Data loading failed, using fallback:', err);
        setError(err as Error);
        setData(fallbackData); // Use fallback data
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  return { data, loading, error };
};
```

---

## 📝 User-Friendly Error Messages

### **1. Error Message Patterns**
```typescript
// Turkish error messages for autism-friendly UX
const ERROR_MESSAGES = {
  // Network errors
  NETWORK_ERROR: {
    title: "Bağlantı Sorunu",
    message: "İnternet bağlantınızı kontrol edin ve tekrar deneyin.",
    action: "Tekrar Dene",
    icon: "🌐"
  },
  
  // Audio errors
  AUDIO_ERROR: {
    title: "Ses Sorunu",
    message: "Ses çalamadık, ama etkinliğe devam edebilirsin.",
    action: "Devam Et",
    icon: "🔊"
  },
  
  // Loading errors
  LOADING_ERROR: {
    title: "Yükleme Sorunu",
    message: "Sayfa yüklenirken bir sorun oluştu.",
    action: "Sayfayı Yenile",
    icon: "📱"
  },
  
  // Module errors
  MODULE_ERROR: {
    title: "Modül Sorunu",
    message: "Bu modülde geçici bir sorun var. Başka bir modül deneyin.",
    action: "Ana Menü",
    icon: "🧩"
  },
  
  // Game errors
  GAME_ERROR: {
    title: "Oyun Sorunu",
    message: "Oyun başlatılırken bir sorun oluştu.",
    action: "Oyunu Yeniden Başlat",
    icon: "🎮"
  }
};
```

### **2. Error Display Components**
```typescript
// Autism-friendly error display
const ErrorDisplay = ({ 
  error, 
  onRetry, 
  moduleId 
}: ErrorDisplayProps) => {
  const errorConfig = ERROR_MESSAGES[error.type] || ERROR_MESSAGES.LOADING_ERROR;
  
  return (
    <div className="error-display">
      <div className="error-icon">
        {errorConfig.icon}
      </div>
      
      <h3 className="error-title">
        {errorConfig.title}
      </h3>
      
      <p className="error-message">
        {errorConfig.message}
      </p>
      
      <div className="error-actions">
        <button 
          onClick={onRetry}
          className="primary-button"
        >
          {errorConfig.action}
        </button>
        
        <button 
          onClick={() => window.location.href = '/modules'}
          className="secondary-button"
        >
          Ana Menü
        </button>
      </div>
    </div>
  );
};
```

---

## 📊 Error Monitoring & Logging

### **1. Error Tracking**
```typescript
// Centralized error tracking
interface ErrorReport {
  id: string;
  timestamp: string;
  userId?: string;
  moduleId?: string;
  errorType: string;
  errorMessage: string;
  stackTrace?: string;
  userAgent: string;
  url: string;
  additionalContext?: any;
}

const errorTracker = {
  reportError: (error: Error, context?: any) => {
    const report: ErrorReport = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      userId: context?.userId,
      moduleId: context?.moduleId,
      errorType: error.name,
      errorMessage: error.message,
      stackTrace: error.stack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      additionalContext: context
    };
    
    // Send to monitoring service
    sendErrorReport(report);
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Report:', report);
    }
  }
};
```

### **2. Error Analytics**
```typescript
// Error pattern analysis
const errorAnalytics = {
  trackErrorPattern: (error: Error, moduleId: string) => {
    // Track error frequency
    const errorKey = `${error.name}_${moduleId}`;
    const errorCount = getErrorCount(errorKey);
    
    if (errorCount > 5) {
      // Alert for high error rate
      alertHighErrorRate(errorKey, errorCount);
    }
    
    // Track error trends
    trackErrorTrend(errorKey, new Date());
  },
  
  generateErrorReport: () => {
    return {
      totalErrors: getTotalErrors(),
      errorsByModule: getErrorsByModule(),
      errorsByType: getErrorsByType(),
      errorTrends: getErrorTrends()
    };
  }
};
```

---

## 🔧 Development Error Handling

### **1. Development Error Overlay**
```typescript
// Enhanced error overlay for development
const DevelopmentErrorOverlay = ({ error }: { error: Error }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <div className="dev-error-overlay">
      <div className="error-header">
        <h2>🚨 Development Error</h2>
        <button onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? 'Hide' : 'Show'} Details
        </button>
      </div>
      
      {showDetails && (
        <div className="error-details">
          <h3>Error: {error.name}</h3>
          <p>{error.message}</p>
          <pre>{error.stack}</pre>
        </div>
      )}
      
      <div className="error-actions">
        <button onClick={() => window.location.reload()}>
          Reload Page
        </button>
        <button onClick={() => console.clear()}>
          Clear Console
        </button>
      </div>
    </div>
  );
};
```

### **2. Error Testing Tools**
```typescript
// Error simulation for testing
const ErrorSimulator = () => {
  const simulateError = (type: string) => {
    switch (type) {
      case 'network':
        throw new Error('Simulated network error');
      case 'audio':
        throw new Error('Simulated audio error');
      case 'component':
        throw new Error('Simulated component error');
      default:
        throw new Error('Unknown error type');
    }
  };
  
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <div className="error-simulator">
      <h3>Error Simulator</h3>
      <button onClick={() => simulateError('network')}>
        Simulate Network Error
      </button>
      <button onClick={() => simulateError('audio')}>
        Simulate Audio Error
      </button>
      <button onClick={() => simulateError('component')}>
        Simulate Component Error
      </button>
    </div>
  );
};
```

---

## 🎯 Module-Specific Error Handling

### **1. Audio Module Errors**
```typescript
// Audio-specific error handling
const useAudioErrorHandling = () => {
  const handleAudioError = (error: Error, audioType: string) => {
    const errorContext = {
      audioType,
      moduleId: 'audio-system',
      timestamp: new Date().toISOString()
    };
    
    // Log specific audio error
    console.error(`Audio Error (${audioType}):`, error);
    
    // Report to error tracking
    errorTracker.reportError(error, errorContext);
    
    // Show user-friendly message
    showNotification({
      type: 'warning',
      message: 'Ses çalamadık, ama etkinliğe devam edebilirsin.',
      duration: 3000
    });
  };
  
  return { handleAudioError };
};
```

### **2. Game Module Errors**
```typescript
// Game-specific error handling
const useGameErrorHandling = () => {
  const handleGameError = (error: Error, gameId: string) => {
    // Save game state before error
    saveGameState(gameId);
    
    // Report error
    errorTracker.reportError(error, { gameId, gameState: 'error' });
    
    // Offer recovery options
    showGameErrorDialog({
      title: 'Oyun Sorunu',
      message: 'Oyun durduruldu. Ne yapmak istersin?',
      actions: [
        { label: 'Oyunu Yeniden Başlat', action: () => restartGame(gameId) },
        { label: 'Son Kaydettiğim Yerden Devam Et', action: () => resumeGame(gameId) },
        { label: 'Ana Menü', action: () => goToMainMenu() }
      ]
    });
  };
  
  return { handleGameError };
};
```

---

## 📋 Error Handling Checklist

### **Pre-Deployment Error Handling**
- [ ] Error boundaries implemented for all routes
- [ ] Fallback strategies defined for critical features
- [ ] User-friendly error messages in Turkish
- [ ] Error monitoring service configured
- [ ] Retry logic implemented for network requests
- [ ] Graceful degradation for audio failures
- [ ] Error reporting to analytics
- [ ] Development error overlay working

### **Runtime Error Handling**
- [ ] Error boundaries catching all errors
- [ ] Fallback chains working correctly
- [ ] Error messages displayed properly
- [ ] Error reports being sent
- [ ] User able to recover from errors
- [ ] No unhandled promise rejections
- [ ] Memory leaks prevented
- [ ] Performance impact minimized

---

## 🔗 İlgili Kural Dosyaları

### **Cross-References**
- **[Audio System Rules](./audio-system-rules.md)** - Audio fallback strategies
- **[Component Rules](./component-rules.md)** - Component error boundaries
- **[API Rules](./api-rules.md)** - API error handling
- **[Security Rules](./security-rules.md)** - Security error handling
- **[Performance Rules](./performance-rules.md)** - Performance error monitoring

### **External Resources**
- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Error Handling Best Practices](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Error_handling)
- [Web API Error Handling](https://developer.mozilla.org/en-US/docs/Web/API/Window/error_event)

---

## ⚠️ Kritik Error Handling Uyarıları

### **❌ ASLA YAPILMAYACAKLAR**
- Error'ları silent ignore etme
- User'a technical error messages gösterme
- Error boundaries olmadan production deploy
- Fallback strategies olmadan critical features
- Error'ları proper logging yapmama
- Unhandled promise rejections bırakma

### **✅ MUTLAKA YAPILACAKLAR**
- Her route için error boundary
- User-friendly error messages
- Fallback strategies implementation
- Error monitoring setup
- Graceful degradation
- Proper error logging
- Recovery options providing

---

> **🚨 Error Handling Mottosu:** "Hatalar kaçınılmaz, ama kullanıcı deneyimini bozmamalılar. Her hata bir öğrenme fırsatı, her recovery bir güven tazelemesi."

**Son Güncelleme:** 2025-01-07  
**Error Rate:** 🟢 <1% target  
**Coverage:** 🟢 100% error boundaries  
**Recovery:** 🟢 Graceful degradation 