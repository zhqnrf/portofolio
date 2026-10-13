export default defineEventHandler(async (event) => {
  const { adminPassword } = useRuntimeConfig()
  if (!adminPassword) {
    throw createError({ statusCode: 500, statusMessage: 'NUXT_ADMIN_PASSWORD belum diisi di file .env' })
  }
  const body = await readBody<{ password?: string }>(event)
  if (!body?.password || !safeEqual(body.password, adminPassword)) {
    throw createError({ statusCode: 401, statusMessage: 'Password salah' })
  }
  startSession(event)
  return { ok: true }
})
