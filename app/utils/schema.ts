// Definisi form untuk halaman /admin. Tambah field di sini kalau mau kolom baru.
export type FieldType = 'text' | 'textarea' | 'tags' | 'links' | 'url'

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
      { key: 'description', label: 'Deskripsi', type: 'textarea' },
      { key: 'tags', label: 'Teknologi', type: 'tags' },
      { key: 'link', label: 'Link', type: 'url' },
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
      { key: 'image', label: 'Gambar (URL)', type: 'url', hint: 'Bisa link gambar online, atau taruh file di folder public/ lalu tulis /nama-file.png' },
      { key: 'links', label: 'Link', type: 'links', hint: 'Link pertama dipakai saat kartu diklik.' },
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
  for (const f of schema.fields) item[f.key] = f.type === 'tags' || f.type === 'links' ? [] : ''
  return item
}
