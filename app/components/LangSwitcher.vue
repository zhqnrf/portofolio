<script setup lang="ts">
import { LANGS, type LangCode } from '~/utils/i18n'

const { lang, info, t, setLang } = useLang()
const open = ref(false)
const root = ref<HTMLElement | null>(null)

function choose(code: LangCode) {
  setLang(code)
  open.value = false
}
function onDoc(e: MouseEvent) {
  if (open.value && root.value && !root.value.contains(e.target as Node)) open.value = false
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}
onMounted(() => {
  document.addEventListener('click', onDoc)
  document.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDoc)
  document.removeEventListener('keydown', onKey)
})
</script>

<template>
  <div ref="root" class="lang">
    <button
      type="button"
      class="lang-btn"
      :aria-label="t('lang.label')"
      :title="t('lang.label')"
      aria-haspopup="listbox"
      :aria-expanded="open"
      @click="open = !open"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2" />
        <path d="M3 12h18M12 3c2.6 2.6 3.9 5.6 3.9 9s-1.3 6.4-3.9 9c-2.6-2.6-3.9-5.6-3.9-9S9.4 5.6 12 3Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
      </svg>
      <span>{{ info.short }}</span>
    </button>
    <ul v-if="open" class="menu" role="listbox" :aria-label="t('lang.label')">
      <li v-for="l in LANGS" :key="l.code">
        <button
          type="button"
          role="option"
          :aria-selected="lang === l.code"
          :class="{ on: lang === l.code }"
          :lang="l.code"
          :dir="l.dir"
          @click="choose(l.code)"
        >
          <span class="name">{{ l.label }}</span>
          <span class="code">{{ l.short }}</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.lang { position: relative; }
.lang-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 38px;
  padding: 0 12px 0 10px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--bg);
  color: var(--ink);
  font: inherit;
  font-family: var(--f-mono);
  font-size: 12px;
  font-weight: 500;
  transition: border-color .2s, background-color .3s;
}
.lang-btn:hover, .lang-btn[aria-expanded='true'] { border-color: var(--teal); }
.lang-btn svg { width: 17px; height: 17px; }
.menu {
  position: absolute;
  top: calc(100% + 8px);
  inset-inline-end: 0;
  min-width: 200px;
  margin: 0;
  padding: 6px;
  list-style: none;
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: 14px;
  box-shadow: 0 18px 40px -18px rgba(0, 0, 0, .35);
  z-index: 70;
}
.menu button {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 9px 12px;
  border: 0;
  border-radius: 9px;
  background: transparent;
  color: var(--text);
  font-size: 14px;
  text-align: start;
}
.menu button:hover { background: var(--soft); color: var(--ink); }
.menu button.on { color: var(--ink); font-weight: 700; background: var(--soft); }
.menu button.on .code { color: var(--teal); }
.code { font-family: var(--f-mono); font-size: 11px; color: var(--muted); }
</style>
