#!/usr/bin/env node
// Generate favicon suite from an inline SVG using Sharp + to-ico.
// Run: `npm run generate:favicons` — commits generated files in `public/`.

import { writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import sharp from 'sharp'
import toIco from 'to-ico'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const publicDir = join(__dirname, '..', 'public')

const BG = '#09090b' // color-bg (zinc-950)
const FG = '#00e5ff' // color-accent (cyan)
const RADIUS = 8 // px on a 48 canvas

// Master SVG. Text rendered with system monospace; at 48+ px it reads clearly.
const masterSvg = (size = 48) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="${size}" height="${size}">
  <rect width="48" height="48" rx="${RADIUS}" fill="${BG}"/>
  <text x="24" y="24"
        text-anchor="middle"
        dominant-baseline="central"
        fill="${FG}"
        font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, 'DejaVu Sans Mono', monospace"
        font-size="22" font-weight="700"
        letter-spacing="-1.5">TV</text>
</svg>`

// Simplified SVG for tiny sizes — bolder, tighter.
const tinySvg = () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <rect width="48" height="48" rx="${RADIUS}" fill="${BG}"/>
  <text x="24" y="24"
        text-anchor="middle"
        dominant-baseline="central"
        fill="${FG}"
        font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, 'DejaVu Sans Mono', monospace"
        font-size="26" font-weight="800"
        letter-spacing="-2">TV</text>
</svg>`

async function renderPng(svg, size) {
  return sharp(Buffer.from(svg))
    .resize(size, size, { fit: 'contain' })
    .png({ compressionLevel: 9 })
    .toBuffer()
}

async function main() {
  await mkdir(publicDir, { recursive: true })

  // 1. SVG served to modern browsers
  await writeFile(join(publicDir, 'favicon.svg'), masterSvg(48))
  console.log('→ favicon.svg')

  // 2. PNGs at required sizes
  const sizes = {
    'favicon-16x16.png': [tinySvg(), 16],
    'favicon-32x32.png': [masterSvg(32), 32],
    'favicon-48x48.png': [masterSvg(48), 48],
    'apple-touch-icon.png': [masterSvg(180), 180],
    'android-chrome-192x192.png': [masterSvg(192), 192],
    'android-chrome-512x512.png': [masterSvg(512), 512],
  }

  const pngBuffers = {}
  for (const [filename, [svg, size]] of Object.entries(sizes)) {
    const buf = await renderPng(svg, size)
    await writeFile(join(publicDir, filename), buf)
    pngBuffers[filename] = buf
    console.log(`→ ${filename}`)
  }

  // 3. Multi-resolution ICO (16 + 32 + 48)
  const icoBuf = await toIco([
    pngBuffers['favicon-16x16.png'],
    pngBuffers['favicon-32x32.png'],
    pngBuffers['favicon-48x48.png'],
  ])
  await writeFile(join(publicDir, 'favicon.ico'), icoBuf)
  console.log('→ favicon.ico (16 + 32 + 48)')

  // 4. Minimal PWA manifest
  const manifest = {
    name: 'Tommaso Valenzano',
    short_name: 'tvalenzano',
    icons: [
      { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    theme_color: BG,
    background_color: BG,
    display: 'standalone',
  }
  await writeFile(
    join(publicDir, 'site.webmanifest'),
    JSON.stringify(manifest, null, 2) + '\n',
  )
  console.log('→ site.webmanifest')

  console.log('\n✓ favicon suite generated in public/')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
