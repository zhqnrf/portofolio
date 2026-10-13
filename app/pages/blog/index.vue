<script setup lang="ts">
import { formatDate, publishedPosts, readingMinutes } from '~/utils/markdown'

const { data } = await useFetch<Record<string, any>>('/api/content', { key: 'content' })
const posts = computed(() => publishedPosts(data.value?.posts))
const name = computed(() => data.value?.profile?.name ?? '')

useHead(() => ({
  title: `Blog — ${name.value}`,
  meta: [{ name: 'description', content: `Tulisan ${name.value} tentang web, software, dan pengalaman kerja.` }],
}))
</script>

<template>
  <div class="wrap">
    <SiteHeader />

    <main>
      <header class="intro">
        <span class="label">Blog</span>
        <h1>Catatan dari <span class="grad-text">balik layar.</span></h1>
        <p>Tulisan tentang web, software, dan hal-hal yang aku pelajari waktu membangun sistem untuk orang sungguhan.</p>
      </header>

      <p v-if="!posts.length" class="empty">Belum ada tulisan. Tulisan pertama sedang disiapkan.</p>

      <ul v-else class="posts">
        <li v-for="(p, i) in posts" :key="p.slug" class="post" :class="{ featured: i === 0 }">
          <NuxtLink :to="`/blog/${p.slug}`" class="post-link">
            <div class="cover">
              <img v-if="p.cover" :src="p.cover" :alt="p.title" loading="lazy">
              <span v-else class="cover-fallback">{{ p.title?.[0] }}</span>
            </div>
            <div class="post-body">
              <div class="meta label">
                <time :datetime="p.date">{{ formatDate(p.date) }}</time>
                <span>·</span>
                <span>{{ readingMinutes(p.body) }} min read</span>
              </div>
              <h2>{{ p.title }}</h2>
              <p>{{ p.excerpt }}</p>
              <div v-if="p.tags?.length" class="chips"><span v-for="t in p.tags" :key="t" class="chip">{{ t }}</span></div>
            </div>
          </NuxtLink>
        </li>
      </ul>
    </main>

    <footer class="foot">© {{ new Date().getFullYear() }} {{ name }}</footer>
  </div>
</template>

<style scoped>
.wrap { max-width: 980px; margin: 0 auto; padding-inline: 24px; }
.intro { padding-block: 40px 48px; max-width: 40em; }
.intro h1 { margin: 10px 0 14px; font-size: clamp(34px, 5vw, 52px); font-weight: 800; line-height: 1.08; letter-spacing: -0.035em; }
.intro p { margin: 0; font-size: 17px; }
.empty { color: var(--muted); }

.posts { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 40px 32px; }
.post.featured { grid-column: 1 / -1; }
.post-link { display: grid; gap: 18px; }
.featured .post-link { grid-template-columns: 1.25fr 1fr; gap: 32px; align-items: center; }
.post-link > * { min-width: 0; }
.cover { aspect-ratio: 16 / 9; border-radius: 14px; overflow: hidden; border: 1px solid var(--line); background: var(--grad); }
.cover img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s cubic-bezier(.2, .8, .2, 1); }
.cover-fallback { display: grid; place-items: center; height: 100%; color: #ffffff; font-size: 48px; font-weight: 800; }
.post-link:hover .cover img { transform: scale(1.04); }
.post-body { display: grid; gap: 10px; align-content: start; }
.meta { display: flex; gap: 8px; }
.post-body h2 { margin: 0; font-size: 22px; line-height: 1.3; letter-spacing: -0.02em; transition: color .2s; }
.featured .post-body h2 { font-size: clamp(24px, 3vw, 32px); }
.post-body p { margin: 0; }
.post-link:hover h2 { color: var(--teal); }

.foot { padding-block: 80px 48px; font-size: 13px; color: var(--muted); }

@media (max-width: 760px) {
  .posts { grid-template-columns: 1fr; }
  .featured .post-link { grid-template-columns: 1fr; gap: 18px; }
}
</style>
