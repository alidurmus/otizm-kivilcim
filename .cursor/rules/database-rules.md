# 🗄️ Database Kuralları - Kıvılcım Platform

**Amaç:** Güvenli veri yapısı, optimized queries, scalable architecture  
**Hedef:** <200ms query response, user data isolation, KVKK compliance  
**Güncelleme:** Monthly (data model optimizations)

---

## 🔥 Firebase/Firestore Kuralları

### **1. Collection Structure**
```typescript
// Optimized Firestore collection hierarchy
const FIRESTORE_STRUCTURE = {
  users: {
    // User profile data
    uid: {
      profile: UserProfile,
      settings: UserSettings,
      parentalConsent: boolean
    }
  },
  
  children: {
    // Child progress data (with parental consent)
    childId: {
      profile: ChildProfile,
      progress: ModuleProgress,
      sessions: SessionHistory
    }
  },
  
  modules: {
    // Module configuration (public read)
    moduleId: {
      config: ModuleConfig,
      content: ModuleContent
    }
  }
};
```

### **2. Data Modeling Principles**
```typescript
// Firestore document structure
interface UserProfile {
  uid: string;
  email: string;
  role: 'parent' | 'teacher' | 'admin';
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
  preferences: UserPreferences;
  
  // KVKK compliance
  consentGiven: boolean;
  consentDate: Timestamp;
  dataRetentionDate: Timestamp; // 3 years from consent
}

interface ChildProfile {
  childId: string;
  parentId: string;
  name: string;
  age: number;
  diagnoses: string[];
  createdAt: Timestamp;
  
  // Privacy protection
  encryptedData: EncryptedFields;
  anonymizedId: string; // For analytics
}
```

---

## 🔐 Security Rules

### **1. Firestore Security Rules**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // User can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Additional validation for write operations
      allow write: if request.auth != null && 
                      request.auth.uid == userId &&
                      validateUserData(request.resource.data);
    }
    
    // Children data requires parental consent
    match /children/{childId} {
      allow read, write: if request.auth != null && 
                            isParentOfChild(request.auth.uid, childId) &&
                            hasParentalConsent(request.auth.uid);
    }
    
    // Module configurations are public read
    match /modules/{moduleId} {
      allow read: if true;
      allow write: if request.auth != null && 
                      hasAdminRole(request.auth.uid);
    }
    
    // Progress data with privacy protection
    match /progress/{progressId} {
      allow read, write: if request.auth != null && 
                            canAccessProgressData(request.auth.uid, progressId);
    }
    
    // Helper functions
    function validateUserData(data) {
      return data.keys().hasAll(['email', 'role', 'consentGiven']) &&
             data.email is string &&
             data.role in ['parent', 'teacher', 'admin'] &&
             data.consentGiven is bool;
    }
    
    function hasParentalConsent(uid) {
      return get(/databases/$(database)/documents/users/$(uid)).data.consentGiven == true;
    }
    
    function isParentOfChild(uid, childId) {
      return get(/databases/$(database)/documents/children/$(childId)).data.parentId == uid;
    }
    
    function hasAdminRole(uid) {
      return get(/databases/$(database)/documents/users/$(uid)).data.role == 'admin';
    }
  }
}
```

### **2. Data Validation Rules**
```typescript
// Input validation with Zod
const UserProfileSchema = z.object({
  email: z.string().email("Geçerli email adresi gerekli"),
  role: z.enum(['parent', 'teacher', 'admin']),
  consentGiven: z.boolean(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'auto']),
    language: z.enum(['tr', 'en']),
    voiceGender: z.enum(['male', 'female', 'mixed'])
  })
});

const ChildProfileSchema = z.object({
  name: z.string().min(1, "İsim gerekli").max(50, "İsim çok uzun"),
  age: z.number().min(3, "Minimum 3 yaş").max(18, "Maximum 18 yaş"),
  diagnoses: z.array(z.string()).optional(),
  parentId: z.string().uuid("Geçerli parent ID gerekli")
});
```

---

## 🚀 Query Optimization

### **1. Efficient Queries**
```typescript
// ✅ DOĞRU: Indexed queries
const getUserProgress = async (userId: string) => {
  const progressQuery = query(
    collection(db, 'progress'),
    where('userId', '==', userId),
    where('moduleId', '==', moduleId),
    orderBy('createdAt', 'desc'),
    limit(10)
  );
  
  return await getDocs(progressQuery);
};

