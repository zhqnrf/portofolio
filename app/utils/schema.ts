// Definisi form untuk halaman /admin. Tambah field di sini kalau mau kolom baru.
import { LANGS, PROFILE_LANGS } from './i18n'

export type FieldType = 'text' | 'textarea' | 'tags' | 'links' | 'url' | 'image' | 'markdown' | 'date' | 'checkbox'

export interface Field {
  key: string
  label: string
  type: FieldType
  hint?: string
}

export interface SectionSchema {
  key: string
  label: string
  kind: 'object' | 'list'
  fields: Field[]
  /** field yang dipakai sebagai judul kartu di daftar */
  titleKey?: string
  subKey?: string
}

export const sections: SectionSchema[] = [
  {
    key: 'profile',
    label: 'Profil',
    kind: 'object',
    fields: [
      { key: 'name', label: 'Nama', type: 'text' },
      { key: 'role', label: 'Peran / jabatan', type: 'text' },
      { key: 'tagline', label: 'Tagline', type: 'textarea' },
      { key: 'about', label: 'Tentang saya', type: 'textarea', hint: 'Pisahkan paragraf dengan satu baris kosong.' },
      { key: 'location', label: 'Lokasi', type: 'text' },
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'phone', label: 'Nomor telepon (tampilan)', type: 'text' },
      { key: 'whatsapp', label: 'Nomor WhatsApp', type: 'text', hint: 'Format internasional tanpa + dan spasi, contoh 628123456789.' },
      { key: 'github', label: 'GitHub', type: 'url' },
      { key: 'linkedin', label: 'LinkedIn', type: 'url' },
      { key: 'resume', label: 'Link CV / résumé', type: 'url', hint: 'Kosongkan kalau belum ada.' },
    ],
  },
  {
    key: 'profileI18n',
    label: 'Profil (terjemahan)',
    kind: 'object',
    // Profil utama ditulis dalam bahasa Inggris; di sini versi bahasa lain. Kosongkan untuk memakai versi Inggris.
    fields: PROFILE_LANGS.flatMap((code) => {
      const name = LANGS.find((l) => l.code === code)!.label
      return [
        { key: `role_${code}`, label: `Peran — ${name}`, type: 'text' as const },
        { key: `tagline_${code}`, label: `Tagline — ${name}`, type: 'textarea' as const },
        { key: `about_${code}`, label: `Tentang saya — ${name}`, type: 'textarea' as const, hint: 'Pisahkan paragraf dengan satu baris kosong.' },
        { key: `location_${code}`, label: `Lokasi — ${name}`, type: 'text' as const },
      ]
    }),
  },
  {
    key: 'skills',
    label: 'Skill',
    kind: 'object',
    fields: [
      { key: 'tech', label: 'Tech skill', type: 'tags' },
      { key: 'soft', label: 'Soft skill', type: 'tags' },
      { key: 'languages', label: 'Bahasa', type: 'tags' },
    ],
  },
  {
    key: 'experience',
    label: 'Pengalaman',
    kind: 'list',
    titleKey: 'role',
    subKey: 'org',
    fields: [
      { key: 'period', label: 'Periode', type: 'text', hint: 'Contoh: Feb 2024 — Jun 2024' },
      { key: 'role', label: 'Posisi', type: 'text' },
      { key: 'org', label: 'Tempat', type: 'text' },
      { key: 'location', label: 'Lokasi', type: 'text', hint: 'Contoh: Kediri, East Java' },
      { key: 'description', label: 'Deskripsi', type: 'textarea', hint: 'Satu baris = satu poin.' },
      { key: 'tags', label: 'Teknologi', type: 'tags' },
      { key: 'link', label: 'Link', type: 'url' },
    ],
  },
  {
    key: 'posts',
    label: 'Blog',
    kind: 'list',
    titleKey: 'title',
    subKey: 'date',
    fields: [
      { key: 'title', label: 'Judul', type: 'text' },
      { key: 'slug', label: 'Slug (URL)', type: 'text', hint: 'Kosongkan untuk dibuat otomatis dari judul.' },
      { key: 'date', label: 'Tanggal terbit', type: 'date' },
      { key: 'published', label: 'Tampilkan di situs', type: 'checkbox', hint: 'Matikan untuk menyimpan sebagai draf.' },
      { key: 'excerpt', label: 'Ringkasan', type: 'textarea', hint: 'Satu-dua kalimat yang tampil di daftar blog.' },
      { key: 'cover', label: 'Gambar sampul', type: 'image' },
      { key: 'tags', label: 'Tag', type: 'tags' },
      { key: 'body', label: 'Isi tulisan', type: 'markdown' },
    ],
  },
  {
    key: 'projects',
    label: 'Proyek',
    kind: 'list',
    titleKey: 'title',
    subKey: 'role',
    fields: [
      { key: 'title', label: 'Nama proyek', type: 'text' },
      { key: 'role', label: 'Peran', type: 'text' },
      { key: 'year', label: 'Tahun', type: 'text' },
      { key: 'description', label: 'Deskripsi', type: 'textarea' },
      { key: 'tags', label: 'Teknologi', type: 'tags' },
      { key: 'image', label: 'Gambar', type: 'image' },
      { key: 'links', label: 'Link', type: 'links', hint: 'Link pertama dipakai saat kartu diklik.' },
    ],
  },
  {
    key: 'publications',
    label: 'Publikasi',
    kind: 'list',
    titleKey: 'title',
    subKey: 'venue',
    fields: [
      { key: 'year', label: 'Tahun', type: 'text' },
      { key: 'title', label: 'Judul', type: 'text' },
      { key: 'authors', label: 'Penulis', type: 'text', hint: 'Pisahkan dengan koma. Namamu akan ditebalkan otomatis.' },
      { key: 'venue', label: 'Jurnal / konferensi', type: 'text', hint: 'Contoh: Journal of Information System Research (JOSH), 7(4), 1088–1099' },
      { key: 'link', label: 'Link (DOI)', type: 'url' },
      { key: 'summary', label: 'Ringkasan singkat', type: 'textarea' },
      { key: 'tags', label: 'Kata kunci', type: 'tags' },
    ],
  },
  {
    key: 'education',
    label: 'Pendidikan',
    kind: 'list',
    titleKey: 'school',
    subKey: 'major',
    fields: [
      { key: 'period', label: 'Periode', type: 'text' },
      { key: 'school', label: 'Sekolah / kampus', type: 'text' },
      { key: 'major', label: 'Jurusan', type: 'text' },
      { key: 'score', label: 'Nilai / IPK', type: 'text' },
      { key: 'description', label: 'Keterangan', type: 'textarea' },
    ],
  },
  {
    key: 'events',
    label: 'Kepanitiaan',
    kind: 'list',
    titleKey: 'title',
    subKey: 'role',
    fields: [
      { key: 'year', label: 'Tahun', type: 'text' },
      { key: 'title', label: 'Nama acara', type: 'text' },
      { key: 'role', label: 'Divisi / peran', type: 'text' },
      { key: 'description', label: 'Deskripsi', type: 'textarea' },
      { key: 'link', label: 'Link', type: 'url' },
    ],
  },
  {
    key: 'organizations',
    label: 'Organisasi',
    kind: 'list',
    titleKey: 'role',
    subKey: 'org',
    fields: [
      { key: 'period', label: 'Periode', type: 'text' },
      { key: 'role', label: 'Jabatan', type: 'text' },
      { key: 'org', label: 'Organisasi', type: 'text' },
    ],
  },
  {
    key: 'achievements',
    label: 'Prestasi',
    kind: 'list',
    titleKey: 'title',
    subKey: 'year',
    fields: [
      { key: 'year', label: 'Tahun', type: 'text' },
      { key: 'title', label: 'Prestasi', type: 'text' },
    ],
  },
  {
    key: 'certificates',
    label: 'Sertifikat',
    kind: 'list',
    titleKey: 'title',
    subKey: 'issuer',
    fields: [
      { key: 'title', label: 'Nama sertifikat', type: 'text' },
      { key: 'issuer', label: 'Penerbit', type: 'text' },
      { key: 'year', label: 'Tahun', type: 'text' },
      { key: 'url', label: 'Link sertifikat', type: 'url' },
    ],
  },
]

export function blankItem(schema: SectionSchema) {
  const item: Record<string, any> = { id: `${schema.key}-${Date.now().toString(36)}` }
  for (const f of schema.fields) {
    item[f.key] = f.type === 'tags' || f.type === 'links' ? [] : f.type === 'checkbox' ? false : ''
  }
  if (schema.key === 'posts') item.date = new Date().toISOString().slice(0, 10)
  return item
}
