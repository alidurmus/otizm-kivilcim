# API Kuralları - Kıvılcım Platform

## 🌐 API Ana Kuralları

### 🏗️ API Architecture

#### **Next.js API Routes Structure**
```typescript
// ZORUNLU API yapısı
app/api/
├── audio/
│   ├── route.ts           # GET, POST audio operations
│   └── [id]/route.ts      # GET, PUT, DELETE specific audio
├── speech/
│   ├── route.ts           # ElevenLabs TTS proxy
│   ├── v3-test/route.ts   # v3 model testing
│   ├── config/route.ts    # Voice configuration
│   └── voices/route.ts    # Available voices list
├── auth/
│   └── route.ts           # Authentication endpoints
└── analytics/
    └── route.ts           # Usage analytics
```

#### **RESTful API Standards**
- **GET:** Data retrieval (no side effects)
- **POST:** Resource creation
- **PUT:** Resource update (full replacement)
- **PATCH:** Partial resource update
- **DELETE:** Resource removal

### 🔐 API Security Kuralları

#### **Authentication & Authorization**
- **Server-Side Only:** API keys never exposed to client
- **Rate Limiting:** IP-based request throttling
- **Input Validation:** Zod schema validation for all inputs
- **Error Handling:** Consistent error response format

#### **Security Implementation**
```typescript
// ZORUNLU güvenlik pattern
export async function POST(request: NextRequest) {
  try {
    // 1. Rate limiting check
    const rateLimitResult = await rateLimit(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    // 2. Authentication
    const user = await authenticateRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 3. Input validation
    const body = await request.json();
    const validatedData = schema.parse(body);

    // 4. Business logic
    const result = await processRequest(validatedData);

    return NextResponse.json(result);
  } catch (error) {
    return handleAPIError(error);
  }
}
```

### 🎵 Audio API Kuralları

#### **Speech API (/api/speech)**
- **Purpose:** ElevenLabs TTS proxy
- **Security:** Server-side API key management
- **Fallback:** Web Speech API for client-side fallback
- **Caching:** Response caching for repeated requests

#### **Audio Management API (/api/audio)**
```typescript
// ZORUNLU audio API interface
interface AudioAPI {
  // GET /api/audio - List audio files
  list: (params: {
    category?: string;
    module?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) => Promise<AudioFile[]>;

  // POST /api/audio - Create audio file
  create: (data: AudioFileCreate) => Promise<string>;

  // GET /api/audio/[id] - Get specific audio file
  get: (id: string) => Promise<AudioFile>;

  // PUT /api/audio/[id] - Update audio file
  update: (id: string, data: AudioFileUpdate) => Promise<AudioFile>;

  // DELETE /api/audio/[id] - Delete audio file
  delete: (id: string) => Promise<boolean>;
}
```

### 📊 API Response Standards

#### **Consistent Response Format**
```typescript
// ZORUNLU response format
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    timestamp: string;
  };
}
```

#### **HTTP Status Codes**
- **200:** Success
- **201:** Created
- **400:** Bad Request (validation error)
- **401:** Unauthorized
- **403:** Forbidden
- **404:** Not Found
- **429:** Too Many Requests
- **500:** Internal Server Error

### 🧪 API Testing Kuralları

#### **Test Coverage Requirements**
- **Unit Tests:** API route logic testing
- **Integration Tests:** Database operations
- **E2E Tests:** Full API workflow testing
- **Performance Tests:** Response time benchmarking

#### **API Test Patterns**
```typescript
// ZORUNLU API test pattern
describe('/api/audio', () => {
  describe('GET /api/audio', () => {
    test('should return audio files list', async () => {
      const response = await request(app)
        .get('/api/audio')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('should filter by category', async () => {
      const response = await request(app)
        .get('/api/audio?category=letter')
        .expect(200);

      expect(response.body.data.every(
        file => file.category === 'letter'
      )).toBe(true);
    });
  });

  describe('POST /api/audio', () => {
    test('should create audio file', async () => {
      const audioData = {
        title: 'Test Audio',
        filename: 'test.mp3',
        // ... other fields
      };

      const response = await request(app)
        .post('/api/audio')
        .send(audioData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(typeof response.body.data).toBe('string'); // ID
    });

    test('should validate input data', async () => {
      const invalidData = { title: '' }; // Missing required fields

      await request(app)
        .post('/api/audio')
        .send(invalidData)
        .expect(400);
    });
  });
});
```

### 🔄 API Performance Kuralları

#### **Performance Targets**
- **Response Time:** <200ms for simple operations
- **Database Queries:** <100ms average
- **External API Calls:** <500ms (ElevenLabs)
- **Concurrent Requests:** Support 100+ simultaneous

