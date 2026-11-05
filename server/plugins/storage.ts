export default defineNitroPlugin(async () => {
  const url = process.env.REDIS_URL || process.env.STORAGE_URL
  if (!url) return
  try {
    const { default: redisDriver } = await import('unstorage/drivers/redis')
    useStorage().mount('content', redisDriver({ url, base: 'portfolio' }))
    console.log('[storage] redis terpasang, skema:', url.split(':')[0])
  } catch (e: any) {
    console.error('[storage] gagal memasang redis:', e?.message)
  }
})