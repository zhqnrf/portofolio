<script setup lang="ts">
// Header ringkas untuk halaman selain beranda (blog, arsip proyek)
const { data } = await useFetch<Record<string, any>>('/api/content', { key: 'content' })
const name = computed(() => data.value?.profile?.name ?? '')
const route = useRoute()
const { t } = useLang()
const links = [
  { to: '/', key: 'header.home' },
  { to: '/projects', key: 'header.projects' },
  { to: '/blog', key: 'header.blog' },
]
const isActive = (to: string) => (to === '/' ? route.path === '/' : route.path.startsWith(to))
</script>

<template>
  <header class="site-header">
    <NuxtLink to="/" class="brand">
      <LogoCat :size="34" :interactive="false" />
      <span>{{ name }}</span>
    </NuxtLink>
    <div class="right">
      <nav aria-label="Main">
        <NuxtLink v-for="l in links" :key="l.to" :to="l.to" :class="{ active: isActive(l.to) }">{{ t(l.key) }}</NuxtLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px 24px;
  padding-block: 28px;
}
.brand { display: inline-flex; align-items: center; gap: 12px; font-weight: 800; color: var(--ink); letter-spacing: -0.01em; }
.right { display: flex; align-items: center; gap: 22px; padding-inline-end: 120px; }
nav { display: flex; gap: 22px; }
nav a {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
  padding-block: 4px;
  border-bottom: 2px solid transparent;
  transition: color .2s, border-color .2s;
}
nav a:hover { color: var(--ink); }
nav a.active { color: var(--ink); border-image: var(--grad) 1; }
</style>