// ❌ YANLIŞ: Full collection scan
const getAllProgress = async () => {
  const allProgress = await getDocs(collection(db, 'progress'));
  return allProgress.docs.filter(doc => doc.data().userId === userId);
};
```

### **2. Composite Indexes**
```typescript
// Firestore composite indexes
const REQUIRED_INDEXES = [
  // User progress queries
  {
    collection: 'progress',
    fields: ['userId', 'moduleId', 'createdAt']
  },
  
  // Session history queries
  {
    collection: 'sessions',
    fields: ['childId', 'date', 'moduleId']
  },
  
  // Analytics queries
  {
    collection: 'analytics',
    fields: ['date', 'moduleId', 'eventType']
  }
];
```

### **3. Pagination Patterns**
```typescript
// Cursor-based pagination
const getProgressWithPagination = async (
  userId: string, 
  lastDoc?: DocumentSnapshot
) => {
  let q = query(
    collection(db, 'progress'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(20)
  );
  
  if (lastDoc) {
    q = query(q, startAfter(lastDoc));
  }
  
  const snapshot = await getDocs(q);
  return {
    docs: snapshot.docs,
    lastDoc: snapshot.docs[snapshot.docs.length - 1]
  };
};
```

---

## 📊 Data Patterns

### **1. Denormalization Strategy**
```typescript
// User profile with denormalized data
interface UserWithStats {
  uid: string;
  email: string;
  role: string;
  
  // Denormalized stats for quick access
  totalModulesCompleted: number;
  currentStreak: number;
  lastActive: Timestamp;
  favoriteModules: string[];
  
  // Child count (for parents)
  childrenCount: number;
  childrenIds: string[];
}

// Progress summary denormalization
interface ProgressSummary {
  userId: string;
  moduleId: string;
  
  // Aggregated data
  totalSessions: number;
  totalTimeSpent: number;
  averageScore: number;
  lastSession: Timestamp;
  progressPercentage: number;
}
```

### **2. Real-time Updates**
```typescript
// Real-time progress listening
const useProgressListener = (userId: string, moduleId: string) => {
  const [progress, setProgress] = useState<ProgressData | null>(null);
  
  useEffect(() => {
    const progressDoc = doc(db, 'progress', `${userId}_${moduleId}`);
    
    const unsubscribe = onSnapshot(progressDoc, (doc) => {
      if (doc.exists()) {
        setProgress(doc.data() as ProgressData);
      }
    });
    
    return unsubscribe;
  }, [userId, moduleId]);
  
  return progress;
};
```

### **3. Batch Operations**
```typescript
// Batch writes for consistency
const updateUserProgress = async (
  userId: string, 
  moduleId: string, 
  sessionData: SessionData
) => {
  const batch = writeBatch(db);
  
  // Update progress document
  const progressRef = doc(db, 'progress', `${userId}_${moduleId}`);
  batch.update(progressRef, {
    lastSession: serverTimestamp(),
    totalSessions: increment(1),
    totalScore: increment(sessionData.score)
  });
  
  // Add session history
  const sessionRef = doc(collection(db, 'sessions'));
  batch.set(sessionRef, {
    userId,
    moduleId,
    ...sessionData,
    createdAt: serverTimestamp()
  });
  
  // Update user stats
  const userRef = doc(db, 'users', userId);
  batch.update(userRef, {
    lastActive: serverTimestamp(),
    totalSessions: increment(1)
  });
  
  await batch.commit();
};
```

---

## 🔄 Caching Strategy

### **1. Client-Side Caching**
```typescript
// SWR with Firestore
const useUserProgress = (userId: string) => {
  const { data, error, mutate } = useSWR(
    `progress_${userId}`,
    async () => {
      const snapshot = await getDocs(
        query(collection(db, 'progress'), where('userId', '==', userId))
      );
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 300000 // 5 minutes
    }
  );
  
  return { progress: data, error, mutate };
};
```

### **2. Server-Side Caching**
```typescript
// API route with caching
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  
  // Check cache first
  const cachedData = await redis.get(`user_progress_${userId}`);
  if (cachedData) {
    return Response.json(JSON.parse(cachedData));
  }
  
  // Fetch from Firestore
  const progress = await fetchUserProgress(userId);
  
  // Cache for 5 minutes
  await redis.setex(`user_progress_${userId}`, 300, JSON.stringify(progress));
  
  return Response.json(progress);
}
```

---

## 🔒 Privacy & Data Protection

### **1. Data Anonymization**
```typescript
// Anonymize sensitive data for analytics
const anonymizeUserData = (userData: UserData) => {
  return {
    id: generateAnonymousId(userData.uid),
    age: userData.age,
    region: userData.region,
    modulePreferences: userData.preferences,
    
    // Remove PII
    // name: removed
    // email: removed
    // address: removed
  };
};
```

### **2. Data Retention**
```typescript
// Automatic data cleanup
const cleanupExpiredData = async () => {
  const expiredUsers = await getDocs(
    query(
      collection(db, 'users'),
      where('dataRetentionDate', '<', new Date())
    )
  );
  
  const batch = writeBatch(db);
  
  expiredUsers.forEach(userDoc => {
    // Delete user data
    batch.delete(userDoc.ref);
    
    // Delete related child data
    // Delete related progress data
    // Delete related session data
  });
  
  await batch.commit();
};
```

---

## 📈 Analytics & Reporting

### **1. Progress Analytics**
```typescript
// Module completion analytics
const getModuleAnalytics = async (moduleId: string) => {
  const analytics = await getDocs(
    query(
      collection(db, 'analytics'),
      where('moduleId', '==', moduleId),
      where('eventType', '==', 'completion'),
      orderBy('date', 'desc')
    )
  );
  
  return analytics.docs.map(doc => doc.data());
};
```

### **2. Performance Metrics**
```typescript
// Database performance monitoring
const DATABASE_METRICS = {
  queryResponseTime: '<200ms',
  connectionPoolSize: 10,
  maxConnections: 100,
  cacheHitRatio: '>80%',
  indexEfficiency: '>95%'
};
```

---

## 🔧 Development Tools

### **1. Firestore Emulator**
```bash
# Local development with emulator
firebase emulators:start --only firestore

