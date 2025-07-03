# Kıvılcım Projesi - Kodlama Standartları ve Mimari Prensipleri

## 1. SOLID Prensipleri

### Single Responsibility Principle (Tek Sorumluluk Prensibi)
Her sınıf ve fonksiyon sadece bir sorumluluğa sahip olmalıdır.

#### ✅ İyi Örnekler:
```typescript
// ✅ Sadece ses çalmaktan sorumlu
class AudioPlayer {
  async play(audioUrl: string): Promise<void> {
    const audio = new Audio(audioUrl);
    await audio.play();
  }
}

// ✅ Sadece egzersiz doğrulamadan sorumlu
class ExerciseValidator {
  validateAnswer(userAnswer: string, correctAnswer: string): boolean {
    return userAnswer.toLowerCase() === correctAnswer.toLowerCase();
  }
}

// ✅ Sadece ses üretmekten sorumlu
class VoiceGenerator {
  async generateSpeech(text: string, type: VoiceType): Promise<string> {
    // ElevenLabs API call
  }
}
```

#### ❌ Kötü Örnekler:
```typescript
// ❌ Çok fazla sorumluluk
class ExerciseManager {
  validateAnswer() { /* ... */ }
  playSound() { /* ... */ }
  updateProgress() { /* ... */ }
  saveToDatabase() { /* ... */ }
  sendNotification() { /* ... */ }
}
```

### Open/Closed Principle (Açık/Kapalı Prensibi)
Kodlar genişletmeye açık, değişikliğe kapalı olmalıdır.

#### ✅ İyi Örnekler:
```typescript
// Base interface
interface ExerciseType {
  validate(answer: any): boolean;
  getInstructions(): string;
  getProgress(): number;
}

// Genişletilebilir tasarım
class LiteracyExercise implements ExerciseType {
  validate(answer: string): boolean {
    return this.validateSyllable(answer);
  }
  
  getInstructions(): string {
    return "Harfleri birleştirerek hece oluştur";
  }
  
  getProgress(): number {
    return this.completedSteps / this.totalSteps;
  }
}

class MathExercise implements ExerciseType {
  validate(answer: number): boolean {
    return this.validateNumber(answer);
  }
  
  getInstructions(): string {
    return "Sayıları toplama işlemi yap";
  }
  
  getProgress(): number {
    return this.solvedProblems / this.totalProblems;
  }
}
```

### Liskov Substitution Principle (Liskov Yerine Geçme Prensibi)
Alt sınıflar, üst sınıfların yerine sorunsuz kullanılabilmelidir.

#### ✅ İyi Örnekler:
```typescript
abstract class VoiceProvider {
  abstract async speak(text: string): Promise<void>;
  abstract isAvailable(): boolean;
}

class ElevenLabsProvider extends VoiceProvider {
  async speak(text: string): Promise<void> {
    // ElevenLabs implementation
    if (!this.isAvailable()) throw new Error('ElevenLabs not available');
    await this.generateAndPlay(text);
  }
  
  isAvailable(): boolean {
    return !!process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
  }
}

class WebSpeechProvider extends VoiceProvider {
  async speak(text: string): Promise<void> {
    // Web Speech API implementation
    if (!this.isAvailable()) throw new Error('Web Speech not available');
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  }
  
  isAvailable(): boolean {
    return 'speechSynthesis' in window;
  }
}

// Her iki provider da VoiceProvider yerine kullanılabilir
function playWelcomeMessage(provider: VoiceProvider) {
  if (provider.isAvailable()) {
    provider.speak("Hoş geldin!");
  }
}
```

### Interface Segregation Principle (Arayüz Ayrımı Prensibi)
Sınıflar kullanmadıkları interface'lere bağımlı olmamalıdır.

