import { NextResponse } from 'next/server'
import { findAdminUser, verifyPassword, createSessionToken, updateAdminLastLogin, sanitizeText } from '@/lib/auth'
import { checkRateLimit } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    // 1. Persistent IP Rate Limiting: 5 attempts per 15 minutes
    const rate = checkRateLimit(request, 'auth_login', 5, 15 * 60 * 1000)
    if (!rate.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many login attempts. Command terminal locked. Please wait ${Math.ceil(rate.resetSeconds / 60)} minutes.`,
        },
        {
          status: 429,
          headers: { 'Retry-After': String(rate.resetSeconds) },
        }
      )
    }

    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      )
    }

    const cleanUsername = sanitizeText(String(username).trim().toLowerCase(), 50)
    const user = await findAdminUser(cleanUsername)

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid username or password' },
        { status: 401 }
      )
    }

    const isValid = verifyPassword(password, user.password_hash)
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid username or password' },
        { status: 401 }
      )
    }

    // Update last login timestamp in MySQL
    if (user.id) {
      await updateAdminLastLogin(user.id)
    }

    const token = createSessionToken(user)
    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful',
      user: {
        id: user.id,
        username: user.username,
        name: user.name || 'Vice City Admin',
        role: user.role || 'superadmin',
      },
    })

    // Secure HTTP-only session cookie (7 days expiry)
    response.cookies.set('gta_admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal authentication service error' },
      { status: 500 }
    )
  }
}
