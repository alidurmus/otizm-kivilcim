# **Kıvılcım Gelişim Platformu v1.0.0-MVP (Next.js)**

# **Otizmli Çocuklar için Bütünsel Gelişim Platformu**

# **Son Güncelleme: 4 Temmuz 2025**

default\_language: "tr"

# **\======================================================**

# **PROJE BİLGİLERİ**

# **\======================================================**

project:  
name: "Kıvılcım"  
version: "v1.0.0-MVP"  
status: "Geliştirme Aşamasında (MVP Fazı)"  
platform: "Next.js & React (PWA \- Progressive Web App)"  
database: "Firebase Firestore & Authentication"  
styling: "Tailwind CSS"  
design\_framework: "Kıvılcım Duyusal Dostu Tasarım Sistemi v1.0"

# **Mevcut Sistem Durumu (Modüler Yapı)**

modules:  
\- okuryazarlik: "🚀 Geliştiriliyor (MVP Odaklı)"  
\- anlam\_ve\_kelime: "📋 Planlandı"  
\- sosyal\_iletisim: "📋 Planlandı"  
\- yazma\_ve\_ifade: "📋 Planlandı"  
\- temel\_kavramlar: "📋 Planlandı"

# **\======================================================**

# **DİZİN ORGANİZASYON KURALLARI**

# **\======================================================**

directory\_rules:

* name: Next.js Proje Yapısı  
  match: "src/\*\*"  
  description: Kod tabanını yapılandırılmış ve ölçeklenebilir tut.  
  goals:  
  * Sayfalar (Routes) src/app/ altına (App Router).  
  * Tekrar kullanılabilir arayüz bileşenleri src/components/ui/ altına.  
  * Sayfa veya modüllere özel bileşenler src/components/specific/ altına.  
  * Global stiller ve Tailwind yapılandırması src/styles/ altına.  
  * Yardımcı fonksiyonlar ve hook'lar src/lib/ ve src/hooks/ altına.  
  * API rotaları src/app/api/ altına.  
  * Durum yönetimi (state management) kodları src/store/ altına.  
* name: Varlık (Asset) Organizasyonu  
  match: "public/\*\*"  
  description: Görsel ve statik varlıkları düzenle.  
  goals:  
  * Görseller public/images/ altına.  
  * Fontlar public/fonts/ altına.  
  * Diğer statik dosyalar (örn: robots.txt) public/ kök dizinine.

# **\======================================================**

# **KODLAMA VE GELİŞTİRME KURALLARI**

# **\======================================================**

rules:

