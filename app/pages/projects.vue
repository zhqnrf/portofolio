<script setup lang="ts">
const { data } = await useFetch<Record<string, any>>('/api/content', { key: 'content' })
const projects = computed<any[]>(() => data.value?.projects ?? [])
const name = computed(() => data.value?.profile?.name ?? '')
useHead(() => ({ title: `All Projects — ${name.value}` }))
</script>

<template>
  <div class="wrap">
    <SiteHeader />
    <main>
      <header class="intro">
        <span class="label">Archive</span>
        <h1>All projects</h1>
        <p>{{ projects.length }} projects, from hospital systems to school websites and mobile apps.</p>
      </header>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Year</th>
              <th>Project</th>
              <th class="hide-sm">Role</th>
              <th class="hide-md">Built with</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in projects" :key="p.id">
              <td class="label year">{{ p.year }}</td>
              <td class="title">{{ p.title }}</td>
              <td class="hide-sm role">{{ p.role }}</td>
              <td class="hide-md"><div class="chips"><span v-for="t in p.tags" :key="t" class="chip">{{ t }}</span></div></td>
              <td>
                <a v-if="p.links?.[0]?.url" :href="p.links[0].url" target="_blank" rel="noopener" class="go">
                  {{ p.links[0].label }} <Icon name="arrow" />
                </a>
                <span v-else class="private label">Internal</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
    <footer class="foot">© {{ new Date().getFullYear() }} {{ name }}</footer>
  </div>
</template>

<style scoped>
.wrap { max-width: 1100px; margin: 0 auto; padding-inline: 24px; }
.intro { padding-block: 40px 40px; }
.intro h1 { margin: 10px 0 10px; font-size: clamp(34px, 5vw, 52px); font-weight: 800; letter-spacing: -0.035em; line-height: 1.08; }
.intro p { margin: 0; }
.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: 15px; }
th { text-align: left; font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--ink); padding: 12px 12px 12px 0; border-bottom: 1px solid var(--line); }
td { padding: 16px 12px 16px 0; border-bottom: 1px solid var(--line); vertical-align: top; }
tbody tr { transition: background .2s; }
tbody tr:hover { background: var(--soft); }
.year { padding-top: 19px; white-space: nowrap; }
.title { font-weight: 700; color: var(--ink); min-width: 180px; }
.role { color: var(--muted); font-size: 14px; }
.go { display: inline-flex; align-items: center; gap: 4px; font-size: 14px; font-weight: 600; color: var(--ink); white-space: nowrap; }
.go:hover { color: var(--teal); }
.private { white-space: nowrap; }
.foot { padding-block: 80px 48px; font-size: 13px; color: var(--muted); }
@media (max-width: 900px) { .hide-md { display: none; } }
@media (max-width: 600px) { .hide-sm { display: none; } }
</style>
