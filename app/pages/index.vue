<script setup lang="ts">
import { formatDate, publishedPosts, readingMinutes } from '~/utils/markdown'

const { data } = await useFetch<Record<string, any>>('/api/content', { key: 'content' })
const posts = computed(() => publishedPosts(data.value?.posts))
const lines = (text: string) => String(text || '').split('\n').map((l) => l.replace(/^[•\-*]\s*/, '').trim()).filter(Boolean)

const profile = computed(() => data.value?.profile ?? {})
const skills = computed(() => data.value?.skills ?? {})
const list = (key: string) => computed<any[]>(() => data.value?.[key] ?? [])
const experience = list('experience')
const projects = list('projects')
const education = list('education')
const events = list('events')
const organizations = list('organizations')
const achievements = list('achievements')
const certificates = list('certificates')
const publications = list('publications')

const authorList = (s: string) => String(s || '').split(',').map((a) => a.trim()).filter(Boolean)
const isMe = (a: string) => {
  const last = String(profile.value.name || '').trim().split(/\s+/).pop()?.toLowerCase()
  return !!last && a.toLowerCase().includes(last)
}

const aboutParagraphs = computed<string[]>(() =>
  String(profile.value.about ?? '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
)

const nav = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'writing', label: 'Writing' },
  { id: 'activities', label: 'Activities' },
  { id: 'publications', label: 'Publications' },
  { id: 'awards', label: 'Awards' },
]

useHead(() => ({
  title: profile.value.name ? `${profile.value.name} — ${profile.value.role}` : 'Portfolio',
  meta: [{ name: 'description', content: profile.value.tagline ?? '' }],
}))

const initials = (t: string) =>
  String(t || '?').split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase()

// Nav aktif mengikuti section yang sedang terlihat
const active = ref('about')
const root = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

function onMove(e: PointerEvent) {
  root.value?.style.setProperty('--mx', `${e.clientX}px`)
  root.value?.style.setProperty('--my', `${e.clientY}px`)
}

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) if (entry.isIntersecting) active.value = entry.target.id
    },
    { rootMargin: '-35% 0px -60% 0px' },
  )
  nav.forEach((n) => {
    const el = document.getElementById(n.id)
    if (el) observer!.observe(el)
  })
  window.addEventListener('pointermove', onMove, { passive: true })
})
onBeforeUnmount(() => {
  observer?.disconnect()
  window.removeEventListener('pointermove', onMove)
})
</script>

