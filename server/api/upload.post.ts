import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { randomBytes } from 'node:crypto'

const TYPES: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
}
const MAX = 5 * 1024 * 1024

// Simpan gambar ke public/uploads/<tahun>/ supaya ikut ter-commit dan ter-deploy
export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const parts = await readMultipartFormData(event)
  const file = parts?.find((p) => p.name === 'file' && p.filename)
  if (!file) throw createError({ statusCode: 400, statusMessage: 'Tidak ada file yang diunggah' })

  const ext = TYPES[file.type ?? '']
  if (!ext) throw createError({ statusCode: 400, statusMessage: 'Format harus PNG, JPG, WEBP, GIF, atau SVG' })
  if (file.data.length > MAX) throw createError({ statusCode: 400, statusMessage: 'Ukuran gambar maksimal 5 MB' })

  const year = String(new Date().getFullYear())
  const base = slugify(file.filename!.replace(/\.[^.]+$/, '')).slice(0, 40)
  const name = `${base}-${randomBytes(3).toString('hex')}.${ext}`
  const dir = join(process.cwd(), 'public', 'uploads', year)
  await mkdir(dir, { recursive: true })
  await writeFile(join(dir, name), file.data)
  return { url: `/uploads/${year}/${name}` }
})
