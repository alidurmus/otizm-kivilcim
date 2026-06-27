# 📚 Kıvılcım: Otizm Dostu Eğitim Platformu - Dokümantasyon Merkezi

Kıvılcım projesi, özel eğitime ihtiyaç duyan otizmli çocuklar için tasarlanmış, pedagojik olarak güvenli, duyusal uyaranları yönetilmiş bir web uygulamasıdır. (Next.js, TailwindCSS, TypeScript, Playwright).

Bu klasör, projenin tüm mimari, tasarım ve süreç yönetim evraklarını barındırır. Yeni geliştiriciler ve **Yapay Zeka (AI)** asistanları, proje kurallarını kavramak için öncelikle bu belgelere göz atmalıdır.

## 🔗 Temel Dokümanlar
Aşağıdaki belgeler projenin yaşam döngüsünü yönetir:

- **[Görev Listesi (todo.md)](./todo.md):** Projenin canlı backlog'u. Tüm tamamlanan (Faz 1 - Faz 6) ve bekleyen görevler buradadır. AI kodlayıcılar işe buradan başlamalıdır.
- **[Onarım ve Gelişim Raporu (project-walkthrough.md)](./project-walkthrough.md):** Faz 1'den Faz 6'ya kadar uygulamanın geçirdiği mimari onarımların ve "Otizm Dostu" (ASD-friendly) standartlara nasıl ulaştığının teknik raporudur. Best-practice arşividir.
- **[Ürün İsterleri (prd.md)](./prd.md):** Kıvılcım platformunun kapsamlı ürün gereksinim dokümanı.
- **[Veritabanı Şeması (veritabani.md)](./veritabani.md):** Firebase altyapısı veya Prisma tabloları üzerine referanslar.

## 🤖 Yapay Zeka (AI) Kuralları
Projeye dâhil olacak AI asistanları, öncelikle proje kök dizinindeki `.agents/AGENTS.md` belgesini okumak ve katı UI/UX ve erişilebilirlik kurallarına harfiyen uymakla yükümlüdür. AI, `.agents/skills/` klasöründeki yetenekleri kullanarak otonom görev yönetimi (`todo-manager`) yapabilir.