<template>
  <div ref="root" class="page">
    <div class="spotlight" aria-hidden="true" />

    <div class="shell">
      <!-- KIRI: header sticky -->
      <header class="side">
        <div>
          <div class="logo">
            <LogoCat :size="60" />
          </div>
          <h1 class="name">{{ profile.name }}</h1>
          <h2 class="role grad-text">{{ profile.role }}</h2>
          <p class="tagline">{{ profile.tagline }}</p>

          <nav class="nav" aria-label="Sections">
            <a
              v-for="n in nav"
              :key="n.id"
              :href="`#${n.id}`"
              :class="{ active: active === n.id }"
            >
              <span class="nav-line" />
              <span class="nav-text">{{ n.label }}</span>
            </a>
          </nav>
        </div>

        <ul class="socials">
          <li v-if="profile.github">
            <a :href="profile.github" target="_blank" rel="noopener" aria-label="GitHub"><Icon name="github" /></a>
          </li>
          <li v-if="profile.linkedin">
            <a :href="profile.linkedin" target="_blank" rel="noopener" aria-label="LinkedIn"><Icon name="linkedin" /></a>
          </li>
          <li v-if="profile.email">
            <a :href="`mailto:${profile.email}`" aria-label="Email"><Icon name="mail" /></a>
          </li>
          <li v-if="profile.whatsapp">
            <a :href="`https://wa.me/${profile.whatsapp}`" target="_blank" rel="noopener" aria-label="WhatsApp"><Icon name="whatsapp" /></a>
          </li>
        </ul>
      </header>

      <!-- KANAN: konten -->
      <main class="content">
        <section id="about" class="section" aria-label="About me">
          <h3 class="sec-title">About</h3>
          <p v-for="(p, i) in aboutParagraphs" :key="i" class="about-p">{{ p }}</p>

          <div class="skill-groups">
            <div v-if="skills.tech?.length" class="skill-group">
              <span class="label">Tech</span>
              <div class="chips"><span v-for="s in skills.tech" :key="s" class="chip">{{ s }}</span></div>
            </div>
            <div v-if="skills.soft?.length" class="skill-group">
              <span class="label">Soft skills</span>
              <div class="chips"><span v-for="s in skills.soft" :key="s" class="chip plain">{{ s }}</span></div>
            </div>
            <div v-if="skills.languages?.length" class="skill-group">
              <span class="label">Languages</span>
              <div class="chips"><span v-for="s in skills.languages" :key="s" class="chip plain">{{ s }}</span></div>
            </div>
          </div>

          <div v-if="education.length" class="edu">
            <span class="label">Education</span>
            <div v-for="e in education" :key="e.id" class="edu-row">
              <div class="edu-head">
                <strong>{{ e.school }}</strong>
                <span class="label">{{ e.period }}</span>
              </div>
              <div class="edu-sub">{{ e.major }}<template v-if="e.score"> · <span class="grad-text edu-score">{{ e.score }}</span></template></div>
              <p v-if="e.description" class="edu-desc">{{ e.description }}</p>
            </div>
          </div>
        </section>

        <section id="experience" class="section" aria-label="Work experience">
          <h3 class="sec-title">Experience</h3>
          <ol class="items">
            <li v-for="x in experience" :key="x.id" class="item">
              <div class="item-bg" />
              <span class="item-when label">{{ x.period }}</span>
              <div class="item-body">
                <h3 class="item-title">
                  <component :is="x.link ? 'a' : 'span'" :href="x.link || undefined" :target="x.link ? '_blank' : undefined" rel="noopener" :class="{ 'stretch': x.link }">
                    {{ x.role }} · <span class="org">{{ x.org }}</span>
                    <Icon v-if="x.link" name="arrow" class="arrow" />
                  </component>
                </h3>
                <div v-if="x.location" class="label project-meta">{{ x.location }}</div>
                <ul v-if="lines(x.description).length > 1" class="item-points">
                  <li v-for="(l, i) in lines(x.description)" :key="i">{{ l }}</li>
                </ul>
                <p v-else class="item-desc">{{ x.description }}</p>
                <div v-if="x.tags?.length" class="chips"><span v-for="t in x.tags" :key="t" class="chip">{{ t }}</span></div>
              </div>
            </li>
          </ol>
          <a v-if="profile.resume" :href="profile.resume" target="_blank" rel="noopener" class="more-link">
            View full résumé <Icon name="arrow" />
          </a>
        </section>

        <section id="projects" class="section" aria-label="Selected projects">
          <h3 class="sec-title">Projects</h3>
          <ul class="items">
            <li v-for="p in projects.slice(0, 6)" :key="p.id" class="item project">
              <div class="item-bg" />
              <div class="thumb">
                <img v-if="p.image" :src="p.image" :alt="p.title" loading="lazy">
                <span v-else class="thumb-fallback">{{ initials(p.title) }}</span>
              </div>
              <div class="item-body">
                <h3 class="item-title">
                  <component :is="p.links?.[0]?.url ? 'a' : 'span'" :href="p.links?.[0]?.url || undefined" :target="p.links?.[0]?.url ? '_blank' : undefined" rel="noopener" :class="{ 'stretch': p.links?.[0]?.url }">
                    {{ p.title }}
                    <Icon v-if="p.links?.[0]?.url" name="arrow" class="arrow" />
                  </component>
                </h3>
                <div class="label project-meta">{{ p.role }}<template v-if="p.year"> · {{ p.year }}</template></div>
                <p class="item-desc">{{ p.description }}</p>
                <div v-if="p.links?.length > 1" class="links">
                  <a v-for="l in p.links" :key="l.url" :href="l.url" target="_blank" rel="noopener">{{ l.label }} <Icon name="arrow" /></a>
                </div>
                <div v-if="p.tags?.length" class="chips"><span v-for="t in p.tags" :key="t" class="chip">{{ t }}</span></div>
              </div>
            </li>
          </ul>
          <NuxtLink to="/projects" class="more-link">
            View all {{ projects.length }} projects <Icon name="arrow" />
          </NuxtLink>
        </section>

        <section id="writing" class="section" aria-label="Latest writing">
          <h3 class="sec-title">Writing</h3>
          <p v-if="!posts.length" class="item-desc">Belum ada tulisan.</p>
          <ul v-else class="items">
            <li v-for="p in posts.slice(0, 3)" :key="p.slug" class="item project">
              <div class="item-bg" />
              <div class="thumb">
                <img v-if="p.cover" :src="p.cover" :alt="p.title" loading="lazy">
                <span v-else class="thumb-fallback">{{ initials(p.title) }}</span>
              </div>
              <div class="item-body">
                <h3 class="item-title">
                  <NuxtLink :to="`/blog/${p.slug}`" class="stretch">
                    {{ p.title }} <Icon name="arrow" class="arrow" />
                  </NuxtLink>
                </h3>
                <div class="label project-meta">{{ formatDate(p.date) }} · {{ readingMinutes(p.body) }} min read</div>
                <p class="item-desc">{{ p.excerpt }}</p>
              </div>
            </li>
          </ul>
          <NuxtLink to="/blog" class="more-link">
            Read the blog <Icon name="arrow" />
          </NuxtLink>
        </section>

        <section id="activities" class="section" aria-label="Events and organizations">
          <h3 class="sec-title">Activities</h3>
          <ol class="items">
            <li v-for="ev in events" :key="ev.id" class="item">
              <div class="item-bg" />
              <span class="item-when label">{{ ev.year }}</span>
              <div class="item-body">
                <h3 class="item-title">
                  <component :is="ev.link ? 'a' : 'span'" :href="ev.link || undefined" :target="ev.link ? '_blank' : undefined" rel="noopener" :class="{ 'stretch': ev.link }">
                    {{ ev.title }}
                    <Icon v-if="ev.link" name="arrow" class="arrow" />
                  </component>
                </h3>
                <div class="label project-meta">{{ ev.role }}</div>
                <p class="item-desc">{{ ev.description }}</p>
              </div>
            </li>
          </ol>

          <div v-if="organizations.length" class="table-block">
            <span class="label">Organizations</span>
            <ul class="rows">
              <li v-for="o in organizations" :key="o.id" class="row">
                <span class="label row-when">{{ o.period }}</span>
                <span class="row-main"><strong>{{ o.role }}</strong> · {{ o.org }}</span>
              </li>
            </ul>
          </div>
        </section>

        <section v-if="publications.length" id="publications" class="section" aria-label="Publications">
          <h3 class="sec-title">Publications</h3>
          <ol class="items">
            <li v-for="pub in publications" :key="pub.id" class="item">
              <div class="item-bg" />
              <span class="item-when label">{{ pub.year }}</span>
              <div class="item-body">
                <h3 class="item-title">
                  <component :is="pub.link ? 'a' : 'span'" :href="pub.link || undefined" :target="pub.link ? '_blank' : undefined" rel="noopener" :class="{ 'stretch': pub.link }">
                    {{ pub.title }}
                    <Icon v-if="pub.link" name="arrow" class="arrow" />
                  </component>
                </h3>
                <div class="pub-authors">
                  <template v-for="(a, i) in authorList(pub.authors)" :key="i">
                    <strong v-if="isMe(a)">{{ a }}</strong><span v-else>{{ a }}</span><span v-if="i < authorList(pub.authors).length - 1">, </span>
                  </template>
                </div>
                <div class="label project-meta">{{ pub.venue }}</div>
                <p v-if="pub.summary" class="item-desc">{{ pub.summary }}</p>
                <div v-if="pub.tags?.length" class="chips"><span v-for="t in pub.tags" :key="t" class="chip">{{ t }}</span></div>
              </div>
            </li>
          </ol>
        </section>

        <section id="awards" class="section" aria-label="Achievements and certificates">
          <h3 class="sec-title">Awards</h3>
          <div class="table-block first">
            <span class="label">Achievements</span>
            <ul class="rows">
              <li v-for="a in achievements" :key="a.id" class="row">
                <span class="label row-when">{{ a.year }}</span>
                <span class="row-main">{{ a.title }}</span>
              </li>
            </ul>
          </div>
          <div v-if="certificates.length" class="table-block">
            <span class="label">Certificates</span>
            <ul class="rows">
              <li v-for="c in certificates" :key="c.id" class="row">
                <span class="label row-when">{{ c.year || '—' }}</span>
                <span class="row-main">
                  <component :is="c.url ? 'a' : 'span'" :href="c.url || undefined" target="_blank" rel="noopener" :class="{ 'cert-link': c.url }">
                    <strong>{{ c.title }}</strong>
                    <Icon v-if="c.url" name="arrow" class="arrow" />
                  </component>
                  <span class="row-sub">{{ c.issuer }}</span>
                </span>
              </li>
            </ul>
          </div>
        </section>

        <section class="contact" aria-label="Contact">
          <h3 class="contact-title">Let's work <span class="grad-text">together.</span></h3>
          <p>Have a project, an internship, or just want to say hi? My inbox is open.</p>
          <div class="contact-actions">
            <a v-if="profile.email" :href="`mailto:${profile.email}`" class="btn"><Icon name="mail" /> {{ profile.email }}</a>
            <a v-if="profile.whatsapp" :href="`https://wa.me/${profile.whatsapp}`" target="_blank" rel="noopener" class="btn ghost"><Icon name="whatsapp" /> {{ profile.phone || 'WhatsApp' }}</a>
          </div>
        </section>

        <footer class="foot">
          Designed and built by {{ profile.name }} with Nuxt. Based in {{ profile.location }}.
        </footer>
      </main>
    </div>
  </div>
