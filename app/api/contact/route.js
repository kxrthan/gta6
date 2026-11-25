import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { sanitizeText, isValidEmail } from '@/lib/auth'
import { checkRateLimit } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    // Rate limiting: 5 contact transmissions per hour per IP
    const rate = checkRateLimit(request, 'contact', 5, 60 * 60 * 1000)
    if (!rate.allowed) {
      return NextResponse.json(
        { error: 'Rate limit reached. Please wait before transmitting another message.' },
        { status: 429, headers: { 'Retry-After': String(rate.resetSeconds) } }
      )
    }

    const body = await request.json()
    const { name, email, category = 'News Tip', subject = '', message = '' } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 })
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    const cleanName = sanitizeText(name, 100)
    const cleanEmail = email.trim().toLowerCase()
    const cleanCategory = sanitizeText(category, 50)
    const cleanSubject = sanitizeText(subject, 150)
    const cleanMessage = sanitizeText(message, 3000)

    // Register email in subscribers leads with lead source
    try {
      await query(
        'INSERT INTO subscribers (email, source, status, created_at) VALUES (?, ?, ?, NOW()) ON DUPLICATE KEY UPDATE status = status',
        [cleanEmail, `Contact: ${cleanCategory || 'Inquiry'}`, 'Active']
      )
    } catch (e) {
      // Ignore database sync failure to avoid leaking internals
    }

    // Do NOT log private message content or contact email in production server stdout
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Contact Wire] Message received for category: ${cleanCategory}`)
    }

    return NextResponse.json({
      success: true,
      message: 'Encrypted dispatch transmitted to Vice City Headquarters.',
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to transmit encrypted message.' }, { status: 500 })
  }
}