* name: Genel Kod Kalitesi  
  description: Kod basit, modüler ve okunabilir olmalı.  
  goals:  
  * DRY (Don't Repeat Yourself) ilkesine uy.  
  * KISS (Keep It Simple, Stupid) ilkesine uy.  
  * Single Responsibility Principle (SRP) uygula; her bileşen ve hook tek bir iş yapsın.  
  * Değişken, fonksiyon ve bileşen adları açıklayıcı ve tutarlı olsun.  
* name: TypeScript & React Kodlama Kuralları  
  match: \[".ts", ".tsx"\]  
  description: Modern, güvenli ve performanslı React kodu yazma.  
  goals:  
  * **Her Yerde TypeScript:** Tüm proje strict modda TypeScript kullanmalıdır. any tipinden kaçınılmalıdır.  
  * **Fonksiyonel Bileşenler ve Hook'lar:** Sadece fonksiyonel bileşenler ve hook'lar kullanılmalıdır. Class-based component'ler kullanılmayacaktır.  
  * **Bileşen Yapısı:** Bileşenleri küçük ve tekrar kullanılabilir parçalara böl. Karmaşık bileşenler, alt bileşenlere ayrılmalıdır.  
  * **Props Tipi:** Tüm bileşenlerin props'ları için TypeScript interface veya type tanımlanmalıdır.  
  * **Durum Yönetimi:** Basit durumlar için useState, karmaşık durumlar için useReducer. Global durum yönetimi için **Zustand** veya **Context API** tercih edilmelidir.  
  * **ESLint ve Prettier:** Proje genelinde tutarlı bir kod stili için ESLint ve Prettier kuralları zorunludur.  
* name: Next.js Framework Kuralları  
  match: \[".ts", ".tsx"\]  
  description: Next.js en iyi pratikleri.  
  goals:  
  * **App Router:** Proje, Next.js App Router yapısını kullanmalıdır. pages/ dizini kullanılmayacaktır.  
  * **Server & Client Components:** Bileşenler, varsayılan olarak Server Component olmalıdır. Sadece interaktivite veya hook gerektiren bileşenler "use client" direktifi ile Client Component olarak işaretlenmelidir.  
  * **Veri Çekme (Data Fetching):** Sunucu tarafında veri çekmek için fetch API'si, istemci tarafında ise **SWR** veya **React Query** kullanılmalıdır.  
  * **API Rotaları (Route Handlers):** Backend işlemleri için src/app/api/ altındaki Route Handler'lar kullanılmalıdır.  
  * **Metadata:** Sayfa başlıkları ve SEO için metadata objesi veya generateMetadata fonksiyonu kullanılmalıdır.  
* name: Firebase Kullanım Kuralları  
  match: "src/lib/firebase/\*\*"  
  description: Firebase servisleri için en iyi pratikler.  
  goals:  
  * **Firebase JS SDK:** Firebase ile etkileşim için resmi JavaScript SDK'sı kullanılmalıdır.  
  * **Merkezi Servis:** Tüm Firestore okuma/yazma işlemleri merkezi bir src/lib/firebase/firestoreService.ts dosyası üzerinden yapılmalıdır.  
  * **Güvenlik:** İstemci tarafında sadece güvenli operasyonlar yapılmalı, hassas işlemler (örn: bir başkasının verisini silme) Firebase Functions ile tetiklenen backend fonksiyonları üzerinden gerçekleştirilmelidir.  
  * **Hata Yönetimi:** Tüm Firebase çağrıları try-catch blokları ile sarmalanmalı ve hatalar uygun şekilde yönetilmelidir.  
* name: "Kıvılcım" Platformuna Özgü Kurallar  
  match: "src/\*\*"  
  description: Platformun temel pedagojik ve yapısal ilkeleri.  
  goals:  
  * **Modülerlik:** Her gelişim alanı (Okuryazarlık vb.) src/components/modules/ altında kendi bileşen grubuna sahip olmalıdır.  
  * **Duyusal Ayarlar:** Tüm UI bileşenleri, global bir SensoryContext veya Zustand store'u üzerinden gelen ayarlara (renk, animasyon vb.) duyarlı olmalıdır.  
  * **Pedagojik İlkeler:** Bileşenler ve hook'lar, PRD'de tanımlanan pedagojik yaklaşımlara uygun şekilde tasarlanmalıdır.  
* name: Stil ve Tasarım Kuralları (Tailwind CSS)  
  match: \[".tsx", ".css"\]  
  description: "Kıvılcım \- Görsel Tasarım ve Arayüz Kılavuzu" belgesine dayalı kurallar.  
  goals:  
  * **Utility-First:** Arayüzler öncelikli olarak Tailwind CSS utility sınıfları kullanılarak oluşturulmalıdır.  
  * **tailwind.config.js:** Proje renk paleti, font aileleri ve özel temalar tailwind.config.js dosyasında merkezi olarak tanımlanmalıdır.  
  * **@apply Kullanımı:** @apply direktifi, sadece tekrar eden ve karmaşık bileşen stilleri için (örn: .btn-primary) src/styles/globals.css içinde dikkatli kullanılmalıdır.  
  * **Duyarlı Tasarım:** sm:, md:, lg: gibi duyarlılık ön ekleri aktif olarak kullanılmalıdır.  
  * **Karanlık Mod:** Proje, dark: ön eki ile karanlık mod desteğine baştan itibaren sahip olmalıdır.  
* name: Test Yazımı  
  description: Her işlevsellik testlerle doğrulanmalıdır.  
  goals:  
  * **Jest ve React Testing Library (RTL):** Testler için bu iki araç standart olarak kullanılacaktır.  
  * **Birim Testleri:** Yardımcı fonksiyonlar ve hook'lar için birim testleri yazılmalıdır.  
  * **Bileşen Testleri:** Her bileşen, RTL ile render edilerek temel işlevselliği, kullanıcı etkileşimleri ve erişilebilirliği test edilmelidir.  
  * **Kullanıcı Odaklı Test:** Testler, "Kullanıcı ne görüyor ve ne yapabiliyor?" sorusuna odaklanmalı, implementasyon detaylarına aşırı bağımlı olmamalıdır.  
  * **Mocking:** Harici API çağrıları ve servisler jest.mock() ile mock'lanmalıdır.  
* name: Yorumlama ve Dokümantasyon  
  description: Kod kendi kendini açıklamalı ama gerektiğinde yorum eklenmeli.  
  goals:  
  * Tüm props interfaceleri ve karmaşık fonksiyonlar için JSDoc/TSDoc formatında yorumlar eklenmelidir.  
  * Karmaşık algoritmalar veya iş mantığı için "neden" yapıldığını açıklayan yorumlar eklenmelidir.  
  * Projenin ana README.md dosyası güncel tutulmalıdır.  
* name: Güvenlik ve Veri Gizliliği (KVKK)  
  description: Kullanıcı verileri en üst düzeyde korunmalıdır.  
  goals:  
  * **Ortam Değişkenleri:** Tüm API anahtarları ve hassas bilgiler .env.local dosyası üzerinden NEXT\_PUBLIC\_ ön eki olmadan (sunucu tarafı için) veya ön ekli (istemci tarafı için) yönetilmelidir. Asla koda hardcode edilmemelidir.  
  * **Veri Doğrulama:** Kullanıcıdan gelen tüm girdiler hem istemci hem de sunucu tarafında doğrulanmalıdır.  
  * **Açık Rıza:** Veri toplama ve işleme konusunda kullanıcılardan (ebeveynlerden) açık ve anlaşılır bir onay alınmalıdır.