</template>

<style scoped>
.page { position: relative; min-height: 100vh; }

/* Cahaya lembut mengikuti kursor */
.spotlight {
  pointer-events: none;
  position: fixed;
  inset: 0;
  z-index: 0;
  background: radial-gradient(560px circle at var(--mx, -999px) var(--my, -999px), var(--tint), transparent 70%);
}

.shell {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding-inline: 24px;
}

/* ---------- Sidebar ---------- */
.side { padding-block: 56px 16px; }
.logo { margin-bottom: 22px; width: max-content; }
.name {
  margin: 0;
  font-size: clamp(36px, 5vw, 50px);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.035em;
}
.role {
  margin: 12px 0 0;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.01em;
  display: inline-block;
}
.tagline { margin: 16px 0 0; max-width: 21em; color: var(--text); }

.nav { display: none; }
.socials { list-style: none; padding: 0; margin: 32px 0 0; display: flex; gap: 20px; }
.socials a { display: grid; place-items: center; font-size: 22px; color: var(--muted); transition: color .2s, transform .2s; }
.socials a:hover { color: var(--ink); transform: translateY(-2px); }
.socials { align-items: center; }

/* ---------- Konten ---------- */
.content { padding-block: 24px 64px; }
.section { padding-block: 24px 40px; scroll-margin-top: 24px; }
.sec-title {
  position: sticky;
  top: 0;
  z-index: 5;
  margin: 0 -24px 20px;
  padding: 16px 24px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  background: color-mix(in srgb, var(--bg) 88%, transparent);
  backdrop-filter: blur(8px);
}

