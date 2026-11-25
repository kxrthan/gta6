// High-performance sliding-window rate limiter for serverless Next.js runtimes

const globalForLimiter = globalThis

if (!globalForLimiter._rateLimitStore) {
  globalForLimiter._rateLimitStore = new Map()
}

const store = globalForLimiter._rateLimitStore

export function getClientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp.trim()
  }
  return '127.0.0.1'
}

/**
 * Check if a request exceeds rate limits.
 * @param {Request} request Next.js request object
 * @param {string} endpoint Unique endpoint name
 * @param {number} maxRequests Maximum requests in the window
 * @param {number} windowMs Time window in milliseconds
 * @returns {{ allowed: boolean, remaining: number, resetSeconds: number }}
 */
export function checkRateLimit(request, endpoint, maxRequests = 10, windowMs = 60000) {
  const ip = getClientIp(request)
  const key = `${endpoint}:${ip}`
  const now = Date.now()

  let timestamps = store.get(key) || []
  const windowStart = now - windowMs

  // Filter out timestamps outside current window
  timestamps = timestamps.filter((t) => t > windowStart)

  if (timestamps.length >= maxRequests) {
    const oldest = timestamps[0]
    const resetSeconds = Math.ceil((oldest + windowMs - now) / 1000)
    store.set(key, timestamps)
    return {
      allowed: false,
      remaining: 0,
      resetSeconds: Math.max(1, resetSeconds),
    }
  }

  timestamps.push(now)
  store.set(key, timestamps)

  // Periodic cleanup if store grows large
  if (store.size > 5000) {
    for (const [k, v] of store.entries()) {
      const valid = v.filter((t) => t > now - windowMs)
      if (valid.length === 0) store.delete(k)
      else store.set(k, valid)
    }
  }

  return {
    allowed: true,
    remaining: maxRequests - timestamps.length,
    resetSeconds: Math.ceil(windowMs / 1000),
  }
}
