// Membuat kursor kepala kucing pixel → public/cursor.svg & public/cursor-pointer.svg
// Jalankan: node scripts/make-cursors.mjs
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

// Setengah kiri (8 kolom); setengah kanan dicerminkan otomatis.
// o garis hitam · g badan gradasi · l dalam telinga · w putih · e mata · h kilau · p pink
const BASE = [
  '..o.....',
  '..oo....',
  '.olo....',
  '.ollo...',
  '.ogloooo',
  '.ogggggg',
  'oggggggg',
  'oggheggg',
  'oggeeggg',
  'ogpgggwp',
  'oggggwwo',
  '.oggwwow',
  '..oogwww',
  '....oooo',
]

// Versi saat menunjuk link: mata senang ^^ dan mulut terbuka
const POINTER = BASE.map((row, i) => {
  if (i === 7) return 'ogggeggg'
  if (i === 8) return 'oggegegg'
  if (i === 10) return 'oggggwoo'
  if (i === 11) return '.oggwwop'
  return row
})

const COLORS = { o: '#0b0f0e', l: '#f7b6c6', w: '#ffffff', e: '#0b0f0e', h: '#ffffff', p: '#f4a3b8' }
const S = 2 // 1 pixel sprite = 2px layar

function svg(half) {
  const rows = half.map((r) => r + [...r].reverse().join(''))
  const w = rows[0].length * S
  const h = rows.length * S
  let rects = ''
  rows.forEach((row, y) => {
    ;[...row].forEach((c, x) => {
      if (c === '.') return
      const fill = c === 'g' ? 'url(#g)' : COLORS[c]
      rects += `<rect x="${x * S}" y="${y * S}" width="${S}" height="${S}" fill="${fill}"/>`
    })
  })
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="${h}" gradientUnits="userSpaceOnUse">` +
    `<stop offset="0" stop-color="#0f8f63"/><stop offset=".55" stop-color="#0b7a70"/><stop offset="1" stop-color="#0779a0"/>` +
    `</linearGradient></defs>${rects}</svg>\n`
}

const out = (name) => fileURLToPath(new URL(`../public/${name}`, import.meta.url))
writeFileSync(out('cursor.svg'), svg(BASE))
writeFileSync(out('cursor-pointer.svg'), svg(POINTER))
console.log('cursor.svg & cursor-pointer.svg dibuat')