.about-p { margin: 0 0 16px; max-width: 38em; }
.about-p:first-of-type::first-letter { color: var(--ink); }

.chips { display: flex; flex-wrap: wrap; gap: 6px; }
.skill-groups { display: grid; gap: 18px; margin-top: 32px; }
.skill-group { display: grid; gap: 8px; }

.edu { margin-top: 36px; display: grid; gap: 16px; }
.edu-row { padding: 16px 18px; border: 1px solid var(--line); border-radius: var(--radius); background: var(--bg); }
.edu-head { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 4px 16px; color: var(--ink); }
.edu-sub { font-size: 15px; margin-top: 2px; }
.edu-score { font-weight: 700; }
.edu-desc { margin: 8px 0 0; font-size: 14px; color: var(--muted); }

/* Item list ala Brittany: hover menyorot satu, yang lain meredup */
.items { list-style: none; margin: 0; padding: 0; display: grid; gap: 40px; }
.item { position: relative; display: grid; gap: 6px; transition: opacity .25s; }
.item > * { min-width: 0; position: relative; }
.item-bg {
  position: absolute !important;
  inset: -16px;
  border-radius: var(--radius);
  transition: background .25s, box-shadow .25s;
  z-index: 0;
}
.item-when { padding-top: 3px; z-index: 1; }
.item-body { z-index: 1; display: grid; gap: 8px; }
.item-title { margin: 0; font-size: 17px; font-weight: 700; line-height: 1.35; }
.item-title a, .item-title span { display: inline; }
.org { color: var(--teal); }
.arrow { display: inline-block; vertical-align: -2px; margin-left: 3px; font-size: 14px; transition: transform .2s; }
.item-desc { margin: 0; font-size: 15px; }
.item-points { margin: 0; padding-left: 18px; display: grid; gap: 6px; font-size: 15px; }
.item-points li::marker { color: var(--teal); }
.pub-authors { font-size: 14px; color: var(--muted); }
.pub-authors strong { color: var(--ink); font-weight: 700; }
.project-meta { margin-top: -4px; }

.stretch::after { content: ''; position: absolute; inset: -16px; z-index: 2; }
.links { display: flex; flex-wrap: wrap; gap: 6px 16px; position: relative; z-index: 3; }
.links a { display: inline-flex; align-items: center; gap: 3px; font-size: 13px; font-weight: 600; color: var(--ink); }
.links a:hover { color: var(--teal); }

@media (hover: hover) {
  .items:hover .item { opacity: 0.5; }
  .items:hover .item:hover { opacity: 1; }
  .item:hover .item-bg {
    background: color-mix(in srgb, var(--soft) 70%, var(--bg));
    box-shadow: inset 0 0 0 1px var(--line), 0 10px 30px -18px color-mix(in srgb, var(--blue) 45%, transparent);
  }
  .item:hover .item-title a { color: var(--teal); }
  .item:hover .arrow { transform: translate(2px, -2px); }
}

