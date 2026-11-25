import { NextResponse } from 'next/server'
import { verifySessionToken, findAdminUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  try {
    const cookie = request.cookies.get('gta_admin_session')?.value
    const authHeader = request.headers.get('authorization')
    const token = cookie || (authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null)

    if (!token) {
      return NextResponse.json({ authenticated: false })
    }

    const payload = verifySessionToken(token)
    if (!payload || !payload.username) {
      return NextResponse.json({ authenticated: false })
    }

    // Optional: Refresh user from DB to ensure still valid
    const user = await findAdminUser(payload.username)
    if (!user) {
      return NextResponse.json({ authenticated: false })
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name || 'Vice City Admin',
        role: user.role || 'superadmin',
        lastLogin: user.last_login,
      },
    })
  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json({ authenticated: false })
  }
}
