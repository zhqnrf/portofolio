import { marked } from 'marked'

marked.setOptions({ gfm: true })

export function renderMarkdown(md: string) {
  return marked.parse(md || '', { async: false }) as string
}

export function readingMinutes(md: string) {
  const words = String(md || '').trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

export function formatDate(date: string) {
  if (!date) return ''
  const d = new Date(`${date}T00:00:00`)
  if (Number.isNaN(d.getTime())) return date
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

/** Tulisan yang tampil di situs, terbaru dulu */
export function publishedPosts(posts: any[] = []) {
  return posts
    .filter((p) => p.published && p.slug)
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
}

export async function uploadImage(file: File): Promise<string> {
  const body = new FormData()
  body.append('file', file)
  const res = await $fetch<{ url: string }>('/api/upload', { method: 'POST', body })
  return res.url
}
