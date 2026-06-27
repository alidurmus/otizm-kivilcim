---
name: todo-manager
description: docs/todo.md içerisindeki proje görev listesini okur, günceller ve senkronize tutar.
---

# Todo Manager (todo-manager)

Bu yetenek tetiklendiğinde veya sen projede belirli görevleri tamamladığında, `docs/todo.md` (veya `C:\cursor\otizm-kivilcim\docs\todo.md`) dosyasını güncel tutmakla yükümlüsün.

### Kurallar:
1. Bir göreve başlarken, o görevin başındaki sembolü `⏳` (Beklemede) yerine `🔄` (Üzerinde Çalışılıyor) yap ve ismini ekle (örn: `@ai-coder`).
2. Görev tamamen bitip test edildiğinde, sembolü `✅` (Tamamlandı) yap ve tarihi ekle (`@completed-YYYY-MM-DD`).
3. Alt adımları `[ ]`'den `[x]`'e çevir.
4. Dosyanın formatını ve markdown yapısını KESİNLİKLE bozma. Diğer görevlerin durumlarını yanlışlıkla silme.

Bu işlemi yaparken `multi_replace_file_content` aracını kullanarak sadece ilgili kısımları (satır aralığı vererek) düzenle. Dosyayı baştan sona yeniden yazmaktan kaçın.
