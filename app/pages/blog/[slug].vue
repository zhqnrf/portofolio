<script setup lang="ts">
import { formatDate, publishedPosts, readingMinutes, renderMarkdown } from '~/utils/markdown'

const route = useRoute()
const { info, t } = useLang()
const { data } = await useFetch<Record<string, any>>('/api/content', { key: 'content' })
const all = computed(() => publishedPosts(data.value?.posts))
const post = computed(() => all.value.find((p) => p.slug === route.params.slug))
const html = computed(() => renderMarkdown(post.value?.body ?? ''))
// Info penulis mengikuti bahasa artikel (Indonesia)
const profile = computed(() => localizeProfile(data.value?.profile ?? {}, data.value?.profileI18n, 'id'))
const others = computed(() => all.value.filter((p) => p.slug !== route.params.slug).slice(0, 2))

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Tulisan tidak ditemukan', fatal: true })
}

useHead(() => ({
  title: `${post.value?.title} — ${profile.value.name}`,
  meta: [
    { name: 'description', content: post.value?.excerpt ?? '' },
    { property: 'og:title', content: post.value?.title ?? '' },
    { property: 'og:description', content: post.value?.excerpt ?? '' },
    ...(post.value?.cover ? [{ property: 'og:image', content: post.value.cover }] : []),
  ],
}))

// Garis progres baca — diubah langsung di DOM supaya artikel tidak di-render ulang saat scroll
const bar = ref<HTMLElement | null>(null)
let frame = 0
function onScroll() {
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(() => {
    const h = document.documentElement
    const max = h.scrollHeight - h.clientHeight
    const p = max > 0 ? Math.min(1, h.scrollTop / max) : 0
    if (bar.value) bar.value.style.width = `${(p * 100).toFixed(2)}%`
  })
}
onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <div v-if="post">
    <div ref="bar" class="progress" aria-hidden="true" />
    <div class="wrap">
      <SiteHeader />

      <article lang="id" dir="ltr">
        <header class="head">
          <NuxtLink to="/blog" class="back label">{{ t('blog.allPosts') }}</NuxtLink>
          <div class="meta label">
            <time :datetime="post.date">{{ formatDate(post.date, info.locale) }}</time>
            <span>·</span>
            <span>{{ t('common.minRead', { n: readingMinutes(post.body) }) }}</span>
          </div>
          <h1>{{ post.title }}</h1>
          <p v-if="post.excerpt" class="excerpt">{{ post.excerpt }}</p>
          <div class="byline">
            <LogoCat :size="36" :interactive="false" />
            <div>
              <strong>{{ profile.name }}</strong>
              <span>{{ profile.role }} · {{ profile.location }}</span>
            </div>
          </div>
        </header>

        <figure v-if="post.cover" class="cover">
          <img :src="post.cover" :alt="post.title">
        </figure>

        <div class="prose body" v-html="html" />

        <footer class="post-foot">
          <div v-if="post.tags?.length" class="chips"><span v-for="t in post.tags" :key="t" class="chip">{{ t }}</span></div>
        </footer>
      </article>

      <aside v-if="others.length" class="more">
        <span class="label">{{ t('blog.more') }}</span>
        <NuxtLink v-for="p in others" :key="p.slug" :to="`/blog/${p.slug}`" class="more-item">
          <strong>{{ p.title }}</strong>
          <span class="label">{{ formatDate(p.date, info.locale) }}</span>
        </NuxtLink>
      </aside>

      <footer class="foot">© {{ new Date().getFullYear() }} {{ profile.name }}</footer>
    </div>
  </div>
</template>

<style scoped>
.progress {
  position: fixed; top: 0; left: 0; width: 0; height: 3px; z-index: 50; pointer-events: none;
  background: var(--grad);
}
.wrap { max-width: 980px; margin: 0 auto; padding-inline: 24px; }
article { max-width: 720px; margin: 0 auto; }
.head { padding-block: 32px 36px; display: grid; gap: 14px; }
.back { width: max-content; transition: color .2s; }
.back:hover { color: var(--ink); }
.meta { display: flex; gap: 8px; margin-top: 8px; }
h1 { margin: 0; font-size: clamp(32px, 5vw, 48px); font-weight: 800; line-height: 1.1; letter-spacing: -0.035em; }
.excerpt { margin: 0; font-size: 19px; line-height: 1.6; color: var(--text); }
.byline { display: flex; align-items: center; gap: 12px; margin-top: 8px; }
.byline strong { display: block; color: var(--ink); font-size: 14px; }
.byline span { font-size: 13px; color: var(--muted); }

.cover { margin: 0 0 44px; }
.cover img { width: 100%; height: auto; border-radius: 16px; border: 1px solid var(--line); }
@media (min-width: 900px) { .cover { margin-inline: -60px; } }

.post-foot { margin-top: 48px; padding-top: 24px; border-top: 1px solid var(--line); }

.more { max-width: 720px; margin: 64px auto 0; display: grid; gap: 4px; }
.more-item { display: flex; justify-content: space-between; gap: 16px; padding-block: 14px; border-bottom: 1px solid var(--line); }
.more-item strong { color: var(--ink); transition: color .2s; }
.more-item:hover strong { color: var(--teal); }
.foot { max-width: 720px; margin: 0 auto; padding-block: 80px 48px; font-size: 13px; color: var(--muted); }
</style>
