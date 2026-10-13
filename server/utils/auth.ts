import { createHmac, timingSafeEqual } from 'node:crypto'
import type { H3Event } from 'h3'

const COOKIE = 'admin_session'

function sessionToken() {
  const { adminPassword, sessionSecret } = useRuntimeConfig()
  return createHmac('sha256', sessionSecret || adminPassword)
    .update(`admin:${adminPassword}`)
    .digest('hex')
}

export function safeEqual(a: string, b: string) {
  const A = Buffer.from(a)
  const B = Buffer.from(b)
  return A.length === B.length && timingSafeEqual(A, B)
}

export function isAdmin(event: H3Event) {
  const cookie = getCookie(event, COOKIE)
  return !!cookie && !!useRuntimeConfig().adminPassword && safeEqual(cookie, sessionToken())
}

export function requireAdmin(event: H3Event) {
  if (!isAdmin(event)) {
    throw createError({ statusCode: 401, statusMessage: 'Belum login' })
  }
}

export function startSession(event: H3Event) {
  setCookie(event, COOKIE, sessionToken(), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === 'production',
  })
}

export function endSession(event: H3Event) {
  deleteCookie(event, COOKIE, { path: '/' })
}
