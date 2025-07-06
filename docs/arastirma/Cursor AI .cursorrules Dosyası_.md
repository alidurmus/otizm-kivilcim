

# **Zekayı Mimar Etmek: Modern Yazılım Geliştirme İçin Cursor AI Kurallarında Uzmanlaşmaya Yönelik Kapsamlı Bir Kılavuz**

## **Bölüm 1: Cursor Kurallarının Felsefesi ve Evrimi**

Bu temel bölüm, Cursor Kurallarının kavramsal çerçevesini oluşturacak ve onları yalnızca bir yapılandırma ayarı olarak değil, modern, yapay zeka destekli yazılım mimarisinin kritik bir bileşeni olarak konumlandıracaktır. Mevcut sistemin arkasındaki tasarım ilkelerini anlamak için evrimlerini takip edeceğiz.

### **1.1. Cursor Kurallarını Tanımlama: Talimatlardan İşbirliğine**

Cursor Kuralları, özünde, Cursor'ın kullandığı Büyük Dil Modellerine (LLM'ler) iletilen bir dizi talimat, bir "kural kitabı" veya "sistem istemi"dir.1 Amaçları, yapay zekayı projeye özgü kalıpları, en iyi uygulamaları ve kısıtlamaları anlaması için yönlendirmek ve böylece üretilen kodun proje standartlarıyla uyumlu olmasını sağlamaktır.1 Bu yaklaşım, geliştiricinin yapay zeka ile etkileşimini yalnızca konuşmaya dayalı ve geçici bir etkileşimden, kodlanmış ve kalıcı bir etkileşime dönüştürür. Bu, bir stajyer geliştiriciye her görev için ayrı ayrı talimatlar vermek ile onlara kapsamlı bir başlangıç belgesi ve stil kılavuzu vermek arasındaki farka benzer.

Yapay zeka destekli kodlama araçlarının ilk versiyonları, genellikle teknik olarak işlevsel ancak stilistik olarak tutarsız veya alışılmadık kodlar üretiyordu. Bu durum, geliştiriciler için önemli bir manuel düzeltme yükü yaratıyordu.2 "Teknik olarak doğru ama stilistik olarak hatalı" olarak tanımlanabilecek bu sorun, Cursor Kuralları gibi bir sistemin oluşturulmasının arkasındaki temel itici güçtü. Bu özellik, genel amaçlı bir LLM'nin çıktısı ile belirli bir projenin "kod lehçesi" arasındaki boşluğu doldurmak için mevcuttur. Sonuç olarak, iyi bir kural setinin birincil ölçütü, bu "gözden geçirme zahmetini" azaltma ve hem insan hem de yapay zeka tarafından katkıda bulunulan kod tabanında tutarlılığı artırma yeteneğidir.2

### **1.2. Evrimsel Yol: .cursorrules Dosyasından .cursor/rules/\*.mdc Dizisine**

Cursor, proje kök dizinindeki tek ve eski bir .cursorrules dosyasından, birden çok .mdc dosyası içeren modern bir .cursor/rules/ dizin sistemine geçiş yapmıştır.3 Eski dosya, geriye dönük uyumluluk için hala desteklenmektedir, ancak yeni sisteme geçiş şiddetle tavsiye edilmektedir.4 Bu, kritik bir ayrımdır, çünkü eski veya topluluk tarafından oluşturulmuş bilgilerin çoğu, kafa karışıklığına neden olabilecek eski dosyaya atıfta bulunabilir. Bu nedenle, anlayışımızı modern

.mdc sistemi üzerine inşa etmek zorunludur.

Tek bir dosya (.cursorrules) doğası gereği monolitiktir. Projeler büyüdükçe, özellikle de monorepolar (tek bir depoda birden çok projenin yönetildiği yapılar) söz konusu olduğunda, tek bir kural seti yetersiz ve yönetilemez hale gelir.1

.cursor/rules/ dizin yapısının tanıtılması, bu ölçeklenme sorununa doğrudan bir çözümdür. Bu yapı, **modülerliğe** (kuralları ilgili oldukları konulara göre ayırma), **birleştirilebilirliğe** (kuralları birbirine zincirleme) ve **tanecikliliğe** (kuralları belirli alt dizinlere veya dosya türlerine uygulama) olanak tanır. Bu evrim, yazılım mühendisliğindeki monolitik yapılandırmalardan "kod olarak" mimarilere (örneğin, Kod Olarak Altyapı) geçiş yönündeki daha geniş eğilimi yansıtmaktadır. Bu mimari değişim, Cursor Kurallarını yönetmenin artık basit bir yapılandırma görevi değil, bir yazılım tasarımı eylemi olduğu anlamına gelir. Kurallar, sürüm kontrollü, kod tabanının ayrılmaz bir parçası haline gelir ve yapay zekanın projeyle etkileşiminin "bilişsel mimarisini" tanımlar.

Aşağıdaki tablo, eski ve modern kural sistemleri arasındaki temel farkları özetleyerek geliştiricileri modern sisteme yönlendirmeyi ve eski sistemin neden kullanımdan kaldırıldığını anlamalarına yardımcı olmayı amaçlamaktadır.

**Tablo 1: Eski ve Modern Kural Sistemleri Karşılaştırması**

| Özellik | Eski Sistem (.cursorrules) | Modern Sistem (.cursor/rules/\*.mdc) | Tavsiye |
| :---- | :---- | :---- | :---- |
| **Konum** | Proje kök dizininde tek bir dosya 3 | Proje kökünde .cursor/rules/ dizini altında birden çok dosya 5 | Modern sistem, daha iyi organizasyon ve ölçeklenebilirlik sağlar. |
| **Biçim** | Genellikle JSON formatında yapılandırılmış metin 2 | YAML ön bilgisi (frontmatter) içeren Markdown (.mdc) dosyaları 8 | Markdown, hem insanlar hem de yapay zeka için daha okunabilir ve zengin içeriklidir. |
| **Taneciklilik** | Sınırlı; genellikle tüm projeye uygulanır. | Yüksek; glob desenleri ile belirli dosyalara veya dizinlere uygulanabilir 3 | Modern sistem, monorepolar ve karmaşık projeler için hassas kontrol sunar. |
| **Modülerlik** | Düşük; tüm kurallar tek bir dosyada toplanır. | Yüksek; kurallar konularına göre ayrı dosyalara bölünebilir ve birleştirilebilir 3 | Modülerlik, bakımı ve yeniden kullanılabilirliği artırır. |
| **Sürüm Kontrolü** | Evet, tek bir dosya olarak 2 | Evet, bir dizin ve içeriği olarak; değişiklikler daha şeffaftır 3 | Her iki sistem de sürüm kontrolünü destekler, ancak modern sistem daha şeffaftır. |
| **Topluluk Desteği** | Eski kaynaklarda ve topluluklarda hala bahsedilmektedir. | Aktif olarak geliştirilmekte ve yeni topluluk kaynakları tarafından benimsenmektedir 8 | Geleceğe yönelik projeler için modern sistemi kullanmak daha sürdürülebilirdir. |
| **Resmi Tavsiye** | Kullanımdan kaldırılıyor; geçiş yapılması önerilir 4 | Aktif olarak desteklenen ve tavsiye edilen sistem 4 | Resmi tavsiyeye uymak, en iyi uyumluluğu ve performansı sağlar. |