.thumb {
  width: 120px;
  aspect-ratio: 16 / 10;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--line);
  background: var(--grad);
  z-index: 1;
}
.thumb img { width: 100%; height: 100%; object-fit: cover; }
.thumb-fallback {
  display: grid;
  place-items: center;
  height: 100%;
  color: #ffffff;
  font-weight: 800;
  font-size: 20px;
  letter-spacing: 0.04em;
}

.more-link { display: inline-flex; align-items: center; gap: 6px; margin-top: 36px; font-weight: 700; color: var(--ink); border-bottom: 2px solid var(--teal); }

.table-block { margin-top: 44px; display: grid; gap: 6px; }
.table-block.first { margin-top: 0; }
.rows { list-style: none; margin: 0; padding: 0; }
.row { display: grid; grid-template-columns: 110px 1fr; gap: 16px; padding-block: 12px; border-bottom: 1px solid var(--line); font-size: 15px; }
.row > * { min-width: 0; }
.row-when { padding-top: 2px; }
.row-main { color: var(--text); }
.row-main strong { color: var(--ink); font-weight: 600; }
.row-sub { display: block; font-size: 13px; color: var(--muted); }
.cert-link:hover strong { color: var(--teal); }

.contact { margin-top: 24px; padding: 36px 28px; border-radius: 16px; background: var(--panel); box-shadow: inset 0 0 0 1px var(--panel-line); color: #b9c7c2; position: relative; overflow: hidden; }
.contact::before { content: ''; position: absolute; inset: 0 0 auto 0; height: 4px; background: var(--grad); }
.contact-title { margin: 0; color: #ffffff; font-size: clamp(26px, 4vw, 34px); font-weight: 800; letter-spacing: -0.03em; }
.contact-title .grad-text { background: linear-gradient(135deg, #3fd3a0, #36b9d6); -webkit-background-clip: text; background-clip: text; }
.contact p { margin: 10px 0 0; max-width: 32em; }
.contact-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 24px; }
.btn {
  display: inline-flex; align-items: center; gap: 8px; padding: 11px 18px; border-radius: 999px;
  background: #ffffff; color: #0b0f0e; font-weight: 600; font-size: 14px; word-break: break-all;
  transition: transform .15s;
}
.btn:hover { transform: translateY(-1px); }
.btn.ghost { background: transparent; color: #ffffff; box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .3); }

.foot { margin-top: 48px; font-size: 13px; color: var(--muted); max-width: 30em; }

/* ---------- Desktop: dua kolom ---------- */
@media (min-width: 1024px) {
  .shell { display: flex; justify-content: space-between; gap: 48px; padding-inline: 48px; }
  .side {
    position: sticky;
    top: 0;
    width: 46%;
    max-height: 100vh;
    overflow-y: auto;
    scrollbar-width: none;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-block: 96px;
  }
  .content { width: 52%; padding-block: 96px; }
  .section { padding-block: 0 96px; scroll-margin-top: 96px; }
  .sec-title { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); margin: 0; padding: 0; }

  .nav { display: grid; gap: 2px; margin-top: 64px; width: max-content; }
  .nav a { display: flex; align-items: center; gap: 14px; padding-block: 10px; }
  .nav-line { width: 32px; height: 1px; background: var(--muted); transition: width .25s, background .25s, height .25s; }
  .nav-text { font-size: 12px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); transition: color .25s; }
  .nav a:hover .nav-line, .nav a.active .nav-line { width: 64px; height: 2px; background: var(--grad); }
  .nav a:hover .nav-text, .nav a.active .nav-text { color: var(--ink); }

  .item { grid-template-columns: 140px 1fr; gap: 20px; }
  .item.project { grid-template-columns: 140px 1fr; }
  .thumb { width: 100%; margin-top: 4px; }
  .item-bg { inset: -20px -24px; }
  .stretch::after { inset: -20px -24px; }
}

/* Layar pendek (laptop kecil): rapatkan supaya sosmed & tombol tema tetap terlihat */
@media (min-width: 1024px) and (max-height: 820px) {
  .side { padding-block: 56px 40px; }
  .content { padding-block: 56px; }
  .nav { margin-top: 36px; }
  .nav a { padding-block: 7px; }
  .logo { margin-bottom: 14px; }
}

@media (max-width: 560px) {
  .row { grid-template-columns: 1fr; gap: 2px; }
  .item.project .thumb { width: 100%; max-width: 280px; }
}
</style>
