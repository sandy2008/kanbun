// Generate PWA icons for Kanbun
const fs = require('fs');
const path = require('path');

// Create a simple SVG icon based on our favicon
const createIcon = (size) => {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" fill="#1a1a1a"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
          font-family="serif" font-size="${Math.floor(size * 0.6)}" fill="#d4af37">漢</text>
</svg>`;
};

// Icon sizes needed for PWA
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Create icons directory
if (!fs.existsSync('icons')) {
    fs.mkdirSync('icons');
}

// Generate SVG icons
sizes.forEach(size => {
    const svgContent = createIcon(size);
    fs.writeFileSync(`icons/icon-${size}x${size}.svg`, svgContent);
    console.log(`Created icon-${size}x${size}.svg`);
});

console.log('All PWA icons generated successfully!');
