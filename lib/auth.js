import crypto from 'crypto'
import { query } from '@/lib/db'

function getJwtSecret() {
  const secret = process.env.ADMIN_JWT_SECRET
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'SECURITY FATAL: ADMIN_JWT_SECRET environment variable is missing in production deployment. Define a strong secret key.'
      )
    }
    console.warn(
      '⚠️ SECURITY WARNING: ADMIN_JWT_SECRET is unset. Running with development fallback. Set ADMIN_JWT_SECRET before deploying to production.'
    )
    return 'gta6_vice_city_dev_temporary_secret_key_change_in_production'
  }
  return secret
}

export function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password, storedHash) {
  if (!storedHash || !password) return false
  if (storedHash === password) return true // plaintext legacy/fallback
  try {
    const [salt, key] = storedHash.split(':')
    if (!salt || !key) return false
    const hashBuffer = crypto.scryptSync(password, salt, 64)
    const keyBuffer = Buffer.from(key, 'hex')
    if (hashBuffer.length !== keyBuffer.length) return false
    return crypto.timingSafeEqual(hashBuffer, keyBuffer)
  } catch (err) {
    console.error('Password verification error:', err)
    return false
  }
}

// Lightweight HMAC-SHA256 session token
export function createSessionToken(user) {
  const secret = getJwtSecret()
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const payload = Buffer.from(
    JSON.stringify({
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role || 'superadmin',
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days expiration
    })
  ).toString('base64url')

  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${header}.${payload}`)
    .digest('base64url')

  return `${header}.${payload}.${signature}`
}

export function verifySessionToken(token) {
  if (!token || typeof token !== 'string') return null
  const parts = token.split('.')
  if (parts.length !== 3) return null

  const secret = getJwtSecret()
  const [header, payload, signature] = parts
  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(`${header}.${payload}`)
    .digest('base64url')

  // Timing safe signature comparison
  const sigBuffer = Buffer.from(signature)
  const expBuffer = Buffer.from(expectedSig)
  if (sigBuffer.length !== expBuffer.length || !crypto.timingSafeEqual(sigBuffer, expBuffer)) {
    return null
  }

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    if (data.exp && data.exp < Math.floor(Date.now() / 1000)) {
      return null // Expired
    }
    return data
  } catch (e) {
    return null
  }
}

export async function findAdminUser(username) {
  try {
    const rows = await query('SELECT * FROM admin_users WHERE username = ? LIMIT 1', [username])
    return rows[0] || null
  } catch (err) {
    console.error('Error fetching admin user:', err.message)
    return null
  }
}

export async function updateAdminLastLogin(userId) {
  try {
    await query('UPDATE admin_users SET last_login = NOW() WHERE id = ?', [userId])
  } catch (err) {
    console.error('Error updating last_login:', err.message)
  }
}

// Security sanitization utilities
export function sanitizeText(str, maxLength = 500) {
  if (typeof str !== 'string') return ''
  return str
    .replace(/<[^>]*>/g, '') // Strip HTML tags
    .trim()
    .slice(0, maxLength)
}

export function isValidEmail(email) {
  if (typeof email !== 'string') return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim()) && email.length <= 150
}
