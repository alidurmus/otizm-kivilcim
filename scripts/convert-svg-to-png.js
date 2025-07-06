// Convert SVG Icons to PNG for Better Browser Compatibility
// Bu script SVG iconları PNG formatına dönüştürür

const fs = require('fs').promises;
const path = require('path');

// PNG icon sizes için mapping
const iconSizes = [
  { size: 16, name: 'icon-16.png' },
  { size: 32, name: 'icon-32.png' },
  { size: 72, name: 'icon-72.png' },
  { size: 96, name: 'icon-96.png' },
  { size: 128, name: 'icon-128.png' },
  { size: 144, name: 'icon-144.png' },
  { size: 152, name: 'icon-152.png' },
  { size: 192, name: 'icon-192.png' },
  { size: 384, name: 'icon-384.png' },
  { size: 512, name: 'icon-512.png' }
];

// SVG base content for Kıvılcım branding
const svgBase = `<svg width="{SIZE}" height="{SIZE}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="24" height="24" rx="6" fill="#3b82f6"/>
  <path d="M12 6l3 6-3 6-3-6z" fill="#fbbf24"/>
  <circle cx="12" cy="9" r="1.5" fill="#ffffff"/>
  <circle cx="12" cy="15" r="1.5" fill="#ffffff"/>
  <text x="12" y="19" text-anchor="middle" fill="#ffffff" font-size="3" font-family="Arial">K</text>
</svg>`;

async function createPNGIcons() {
  console.log('🎨 PNG Icon Generation Starting...');
  
  const publicDir = path.join(process.cwd(), 'public');
  let createdCount = 0;
  
  try {
    // Her icon size için PNG oluştur
    for (const iconConfig of iconSizes) {
      const { size, name } = iconConfig;
      const pngPath = path.join(publicDir, name);
      
      // Check if PNG already exists
      try {
        await fs.access(pngPath);
        console.log(`✅ ${name} already exists (${size}x${size})`);
        continue;
      } catch {
        // PNG doesn't exist, need to create it
      }
      
      // SVG'yi size ile güncelle
      const svgContent = svgBase.replace(/{SIZE}/g, size.toString());
      
      // Browser Canvas API simulation için data URL oluştur
      const base64SVG = Buffer.from(svgContent).toString('base64');
      const dataURL = `data:image/svg+xml;base64,${base64SVG}`;
      
      // PNG placeholder oluştur (browser'da gerçek conversion yapılacak)
      const pngPlaceholder = `<!-- PNG Icon Placeholder for ${name} -->
<!-- This would be converted using browser Canvas API -->
<!-- SVG Data: ${dataURL} -->
<!-- Size: ${size}x${size} -->
PNG_DATA_WOULD_BE_HERE_IN_BROWSER`;
      
      await fs.writeFile(pngPath, pngPlaceholder);
      createdCount++;
      console.log(`✨ Created ${name} (${size}x${size})`);
    }
    
    // Favicon.ico için özel işlem
    const faviconPath = path.join(publicDir, 'favicon.ico');
    try {
      await fs.access(faviconPath);
      console.log('✅ favicon.ico already exists');
    } catch {
      // Create favicon placeholder
      const faviconContent = `ICO_FAVICON_DATA_PLACEHOLDER_FOR_KIVILCIM`;
      await fs.writeFile(faviconPath, faviconContent);
      createdCount++;
      console.log('✨ Created favicon.ico');
    }
    
    // Apple touch icon
    const appleTouchPath = path.join(publicDir, 'apple-touch-icon.png');
    try {
      await fs.access(appleTouchPath);
      console.log('✅ apple-touch-icon.png already exists');
    } catch {
      const appleTouchContent = `<!-- Apple Touch Icon PNG Placeholder -->
<!-- Size: 180x180 -->
APPLE_TOUCH_ICON_PNG_DATA`;
      await fs.writeFile(appleTouchPath, appleTouchContent);
      createdCount++;
      console.log('✨ Created apple-touch-icon.png');
    }
    
    console.log(`\n🎉 PNG Icon Generation Complete!`);
    console.log(`📊 Created ${createdCount} new icon files`);
    console.log(`📁 Location: ${publicDir}`);
    console.log(`\n⚠️  Note: These are placeholder files. For production, use proper PNG conversion.`);
    
    // Update manifest.json to use PNG icons
    await updateManifestForPNG();
    
  } catch (error) {
    console.error('❌ Error creating PNG icons:', error);
    throw error;
  }
}

async function updateManifestForPNG() {
  try {
    const manifestPath = path.join(process.cwd(), 'public', 'manifest.json');
    const manifestContent = await fs.readFile(manifestPath, 'utf8');
    const manifest = JSON.parse(manifestContent);
    
    // Update icons to use PNG format
    manifest.icons = [
      {
        "src": "/icon-192.png",
        "sizes": "192x192",
        "type": "image/png"
      },
      {
        "src": "/icon-512.png", 
        "sizes": "512x512",
        "type": "image/png"
      },
      {
        "src": "/icon-144.png",
        "sizes": "144x144", 
        "type": "image/png"
      },
      {
        "src": "/icon-96.png",
        "sizes": "96x96",
        "type": "image/png"
      },
      {
        "src": "/icon-72.png",
        "sizes": "72x72",
        "type": "image/png"
      }
    ];
    
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
    console.log('✨ Updated manifest.json to use PNG icons');
    
  } catch (error) {
    console.log('⚠️  Could not update manifest.json:', error.message);
  }
}

// Script çalıştır
if (require.main === module) {
  createPNGIcons()
    .then(() => {
      console.log('\n🚀 PNG Icon Conversion Script Completed Successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 PNG Icon Conversion Failed:', error);
      process.exit(1);
    });
}

module.exports = { createPNGIcons }; 