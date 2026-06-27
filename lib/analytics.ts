/**
 * Kıvılcım - Privacy-Compliant Analytics & Learning Outcomes Tracker
 * 
 * Bu modül, GDPR/KVKK kurallarına uygun (çerez kullanmayan, IP loglamayan) 
 * şekilde öğrenci gelişim metriklerini ve uygulama hatalarını anonim olarak takip eder.
 */

interface LearningOutcome {
    moduleId: string;
    gameType: string;
    isCorrect: boolean;
    durationMs: number;
    attempts: number;
  }
  
  interface SystemEvent {
    eventName: string;
    properties?: Record<string, string | number | boolean>;
  }
  
  export const Analytics = {
    /**
     * Otizmli çocuğun modül bazındaki başarısını ölçer.
     * Tamamen anonimdir (user_id loglanmaz, sadece session-based istatistik tutulabilir).
     */
    trackLearningOutcome: (data: LearningOutcome) => {
      if (typeof window === 'undefined') return;
      
      const payload = {
        ...data,
        timestamp: new Date().toISOString(),
        // Benzersiz olmayan ama oturumu temsil eden anonim bir ID eklenebilir.
        sessionId: 'anonymous_session' 
      };
      
      // Geliştirme ortamında konsola yazdır
      if (process.env.NODE_ENV === 'development') {
        console.log('[Analytics - Learning Outcome]', payload);
      }
      
      // Production'da: 
      // fetch('/api/analytics/learning', { method: 'POST', body: JSON.stringify(payload) })
    },
  
    /**
     * Uygulama içi genel etkileşimleri ve sağlık durumunu izler. (Örn: "game_started", "audio_failed")
     */
    trackEvent: (event: SystemEvent) => {
      if (typeof window === 'undefined') return;
  
      const payload = {
        ...event,
        timestamp: new Date().toISOString(),
      };
  
      if (process.env.NODE_ENV === 'development') {
        console.log('[Analytics - System Event]', payload);
      }
  
      // Production'da:
      // fetch('/api/analytics/events', { method: 'POST', body: JSON.stringify(payload) })
    }
  };
  
