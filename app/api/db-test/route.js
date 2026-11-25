import { NextResponse } from 'next/server'
import { testConnection } from '@/lib/db'
import { verifySessionToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  // Security hardening: in production, require authenticated admin session to prevent internal reconnaissance
  if (process.env.NODE_ENV === 'production') {
    const cookie = request.cookies.get('gta_admin_session')?.value
    const authHeader = request.headers.get('authorization')
    const token = cookie || (authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null)
    const session = verifySessionToken(token)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin authentication required to test database diagnostics.' },
        { status: 401 }
      )
    }
  }

  const result = await testConnection()
  if (!result.success) {
    return NextResponse.json(result, { status: 500 })
  }
  return NextResponse.json(result)
}
