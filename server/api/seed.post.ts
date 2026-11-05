export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const existing = await readContent()
  if (Object.keys(existing).length && getQuery(event).force !== '1') {
    throw createError({ statusCode: 409, statusMessage: 'Konten sudah ada' })
  }
  const body = await readBody(event)
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw createError({ statusCode: 400, statusMessage: 'Body harus objek JSON' })
  }
  await useStorage('content').setItem('content.json', JSON.stringify(body, null, 2) + '\n')
  return { ok: true, sections: Object.keys(body) }
})