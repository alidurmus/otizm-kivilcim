const fs = require('fs');
const path = require('path');

// Simple SVG to base64 icon generator for PWA
const createIcon = (size, bgColor = '#667eea', textColor = '#ffffff') => {
  const fontSize = Math.floor(size * 0.6);
  const svg = `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="url(#bg)"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${fontSize}" 
        font-weight="bold" text-anchor="middle" dominant-baseline="central" 
        fill="${textColor}">K</text>
</svg>`.trim();
  
  return svg;
};

// Convert SVG to base64 data URL (for simple deployment)
const svgToDataUrl = (svg) => {
  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
};

// Create required icon sizes
const iconSizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];
const publicDir = path.join(__dirname, '..', 'public');

console.log('🎨 Kıvılcım PWA icons oluşturuluyor...\n');

iconSizes.forEach(size => {
  const svg = createIcon(size);
  const filename = `icon-${size}.png`;
  const filepath = path.join(publicDir, filename);
  
  // For now, save as SVG (browsers support SVG in manifest)
  // Later can be converted to PNG with sharp or canvas
  const svgFilename = `icon-${size}.svg`;
  const svgFilepath = path.join(publicDir, svgFilename);
  
  try {
    fs.writeFileSync(svgFilepath, svg);
    console.log(`✅ Created: ${svgFilename} (${size}x${size})`);
    
    // Also create a simple HTML for testing
    if (size === 192) {
      const testHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>Icon Test</title>
</head>
<body>
  <h1>Kıvılcım Icons</h1>
  <div style="display: flex; gap: 10px; flex-wrap: wrap;">
    ${iconSizes.map(s => `
      <div style="text-align: center;">
        <img src="icon-${s}.svg" width="64" height="64" style="border: 1px solid #ccc;">
        <br><small>${s}x${s}</small>
      </div>
    `).join('')}
  </div>
</body>
</html>`.trim();
      
      fs.writeFileSync(path.join(publicDir, 'icon-test.html'), testHtml);
      console.log('🧪 Created: icon-test.html');
    }
    
  } catch (error) {
    console.error(`❌ Error creating ${svgFilename}:`, error.message);
  }
});

// Update manifest to use SVG icons (temporary fix)
const manifestPath = path.join(publicDir, 'manifest.json');
try {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  
  // Update to SVG format temporarily
  manifest.icons = manifest.icons.map(icon => ({
    ...icon,
    src: icon.src.replace('.png', '.svg'),
    type: 'image/svg+xml'
  }));
  
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('\n📝 Updated manifest.json to use SVG icons');
  
} catch (error) {
  console.error('❌ Error updating manifest:', error.message);
}

console.log('\n🎉 Icon creation completed!');
console.log('📋 Next steps:');
console.log('   1. Test icons: open http://localhost:3000/icon-test.html');
console.log('   2. Convert SVG to PNG later with: npm install sharp');
console.log('   3. Icons use Kıvılcım brand colors (#667eea gradient)');

// Create favicon.ico alternative
const faviconSvg = createIcon(32);
fs.writeFileSync(path.join(publicDir, 'favicon.svg'), faviconSvg);
console.log('✅ Created: favicon.svg'); 