---

## **Bölüm 2: Modern Bir Cursor Kuralının Anatomisi (.mdc Dosyası)**

Bu bölüm, .mdc dosya formatının titiz, satır satır bir analizini sunacaktır. Bu yapıda uzmanlaşmak, etkili kurallar yazmak için vazgeçilmezdir.

### **2.1. Dosya Yapısı: Konum ve Adlandırma Kuralları**

Projeye özgü kurallar, proje kök dizinindeki .cursor/rules/ dizinine yerleştirilmelidir.3 Bu katı dizin yapısı, Cursor'ın projeye özgü kuralları keşfetme ve dizine ekleme yöntemidir; buna uymak bir ön koşuldur. Dosya adları

kebab-case (tire ile ayrılmış küçük harfler) kullanmalı ve .mdc uzantısına sahip olmalıdır.9 Bu adlandırma kuralı, özellikle çok sayıda kural içeren projelerde okunabilirliği ve bakımı artıran bir en iyi uygulamadır. Bazı topluluk üyeleri, sıralama ve kategorizasyon için sayısal bir önek sistemi (örneğin,

001-core-security.mdc) benimsemiştir, bu da büyük kural setlerini yönetmek için etkili bir strateji olabilir.11

### **2.2. Başlık: Meta Veri ve Kapsam Belirleme için YAML Ön Bilgisi**

Her .mdc dosyası, anahtar-değer meta verilerini içeren bir YAML ön bilgi bloğu (üç tire \--- ile belirtilir) ile başlar.6 Bu meta veriler makine tarafından okunabilir ve bir kuralın

*nasıl* ve *ne zaman* uygulanacağını kontrol eder. Bu, kuralın mantığı için bir kontrol düzlemidir.

**Ön Bilgi Anahtarlarının Ayrıntılı Dökümü:**

* description: Kuralın amacının kısa ve öz, insan tarafından okunabilir bir özetidir. Bu, Agent Requested (Ajan Tarafından Talep Edilen) kural türü için kritik öneme sahiptir, çünkü yapay zeka bu açıklamayı kuralı uygulayıp uygulamamaya karar vermek için kullanır.5  
* globs: Kuralı, eşleşen bir dosya bağlamda olduğunda otomatik olarak tetikleyen dosya yolu desenlerinin (örneğin, src/components/\*\*/\*.tsx, \*\*/\*.py) bir dizisidir.3 Bu, kuralları kod tabanının belirli bölümleriyle sınırlamak için birincil mekanizmadır.  
* alwaysApply (veya ruleType: always): Kuralın, bağlamdan bağımsız olarak her yapay zeka etkileşimine dahil edilmesini zorlayan bir boole bayrağıdır. Temel, çerçeve düzeyindeki talimatlar için idealdir.1  
* priority: Birden çok kural uygulandığında çakışmaları çözmeye yardımcı olmak için sayısal bir değerdir.8  
* dependencies: Bu kural tetiklendiğinde dahil edilecek diğer .mdc dosyalarının bir dizisidir ve birleştirilebilirliğe olanak tanır.8  
* tags, version: Organizasyon ve sürüm oluşturma için ek meta verilerdir.12

### **2.3. Gövde: İnsan Tarafından Okunabilir Talimatlar için Markdown**

Dosyanın gövdesi standart Markdown'dır ve geliştiricinin yapay zeka için gerçek talimatları sağladığı yerdir.1 Markdown kullanımı bilinçli bir seçimdir. Başlıklar, listeler ve kod blokları dahil olmak üzere zengin biçimlendirmeye izin vererek kuralları hem yapay zeka hem de onları sürdürmesi gereken insan geliştiriciler için okunabilir kılar. Bu ikili kitle, temel bir tasarım ilkesidir.

### **2.4. Kural Uygulama Mantığı: Cursor'ın Neyi Uygulayacağını Nasıl Seçtiği**

Cursor, tüm kuralları körü körüne uygulamaz. Belirli bir istem için hangi kuralların ilgili olduğunu belirlemek için sofistike bir hiyerarşi kullanır. Bu hiyerarşiyi anlamak, bir kuralın neden uygulandığını (veya uygulanmadığını) hata ayıklamak için çok önemlidir. Geliştiricinin, etkili ve öngörülebilir bir kural sistemi tasarlamak için bu tetikleyici hiyerarşisinin zihinsel bir modeline ihtiyacı vardır. Dokümantasyon ve topluluk tartışmalarına dayanarak, bu hiyerarşi net bir işlem sırasına sentezlenebilir.1

Aşağıdaki tablo, bir kuralın etkinleştirilebileceği farklı yolları açıklayan, kullanıcının kendi kullanım durumu için doğru mekanizmayı seçmesine yardımcı olan eyleme geçirilebilir bir referans sağlar. Always, Auto Attached, Agent Requested ve Manual arasındaki ayrım, kuralları etkili bir şekilde kullanmanın temelidir.

**Tablo 2: Kural Uygulama Tetikleyicileri**

| Kural Türü | Tetikleme Mekanizması | YAML Yapılandırması | İdeal Kullanım Durumu |
| :---- | :---- | :---- | :---- |
| **Manuel** | Sohbette @kuralAdi ile açıkça çağrılır.6 | Yok (ön bilgi gerektirmez). | Tek seferlik bir yeniden düzenleme modelini uygulamak. |
| **Otomatik Eklenen (Globs)** | Bağlamdaki bir dosya, globs deseniyle eşleşir.5 | globs: \["src/\*\*/\*.tsx"\] | Tüm .tsx dosyalarında React desenlerini zorunlu kılmak. |
| **Ajan Tarafından Talep Edilen** | Yapay zeka, description alanına ve istemin amacına göre kuralı akıllıca seçer.1 | description: "Veritabanı geçişleri için kurallar" | Yalnızca veritabanı değişiklikleri sorulduğunda devreye giren bir kural. |
| **Her Zaman** | Kural her zaman bağlama dahil edilir.1 | alwaysApply: true veya ruleType: always | "Her zaman İngilizce yanıt ver ve TypeScript kullan" gibi genel bir kural. |

