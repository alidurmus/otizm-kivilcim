# Naming Conventions – Best Practices (Next.js & React)

## 1. Genel Prensipler
- Anlamlı ve açıklayıcı isimler kullanın.
- Kısa ama açık tutun, gereksiz kısaltmalardan kaçının.
- Proje genelinde tutarlılık sağlayın.

## 2. Değişken ve Fonksiyonlar
- **camelCase** kullanın: `userName`, `isActive`, `fetchUserData()`, `handleSubmit()`
- Boolean değişkenler için `is`, `has`, `can`, `should` önekleri: `isLoading`, `hasPermission`, `canEdit`, `shouldRender`
- Fonksiyonlar eylemle başlar: `getUserProfile()`, `updateSettings()`, `handleClick()`

## 3. Class ve Component İsimleri
- **PascalCase** kullanın: `UserProfile`, `LoginForm`, `DashboardPage`
- React component dosya adı da PascalCase: `UserProfile.jsx`, `LoginForm.tsx`

## 4. Dosya ve Klasörler
- Küçük harf ve tire (-) ile ayırın: `user-profile.js`, `use-auth.js`, `api-client.ts`
- Component dosyaları PascalCase olabilir: `UserCard.tsx`
- Klasörler küçük harf ve tire ile: `components/`, `utils/`, `hooks/`, `pages/`

## 5. Sabitler (Constants)
- **BÜYÜK_HARF_UNDERSCORE**: `API_URL`, `MAX_RETRY_COUNT`

## 6. TypeScript Tipleri ve Enumlar
- **PascalCase**: `UserRole`, `AppStatus`, `ThemeType`

## 7. Context, Hook ve Provider İsimleri
- Hooklar `use` ile başlar: `useAuth`, `useUserProfile`
- Context: `UserContext`
- Provider: `UserProvider`

## 8. Test Dosyaları
- Test edilen dosya ile aynı isimde, `.test.js` veya `.spec.tsx` uzantısı ile: `user-profile.test.tsx`

## 9. Çeviri ve UI Metinleri
- Kodda İngilizce, kullanıcıya görünen metinler Türkçe olmalı.
  ```js
  // Kodda
  const errorMessage = "Bir hata oluştu. Lütfen tekrar deneyin."; // Türkçe metin, değişken adı İngilizce
  ```

## Kaynaklar
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [React Docs: Naming Conventions](https://react.dev/learn/naming-components-and-hooks)
- [Next.js Naming Best Practices](https://nextjs.org/docs)

---

> Bu kurallar, kodun okunabilirliğini ve sürdürülebilirliğini artırmak için önerilmektedir. 