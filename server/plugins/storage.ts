import redisDriver from 'unstorage/drivers/redis'

export default defineNitroPlugin(() => {
  const url = process.env.REDIS_URL || process.env.STORAGE_URL
  if (!url) return
  useStorage().mount('content', redisDriver({ url, base: 'portfolio' }))
})