---

## **Bölüm 3: Etkili Kurallar Oluşturmak İçin Pratik Bir Kılavuz**

Bu bölüm, sözdiziminden, yüksek kaliteli ve tutarlı sonuçlar üreten kurallar yazma sanatına ve bilimine geçen temel bir talimat kılavuzudur.

### **3.1. İlke 1: Bir Persona ve Üst Düzey Bir Genel Bakış ile Başlayın**

Etkili kurallar genellikle, yapay zeka için bir "persona" belirleyen üst düzey bir açıklama ile başlar. Örneğin, "Siz Python, Django ve ölçeklenebilir web uygulamaları geliştirme konusunda bir uzmansınız" gibi bir ifade kullanılabilir.1 Bu, ayrıntılara girmeden önce temel bağlamı sağlar. İleri düzey istem mühendisliğinden ödünç alınan bu teknik, tüm etkileşimi çerçeveler. LLM'yi, eğitim verilerinin en ilgili bölümlerine erişmeye ve belirli bir düşünce modunu benimsemeye teşvik eder, bu da daha doğru ve stilistik olarak uygun çıktılarla sonuçlanır.

### **3.2. İlke 2: Olumlu ve Olumsuz Örneklerin Gücü**

En güçlü kurallar, hem istenen kalıpların (✅ İYİ) hem de yapay zekanın kaçınması gereken, kullanımdan kaldırılmış veya yanlış kalıpların (❌ KÖTÜ) somut kod örneklerini sunar.1 Bu, sadece istenen kalıbı tanımlamaktan çok daha etkilidir. Yapay zekaya

*ne yapmaması gerektiğini* göstermek, çıktısını sınırlamanın ve eğitim verilerindeki yaygın ancak istenmeyen kalıplara geri dönmesini önlemenin güçlü bir yoludur. Örneğin, ona açıkça @supabase/auth-helpers-nextjs kullanmamasını ve her zaman @supabase/ssr kullanmasını, eşlik eden kod parçacıklarıyla birlikte belirtmek, belirsizliği ortadan kaldırır.13

### **3.3. İlke 3: Açık ve Kararlı Olun**

Başarılı topluluk kuralları genellikle "HER ZAMAN... ZORUNDASINIZ", "ASLA üretme...", "Eğer görürsen DUR ve DÜZELT..." gibi güçlü, doğrudan ve hatta buyurgan bir dil kullanır.13 Bu, insan iletişiminde aşırı agresif görünebilse de, LLM'lere talimat verirken etkilidir. Bu doğrudanlık, belirsizliği azaltır ve talimatın pazarlık edilemez doğasını pekiştirir.

### **3.4. İlke 4: Doğrulama Adımlarını Dahil Edin**

Gelişmiş kurallar, yapay zekanın görevini tamamlamadan önce gerçekleştirmesi gereken son bir kontrol listesi veya bir dizi doğrulama adımı içerir. Bu, bir "kendi kendini düzeltme" döngüsünü zorlar.1 Bu, kaliteyi programatik olarak zorlamanın bir yoludur. Yapay zekaya "yanıtınızı burada gösterilen kalıplara göre doğrulayın" talimatını vererek, kendi çalışmasını yerleşik kurallara göre iki kez kontrol etmesini sağlarsınız, böylece kod geliştiriciye sunulmadan önce hatalar yakalanır.

### **3.5. İlke 5: @ Sembolleri ile Harici Bağlamı Entegre Edin**

Kurallar izole değildir. Zengin ve dinamik bir bağlam sağlamak için diğer proje dosyalarına (@file), klasörlere (@folder) ve hatta belgelere (@Docs) başvurabilir ve başvurmalıdırlar.3 Bu, oyunun kurallarını değiştiren bir özelliktir. Bir kural, bir

service-template.ts dosyasına 22 veya bir çekirdek

types.ts dosyasına başvurabilir, bu da yapay zekanın çıktısının mevcut proje yapıları ve türleriyle tutarlı olmasını sağlar. @Docs özelliği, yapay zekanın bilgisini bir kütüphanenin *güncel* sürümünün belgelerine dayandırmanıza olanak tanır ve LLM'lerin güncel olmayan bilgilere sahip olduğu "bilgi kesintisi" sorununu azaltır.20

@ sembolü, statik bir kural dosyasını dinamik bir bağlam düzenleyiciye dönüştürür. Yeni bir React bileşeni oluşturmak için bir kural, components klasöründeki bir glob tarafından tetiklenebilir ve bu kural içinde, yapay zeka için bağlam olarak @components/BaseComponent.tsx ve @lib/styling-guide.md dosyalarını otomatik olarak çekebilir. Bu, geliştiricilerin belirli bir görev için mükemmel "istem bağlamını" otomatik olarak bir araya getiren kurallar tasarlayabileceği anlamına gelir ve her istek için yapay zekaya manuel olarak bilgi besleme çabasını önemli ölçüde azaltır.

---

## **Bölüm 4: Mimari Planlar: Bir Projenin Kural Setini Yapılandırma**

Bu bölüm, tartışmayı tekil kurallar yazmaktan, tüm bir proje veya organizasyon için bütünsel, sürdürülebilir ve ölçeklenebilir bir kural mimarisi tasarlamaya yükseltir.

### **4.1. Taneciklilik ve Birleştirilebilirlik Savunusu**

En iyi uygulamalar, tek ve devasa bir kural dosyasına karşı şiddetle tavsiyede bulunur. Bunun yerine, geliştiriciler birleştirilebilen çok sayıda, daha küçük ve odaklanmış kurallar oluşturmalıdır.3 Bu, yazılım tasarımındaki Tek Sorumluluk İlkesi'ni takip eder.

test için bir kural, stil için bir kuraldan ayrı olmalıdır. Bu, kuralları anlamayı, sürdürmeyi ve hata ayıklamayı kolaylaştırır.

### **4.2. Kural Organizasyonuna Katmanlı Bir Yaklaşım**

