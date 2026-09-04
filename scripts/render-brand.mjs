// Renders the app icon and splash from assets/brand/*.svg.
// Run: node scripts/render-brand.mjs
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const brand = path.join(root, 'assets/brand');
const out = path.join(root, 'assets/images');

const mark = await readFile(path.join(brand, 'mark.svg'));
const markTransparent = await readFile(path.join(brand, 'mark-transparent.svg'));

await sharp(mark).resize(1024, 1024).png().toFile(path.join(out, 'icon.png'));
await sharp(markTransparent).resize(512, 512).png().toFile(path.join(out, 'splash-icon.png'));
await sharp(mark).resize(48, 48).png().toFile(path.join(out, 'favicon.png'));
await sharp(markTransparent).resize(432, 432).png().toFile(path.join(out, 'android-icon-foreground.png'));
await sharp(markTransparent).resize(432, 432).grayscale().png().toFile(path.join(out, 'android-icon-monochrome.png'));
await sharp({ create: { width: 432, height: 432, channels: 4, background: '#FBF7F2' } })
  .png()
  .toFile(path.join(out, 'android-icon-background.png'));

console.log('rendered icon, splash, favicon, android icons');