#### ✅ İyi Örnekler:
```typescript
// Ayrılmış küçük interface'ler
interface Playable {
  play(): Promise<void>;
}

interface Pausable {
  pause(): void;
}

interface Seekable {
  seek(position: number): void;
}

// Sadece ihtiyaç duyulan interface'leri implement et
class SimpleAudioPlayer implements Playable {
  async play(): Promise<void> {
    // Simple play functionality
  }
}

class AdvancedAudioPlayer implements Playable, Pausable, Seekable {
  async play(): Promise<void> { /* ... */ }
  pause(): void { /* ... */ }
  seek(position: number): void { /* ... */ }
}
```

#### ❌ Kötü Örnekler:
```typescript
// ❌ Çok büyük interface
interface MediaPlayer {
  play(): Promise<void>;
  pause(): void;
  seek(position: number): void;
  adjustVolume(level: number): void;
  showSubtitles(show: boolean): void;
  record(): void; // Tüm player'lar record etmez
}
```

### Dependency Inversion Principle (Bağımlılık Ters Çevirme Prensibi)
Üst seviye modüller alt seviye modüllere bağımlı olmamalıdır.

#### ✅ İyi Örnekler:
```typescript
// Abstraction
interface StorageService {
  save(key: string, value: any): Promise<void>;
  load(key: string): Promise<any>;
}

// Low-level implementations
class LocalStorageService implements StorageService {
  async save(key: string, value: any): Promise<void> {
    localStorage.setItem(key, JSON.stringify(value));
  }
  
  async load(key: string): Promise<any> {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }
}

class APIStorageService implements StorageService {
  async save(key: string, value: any): Promise<void> {
    await fetch('/api/storage', {
      method: 'POST',
      body: JSON.stringify({ key, value })
    });
  }
  
  async load(key: string): Promise<any> {
    const response = await fetch(`/api/storage/${key}`);
    return response.json();
  }
}

// High-level module depends on abstraction
class ProgressTracker {
  constructor(private storage: StorageService) {}
  
  async saveProgress(exerciseId: string, progress: number) {
    await this.storage.save(`progress_${exerciseId}`, progress);
  }
  
  async loadProgress(exerciseId: string): Promise<number> {
    return await this.storage.load(`progress_${exerciseId}`) || 0;
  }
}
```

## 2. Clean Code Prensipleri

### Anlamlı İsimlendirme

#### ✅ İyi Örnekler:
```typescript
// ✅ Anlamlı değişken isimleri
const currentExerciseIndex = 0;
const isExerciseCompleted = false;
const userSyllableInput = '';
const celebrationMessages = ['Harikasın!', 'Bravo!'];

// ✅ Anlamlı fonksiyon isimleri
function calculateExerciseProgress(completed: number, total: number): number {
  return Math.round((completed / total) * 100);
}

function playSuccessSound(text: string): Promise<void> {
  return elevenLabsClient.speak(text, 'celebration');
}

function isValidTurkishLetter(letter: string): boolean {
  return /^[a-zA-ZçğıöşüÇĞIİÖŞÜ]$/.test(letter);
}
```

#### ❌ Kötü Örnekler:
```typescript
// ❌ Belirsiz isimler
const d = new Date();
const u = getUserData();
const flag = true;
const data = response.data;
const temp = calculateSomething();

// ❌ Kısaltmalar
function chkUsrInp(inp: string): boolean { /* ... */ }
function procEx(): void { /* ... */ }
```

### Fonksiyon Tasarımı

#### ✅ İyi Örnekler:
```typescript
// ✅ Küçük, tek görevli fonksiyonlar
function validateSyllableInput(input: string, expected: string): boolean {
  return input.toLowerCase().trim() === expected.toLowerCase().trim();
}

function formatProgressPercentage(current: number, total: number): string {
  const percentage = Math.round((current / total) * 100);
  return `${percentage}%`;
}

function createAudioElement(url: string): HTMLAudioElement {
  const audio = new Audio(url);
  audio.volume = 0.8;
  return audio;
}

// ✅ Pure functions (yan etki yok)
function calculateNextExerciseIndex(current: number, total: number): number {
  return current >= total - 1 ? 0 : current + 1;
}

function generateCelebrationMessage(score: number): string {
  if (score >= 90) return 'Mükemmel! Çok başarılısın!';
  if (score >= 70) return 'Harika! Güzel iş çıkardın!';
  return 'Bravo! Devam et böyle!';
}
```