Topluluk depolarındaki en iyi uygulamaları sentezleyerek 8, net bir mimari desen ortaya çıkmaktadır. Bu deseni, herhangi bir proje için sağlam bir başlangıç noktası sağlayan, önerilen, katmanlı bir yapıya resmileştirebiliriz. Somut bir mimari plan sunmak, soyut ilkeleri listelemekten daha değerlidir. Kullanıcıya

.cursor/rules/ dizinini organize etmek için anında, eyleme geçirilebilir bir plan sunar.

Aşağıdaki tablo, bir projenin kural dosyalarını organize etmek için net, yapılandırılmış ve ölçeklenebilir bir şablon sağlar. Bir proje büyüdükçe, tutarlı bir organizasyon ve adlandırma şemasına sahip olmak, sürdürülebilirlik için çok önemlidir. Bu tablo, topluluk en iyi uygulamalarını resmi bir öneriye dönüştürerek organizasyonel kaosu önler.

**Tablo 3: Önerilen Kural Mimarisi ve Adlandırma Şeması**

| Önek/Kategori | Açıklama | Örnek Dosya Adları | Tipik glob / Tetikleyici |
| :---- | :---- | :---- | :---- |
| **0xx-Core** | Proje genelindeki temel kurallar (güvenlik, günlük kaydı, commit mesajları). | 001-security.mdc, 010-git-commits.mdc | Always veya geniş kapsamlı globs. |
| **1xx-Language** | Belirli bir programlama diline özgü kurallar (Python stili, TypeScript katılığı). | 101-python-pep8.mdc, 110-typescript-strict.mdc | globs: \["\*\*/\*.py"\] |
| **2xx-Framework** | Belirli çerçeveler için kurallar (React, Django, Spring). | 201-react-patterns.mdc, 210-django-models.mdc | İlgili dosya türleri için globs. |
| **3xx-Domain** | Belirli iş mantığı veya dizinler için kurallar (API işleme, UI bileşenleri). | 301-api-routes.mdc, 310-ui-components.mdc | Belirli dizinler için globs. |
| **9xx-Workflow** | Çok adımlı süreçleri veya ajansal görevleri tanımlayan kurallar. | 901-new-feature-scaffold.mdc | Manual (@new-feature-scaffold). |

### **4.3. Bir Takımda Kuralları Yönetme: Sürüm Kontrolü ve İşbirliği**

.cursor/rules dizini, projenin sürüm kontrol deposuna kaydedilmelidir.2 Bu kritik bir uygulamadır. Takımdaki her geliştiricinin ve herhangi bir CI/CD otomasyonunun yapay zeka için tam olarak aynı talimat setini kullanmasını sağlar. Bu, tutarlılığı garanti eder ve kuralları paylaşılan, gelişen bir varlık haline getirir. "Yapay zekanın beynindeki" değişiklikler, tıpkı diğer kod değişiklikleri gibi, çekme isteklerinde (pull request) gözden geçirilebilir ve tartışılabilir.

---

## **Bölüm 5: Uygulama Vitrini: Popüler Teknolojiler için Kural Setleri**

Bu bölüm, yaygın teknoloji yığınları için kapsamlı, iyi belgelenmiş ve uyarlanabilir kural örnekleri sunarak kullanıcıya en doğrudan ve pratik değeri sağlayacaktır. Her örnek, araştırmada bulunan en iyi uygulamaların bir sentezi olacaktır.

### **5.1. JavaScript/TypeScript Ekosistemi (React & Next.js)**

Bu ekosistem için kurallar, modern web geliştirmenin temel taşlarını ele almalıdır: bileşen mimarisi, durum yönetimi, stil ve tür güvenliği. Sentezlenen kaynaklar, fonksiyonel bileşenlerin, kancaların (hooks), TypeScript'in ve Tailwind CSS gibi yardımcı program öncelikli stil çerçevelerinin kullanımına yönelik güçlü bir tercihi göstermektedir.25

**Örnek Kural: 201-react-patterns.mdc**

YAML

\---  
description: "React bileşenleri için en iyi uygulamalar, fonksiyonel desenleri ve TypeScript türlerini zorunlu kılar."  
globs:  
  \- "src/components/\*\*/\*.{ts,tsx}"  
  \- "app/components/\*\*/\*.{ts,tsx}"  
\---  
\# React Bileşenleri için Geliştirme Kuralları

\#\# 1\. Genel Felsefe ve Persona  
Sen, modern, fonksiyonel desenler ve tam tür güvenliği konusunda uzmanlaşmış kıdemli bir React geliştiricisisin. Ürettiğin kod, okunabilir, sürdürülebilir ve performanslı olmalıdır.

