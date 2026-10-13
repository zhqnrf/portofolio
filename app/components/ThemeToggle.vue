<script setup lang="ts">
// Tombol ganti mode terang/gelap. Default mengikuti sistem; pilihan disimpan di browser.
const dark = ref(false)

function effectiveDark() {
  const set = document.documentElement.getAttribute('data-theme')
  if (set) return set === 'dark'
  return matchMedia('(prefers-color-scheme: dark)').matches
}

onMounted(() => {
  dark.value = effectiveDark()
})

function toggle() {
  dark.value = !dark.value
  const theme = dark.value ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', theme)
  try {
    localStorage.setItem('theme', theme)
  } catch {}
}
</script>

<template>
  <button
    type="button"
    class="theme-toggle"
    :aria-label="dark ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'"
    :title="dark ? 'Mode terang' : 'Mode gelap'"
    @click="toggle"
  >
    <svg viewBox="0 0 24 24" aria-hidden="true" :class="{ dark }">
      <g class="sun" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
      </g>
      <path class="moon" fill="currentColor" d="M20.2 14.6A8.5 8.5 0 0 1 9.4 3.8a8.5 8.5 0 1 0 10.8 10.8Z" />
    </svg>
  </button>
</template>

<style scoped>
.theme-toggle {
  display: inline-grid;
  place-items: center;
  width: 38px;
  height: 38px;
  padding: 0;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--bg);
  color: var(--ink);
  transition: border-color .2s, transform .2s, background-color .3s;
}
.theme-toggle:hover { border-color: var(--teal); transform: rotate(-12deg); }
svg { width: 18px; height: 18px; overflow: visible; }
.sun, .moon { transform-origin: center; transform-box: fill-box; transition: opacity .3s, transform .45s cubic-bezier(.3, 1.4, .5, 1); }
.moon { opacity: 0; transform: rotate(-60deg) scale(.4); }
.dark .sun { opacity: 0; transform: rotate(90deg) scale(.4); }
.dark .moon { opacity: 1; transform: none; }
</style>
