import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { isValidEmail, sanitizeText, verifySessionToken } from '@/lib/auth'
import { checkRateLimit } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

function isAuthorizedAdmin(request) {
  const cookie = request.cookies.get('gta_admin_session')?.value
  const authHeader = request.headers.get('authorization')
  const token = cookie || (authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null)
  return verifySessionToken(token)
}

export async function GET(request) {
  try {
    // Only authenticated admin can view the subscribers email list
    const session = isAuthorizedAdmin(request)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 401 })
    }

    const rows = await query(
      'SELECT id, email, source, status, DATE_FORMAT(created_at, "%Y-%m-%d") as date, created_at FROM subscribers ORDER BY id DESC'
    )
    return NextResponse.json({
      success: true,
      subscribers: rows.map((r) => ({
        id: r.id,
        email: r.email,
        source: r.source || 'Website Footer',
        status: r.status || 'Active',
        date: r.date || new Date(r.created_at || Date.now()).toISOString().split('T')[0],
      })),
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve subscribers.' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    // Rate limit: 10 subscriptions per hour per IP
    const rate = checkRateLimit(request, 'newsletter_sub', 10, 60 * 60 * 1000)
    if (!rate.allowed) {
      return NextResponse.json(
        { error: 'Too many subscription attempts. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(rate.resetSeconds) } }
      )
    }

    const body = await request.json()
    const { email, source = 'Website Footer', status = 'Active' } = body

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    const cleanEmail = email.trim().toLowerCase()
    const cleanSource = sanitizeText(source, 100)
    const cleanStatus = sanitizeText(status, 50) || 'Active'

    // Check if already subscribed
    const existing = await query('SELECT id FROM subscribers WHERE email = ? LIMIT 1', [cleanEmail])
    if (existing && existing.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'Already registered in Vice City Intelligence Safehouse.',
        id: existing[0].id,
      })
    }

    const result = await query(
      'INSERT INTO subscribers (email, source, status, created_at) VALUES (?, ?, ?, NOW())',
      [cleanEmail, cleanSource, cleanStatus]
    )

    return NextResponse.json({
      success: true,
      id: result.insertId,
      subscriber: {
        id: result.insertId,
        email: cleanEmail,
        source: cleanSource,
        status: cleanStatus,
        date: new Date().toISOString().split('T')[0],
      },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Subscription failed. Database unavailable.' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const session = isAuthorizedAdmin(request)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    let id = searchParams.get('id')
    let email = searchParams.get('email')

    if (!id && !email) {
      const body = await request.json().catch(() => ({}))
      id = body.id
      email = body.email
    }

    if (!id && !email) {
      return NextResponse.json({ error: 'ID or email is required' }, { status: 400 })
    }

    if (id) {
      await query('DELETE FROM subscribers WHERE id = ?', [Number(id)])
    } else if (email) {
      await query('DELETE FROM subscribers WHERE email = ?', [email.trim().toLowerCase()])
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete subscriber.' }, { status: 500 })
  }
}