\#\# 2\. Temel Kurallar  
\- \*\*Fonksiyonel Bileşenler:\*\* HER ZAMAN fonksiyonel bileşenleri ve kancaları (hooks) kullan.  
\- \*\*Adlandırılmış Dışa Aktarımlar (Named Exports):\*\* Bileşenler için HER ZAMAN adlandırılmış dışa aktarımları tercih et. Bu, kod tabanında yeniden adlandırmayı ve aramayı kolaylaştırır.  
\- \*\*TypeScript:\*\* TÜM bileşenler ve yardımcı fonksiyonlar için TypeScript kullan. Prop (özellik) türlerini \`interface\` kullanarak açıkça tanımla.  
\- \*\*Sorumlulukların Ayrılması:\*\* Mantığı (kancalar, durum yönetimi) sunumdan (JSX) ayrı tut. Karmaşık bileşenleri daha küçük, yeniden kullanılabilir parçalara ayır.  
\- \*\*Stil:\*\* Stil için HER ZAMAN Tailwind CSS kullan. Satır içi stillerden (\`style={{}}\`) veya ayrı CSS dosyalarından kaçın.

\#\# 3\. ❌ Kaçınılması Gereken Desenler (Anti-Patterns)  
\- \*\*ASLA Sınıf Bileşenleri Kullanma:\*\* Sınıf bileşenleri (\`class MyComponent extends React.Component\`) eski kabul edilir.  
\- \*\*ASLA \`any\` Türünü Kullanma:\*\* Prop'lar veya durum için \`any\` türünü kullanmak, TypeScript'in amacını boşa çıkarır. Gerekirse \`unknown\` kullan ve tür koruyucuları (type guards) ile daralt.  
\- \*\*ASLA Varsayılan Dışa Aktarımlar (Default Exports) Kullanma:\*\* Bileşenler için \`export default MyComponent;\` kullanmaktan kaçın.

\#\# 4\. ✅ Kod Örnekleri (İstenen Desen)

\#\#\# İyi Bir Bileşen Örneği  
Bu örnek, istenen tüm desenleri göstermektedir: adlandırılmış dışa aktarım, TypeScript arayüzü, fonksiyonel bileşen ve Tailwind CSS.

\`\`\`typescript  
// src/components/ui/Button.tsx

import type { ReactNode } from 'react';

// Prop türleri için açık bir arayüz tanımla  
interface ButtonProps {  
  children: ReactNode;  
  onClick: () \=\> void;  
  variant?: 'primary' | 'secondary';  
}

// Adlandırılmış dışa aktarım ile fonksiyonel bir bileşen oluştur  
export function Button({ children, onClick, variant \= 'primary' }: ButtonProps) {  
  const baseClasses \= 'px-4 py-2 font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2';  
    
  const variantClasses \= {  
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',  
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',  
  };

  return (  
    \<button  
      type="button"  
      onClick={onClick}  
      className={\`${baseClasses} ${variantClasses\[variant\]}\`}  
    \>  
      {children}  
    \</button\>  
  );  
}

## **5\. Bağlam ve Bağımlılıklar**

* Projedeki tüm paylaşılan türler için @/lib/types.ts dosyasına başvur.  
* Stil tutarlılığı için @/styles/tailwind.config.js dosyasındaki tema yapılandırmasını dikkate al.

\#\#\# 5.2. Python Ekosistemi (Django)

Django kuralları, çerçevenin "Convention Over Configuration" (Yapılandırma Yerine Gelenek) felsefesini ve MVT (Model-View-Template) mimarisini yansıtmalıdır. Araştırma, ORM'nin verimli kullanımı, hizmet katmanlarının ayrılması ve Django'nun yerleşik özelliklerinden yararlanma üzerine odaklanmaktadır.\[16, 28, 29, 30\]

\*\*Örnek Kural: \`210-django-models.mdc\`\*\*

\`\`\`yaml  
\---  
description: "Django modellerini oluşturma ve değiştirme kuralları, ORM optimizasyonuna odaklanır."  
globs:  
  \- "\*\*/models.py"  
\---  
\# Django Modelleri için En İyi Uygulamalar

\#\# 1\. Genel Felsefe ve Persona  
Sen, Django ORM'si ve veritabanı performansı konusunda derin bir anlayışa sahip, deneyimli bir Django geliştiricisisin. "Şişman modeller, zayıf görünümler" (fat models, thin views) ilkesine sıkı sıkıya bağlısın.

\#\# 2\. Temel Kurallar  
\- \*\*Model Mantığı:\*\* İş mantığının büyük bir kısmı modelin içinde veya model yöneticilerinde (managers) yer almalıdır. Görünümler (views) yalnızca istek/yanıt döngüsünü yönetmelidir.  
\- \*\*\`\_\_str\_\_\` Metodu:\*\* HER modelin, yönetici arayüzünde ve hata ayıklamada anlamlı bir temsil sağlayan bir \`\_\_str\_\_\` metodu OLMALIDIR.  
\- \*\*Veritabanı Sorguları:\*\* N+1 sorgu problemlerini önlemek için sorgularda HER ZAMAN \`select\_related\` (tek-çok ilişkiler için) ve \`prefetch\_related\` (çok-tek ve çok-çok ilişkiler için) kullan.  
\- \*\*Özel Yöneticiler:\*\* Sık kullanılan veya karmaşık sorgular için özel model yöneticileri (\`models.Manager\`) oluştur. Örneğin, \`Post.objects.published()\` gibi.  
\- \*\*Alan Türleri:\*\* Veri türleri için en uygun alan türlerini kullan (örneğin, telefon numaraları için \`CharField\` yerine özel bir alan).

\#\# 3\. ❌ Kaçınılması Gereken Desenler (Anti-Patterns)  
\- \*\*ASLA Görünümlerde Ham SQL Sorguları Kullanma:\*\* Bu, güvenlik açıklarına yol açar ve taşınabilirliği azaltır. ORM'yi kullan.  
\- \*\*ASLA Bir Döngü İçinde Veritabanına Erişme:\*\* Bir döngü içinde ilişkili nesnelere erişmek, N+1 sorunlarının en yaygın nedenidir. \`prefetch\_related\` ile bunu önle.

\#\# 4\. ✅ Kod Örnekleri (İstenen Desen)

\#\#\# İyi Bir Model ve Yönetici Örneği

\`\`\`python  
\# blog/models.py

from django.db import models  
from django.utils import timezone  
from django.contrib.auth.models import User

class PublishedManager(models.Manager):  
    def get\_queryset(self):  
        return super().get\_queryset().filter(status='published')

class Post(models.Model):  
    STATUS\_CHOICES \= (  
        ('draft', 'Taslak'),  
        ('published', 'Yayınlandı'),  
    )  
    title \= models.CharField(max\_length=250)  
    author \= models.ForeignKey(User, on\_delete=models.CASCADE, related\_name='blog\_posts')  
    body \= models.TextField()  
    publish \= models.DateTimeField(default=timezone.now)  
    created \= models.DateTimeField(auto\_now\_add=True)  
    updated \= models.DateTimeField(auto\_now=True)  
    status \= models.CharField(max\_length=10, choices=STATUS\_CHOICES, default='draft')

    objects \= models.Manager()  \# Varsayılan yönetici  
    published \= PublishedManager()  \# Özel yöneticimiz

    class Meta:  
        ordering \= ('-publish',)

    def \_\_str\_\_(self):  
        return self.title

### **Kötü Sorgu Deseni (Kaçınılması Gereken)**

Python

\# ❌ KÖTÜ: Bu, her gönderi için ayrı bir yazar sorgusu çalıştırır (N+1 sorunu)  
posts \= Post.published.all()  
for post in posts:  
    print(post.author.username) \# Her döngüde veritabanına erişim

\# ✅ İYİ: Yazar verilerini tek bir sorguyla önceden getirir  
posts \= Post.published.select\_related('author').all()  
for post in posts:  
    print(post.author.username) \# Veritabanına ek erişim yok

## **5\. Bağlam ve Bağımlılıklar**

* Eğer projede özel bir temel model varsa (örneğin, created\_at ve updated\_at alanları ekleyen), ona başvur. Örneğin: @apps/utils/models.py.31

\#\#\# 5.3. Java Ekosistemi (Spring Boot)

Java ve Spring Boot için kurallar, güçlü tipleme, bağımlılık enjeksiyonu (dependency injection) ve katmanlı mimari gibi dilin ve çerçevenin temel ilkelerini vurgulamalıdır. Araştırma, yapıcı enjeksiyonu (constructor injection), DTO'ların (Data Transfer Objects) kullanımı ve merkezi hata yönetimi gibi en iyi uygulamalara odaklanmaktadır.\[17, 32\]

\*\*Örnek Kural: \`220-spring-rest-controller.mdc\`\*\*

\`\`\`yaml  
\---  
description: "Spring Boot REST denetleyicileri oluşturmak için yönergeler, güvenlik ve en iyi uygulamalara odaklanır."  
globs:  
  \- "\*\*/\*Controller.java"  
\---  
\# Spring Boot REST Denetleyicileri için Kurallar

\#\# 1\. Genel Felsefe ve Persona  
Sen, Spring Boot ile güvenli, verimli ve test edilebilir REST API'leri oluşturma konusunda uzmanlaşmış kıdemli bir Java geliştiricisisin. Kodun temiz, iyi yapılandırılmış ve SOLID ilkelerine uygun olmalıdır.

\#\# 2\. Temel Kurallar  
\- \*\*Yapıcı Enjeksiyonu (Constructor Injection):\*\* Bağımlılıklar için HER ZAMAN yapıcı enjeksiyonunu kullan. Bu, değişmezliği (immutability) sağlar ve test edilebilirliği artırır.  
\- \*\*DTO Kullanımı:\*\* İstek ve yanıt gövdeleri için HER ZAMAN DTO (Veri Aktarım Nesneleri) kullan. JPA varlıklarını (\`@Entity\`) doğrudan API katmanında AÇIĞA ÇIKARMA. Bu, API sözleşmesini veritabanı şemasından ayırır.  
\- \*\*HTTP Metotları:\*\* RESTful ilkelerine uygun olarak HTTP metotlarını (\`@GetMapping\`, \`@PostMapping\`, \`@PutMapping\`, \`@DeleteMapping\`) doğru şekilde eşle.  
\- \*\*Merkezi Hata Yönetimi:\*\* Uygulama genelindeki istisnaları (exceptions) işlemek için \`@ControllerAdvice\` ve \`@ExceptionHandler\` ile merkezi bir hata yönetimi mekanizması uygula.  
\- \*\*Yanıt Durumları:\*\* Standart HTTP durum kodlarını (200, 201, 204, 400, 404, 500\) uygun şekilde döndür.

\#\# 3\. ❌ Kaçınılması Gereken Desenler (Anti-Patterns)  
\- \*\*ASLA Alan Enjeksiyonu Kullanma:\*\* Bir alan üzerinde \`@Autowired\` kullanmak kötü bir uygulamadır, çünkü test etmeyi zorlaştırır ve gizli bağımlılıklara yol açabilir.  
\- \*\*ASLA JPA Varlıklarını Döndürme:\*\* Bir denetleyici metodundan doğrudan bir JPA varlığı döndürmek, istenmeyen alanları açığa çıkarabilir ve döngüsel bağımlılıklara neden olabilir.

\#\# 4\. ✅ Kod Örnekleri (İstenen Desen)

\#\#\# İyi Bir Denetleyici Örneği

\`\`\`java  
// com/example/project/user/UserController.java

import org.springframework.http.HttpStatus;  
import org.springframework.http.ResponseEntity;  
import org.springframework.web.bind.annotation.\*;

import java.util.List;

@RestController  
@RequestMapping("/api/v1/users")  
public class UserController {

    private final UserService userService;

    // ✅ İYİ: Yapıcı enjeksiyonu kullanılıyor  
    public UserController(UserService userService) {  
        this.userService \= userService;  
    }

    @GetMapping("/{id}")  
    public ResponseEntity\<UserDto\> getUserById(@PathVariable Long id) {  
        UserDto user \= userService.findUserById(id);  
        return ResponseEntity.ok(user);  
    }

    @PostMapping  
    public ResponseEntity\<UserDto\> createUser(@RequestBody CreateUserDto createUserDto) {  
        UserDto newUser \= userService.createUser(createUserDto);  
        // Oluşturulan kaynağın URI'sini döndürmek iyi bir uygulamadır  
        return new ResponseEntity\<\>(newUser, HttpStatus.CREATED);  
    }  
}

### **Kötü Desen Örneği (Kaçınılması Gereken)**

Java

// ❌ KÖTÜ: Alan enjeksiyonu ve JPA varlığının döndürülmesi  
@RestController  
public class BadController {

    @Autowired // Kötü uygulama  
    private UserRepository userRepository;

    @GetMapping("/users/{id}")  
    public User getUser(@PathVariable Long id) { // Kötü uygulama: JPA varlığını döndürüyor  
        return userRepository.findById(id).orElse(null);  
    }  
}

## **5\. Bağlam ve Bağımlılıklar**

* Projenin genel @ControllerAdvice sınıfına başvur. Örneğin: @com/example/project/exception/ApiExceptionHandler.java.  
* DTO'ların tanımlandığı paketi dikkate al. Örneğin: @com/example/project/user/dto/\*\*.

\---

\#\# Bölüm 6: İleri Teknikler ve Stratejik Değerlendirmeler

Bu son bölüm, temelleri öğrenmiş ve Cursor Kuralları sisteminin tüm gücünden yararlanmak isteyen kullanıcılar için konuları ele alacaktır.

\#\#\# 6.1. Topluluktan Yararlanma: Mevcut Kuralları Bulma ve Uyarlama

GitHub (\`awesome-cursorrules\`) ve \`cursor.directory\` ile \`dotcursorrules.com\` gibi özel sitelerde giderek büyüyen bir paylaşılan kural ekosistemi bulunmaktadır.\[8, 10, 16, 27\] Bu, büyük bir verimlilik artışıdır. Geliştiriciler sıfırdan başlamamalıdır. Bu bölüm, kullanıcıyı bu kaynakları nasıl bulacağı, bir topluluk kural setinin kalitesini nasıl değerlendireceği ve en önemlisi, bunları kendi projelerinin özel nüanslarına uyacak şekilde nasıl çatallayacağı (fork) ve özelleştireceği konusunda yönlendirecektir.

\#\#\# 6.2. Kurallarınızı Hata Ayıklama ve Sorun Giderme

Forum tartışmalarında vurgulanan yaygın bir hayal kırıklığı noktası, bir kuralın beklendiği gibi uygulanmamasıdır.\[12, 33, 34\] Bu genellikle uygulama hiyerarşisinin yanlış anlaşılması, sözdizimi hataları veya önbellekleme sorunlarından kaynaklanır. Özel bir sorun giderme kılavuzu, kullanıcı başarısı için çok önemlidir.

\*\*Sorun Giderme Kontrol Listesi:\*\*

1\.  \*\*Dosya Konumunu ve Adlandırmayı Doğrulayın:\*\* Dosyanın \`.cursor/rules/benim-kuralim.mdc\` gibi doğru bir yolda ve adlandırma kuralına uygun olduğundan emin olun.  
2\.  \*\*YAML Ön Bilgi Sözdizimini Kontrol Edin:\*\* \`glob\` deseni doğru mu? \`alwaysApply\` uygun şekilde ayarlanmış mı? YAML girintilemesi geçerli mi?  
3\.  \*\*Yeni Bir Sohbet Başlatın:\*\* Bağlam kirliliğini önlemek için yeni bir sohbet penceresi açın.\[34\]  
4\.  \*\*Basit Bir İstemle Test Edin:\*\* Kuralı izole etmek için çok basit ve doğrudan bir istemle test edin.  
5\.  \*\*Yapay Zekaya Doğrudan Sorun:\*\* "Şu anda hangi kuralları uyguluyorsun?" gibi bir soruyla yapay zekanın bağlamını kontrol edin.  
6\.  \*\*.mdc Dosyalarını Kaydetme Sorunları Gibi Bilinen Editör Hatalarından ve Çözümlerinden Haberdar Olun:\*\* Bazen editörle ilgili geçici sorunlar olabilir. Cursor'ı yeniden başlatmak bu tür sorunları çözebilir.\[11, 34\]

\#\#\# 6.3. Potansiyel Tuzaklar ve Bunlardan Kaçınma Yolları

Kurallar güçlü olsa da, yapılandırma yükü, öğrenme eğrisi, kural çakışmaları ve yaratıcılığı engelleyebilecek aşırı optimizasyon gibi dezavantajları olabilir.\[2\]

\*   \*\*Aşırı Optimizasyon:\*\* Çok katı kurallar kodu esnek olmayan hale getirebilir. Amaç, standartları zorunlu kılmaktır, geliştirici yargısını ortadan kaldırmak değil.  
\*   \*\*Bakım Yükü:\*\* Karmaşık bir kural seti, proje geliştikçe sürdürülmesi gereken kod tabanının başka bir parçası haline gelir.\[1\]  
\*   \*\*Araca Bağımlılık (Tool Lock-in):\*\* Aşırı derecede spesifik Cursor kural özelliklerine yoğun bir şekilde güvenmek, kodu farklı bir düzenleyicide üzerinde çalışmayı zorlaştırabilir.\[2\]

\*\*Azaltma Stratejileri:\*\* Basit başlayın ve yineleyin. Kuralları odaklı tutun. Kural setini düzenli olarak gözden geçirin ve yeniden düzenleyin. Önce en büyük sıkıntı noktalarını çözen kurallara öncelik verin.

\---

\#\# Sonuç: Akıllı Yardımcı Pilotunuzu Mimar Etmek

Bu sonuç bölümü, raporun anahtar çıkarımlarını özetleyerek, Cursor Kurallarının güçlü bir mimari araç olduğu ana temasını pekiştirecektir. Kullanıcı için son, özlü bir yol haritası sunacaktır:

1\.  \*\*Çekirdekle Başlayın:\*\* Önce genel, proje çapındaki standartlarınızı tanımlayın.  
2\.  \*\*Topluluktan Yararlanın:\*\* Çerçeveniz için iyi bir başlangıç kural seti bulun.  
3\.  \*\*Özelleştirin ve Uyarlayın:\*\* Topluluk kurallarını projenizin özel ihtiyaçlarına uyacak şekilde değiştirin.  
4\.  \*\*Yineleyin:\*\* Tekrarlayan kalıplar veya tutarsızlıklar belirledikçe yeni, tanecikli kurallar ekleyin.  
5\.  \*\*İşbirliği Yapın:\*\* Kurallarınızı, tüm ekip tarafından sürümlendirilecek ve geliştirilecek canlı bir belge olarak kabul edin.

#### **Alıntılanan çalışmalar**

1. How to write great Cursor Rules \- Trigger.dev, erişim tarihi Temmuz 6, 2025, [https://trigger.dev/blog/cursor-rules](https://trigger.dev/blog/cursor-rules)  
2. The .cursorRules Playbook \- Greptile, erişim tarihi Temmuz 6, 2025, [https://www.greptile.com/blog/cursorrules](https://www.greptile.com/blog/cursorrules)  
3. What are Cursor Rules? — WorkOS, erişim tarihi Temmuz 6, 2025, [https://workos.com/blog/what-are-cursor-rules](https://workos.com/blog/what-are-cursor-rules)  
4. Rules for AI \- Cursor Documentation, erişim tarihi Temmuz 6, 2025, [https://cursor-docs.apidog.io/rules-for-ai-896238m0](https://cursor-docs.apidog.io/rules-for-ai-896238m0)  
5. Cursor Rules: Enhance Your Development Workflow with AI-Powered Coding | cursor101.com, erişim tarihi Temmuz 6, 2025, [https://cursor101.com/cursor/rules](https://cursor101.com/cursor/rules)  
6. Best practices when using Cursor the AI editor. \- GitHub, erişim tarihi Temmuz 6, 2025, [https://github.com/digitalchild/cursor-best-practices](https://github.com/digitalchild/cursor-best-practices)  
7. Optimizing Cursor AI with .cursorrules | by Andi Ashari \- Medium, erişim tarihi Temmuz 6, 2025, [https://medium.com/@aashari/optimizing-cursor-ai-with-cursorrules-3a1c95b4183f](https://medium.com/@aashari/optimizing-cursor-ai-with-cursorrules-3a1c95b4183f)  
8. A library of rules for the Cursor IDE, providing organized instructions for the Agent Composer LLM backend. \- GitHub, erişim tarihi Temmuz 6, 2025, [https://github.com/sparesparrow/cursor-rules](https://github.com/sparesparrow/cursor-rules)  
9. A Cursor rule to create new Cursor rules \- Playbooks, erişim tarihi Temmuz 6, 2025, [https://playbooks.com/rules/create-rules](https://playbooks.com/rules/create-rules)  
10. Created a collection of 879 .mdc Cursor Rules files for you all \- Showcase, erişim tarihi Temmuz 6, 2025, [https://forum.cursor.com/t/created-a-collection-of-879-mdc-cursor-rules-files-for-you-all/51634](https://forum.cursor.com/t/created-a-collection-of-879-mdc-cursor-rules-files-for-you-all/51634)  
11. My Best Practices for MDC rules and troubleshooting \- How To \- Cursor \- Community Forum, erişim tarihi Temmuz 6, 2025, [https://forum.cursor.com/t/my-best-practices-for-mdc-rules-and-troubleshooting/50526](https://forum.cursor.com/t/my-best-practices-for-mdc-rules-and-troubleshooting/50526)  
12. Optimal structure for .mdc rules files \- Discussion \- Cursor \- Community Forum, erişim tarihi Temmuz 6, 2025, [https://forum.cursor.com/t/optimal-structure-for-mdc-rules-files/52260](https://forum.cursor.com/t/optimal-structure-for-mdc-rules-files/52260)  
13. .CursorRules Rules \- Mastering AI-Assisted Coding: Unlock the Power of .cursorrules in Cursor IDE, erişim tarihi Temmuz 6, 2025, [https://dotcursorrules.com/](https://dotcursorrules.com/)  
14. Everything you need to know about Cursor Rules \- Instructa.ai, erişim tarihi Temmuz 6, 2025, [https://www.instructa.ai/blog/cursor-ai/everything-you-need-to-know-cursor-rules](https://www.instructa.ai/blog/cursor-ai/everything-you-need-to-know-cursor-rules)  
15. Cursor Rules \- CursorFast, erişim tarihi Temmuz 6, 2025, [https://cursorfast.com/cursor-rules](https://cursorfast.com/cursor-rules)  
16. Django Python Cursor Rules rule by Caio Barbieri \- Cursor Directory, erişim tarihi Temmuz 6, 2025, [https://cursor.directory/django-python-cursor-rules](https://cursor.directory/django-python-cursor-rules)  
17. Java Spring Cursor Rules rule by Wesley Archbell \- Cursor Directory, erişim tarihi Temmuz 6, 2025, [https://cursor.directory/java-spring-cursor-rules](https://cursor.directory/java-spring-cursor-rules)  
18. A Rule That Writes the Rules: Exploring rules.mdc | by Denis \- Medium, erişim tarihi Temmuz 6, 2025, [https://medium.com/@devlato/a-rule-that-writes-the-rules-exploring-rules-mdc-288dc6cf4092](https://medium.com/@devlato/a-rule-that-writes-the-rules-exploring-rules-mdc-288dc6cf4092)  
19. Boost Your Development Productivity with Cursor Rules: A Complete Guide, erişim tarihi Temmuz 6, 2025, [https://dev.to/blamsa0mine/boost-your-development-productivity-with-cursor-rules-a-complete-guide-3nhm](https://dev.to/blamsa0mine/boost-your-development-productivity-with-cursor-rules-a-complete-guide-3nhm)  
20. Adding your own documentation \- Cursor Docs, erişim tarihi Temmuz 6, 2025, [https://docs.cursor.com/context/@-symbols/@-docs](https://docs.cursor.com/context/@-symbols/@-docs)  
21. dazzaji/Cursor\_User\_Guide \- GitHub, erişim tarihi Temmuz 6, 2025, [https://github.com/dazzaji/Cursor\_User\_Guide](https://github.com/dazzaji/Cursor_User_Guide)  
22. Rules \- Cursor, erişim tarihi Temmuz 6, 2025, [https://docs.cursor.com/context/rules](https://docs.cursor.com/context/rules)  
23. Working with Documentation \- Cursor Docs, erişim tarihi Temmuz 6, 2025, [https://docs.cursor.com/guides/advanced/working-with-documentation](https://docs.cursor.com/guides/advanced/working-with-documentation)  
24. ivangrynenko/cursorrules: A set of cursor rules for Cursor AI IDE that support PHP, Python, JavaScript and Drupal-specific rules \- GitHub, erişim tarihi Temmuz 6, 2025, [https://github.com/ivangrynenko/cursorrules](https://github.com/ivangrynenko/cursorrules)  
25. awesome-cursorrules/rules/react-typescript-nextjs-nodejs-cursorrules-prompt-/.cursorrules at main · PatrickJS/awesome-cursorrules \- GitHub, erişim tarihi Temmuz 6, 2025, [https://github.com/PatrickJS/awesome-cursorrules/blob/main/rules/react-typescript-nextjs-nodejs-cursorrules-prompt-/.cursorrules](https://github.com/PatrickJS/awesome-cursorrules/blob/main/rules/react-typescript-nextjs-nodejs-cursorrules-prompt-/.cursorrules)  
26. The Perfect Cursor AI setup for React and Next.js \- Builder.io, erişim tarihi Temmuz 6, 2025, [https://www.builder.io/blog/cursor-ai-tips-react-nextjs](https://www.builder.io/blog/cursor-ai-tips-react-nextjs)  
27. Rules for React \- Cursor Directory, erişim tarihi Temmuz 6, 2025, [https://cursor.directory/rules/react](https://cursor.directory/rules/react)  
28. Python Django Best Practices .cursorrules prompt file \- GitHub, erişim tarihi Temmuz 6, 2025, [https://github.com/PatrickJS/awesome-cursorrules/blob/main/rules/python-django-best-practices-cursorrules-prompt-fi/README.md](https://github.com/PatrickJS/awesome-cursorrules/blob/main/rules/python-django-best-practices-cursorrules-prompt-fi/README.md)  
29. Django Cursor Rules for AI \- Playbooks, erişim tarihi Temmuz 6, 2025, [https://playbooks.com/rules/django](https://playbooks.com/rules/django)  
30. Rules for Django | Cursor Directory, erişim tarihi Temmuz 6, 2025, [https://cursor.directory/rules/django](https://cursor.directory/rules/django)  
31. AI Agent Rules \- Using Django, erişim tarihi Temmuz 6, 2025, [https://forum.djangoproject.com/t/ai-agent-rules/40929](https://forum.djangoproject.com/t/ai-agent-rules/40929)  
32. Rules for Java | Cursor Directory, erişim tarihi Temmuz 6, 2025, [https://cursor.directory/rules/java](https://cursor.directory/rules/java)  
33. Documentation (.cursorrules) \- Feature Requests \- Cursor \- Community Forum, erişim tarihi Temmuz 6, 2025, [https://forum.cursor.com/t/documentation-cursorrules/44865](https://forum.cursor.com/t/documentation-cursorrules/44865)  
34. How to best use .mdc rules? \- Discussions \- Cursor \- Community Forum, erişim tarihi Temmuz 6, 2025, [https://forum.cursor.com/t/how-to-best-use-mdc-rules/96880](https://forum.cursor.com/t/how-to-best-use-mdc-rules/96880)