#### ❌ Kötü Örnekler:
```typescript
// ❌ Çok uzun fonksiyonlar
function handleExerciseCompletion(data: any) {
  // 50+ lines of code
  // Multiple responsibilities
  // Hard to test and maintain
}

// ❌ Çok fazla parametre
function createExercise(
  id: string, 
  type: string, 
  letters: string[], 
  target: string, 
  difficulty: number,
  voice: string,
  animation: boolean,
  sound: boolean,
  theme: string
) { /* ... */ }
```

### Error Handling (Hata Yönetimi)

#### ✅ İyi Örnekler:
```typescript
// ✅ Specific error types
class AudioPlaybackError extends Error {
  constructor(message: string, public readonly audioUrl: string) {
    super(message);
    this.name = 'AudioPlaybackError';
  }
}

class ExerciseValidationError extends Error {
  constructor(message: string, public readonly exerciseId: string) {
    super(message);
    this.name = 'ExerciseValidationError';
  }
}

// ✅ Graceful error handling
async function playAudioWithFallback(text: string): Promise<void> {
  try {
    await elevenLabsService.speak(text);
  } catch (error) {
    console.warn('ElevenLabs failed, using fallback:', error);
    
    try {
      await webSpeechService.speak(text);
    } catch (fallbackError) {
      console.error('All audio services failed:', fallbackError);
      showVisualFeedback(text); // Silent fallback
    }
  }
}

// ✅ Error boundaries for React
class ExerciseErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logErrorToService(error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <FriendlyErrorMessage onRetry={() => this.setState({ hasError: false })} />;
    }
    
    return this.props.children;
  }
}
```

### Kod Organizasyonu

#### ✅ İyi Klasör Yapısı:
```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI elements
│   │   ├── Button/
│   │   ├── Card/
│   │   └── ProgressBar/
│   ├── exercise/        # Exercise-specific components
│   │   ├── LetterBox/
│   │   ├── DropZone/
│   │   └── ExerciseContainer/
│   └── layout/          # Layout components
│       ├── Header/
│       └── Navigation/
├── lib/                 # Business logic and utilities
│   ├── audio/           # Audio-related logic
│   │   ├── elevenlabs.ts
│   │   ├── webSpeech.ts
│   │   └── audioPlayer.ts
│   ├── exercise/        # Exercise logic
│   │   ├── validator.ts
│   │   ├── progress.ts
│   │   └── types.ts
│   └── storage/         # Data persistence
│       ├── localStorage.ts
│       └── sessionStorage.ts
├── hooks/               # Custom React hooks
│   ├── useAudio.ts
│   ├── useExercise.ts
│   └── useProgress.ts
├── types/               # TypeScript type definitions
│   ├── exercise.ts
│   ├── audio.ts
│   └── user.ts
└── utils/               # Pure utility functions
    ├── constants.ts
    ├── helpers.ts
    └── validation.ts
```

## 3. TypeScript Best Practices

### Tip Güvenliği

#### ✅ İyi Örnekler:
```typescript
// ✅ Strict typing
interface Exercise {
  id: string;
  type: ExerciseType;
  letters: readonly string[];
  targetSyllable: string;
  difficulty: DifficultyLevel;
  completed: boolean;
}

type ExerciseType = 'literacy' | 'math' | 'social' | 'writing';
type DifficultyLevel = 1 | 2 | 3 | 4 | 5;
type VoiceType = 'letter' | 'word' | 'sentence' | 'celebration';

// ✅ Generic types
interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}

interface ProgressData {
  exerciseId: string;
  completedSteps: number;
  totalSteps: number;
  lastUpdated: Date;
}

// ✅ Utility types
type PartialExercise = Partial<Exercise>;
type ExerciseKeys = keyof Exercise;
type RequiredExerciseFields = Required<Pick<Exercise, 'id' | 'type'>>;
```

