# Resim İşleme Kuralları - Kıvılcım Platform

## 🖼️ Resim İşleme Ana Kuralları

### 📱 Next.js Image Optimization
- **ZORUNLU:** `next/image` component kullanımı
- **Performance:** Automatic image optimization and lazy loading
- **Responsive:** Multiple size variants için `sizes` prop
- **SEO:** Alt text ZORUNLU her resim için

### 🎨 Autism-Friendly Visual Design

#### **Renk Kuralları**
- **Sakin Renkler:** Parlak/yanıp sönen renkler YASAK
- **Kontrast:** WCAG AA compliance (4.5:1 minimum)
- **Renk Paleti:** 
  - Primary: Calm blue (#3B82F6)
  - Success: Soft green (#10B981)
  - Warning: Gentle orange (#F59E0B)
  - Error: Soft red (#EF4444)

#### **Animasyon Kuralları**
- **Smooth Transitions:** ease-in-out only, no harsh movements
- **Duration:** <500ms for micro-interactions
- **Respect Preferences:** `prefers-reduced-motion` support
- **No Autoplay:** User-initiated animations only

### 📐 Responsive Image Kuralları

#### **Breakpoint Strategy**
```typescript
// ZORUNLU responsive breakpoints
const breakpoints = {
  mobile: '(max-width: 768px)',
  tablet: '(max-width: 1024px)',
  desktop: '(min-width: 1025px)'
};
```

#### **Image Sizing Standards**
- **Touch Targets:** Minimum 44px (WCAG compliance)
- **Icons:** 16px, 24px, 32px, 48px variants
- **Avatars:** 40px, 64px, 96px, 128px sizes
- **Hero Images:** Multiple resolution variants

### 🏗️ PWA Icon Kuralları

#### **Required Icon Sizes**
- **16x16:** Favicon, browser tab
- **32x32:** Taskbar icon
- **144x144:** Windows tile
- **192x192:** Android icon
- **512x512:** iOS splash screen

#### **Icon Generation Rules**
```bash
# ZORUNLU PWA icon generation
npm run icons:generate          # Auto-generate all sizes
npm run icons:validate          # Validate icon compliance
```

#### **Icon Quality Standards**
- **Format:** PNG with transparency
- **Design:** Simple, recognizable at small sizes
- **Background:** Solid color, no complex patterns
- **Consistency:** Same design across all sizes

### 🎯 Component Image Kuralları

#### **Module Images**
```typescript
// ZORUNLU module image pattern
<Image
  src="/images/modules/alphabet-reading.png"
  alt="Alfabe okuma modülü - Türk alfabesinin 29 harfini öğrenin"
  width={300}
  height={200}
  priority={false}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

#### **Educational Content Images**
- **Alt Text:** Descriptive and educational context
- **Size Optimization:** WebP format preferred
- **Loading Strategy:** Lazy loading for below-fold content
- **Fallback:** Always provide fallback for failed loads

### 📊 Image Performance Kuralları

#### **Performance Targets**
- **LCP (Largest Contentful Paint):** <2.5s
- **Image Load Time:** <1s for critical images
- **Bundle Impact:** Images not included in main bundle
- **Compression:** Optimal quality/size balance

#### **Optimization Techniques**
```typescript
// ZORUNLU image optimization
{
  formats: ['webp', 'avif', 'png'],
  quality: 80,
  progressive: true,
  placeholder: 'blur',
  loading: 'lazy'
}
```

### 🌐 Accessibility Image Kuralları

#### **Alt Text Standards**
- **Descriptive:** Explain what's in the image
- **Contextual:** Relevant to surrounding content
- **Concise:** <125 characters preferred
- **Educational Value:** Include learning context for autism support

#### **Screen Reader Support**
```typescript
// ZORUNLU accessibility pattern
<Image
  src="/image.png"
  alt="Çocuk elinde kırmızı elma tutuyor - kelime dağarcığı için meyve örneği"
  role="img"
  aria-describedby="image-description"
/>
```

### 🎨 Design System Image Kuralları

#### **Image Categories**
- **Icons:** SVG preferred for scalability
- **Illustrations:** Educational, autism-friendly characters
- **Photos:** Real-world context images
- **Patterns:** Background textures and decorative elements

#### **Style Guide Compliance**
- **Consistent Style:** Same illustration style across modules
- **Brand Colors:** Use platform color palette
- **Character Design:** Friendly, non-threatening appearances
- **Cultural Sensitivity:** Turkish cultural context awareness

### 📱 Mobile Image Kuralları

#### **Mobile Optimization**
- **Smaller Sizes:** Optimized for mobile bandwidth
- **Touch-Friendly:** Larger tap targets for mobile
- **Portrait/Landscape:** Responsive to device orientation
- **Retina Support:** 2x, 3x density variants

#### **Progressive Loading**
```typescript
// Mobile-first loading strategy
const mobileImageSizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
```

### 🔄 Image Caching Kuralları

#### **Cache Strategy**
- **Static Images:** Long-term cache (1 year)
- **User Generated:** Short-term cache (1 day)
- **Educational Content:** Medium-term cache (1 month)
- **Icons/UI:** Permanent cache until version change

#### **CDN Integration**
- **Vercel Image Optimization:** Automatic CDN delivery
- **Edge Caching:** Global image distribution
- **Dynamic Resizing:** On-demand size variants

### 🧪 Image Testing Kuralları

#### **Visual Testing Requirements**
- **Cross-Browser:** Image rendering consistency
- **Device Testing:** Mobile, tablet, desktop variants
- **Loading Testing:** Network throttling scenarios
- **Accessibility Testing:** Screen reader compatibility

#### **Automated Image Tests**
```typescript
// ZORUNLU image test pattern
test('should load module images correctly', async () => {
  await page.goto('/modules');
  
  const images = page.locator('img[src*="/images/modules/"]');
  await expect(images).toHaveCount(10); // 10 active modules
  
  // Check each image loads
  for (const image of await images.all()) {
    await expect(image).toHaveAttribute('alt');
    await expect(image).toBeVisible();
  }
});
```

### 🚨 Image Error Handling

#### **Error Recovery**
- **Fallback Images:** Default placeholders for broken images
- **Retry Logic:** Automatic retry for network failures
- **User Feedback:** Loading states and error messages
- **Graceful Degradation:** Content still accessible without images

#### **Image Error Monitoring**
```typescript
// ZORUNLU error handling pattern
<Image
  src="/image.png"
  alt="Description"
  onError={(e) => {
    console.error('Image load failed:', e);
    // Set fallback image
  }}
  onLoad={() => {
    // Track successful load
  }}
/>
```

### 📈 Image Analytics

#### **Performance Monitoring**
- **Load Times:** Image loading performance tracking
- **Error Rates:** Failed image load monitoring
- **User Engagement:** Image interaction analytics
- **Optimization Impact:** Before/after performance metrics

#### **Quality Metrics**
- **Visual Quality:** User perception surveys
- **Technical Quality:** Image compression efficiency
- **Accessibility Score:** Screen reader effectiveness
- **Educational Value:** Learning outcome correlation

### 🔧 Image Development Tools

#### **Required Tools**
```bash
# Image optimization tools
npm run images:optimize         # Compress and optimize
npm run images:generate-webp    # Convert to WebP format
npm run images:audit           # Check image performance
npm run images:validate        # Validate alt text and accessibility
```

#### **Design Tools Integration**
- **Figma Export:** Consistent export settings
- **SVG Optimization:** Remove unnecessary code
- **Icon Generation:** Automated icon creation
- **Asset Pipeline:** Automated image processing

---

## 🔗 İlgili Kural Dosyaları

- **Component Rules:** `docs/rules/component-rules.md`
- **Testing Rules:** `docs/rules/testing-rules.md`
- **Dashboard Rules:** `docs/rules/dashboard-rules.md`

---

> **Kritik Kural:** Tüm resimler autism-friendly tasarım prensiplerini desteklemelidir. Accessibility ve performance asla ihmal edilemez.

**Son Güncelleme:** 2025-01-07  
**Durum:** Aktif ve zorunlu  
**Owner:** Visual Design Team 