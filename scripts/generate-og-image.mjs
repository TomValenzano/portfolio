#!/usr/bin/env node
// Generate the social-share image (1200×630) used in og:image / twitter:image.
// Run: `npm run generate:og` — writes public/og-image.png.

import { writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import sharp from 'sharp'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const publicDir = join(__dirname, '..', 'public')

const W = 1200
const H = 630
const BG = '#09090b'
const FG = '#00e5ff'
const TEXT = '#fafafa'
const MUTED = '#a1a1aa'
const SANS = "system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif"
const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, 'DejaVu Sans Mono', monospace"

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <pattern id="dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="1" fill="#27272a"/>
    </pattern>
    <radialGradient id="glow" cx="78%" cy="22%" r="55%">
      <stop offset="0%" stop-color="${FG}" stop-opacity="0.18"/>
      <stop offset="60%" stop-color="${FG}" stop-opacity="0.04"/>
      <stop offset="100%" stop-color="${FG}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect width="${W}" height="${H}" fill="url(#dots)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>

  <g transform="translate(80, 80)">
    <rect width="88" height="88" rx="14" fill="${BG}" stroke="${FG}" stroke-width="2"/>
    <text x="44" y="44"
          text-anchor="middle"
          dominant-baseline="central"
          fill="${FG}"
          font-family="${MONO}"
          font-size="40" font-weight="700"
          letter-spacing="-2">TV</text>
  </g>

  <g transform="translate(80, 280)">
    <text x="0" y="0"
          fill="${TEXT}"
          font-family="${SANS}"
          font-size="78" font-weight="700"
          letter-spacing="-2">Tommaso Valenzano</text>
    <text x="0" y="64"
          fill="${MUTED}"
          font-family="${SANS}"
          font-size="34" font-weight="400"
          letter-spacing="-0.5">Full-stack developer · CS MSc (AI track)</text>
  </g>

  <g transform="translate(80, ${H - 80})">
    <text x="0" y="0"
          fill="${FG}"
          font-family="${MONO}"
          font-size="28" font-weight="500">tvalenzano.it</text>
  </g>
</svg>`

async function main() {
  await mkdir(publicDir, { recursive: true })
  const buf = await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9 })
    .toBuffer()
  await writeFile(join(publicDir, 'og-image.png'), buf)
  console.log(`→ og-image.png (${W}×${H})`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