#### **Optimization Techniques**
```typescript
// ZORUNLU performance optimization
export async function GET(request: NextRequest) {
  // 1. Caching
  const cacheKey = generateCacheKey(request);
  const cached = await getFromCache(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  // 2. Database optimization
  const result = await db.audioFiles.findMany({
    select: {
      id: true,
      title: true,
      category: true,
      // Only required fields
    },
    where: buildWhereClause(searchParams),
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset
  });

  // 3. Cache result
  await setCache(cacheKey, result, TTL);

  return NextResponse.json({
    success: true,
    data: result
  });
}
```

### 📈 API Analytics Kuralları

#### **Usage Tracking**
- **Request Metrics:** Count, response times, success rates
- **User Analytics:** Usage patterns, popular endpoints
- **Error Monitoring:** Error rates, common failure points
- **Performance Monitoring:** Slow query identification

#### **Analytics Implementation**
```typescript
// ZORUNLU analytics middleware
export function withAnalytics(handler: APIHandler) {
  return async (request: NextRequest) => {
    const startTime = Date.now();
    const endpoint = request.nextUrl.pathname;
    const method = request.method;

    try {
      const response = await handler(request);
      
      // Track success
      await trackAPICall({
        endpoint,
        method,
        status: response.status,
        duration: Date.now() - startTime,
        success: true
      });

      return response;
    } catch (error) {
      // Track error
      await trackAPICall({
        endpoint,
        method,
        status: 500,
        duration: Date.now() - startTime,
        success: false,
        error: error.message
      });

      throw error;
    }
  };
}
```

### 🌐 External API Integration

#### **ElevenLabs API Rules**
- **SDK Priority:** Use official @elevenlabs/elevenlabs-js
- **Error Handling:** Graceful degradation to fallbacks
- **Rate Limiting:** Respect API limits
- **Cost Optimization:** Cache frequent requests

#### **Firebase Integration**
```typescript
// ZORUNLU Firebase integration pattern
const initializeFirebase = () => {
  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL
      });
    }
    return admin.firestore();
  } catch (error) {
    console.warn('Firebase initialization failed, using mock fallback');
    return createMockFirestore();
  }
};
```

### 🔧 API Development Tools

#### **Development Utilities**
```bash
# ZORUNLU API development commands
npm run api:test            # Run API tests
npm run api:docs            # Generate API documentation
npm run api:benchmark       # Performance benchmarking
npm run api:validate        # Schema validation testing
```

#### **API Documentation**
- **OpenAPI Specification:** Auto-generated from code
- **Interactive Docs:** Swagger UI for testing
- **Examples:** Request/response examples
- **Changelog:** API version history

### 🚨 Error Handling API Kuralları

#### **Error Response Standards**
```typescript
// ZORUNLU error handling
export function handleAPIError(error: unknown): NextResponse {
  // Log error for monitoring
  logger.error('API Error:', error);

  if (error instanceof ZodError) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input data',
        details: error.errors
      }
    }, { status: 400 });
  }

  if (error instanceof APIError) {
    return NextResponse.json({
      success: false,
      error: {
        code: error.code,
        message: error.message
      }
    }, { status: error.statusCode });
  }

  // Generic error
  return NextResponse.json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred'
    }
  }, { status: 500 });
}
```

### 📱 Mobile API Considerations

#### **Mobile Optimization**
- **Payload Size:** Minimize response sizes
- **Bandwidth:** Optimize for slow connections
- **Offline Support:** Cache critical data
- **Progressive Loading:** Support partial data loading

#### **Mobile-Specific Endpoints**
```typescript
// ZORUNLU mobile optimization
export async function GET(request: NextRequest) {
  const userAgent = request.headers.get('user-agent');
  const isMobile = detectMobileDevice(userAgent);

  if (isMobile) {
    // Return optimized data for mobile
    return NextResponse.json({
      success: true,
      data: await getMobileOptimizedData()
    });
  }

  return NextResponse.json({
    success: true,
    data: await getFullData()
  });
}
```

### 🔄 API Versioning Kuralları

#### **Version Strategy**
- **URL Versioning:** `/api/v1/`, `/api/v2/`
- **Backward Compatibility:** Support previous versions
- **Deprecation:** Gradual phase-out process
- **Migration Guides:** Clear upgrade paths

#### **Version Management**
```typescript
// ZORUNLU versioning pattern
export async function GET(request: NextRequest) {
  const version = getAPIVersion(request);

  switch (version) {
    case 'v1':
      return handleV1Request(request);
    case 'v2':
      return handleV2Request(request);
    default:
      return handleLatestRequest(request);
  }
}
```

---

## 🔗 İlgili Kural Dosyaları

- **Testing Rules:** `docs/rules/testing-rules.md`
- **Audio System Rules:** `docs/rules/audio-system-rules.md`
- **Component Rules:** `docs/rules/component-rules.md`
- **Dashboard Rules:** `docs/rules/dashboard-rules.md`

---

> **Kritik Kural:** Tüm API endpoint'leri güvenli, performanslı ve test edilmiş olmalıdır. Server-side güvenlik asla ihmal edilemez.

**Son Güncelleme:** 2025-01-07  
**Durum:** Aktif ve zorunlu  
**Owner:** Backend Development Team 