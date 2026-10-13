<script setup lang="ts">
import { sections, blankItem, type SectionSchema } from '~/utils/schema'

useHead({ title: 'Admin — Portfolio', meta: [{ name: 'robots', content: 'noindex' }] })

const authed = ref<boolean | null>(null)
const password = ref('')
const loginError = ref('')

const content = ref<Record<string, any>>({})
const saved = ref<Record<string, string>>({})
const current = ref<SectionSchema>(sections[0]!)
const openId = ref<string | null>(null)
const saving = ref(false)
const toast = ref<{ text: string; ok: boolean } | null>(null)
const confirmDelete = ref<string | null>(null)

const errMsg = (e: any) => e?.data?.statusMessage || e?.statusMessage || e?.message || 'Terjadi kesalahan'

async function load() {
  const data = await $fetch<Record<string, any>>('/api/content')
  content.value = structuredClone(data)
  saved.value = Object.fromEntries(sections.map((s) => [s.key, JSON.stringify(data[s.key] ?? null)]))
}

onMounted(async () => {
  const me = await $fetch<{ admin: boolean }>('/api/auth/me').catch(() => ({ admin: false }))
  authed.value = me.admin
  if (me.admin) await load()
})

async function login() {
  loginError.value = ''
  try {
    await $fetch('/api/auth/login', { method: 'POST', body: { password: password.value } })
    password.value = ''
    authed.value = true
    await load()
  } catch (e) {
    loginError.value = errMsg(e)
  }
}

async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST' })
  authed.value = false
}

const isDirty = (key: string) =>
  saved.value[key] !== undefined && JSON.stringify(content.value[key] ?? null) !== saved.value[key]
const anyDirty = computed(() => sections.some((s) => isDirty(s.key)))

function showToast(text: string, ok = true) {
  toast.value = { text, ok }
  setTimeout(() => (toast.value = null), 2600)
}

async function save(key = current.value.key) {
  saving.value = true
  try {
    const value = await $fetch(`/api/content/${key}`, { method: 'PUT', body: { value: content.value[key] } })
    saved.value[key] = JSON.stringify(value)
    showToast(`${sections.find((s) => s.key === key)?.label} tersimpan`)
  } catch (e: any) {
    if (e?.statusCode === 401) authed.value = false
    showToast(errMsg(e), false)
  } finally {
    saving.value = false
  }
}

function discard(key = current.value.key) {
  content.value[key] = JSON.parse(saved.value[key] ?? 'null')
  showToast('Perubahan dibatalkan')
}

// --- CRUD daftar ---
const items = computed<any[]>(() => content.value[current.value.key] ?? [])

function addItem() {
  const item = blankItem(current.value)
  content.value[current.value.key] = [item, ...items.value]
  openId.value = item.id
}
function move(i: number, dir: -1 | 1) {
  const arr = [...items.value]
  const j = i + dir
  if (j < 0 || j >= arr.length) return
  ;[arr[i], arr[j]] = [arr[j], arr[i]]
  content.value[current.value.key] = arr
}
function removeItem(id: string) {
  content.value[current.value.key] = items.value.filter((x) => x.id !== id)
  confirmDelete.value = null
  if (openId.value === id) openId.value = null
}
function pick(s: SectionSchema) {
  current.value = s
  openId.value = null
  confirmDelete.value = null
}

const warnUnsaved = (e: BeforeUnloadEvent) => {
  if (anyDirty.value) e.preventDefault()
}
onMounted(() => window.addEventListener('beforeunload', warnUnsaved))
onBeforeUnmount(() => window.removeEventListener('beforeunload', warnUnsaved))
</script>

