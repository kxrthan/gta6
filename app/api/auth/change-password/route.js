import { NextResponse } from 'next/server'
import { verifySessionToken, findAdminUser, verifyPassword, hashPassword } from '@/lib/auth'
import { query } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    const cookie = request.cookies.get('gta_admin_session')?.value
    const authHeader = request.headers.get('authorization')
    const token = cookie || (authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null)

    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifySessionToken(token)
    if (!payload || !payload.username) {
      return NextResponse.json({ success: false, error: 'Invalid or expired session' }, { status: 401 })
    }

    const body = await request.json()
    const { currentPassword, newPassword, newUsername } = body

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Current password and new password are required' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: 'New password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    const user = await findAdminUser(payload.username)
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found in database' }, { status: 404 })
    }

    const isMatch = verifyPassword(currentPassword, user.password_hash)
    if (!isMatch) {
      return NextResponse.json({ success: false, error: 'Current password is incorrect' }, { status: 400 })
    }

    const newHash = hashPassword(newPassword)
    const targetUsername = newUsername && newUsername.trim() ? newUsername.trim().toLowerCase() : user.username

    await query(
      'UPDATE admin_users SET password_hash = ?, username = ? WHERE id = ?',
      [newHash, targetUsername, user.id]
    )

    return NextResponse.json({
      success: true,
      message: 'Admin credentials updated successfully in Bluehost MySQL database!',
      username: targetUsername,
    })
  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json(
      { success: false, error: 'Database error while updating password' },
      { status: 500 }
    )
  }
}
