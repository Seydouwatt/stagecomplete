import sharp from 'sharp';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [
  { size: 192, name: 'pwa-192x192.png' },
  { size: 512, name: 'pwa-512x512.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 64, name: 'favicon-64x64.png' },
];

const svgPath = join(__dirname, '../public/logo.svg');
const outputDir = join(__dirname, '../public');

const svgBuffer = readFileSync(svgPath);

console.log('🎨 Génération des icônes PWA...\n');

for (const { size, name } of sizes) {
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(join(outputDir, name));

  console.log(`✅ ${name} (${size}x${size})`);
}

console.log('\n✨ Toutes les icônes ont été générées avec succès !');
