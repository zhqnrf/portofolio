// Bagian yang berupa satu objek (bukan daftar)
const OBJECT_SECTIONS = ['profile', 'skills']
const LIST_SECTIONS = [
  'experience',
  'projects',
  'education',
  'events',
  'organizations',
  'achievements',
  'certificates',
]

export const SECTIONS = [...OBJECT_SECTIONS, ...LIST_SECTIONS]

const KEY = 'content.json'

export async function readContent(): Promise<Record<string, any>> {
  const data = await useStorage('content').getItem<Record<string, any>>(KEY)
  return data ?? {}
}

export async function writeSection(section: string, value: unknown) {
  if (!SECTIONS.includes(section)) {
    throw createError({ statusCode: 404, statusMessage: `Bagian "${section}" tidak dikenal` })
  }
  const isList = LIST_SECTIONS.includes(section)
  if (isList ? !Array.isArray(value) : typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw createError({ statusCode: 400, statusMessage: `Format "${section}" harus ${isList ? 'daftar' : 'objek'}` })
  }
  const content = await readContent()
  content[section] = value
  // Simpan rapi supaya enak dibaca di git diff
  await useStorage('content').setItem(KEY, JSON.stringify(content, null, 2) + '\n')
  return content
}