<template>
  <div class="admin">
    <!-- Memuat -->
    <div v-if="authed === null" class="center muted">Memuat…</div>

    <!-- Login -->
    <form v-else-if="!authed" class="login" @submit.prevent="login">
      <LogoCat :size="56" />
      <h1>Masuk admin</h1>
      <p class="muted">Kelola isi portofolio kamu.</p>
      <label for="pw" class="f-label">Password</label>
      <input id="pw" v-model="password" type="password" autocomplete="current-password" required>
      <p v-if="loginError" class="error">{{ loginError }}</p>
      <button type="submit" class="btn primary">Masuk</button>
      <NuxtLink to="/" class="back">← Kembali ke situs</NuxtLink>
    </form>

    <!-- Editor -->
    <template v-else>
      <header class="bar">
        <div class="bar-left">
          <LogoCat :size="28" :interactive="false" />
          <strong>Admin Portofolio</strong>
        </div>
        <div class="bar-right">
          <a href="/" target="_blank" class="btn ghost">Lihat situs ↗</a>
          <button type="button" class="btn ghost" @click="logout">Keluar</button>
        </div>
      </header>

      <div class="layout">
        <nav class="tabs" aria-label="Bagian">
          <button
            v-for="s in sections"
            :key="s.key"
            type="button"
            :class="{ active: current.key === s.key }"
            @click="pick(s)"
          >
            <span>{{ s.label }}</span>
            <span v-if="s.kind === 'list'" class="count">{{ content[s.key]?.length ?? 0 }}</span>
            <span v-if="isDirty(s.key)" class="dot" title="Belum disimpan" />
          </button>
        </nav>

        <main class="editor">
          <div class="ed-head">
            <div>
              <h1>{{ current.label }}</h1>
              <p class="muted small">
                {{ current.kind === 'list' ? 'Klik item untuk mengedit. Urutan di sini = urutan di situs.' : 'Edit lalu simpan.' }}
              </p>
            </div>
            <div class="ed-actions">
              <button v-if="current.kind === 'list'" type="button" class="btn ghost" @click="addItem">+ Tambah</button>
              <button type="button" class="btn ghost" :disabled="!isDirty(current.key)" @click="discard()">Batalkan</button>
              <button type="button" class="btn primary" :disabled="!isDirty(current.key) || saving" @click="save()">
                {{ saving ? 'Menyimpan…' : 'Simpan' }}
              </button>
            </div>
          </div>

          <!-- Objek tunggal (profil, skill) -->
          <div v-if="current.kind === 'object' && content[current.key]" class="card form">
            <FieldInput
              v-for="f in current.fields"
              :id="`${current.key}-${f.key}`"
              :key="f.key"
              v-model="content[current.key][f.key]"
              :field="f"
            />
          </div>

          <!-- Daftar -->
          <ul v-else class="list">
            <li v-if="!items.length" class="card empty muted">Belum ada item. Klik “+ Tambah” untuk membuat yang pertama.</li>
            <li v-for="(item, i) in items" :key="item.id" class="card item" :class="{ open: openId === item.id }">
              <div class="item-row">
                <button type="button" class="item-toggle" :aria-expanded="openId === item.id" @click="openId = openId === item.id ? null : item.id">
                  <strong>{{ item[current.titleKey!] || '(tanpa judul)' }}</strong>
                  <span class="muted small">{{ item[current.subKey!] }}</span>
                </button>
                <div class="item-tools">
                  <button type="button" class="icon" :disabled="i === 0" aria-label="Naikkan" @click="move(i, -1)">↑</button>
                  <button type="button" class="icon" :disabled="i === items.length - 1" aria-label="Turunkan" @click="move(i, 1)">↓</button>
                  <template v-if="confirmDelete === item.id">
                    <button type="button" class="btn danger sm" @click="removeItem(item.id)">Hapus</button>
                    <button type="button" class="btn ghost sm" @click="confirmDelete = null">Batal</button>
                  </template>
                  <button v-else type="button" class="icon del" aria-label="Hapus item" @click="confirmDelete = item.id">🗑</button>
                </div>
              </div>
              <div v-if="openId === item.id" class="form">
                <FieldInput
                  v-for="f in current.fields"
                  :id="`${item.id}-${f.key}`"
                  :key="f.key"
                  v-model="item[f.key]"
                  :field="f"
                />
              </div>
            </li>
          </ul>
        </main>
      </div>

      <div v-if="toast" class="toast" :class="{ bad: !toast.ok }" role="status">{{ toast.text }}</div>
    </template>
  </div>
</template>

<style scoped>
.admin { min-height: 100vh; background: var(--soft); color: var(--text); }
.center { display: grid; place-items: center; min-height: 100vh; }
.muted { color: var(--muted); }
.small { font-size: 13px; }
.f-label { font-size: 13px; font-weight: 600; color: var(--ink); }

