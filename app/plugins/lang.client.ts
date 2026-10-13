// Terapkan bahasa pilihan pengunjung setelah halaman selesai dihidrasi (hindari hydration mismatch)
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', () => {
    const { lang, setLang, preferredLang, applyToDocument } = useLang()
    const wanted = preferredLang()
    if (wanted !== lang.value) setLang(wanted)
    else applyToDocument(wanted)
  })
})
