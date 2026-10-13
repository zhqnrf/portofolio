<script setup lang="ts">
import { renderMarkdown, uploadImage } from '~/utils/markdown'

const props = defineProps<{ id: string }>()
const model = defineModel<string>({ default: '' })

const area = ref<HTMLTextAreaElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const tab = ref<'write' | 'preview'>('write')
const uploading = ref(false)
const error = ref('')
const preview = computed(() => renderMarkdown(model.value))

// Sisipkan teks di posisi kursor; bungkus teks yang diblok kalau ada
function insert(before: string, after = '', placeholder = '') {
  const el = area.value
  if (!el) return
  const { selectionStart: s, selectionEnd: e, value } = el
  const selected = value.slice(s, e) || placeholder
  model.value = value.slice(0, s) + before + selected + after + value.slice(e)
  nextTick(() => {
    el.focus()
    el.setSelectionRange(s + before.length, s + before.length + selected.length)
  })
}
function line(prefix: string, placeholder: string) {
  const el = area.value
  if (!el) return
  const start = el.value.lastIndexOf('\n', el.selectionStart - 1) + 1
  el.setSelectionRange(start, start)
  insert(prefix, '', el.selectionStart === el.selectionEnd && !el.value.slice(start).split('\n')[0] ? placeholder : '')
}

const tools = [
  { label: 'B', title: 'Tebal', run: () => insert('**', '**', 'teks tebal') },
  { label: 'I', title: 'Miring', run: () => insert('_', '_', 'teks miring') },
  { label: 'H2', title: 'Judul bagian', run: () => line('## ', 'Judul bagian') },
  { label: 'H3', title: 'Sub-judul', run: () => line('### ', 'Sub-judul') },
  { label: '❝', title: 'Kutipan', run: () => line('> ', 'Kutipan') },
  { label: '•', title: 'Daftar', run: () => line('- ', 'Poin') },
  { label: '1.', title: 'Daftar bernomor', run: () => line('1. ', 'Poin') },
  { label: '</>', title: 'Kode', run: () => insert('\n```php\n', '\n```\n', '// kode') },
  { label: '🔗', title: 'Link', run: () => insert('[', '](https://)', 'teks link') },
]

async function onFile(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  error.value = ''
  uploading.value = true
  try {
    const url = await uploadImage(file)
    const alt = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ')
    insert(`\n![${alt}](${url})\n`)
  } catch (err: any) {
    error.value = err?.data?.statusMessage || 'Gagal mengunggah gambar'
  } finally {
    uploading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}
</script>

<template>
  <div class="md">
    <div class="md-bar">
      <div class="md-tabs" role="tablist">
        <button type="button" role="tab" :aria-selected="tab === 'write'" :class="{ on: tab === 'write' }" @click="tab = 'write'">Tulis</button>
        <button type="button" role="tab" :aria-selected="tab === 'preview'" :class="{ on: tab === 'preview' }" @click="tab = 'preview'">Pratinjau</button>
      </div>
      <div v-show="tab === 'write'" class="md-tools">
        <button v-for="t in tools" :key="t.title" type="button" :title="t.title" :aria-label="t.title" @click="t.run">{{ t.label }}</button>
        <button type="button" class="img-btn" :disabled="uploading" @click="fileInput?.click()">
          {{ uploading ? 'Mengunggah…' : '🖼 Gambar' }}
        </button>
        <input ref="fileInput" type="file" accept="image/*" hidden @change="onFile">
      </div>
    </div>

    <textarea
      v-show="tab === 'write'"
      :id="props.id"
      ref="area"
      v-model="model"
      rows="22"
      spellcheck="true"
      placeholder="Tulis pakai Markdown. ## untuk judul bagian, **tebal**, _miring_, - untuk daftar."
    />
    <div v-show="tab === 'preview'" class="md-preview prose" v-html="preview" />
    <p v-if="error" class="md-error">{{ error }}</p>
  </div>
</template>

<style scoped>
.md { border: 1px solid var(--line); border-radius: 10px; overflow: hidden; background: var(--bg); }
.md:focus-within { border-color: var(--teal); box-shadow: 0 0 0 3px color-mix(in srgb, var(--teal) 15%, transparent); }
.md-bar { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 6px; padding: 6px; border-bottom: 1px solid var(--line); background: var(--soft); }
.md-tabs, .md-tools { display: flex; flex-wrap: wrap; gap: 2px; }
.md-bar button {
  font: inherit; font-size: 13px; font-weight: 600; min-width: 32px; height: 30px; padding: 0 9px;
  border: 0; border-radius: 6px; background: transparent; color: var(--text);
}
.md-bar button:hover:not(:disabled) { background: var(--bg); color: var(--ink); }
.md-tabs button.on { background: var(--bg); color: var(--ink); box-shadow: 0 1px 2px rgba(0, 0, 0, .06); }
.img-btn { color: var(--teal) !important; }
textarea {
  display: block; width: 100%; border: 0; outline: none; resize: vertical; padding: 14px 16px;
  font-family: var(--f-mono); font-size: 13px; line-height: 1.7; color: var(--ink); background: var(--bg);
}
.md-preview { padding: 16px 20px; min-height: 300px; max-height: 70vh; overflow: auto; }
.md-error { margin: 0; padding: 8px 14px; font-size: 13px; color: #b42318; border-top: 1px solid var(--line); }
</style>
