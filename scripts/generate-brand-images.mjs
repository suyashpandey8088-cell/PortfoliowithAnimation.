/**
 * OG / APPLE-TOUCH ICON GENERATOR
 * ─────────────────────────────────────────────────────────────────────────
 * Produces the two raster assets the site needs, straight from the brand
 * palette — no design tool, no binary committed from a laptop, and nothing
 * to go stale. Re-run any time the identity changes:
 *
 *     node scripts/generate-brand-images.mjs
 *
 * Writes a dependency-free PNG encoder: signature, IHDR, one filtered IDAT
 * (zlib) and IEND, with correct CRC-32 on each chunk.
 */
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');

const INK = [0x15, 0x15, 0x15];
const VOLT = [0xc6, 0xff, 0x00];
const FLARE = [0xff, 0x3c, 0xac];

/* ── PNG encoding ────────────────────────────────────────────────────── */

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i += 1) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([length, body, crc]);
}

function writePng(file, width, height, pixels) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // colour type: truecolour RGB
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  // One filter byte (0 = none) per scanline.
  const stride = width * 3;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y += 1) {
    raw[y * (stride + 1)] = 0;
    pixels.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }

  const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);

  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, png);
  console.log(`  wrote ${file}  (${png.length} bytes)`);
}

/* ── Tiny rasteriser ─────────────────────────────────────────────────── */

class Canvas {
  constructor(width, height, background) {
    this.width = width;
    this.height = height;
    this.data = Buffer.alloc(width * height * 3);
    for (let i = 0; i < width * height; i += 1) this.set(i % width, (i / width) | 0, background);
  }

  set(x, y, [r, g, b]) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return;
    const i = ((y | 0) * this.width + (x | 0)) * 3;
    this.data[i] = r;
    this.data[i + 1] = g;
    this.data[i + 2] = b;
  }

  rect(x, y, w, h, colour) {
    for (let j = 0; j < h; j += 1) for (let i = 0; i < w; i += 1) this.set(x + i, y + j, colour);
  }

  circle(cx, cy, r, colour) {
    for (let y = -r; y <= r; y += 1) {
      for (let x = -r; x <= r; x += 1) {
        if (x * x + y * y <= r * r) this.set(cx + x, cy + y, colour);
      }
    }
  }

  ring(cx, cy, r, thickness, colour) {
    for (let y = -r - thickness; y <= r + thickness; y += 1) {
      for (let x = -r - thickness; x <= r + thickness; x += 1) {
        const d = Math.sqrt(x * x + y * y);
        if (Math.abs(d - r) <= thickness / 2) this.set(cx + x, cy + y, colour);
      }
    }
  }
}

/* ── Block letterforms ───────────────────────────────────────────────────
   Each glyph is a 5×7 bitmap. Deliberately chunky: it matches the Archivo
   Black weight of the on-screen monogram without shipping a font. */

const GLYPHS = {
  S: ['11111', '10000', '10000', '11111', '00001', '00001', '11111'],
  P: ['11111', '10001', '10001', '11111', '10000', '10000', '10000'],
};

function drawText(canvas, text, x, y, unit, colour) {
  let cursor = x;
  for (const char of text) {
    const glyph = GLYPHS[char];
    if (!glyph) continue;
    glyph.forEach((row, rowIndex) => {
      row.split('').forEach((cell, colIndex) => {
        if (cell === '1') canvas.rect(cursor + colIndex * unit, y + rowIndex * unit, unit, unit, colour);
      });
    });
    cursor += 6 * unit; // 5 columns + 1 column of tracking
  }
}

/* ── Open Graph card: 1200 × 630 ─────────────────────────────────────── */

function buildOgImage() {
  const W = 1200;
  const H = 630;
  const canvas = new Canvas(W, H, INK);

  // Halftone dot field across the lower band.
  for (let y = 470; y < H; y += 22) {
    for (let x = 20; x < W; x += 22) canvas.circle(x, y, 2.5, [0x2c, 0x2c, 0x2c]);
  }

  // Concentric ring motif, echoing the hero's monogram chrome.
  canvas.ring(940, 315, 210, 3, [0x33, 0x33, 0x33]);
  canvas.ring(940, 315, 160, 3, [0x3d, 0x3d, 0x3d]);
  canvas.circle(940, 315, 26, FLARE);

  // Framing rule.
  canvas.rect(64, 64, W - 128, 4, [0x33, 0x33, 0x33]);
  canvas.rect(64, H - 68, W - 128, 4, [0x33, 0x33, 0x33]);

  // Monogram.
  drawText(canvas, 'SP', 96, 150, 34, VOLT);

  // Underline accent.
  canvas.rect(96, 430, 300, 12, FLARE);

  // Caption row (drawn as pixel bars — no font needed, no fake text).
  canvas.rect(96, 476, 190, 10, [0x6a, 0x6a, 0x6a]);
  canvas.rect(96, 502, 300, 10, [0x4a, 0x4a, 0x4a]);
  canvas.rect(96, 528, 140, 10, [0x4a, 0x4a, 0x4a]);

  return canvas;
}

/* ── Apple touch icon: 180 × 180 ─────────────────────────────────────── */

function buildTouchIcon() {
  const S = 180;
  const canvas = new Canvas(S, S, INK);
  canvas.ring(90, 90, 74, 3, [0x3a, 0x3a, 0x3a]);
  drawText(canvas, 'SP', 26, 62, 12, VOLT);
  canvas.circle(150, 32, 8, FLARE);
  return canvas;
}

/* ── Run ─────────────────────────────────────────────────────────────── */

console.log('Generating brand raster assets…');
writePng(join(OUT_DIR, 'og-image.png'), 1200, 630, buildOgImage().data);
writePng(join(OUT_DIR, 'apple-touch-icon.png'), 180, 180, buildTouchIcon().data);
console.log('Done.');