### React Component Types

#### ✅ İyi Örnekler:
```typescript
// ✅ Proper component typing
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'success';
  size: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant,
  size,
  disabled = false,
  loading = false,
  onClick,
  children,
  className = ''
}) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? 'Yükleniyor...' : children}
    </button>
  );
};

// ✅ Custom hooks with proper typing
interface UseExerciseReturn {
  currentExercise: Exercise | null;
  progress: number;
  isCompleted: boolean;
  nextExercise: () => void;
  resetExercise: () => void;
  submitAnswer: (answer: string) => Promise<boolean>;
}

function useExercise(exerciseId: string): UseExerciseReturn {
  // Implementation with proper return types
}
```

## 4. Testing Standards

### Unit Testing

#### ✅ İyi Test Örnekler:
```typescript
// ✅ Descriptive test names
describe('ExerciseValidator', () => {
  describe('validateSyllable', () => {
    it('should return true when user input matches target syllable exactly', () => {
      const validator = new ExerciseValidator();
      const result = validator.validateSyllable('el', 'el');
      expect(result).toBe(true);
    });
    
    it('should return true when user input matches target with different case', () => {
      const validator = new ExerciseValidator();
      const result = validator.validateSyllable('EL', 'el');
      expect(result).toBe(true);
    });
    
    it('should return false when user input does not match target', () => {
      const validator = new ExerciseValidator();
      const result = validator.validateSyllable('al', 'el');
      expect(result).toBe(false);
    });
  });
});

// ✅ Mock external dependencies
describe('AudioService', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });
  
  it('should call ElevenLabs API with correct parameters', async () => {
    const mockResponse = new Response(new Blob(['audio-data']));
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
    
    const audioService = new AudioService();
    await audioService.generateSpeech('test', 'sentence');
    
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('elevenlabs.io'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json'
        })
      })
    );
  });
});
```

### E2E Testing Best Practices

#### ✅ İyi E2E Test Örnekler:
```typescript
// ✅ Page Object Model
class ExercisePage {
  constructor(private page: Page) {}
  
  async dragLetterToPosition(letter: string, position: number) {
    const letterElement = this.page.getByText(letter).first();
    const dropZone = this.page.getByTestId(`drop-zone-${position}`);
    await letterElement.dragTo(dropZone);
  }
  
  async waitForSuccessMessage() {
    return this.page.waitForSelector('[data-testid="success-message"]');
  }
  
  async getProgressPercentage(): Promise<number> {
    const progressText = await this.page.getByTestId('progress-text').textContent();
    return parseInt(progressText?.match(/(\d+)%/)?.[1] || '0');
  }
}

// ✅ Descriptive test scenarios
test.describe('Exercise Completion Flow', () => {
  test('should allow user to complete syllable exercise with drag and drop', async ({ page }) => {
    const exercisePage = new ExercisePage(page);
    
    await page.goto('/exercise/literacy');
    
    // Drag first letter
    await exercisePage.dragLetterToPosition('e', 1);
    
    // Drag second letter
    await exercisePage.dragLetterToPosition('l', 2);
    
    // Verify success
    await exercisePage.waitForSuccessMessage();
    expect(await exercisePage.getProgressPercentage()).toBeGreaterThan(0);
  });
});
```

## 5. Performance Standards

### React Performance