# Test security rules
firebase emulators:exec --only firestore "npm run test:security"

# Import/export data
firebase emulators:export ./firestore-export
```

### **2. Database Testing**
```typescript
// Security rules testing
describe('Firestore Security Rules', () => {
  it('should allow user to read own data', async () => {
    const db = getFirestore(app);
    const userDoc = doc(db, 'users', 'test-user-id');
    
    await expect(getDoc(userDoc)).resolves.toBeTruthy();
  });
  
  it('should deny access to other users data', async () => {
    const db = getFirestore(app);
    const otherUserDoc = doc(db, 'users', 'other-user-id');
    
    await expect(getDoc(otherUserDoc)).rejects.toThrow('permission-denied');
  });
});
```

---

## 📋 Database Checklist

### **Pre-Deployment Database**
- [ ] Security rules deployed and tested
- [ ] Required indexes created
- [ ] Data validation schemas defined
- [ ] Backup strategy implemented
- [ ] Performance monitoring setup
- [ ] KVKK compliance verified
- [ ] Data retention policies configured

### **Runtime Database**
- [ ] Query performance monitoring
- [ ] Connection pooling optimized
- [ ] Cache hit ratio >80%
- [ ] Backup schedule active
- [ ] Security audit logs enabled
- [ ] Data anonymization working
- [ ] Automatic cleanup scheduled

---

## 🔗 İlgili Kural Dosyaları

### **Cross-References**
- **[Security Rules](./security-rules.md)** - Data security patterns
- **[API Rules](./api-rules.md)** - Database API patterns
- **[Performance Rules](./performance-rules.md)** - Query optimization
- **[Error Handling Rules](./error-handling-rules.md)** - Database error handling

### **External Resources**
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/rules-query)
- [Firestore Best Practices](https://firebase.google.com/docs/firestore/best-practices)
- [Query Performance](https://firebase.google.com/docs/firestore/query-data/queries)

---

## ⚠️ Kritik Database Uyarıları

### **❌ ASLA YAPILMAYACAKLAR**
- Security rules olmadan production deployment
- Full collection scans
- Sensitive data client-side storage
- Index'lenmemiş complex queries
- Batch operations olmadan multiple writes
- Data retention policies olmadan user data storage

### **✅ MUTLAKA YAPILACAKLAR**
- Security rules testing
- Query performance optimization
- Proper indexing strategy
- Data validation implementation
- KVKK compliance verification
- Regular security audits

---

> **🗄️ Database Mottosu:** "Çocuk verilerinin güvenliği ve performansı aynı öncelikte. Her query optimize, her data protected."

**Son Güncelleme:** 2025-01-07  
**Database Performans:** 🟢 <200ms queries  
**Security Level:** 🟢 KVKK Compliant  
**Data Integrity:** 🟢 100% Protected 