.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  font: inherit; font-size: 14px; font-weight: 600; padding: 9px 16px; border-radius: 8px;
  border: 1px solid var(--line); background: var(--bg); color: var(--ink); cursor: pointer;
  transition: background .15s, border-color .15s, opacity .15s;
}
.btn:hover:not(:disabled) { border-color: var(--ink); }
.btn:disabled { opacity: .45; cursor: not-allowed; }
.btn.primary { background: var(--ink); border-color: var(--ink); color: var(--bg); }
.btn.primary:hover:not(:disabled) { background: var(--teal); border-color: var(--teal); color: var(--bg); }
.btn.danger { background: #b42318; border-color: #b42318; color: #ffffff; }
.btn.sm { padding: 5px 10px; font-size: 13px; }

/* Login */
.login {
  width: min(380px, calc(100% - 32px)); margin: 0 auto; padding-block: 15vh 40px;
  display: grid; gap: 10px;
}
.login h1 { margin: 8px 0 0; font-size: 26px; letter-spacing: -0.02em; }
.login p { margin: 0 0 12px; }
.login input { font: inherit; padding: 10px 12px; border: 1px solid var(--line); border-radius: 8px; background: var(--bg); }
.login input:focus { outline: none; border-color: var(--teal); box-shadow: 0 0 0 3px color-mix(in srgb, var(--teal) 15%, transparent); }
.login .btn { margin-top: 6px; }
.error { color: #b42318; font-size: 14px; margin: 0; }
.back { font-size: 14px; color: var(--muted); margin-top: 8px; }
.back:hover { color: var(--ink); }

/* Editor */
.bar {
  position: sticky; top: 0; z-index: 10; display: flex; justify-content: space-between; align-items: center; gap: 12px;
  padding: 12px 20px; background: var(--bg); border-bottom: 1px solid var(--line);
}
.bar::after { content: ''; position: absolute; left: 0; right: 0; bottom: -1px; height: 2px; background: var(--grad); }
.bar-left, .bar-right { display: flex; align-items: center; gap: 10px; }
.bar-right { padding-right: 52px; }
.bar-left strong { color: var(--ink); }

.layout { display: grid; grid-template-columns: 220px minmax(0, 1fr); gap: 28px; max-width: 1100px; margin: 0 auto; padding: 28px 20px 80px; }
.tabs { display: grid; gap: 2px; align-content: start; position: sticky; top: 84px; }
.tabs button {
  display: flex; align-items: center; gap: 8px; text-align: left; font: inherit; font-size: 14px; font-weight: 500;
  padding: 9px 12px; border: 0; border-radius: 8px; background: transparent; color: var(--text); cursor: pointer;
}
.tabs button:hover { background: var(--bg); }
.tabs button.active { background: var(--bg); color: var(--ink); font-weight: 700; box-shadow: inset 2px 0 0 var(--teal); }
.count { margin-left: auto; font-size: 12px; color: var(--muted); font-variant-numeric: tabular-nums; }
.dot { width: 7px; height: 7px; border-radius: 50%; background: #e08a00; flex: none; }
.tabs button:not(:has(.count)) .dot { margin-left: auto; }

.ed-head { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-end; gap: 12px; margin-bottom: 18px; }
.ed-head h1 { margin: 0; font-size: 24px; letter-spacing: -0.02em; }
.ed-head p { margin: 4px 0 0; }
.ed-actions { display: flex; flex-wrap: wrap; gap: 8px; }

.card { background: var(--bg); border: 1px solid var(--line); border-radius: 12px; }
.form { display: grid; gap: 18px; padding: 20px; }
.list { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
.empty { padding: 28px; text-align: center; }
.item.open { border-color: color-mix(in srgb, var(--teal) 40%, var(--line)); box-shadow: 0 8px 24px -16px color-mix(in srgb, var(--blue) 50%, transparent); }
.item .form { border-top: 1px solid var(--line); }
.item-row { display: flex; align-items: center; gap: 8px; padding: 6px 8px 6px 4px; }
.item-toggle {
  flex: 1; min-width: 0; display: grid; gap: 1px; text-align: left; font: inherit; background: none; border: 0;
  padding: 8px 12px; cursor: pointer; border-radius: 8px;
}
.item-toggle strong { color: var(--ink); font-size: 15px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.item-toggle span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.item-toggle:hover strong { color: var(--teal); }
.item-tools { display: flex; align-items: center; gap: 4px; flex: none; }
.icon { width: 32px; height: 32px; border: 1px solid transparent; background: none; border-radius: 8px; cursor: pointer; color: var(--muted); font-size: 15px; }
.icon:hover:not(:disabled) { border-color: var(--line); color: var(--ink); }
.icon:disabled { opacity: .3; cursor: default; }
.icon.del:hover { color: #b42318; }

.toast {
  position: fixed; left: 50%; bottom: calc(24px + env(safe-area-inset-bottom, 0px)); transform: translateX(-50%);
  background: var(--ink); color: var(--bg); padding: 10px 18px; border-radius: 999px; font-size: 14px; font-weight: 600;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, .4);
}
.toast.bad { background: #b42318; }

@media (max-width: 760px) {
  .layout { grid-template-columns: 1fr; gap: 16px; }
  .tabs { position: static; display: flex; overflow-x: auto; gap: 4px; padding-bottom: 4px; }
  .tabs button { flex: none; }
  .tabs button.active { box-shadow: inset 0 -2px 0 var(--teal); }
  .bar strong { display: none; }
}
</style>
