import { DEFAULT_LANG, LANGS, MESSAGES, type LangCode } from '~/utils/i18n'

const STORAGE_KEY = 'lang'
const loadedFonts = new Set<string>()

export function useLang() {
  // Halaman di-prerender dalam bahasa default; pilihan pengunjung diterapkan setelah halaman tampil
  const lang = useState<LangCode>('lang', () => DEFAULT_LANG)
  const info = computed(() => LANGS.find((l) => l.code === lang.value) ?? LANGS[1]!)

  function t(key: string, vars: Record<string, string | number> = {}) {
    const raw = MESSAGES[lang.value]?.[key] ?? MESSAGES.en[key] ?? key
    return raw.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''))
  }

  function applyToDocument(code: LangCode) {
    if (!import.meta.client) return
    const l = LANGS.find((x) => x.code === code)
    if (!l) return
    document.documentElement.lang = code
    document.documentElement.dir = l.dir
    if (l.font && !loadedFonts.has(l.font)) {
      loadedFonts.add(l.font)
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = `https://fonts.googleapis.com/css2?family=${l.font}&display=swap`
      document.head.appendChild(link)
    }
  }

  function setLang(code: LangCode) {
    lang.value = code
    applyToDocument(code)
    try {
      localStorage.setItem(STORAGE_KEY, code)
    } catch {}
  }

  /** Pilihan tersimpan, atau bahasa browser kalau termasuk 6 bahasa yang didukung */
  function preferredLang(): LangCode {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as LangCode | null
      if (saved && MESSAGES[saved]) return saved
    } catch {}
    for (const n of navigator.languages ?? [navigator.language]) {
      const base = n.toLowerCase().split('-')[0] as LangCode
      if (MESSAGES[base]) return base
    }
    return DEFAULT_LANG
  }

  return { lang, info, t, setLang, preferredLang, applyToDocument }
}

/** Profil dengan teks yang sudah disesuaikan bahasa (jatuh ke versi Inggris kalau kosong) */
export function localizeProfile(profile: Record<string, any>, i18n: Record<string, any> | undefined, code: LangCode) {
  if (code === 'en' || !i18n) return profile
  const out = { ...profile }
  for (const f of ['role', 'tagline', 'about', 'location']) {
    const v = i18n[`${f}_${code}`]
    if (v && String(v).trim()) out[f] = v
  }
  return out
}
