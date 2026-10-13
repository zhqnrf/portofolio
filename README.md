# Portfolio — Zhaqian Rouf Alfauzi

Portofolio pribadi berbasis Nuxt 4. Semua isi (profil, pengalaman, proyek, dll.) disimpan di
[`data/content.json`](data/content.json) dan bisa diedit lewat halaman **`/admin`**.

## Menjalankan di lokal

Butuh **Node.js 20.19+** (Nuxt 4 tidak jalan di Node 18).

```bash
npm install
cp .env.example .env   # lalu isi password admin
npm run dev
```

- Situs: http://localhost:3000
- Admin: http://localhost:3000/admin (password dari `NUXT_ADMIN_PASSWORD` di `.env`)

## Alur update konten

1. Jalankan `npm run dev`, buka `/admin`, tambah/edit/hapus/urutkan isi, klik **Simpan**.
2. Perubahan langsung tertulis ke `data/content.json`.
3. Commit dan push ke GitHub. Hosting (Vercel/Netlify) akan build ulang otomatis.

```bash
git add data/content.json
git commit -m "Update konten"
git push
```

## Blog

- Tulis di `/admin` → tab **Blog** → **+ Tambah**. Isi tulisan pakai Markdown, dengan toolbar
  (tebal, judul, kutipan, daftar, kode, link) dan tombol **🖼 Gambar** untuk menyisipkan gambar.
- Gambar sampul dan gambar di dalam tulisan disimpan ke `public/uploads/<tahun>/`, jadi ikut
  ter-commit bersama `data/content.json`.
- Nyalakan **Tampilkan di situs** supaya tulisan muncul; kalau mati, tulisan jadi draf.
- Halaman: `/blog` (daftar) dan `/blog/<slug>` (artikel). Arsip semua proyek ada di `/projects`.

## Bahasa

- Situs tersedia dalam Bahasa Indonesia, English, 日本語, 한국어, 中文, dan العربية (kanan-ke-kiri).
  Pengunjung memilih lewat tombol 🌐 di pojok kanan atas; awalnya mengikuti bahasa browser.
- Teks tampilan (menu, judul bagian, tombol) ada di `app/utils/i18n.ts`.
- Profil dasar ditulis dalam bahasa Inggris (tab **Profil**). Versi bahasa lain diisi di tab
  **Profil (terjemahan)**; kolom yang kosong otomatis memakai versi Inggris.
- Pengalaman, proyek, dan artikel blog tetap dalam bahasa aslinya.

## Deploy gratis

Situs dibangun sebagai halaman statis (`npm run generate`), jadi bisa di-hosting gratis:

- **Vercel / Netlify**: import repo dari GitHub, build command `npm run generate`,
  output `.output/public`. Keduanya mengenali Nuxt otomatis.
- Halaman `/admin` hanya untuk dipakai di lokal. Di situs yang sudah online, admin tidak bisa
  menyimpan karena situsnya statis.

## Struktur

```
app/pages/index.vue        halaman portofolio
app/pages/admin.vue        panel admin (CRUD)
app/utils/schema.ts        daftar field tiap bagian di admin
server/api/                API baca/simpan konten + login
data/content.json          isi portofolio
app/components/LogoCat.vue logo SVG (hover = jadi kucing)
scripts/make-cursors.mjs   generator kursor kepala kucing pixel
```
