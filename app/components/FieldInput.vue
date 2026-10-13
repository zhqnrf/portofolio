<script setup lang="ts">
import type { Field } from '~/utils/schema'

const props = defineProps<{ field: Field; id: string }>()
const model = defineModel<any>()

// Tags disimpan sebagai array, diketik sebagai teks dipisah koma
const tagText = ref('')
watch(
  () => model.value,
  (v) => {
    if (props.field.type === 'tags') tagText.value = (Array.isArray(v) ? v : []).join(', ')
  },
  { immediate: true },
)
function commitTags() {
  model.value = tagText.value.split(',').map((s) => s.trim()).filter(Boolean)
}

function addLink() {
  model.value = [...(model.value ?? []), { label: '', url: '' }]
}
function removeLink(i: number) {
  model.value = model.value.filter((_: unknown, idx: number) => idx !== i)
}

// Upload gambar (sampul blog, gambar proyek)
const imgInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const uploadError = ref('')
async function onImage(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploadError.value = ''
  uploading.value = true
  try {
    model.value = await uploadImage(file)
  } catch (err: any) {
    uploadError.value = err?.data?.statusMessage || 'Gagal mengunggah gambar'
  } finally {
    uploading.value = false
    if (imgInput.value) imgInput.value.value = ''
  }
}
</script>

<template>
  <div class="field">
    <label :for="id" class="f-label">{{ field.label }}</label>

    <textarea
      v-if="field.type === 'textarea'"
      :id="id"
      v-model="model"
      :rows="field.key.startsWith('about') ? 8 : 3"
    />

    <template v-else-if="field.type === 'tags'">
      <input :id="id" v-model="tagText" type="text" placeholder="Pisahkan dengan koma" @blur="commitTags" @keydown.enter.prevent="commitTags">
      <div v-if="model?.length" class="tags">
        <span v-for="t in model" :key="t" class="chip">{{ t }}</span>
      </div>
    </template>

    <div v-else-if="field.type === 'links'" :id="id" class="links">
      <div v-for="(l, i) in model ?? []" :key="i" class="link-row">
        <input v-model="l.label" type="text" placeholder="Label, misal GitHub" :aria-label="`Label link ${i + 1}`">
        <input v-model="l.url" type="url" placeholder="https://…" :aria-label="`URL link ${i + 1}`">
        <button type="button" class="icon-btn" :aria-label="`Hapus link ${i + 1}`" @click="removeLink(i)">✕</button>
      </div>
      <button type="button" class="small-btn" @click="addLink">+ Tambah link</button>
    </div>

    <div v-else-if="field.type === 'image'" class="image">
      <div class="img-preview" :class="{ empty: !model }">
        <img v-if="model" :src="model" alt="">
        <span v-else>Belum ada gambar</span>
      </div>
      <div class="img-actions">
        <button type="button" class="small-btn" :disabled="uploading" @click="imgInput?.click()">
          {{ uploading ? 'Mengunggah…' : model ? 'Ganti gambar' : 'Unggah gambar' }}
        </button>
        <button v-if="model" type="button" class="small-btn danger" @click="model = ''">Hapus</button>
        <input ref="imgInput" type="file" accept="image/*" hidden @change="onImage">
        <input :id="id" v-model="model" type="text" placeholder="atau tempel URL gambar" class="img-url">
      </div>
      <p v-if="uploadError" class="f-error">{{ uploadError }}</p>
    </div>

    <MarkdownEditor v-else-if="field.type === 'markdown'" :id="id" v-model="model" />

    <input v-else-if="field.type === 'date'" :id="id" v-model="model" type="date" class="date">

    <label v-else-if="field.type === 'checkbox'" class="switch">
      <input :id="id" v-model="model" type="checkbox">
      <span class="track"><span class="thumb" /></span>
      <span>{{ model ? 'Tayang' : 'Draf' }}</span>
    </label>

    <input v-else :id="id" v-model="model" :type="field.type === 'url' ? 'url' : 'text'">

    <p v-if="field.hint" class="f-hint">{{ field.hint }}</p>
  </div>
</template>

<style scoped>
.field { display: grid; gap: 6px; }
.f-label { font-size: 13px; font-weight: 600; color: var(--ink); }
.f-hint { margin: 0; font-size: 12px; color: var(--muted); }
input, textarea {
  width: 100%;
  font: inherit;
  font-size: 14px;
  color: var(--ink);
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 9px 12px;
  transition: border-color .15s, box-shadow .15s;
}
textarea { resize: vertical; line-height: 1.55; }
input:focus, textarea:focus { outline: none; border-color: var(--teal); box-shadow: 0 0 0 3px color-mix(in srgb, var(--teal) 15%, transparent); }
.tags { display: flex; flex-wrap: wrap; gap: 6px; }
.links { display: grid; gap: 8px; }
.link-row { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 2fr) auto; gap: 8px; }
.icon-btn { border: 1px solid var(--line); background: var(--bg); border-radius: 8px; width: 38px; cursor: pointer; color: var(--muted); }
.icon-btn:hover { color: #b42318; border-color: #f0c2bd; }
.small-btn { justify-self: start; border: 1px dashed var(--line); background: var(--bg); border-radius: 8px; padding: 7px 12px; font: inherit; font-size: 13px; font-weight: 600; cursor: pointer; color: var(--teal); }
.small-btn:hover { border-color: var(--teal); }
.small-btn:disabled { opacity: .5; }
.small-btn.danger { color: #b42318; }
.f-error { margin: 0; font-size: 12px; color: #b42318; }
.image { display: grid; grid-template-columns: 180px minmax(0, 1fr); gap: 14px; align-items: start; }
.img-preview { aspect-ratio: 16 / 10; border-radius: 8px; overflow: hidden; border: 1px solid var(--line); background: var(--soft); display: grid; place-items: center; font-size: 12px; color: var(--muted); }
.img-preview img { width: 100%; height: 100%; object-fit: cover; }
.img-actions { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.img-url { flex: 1 1 100%; }
.date { max-width: 220px; }
.switch { display: inline-flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 600; color: var(--ink); }
.switch input { position: absolute; opacity: 0; width: 1px; height: 1px; }
.track { width: 40px; height: 22px; border-radius: 999px; background: var(--line); position: relative; transition: background .2s; }
.thumb { position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; border-radius: 50%; background: #ffffff; box-shadow: 0 1px 3px rgba(0, 0, 0, .2); transition: transform .2s; }
.switch input:checked + .track { background: var(--teal); }
.switch input:checked + .track .thumb { transform: translateX(18px); }
.switch input:focus-visible + .track { outline: 2px solid var(--teal); outline-offset: 2px; }
@media (max-width: 560px) { .image { grid-template-columns: 1fr; } }
@media (max-width: 560px) { .link-row { grid-template-columns: 1fr auto; } .link-row input:first-child { grid-column: 1 / -1; } }
</style>