#### ✅ Optimizasyon Teknikleri:
```typescript
// ✅ Memoization
const ExpensiveComponent = React.memo<Props>(({ data, onUpdate }) => {
  const processedData = useMemo(() => {
    return processData(data);
  }, [data]);
  
  const handleClick = useCallback((id: string) => {
    onUpdate(id);
  }, [onUpdate]);
  
  return <div>{/* Render logic */}</div>;
});

// ✅ Lazy loading
const LazyExercisePage = React.lazy(() => import('./ExercisePage'));
const LazyParentPanel = React.lazy(() => import('./ParentPanel'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/exercise" element={<LazyExercisePage />} />
        <Route path="/parent" element={<LazyParentPanel />} />
      </Routes>
    </Suspense>
  );
}

// ✅ Efficient state updates
function useExerciseState() {
  const [state, setState] = useState<ExerciseState>({
    currentIndex: 0,
    answers: [],
    isCompleted: false
  });
  
  const updateAnswer = useCallback((index: number, answer: string) => {
    setState(prev => ({
      ...prev,
      answers: prev.answers.map((a, i) => i === index ? answer : a)
    }));
  }, []);
  
  return { state, updateAnswer };
}
```

## 6. Accessibility Standards

### WCAG 2.1 Uyumluluğu

#### ✅ Erişilebilirlik İyi Pratikleri:
```typescript
// ✅ Semantic HTML and ARIA
const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onStart }) => {
  return (
    <article 
      className="exercise-card"
      role="region"
      aria-labelledby={`exercise-title-${exercise.id}`}
    >
      <h3 id={`exercise-title-${exercise.id}`}>
        {exercise.title}
      </h3>
      
      <p aria-describedby={`exercise-desc-${exercise.id}`}>
        {exercise.description}
      </p>
      
      <button
        onClick={() => onStart(exercise.id)}
        aria-label={`${exercise.title} egzersizini başlat`}
        disabled={exercise.locked}
      >
        {exercise.locked ? 'Kilitli' : 'Başla'}
      </button>
    </article>
  );
};

// ✅ Keyboard navigation
const NavigationMenu: React.FC = () => {
  const [focusedIndex, setFocusedIndex] = useState(0);
  
  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex(prev => Math.min(prev + 1, menuItems.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        handleMenuItemClick(focusedIndex);
        break;
    }
  };
  
  return (
    <nav role="navigation" aria-label="Ana menü">
      <ul onKeyDown={handleKeyDown} role="menubar">
        {menuItems.map((item, index) => (
          <li 
            key={item.id}
            role="none"
          >
            <a
              href={item.href}
              role="menuitem"
              tabIndex={index === focusedIndex ? 0 : -1}
              aria-current={index === focusedIndex ? 'true' : undefined}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
```

## 7. Code Review Checklist

### Pre-Commit Kontrolleri:
- [ ] **SOLID prensipleri uygulandı mı?**
- [ ] **Fonksiyonlar tek sorumluluğa sahip mi?**
- [ ] **Değişken ve fonksiyon isimleri anlamlı mı?**
- [ ] **TypeScript tipleri doğru tanımlandı mı?**
- [ ] **Error handling uygulandı mı?**
- [ ] **Unit testler yazıldı mı?**
- [ ] **Accessibility standartları karşılandı mı?**
- [ ] **Performance optimizasyonları yapıldı mı?**
- [ ] **Code duplication yok mu?**
- [ ] **Magic number'lar constant olarak tanımlandı mı?**

### Otizm Dostu Özel Kontroller:
- [ ] **Animasyonlar sakin ve tahmin edilebilir mi?**
- [ ] **Ses seviyeleri uygun mu?**
- [ ] **Renkler otizm dostu mu? (yüksek kontrast seçeneği var mı?)**
- [ ] **Etkileşimler basit ve anlaşılır mı?**
- [ ] **Error mesajları çocuk dostu mu?**
- [ ] **Touch target'lar yeterince büyük mü? (min 44px)**

Bu standartlar Kıvılcım projesinin sürdürülebilir, ölçeklenebilir ve erişilebilir olmasını sağlar. 