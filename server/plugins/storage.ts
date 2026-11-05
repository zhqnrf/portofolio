export default defineNitroPlugin(async () => {
  let url = process.env.REDIS_URL || process.env.STORAGE_URL
  if (!url) return
  // Upstash mewajibkan TLS
  if (url.startsWith('redis://') && url.includes('upstash.io')) {
    url = url.replace('redis://', 'rediss://')
  }
  try {
    const { default: redisDriver } = await import('unstorage/drivers/redis')
    useStorage().mount(
      'content',
      redisDriver({ url, base: 'portfolio', connectTimeout: 5000, maxRetriesPerRequest: 1 }),
    )
    console.log('[storage] redis terpasang, skema:', url.split(':')[0])
  } catch (e: any) {
    console.error('[storage] gagal memasang redis:', e?.message)
  }
})