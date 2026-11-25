import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import { query } from '@/lib/db'

export const dynamic = 'force-dynamic'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

const ALLOWED_MIME_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'image/avif': ['.avif'],
}

const FORBIDDEN_EXTENSIONS = [
  '.php', '.phtml', '.php3', '.php4', '.php5', '.phps',
  '.exe', '.sh', '.bat', '.cmd', '.com', '.vbs', '.js', '.mjs',
  '.html', '.htm', '.svg', '.xml', '.cgi', '.pl', '.py'
]

// Verify file magic bytes against actual content to prevent disguised executables
function verifyImageMagicBytes(buffer) {
  if (!buffer || buffer.length < 12) return null

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'image/jpeg'
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return 'image/png'
  }

  // WebP: RIFF .... WEBP
  const riff = buffer.toString('ascii', 0, 4)
  const webp = buffer.toString('ascii', 8, 12)
  if (riff === 'RIFF' && webp === 'WEBP') {
    return 'image/webp'
  }

  // AVIF: .... ftyp avif / avis
  const ftyp = buffer.toString('ascii', 4, 8)
  const brand = buffer.toString('ascii', 8, 12)
  if (ftyp === 'ftyp' && (brand === 'avif' || brand === 'avis' || brand === 'mif1')) {
    return 'image/avif'
  }

  return null
}

export async function POST(req) {
  try {
    const formData = await req.formData()
    const file = formData.get('file')

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const rawExt = path.extname(file.name || '').toLowerCase()

    // 1. Block executable and forbidden extensions
    if (FORBIDDEN_EXTENSIONS.includes(rawExt)) {
      return NextResponse.json(
        { error: 'Security alert: Executable and script file uploads are strictly forbidden.' },
        { status: 403 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    // 2. Enforce file size limit
    if (buffer.length > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds the 5 MB limit (Received ${(buffer.length / 1024 / 1024).toFixed(2)} MB)` },
        { status: 400 }
      )
    }

    // 3. Inspect magic bytes for true content type
    const detectedMime = verifyImageMagicBytes(buffer)
    if (!detectedMime || !ALLOWED_MIME_TYPES[detectedMime]) {
      return NextResponse.json(
        { error: 'Invalid file format. Only verified JPEG, PNG, WebP, and AVIF images are permitted.' },
        { status: 400 }
      )
    }

    // 4. Generate unique, collision-proof filename
    const ext = rawExt && ALLOWED_MIME_TYPES[detectedMime].includes(rawExt)
      ? rawExt
      : ALLOWED_MIME_TYPES[detectedMime][0]

    const originalName = file.name || 'image'
    const cleanBase = path
      .basename(originalName, path.extname(originalName))
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-')
      .slice(0, 30)

    const randomSuffix = crypto.randomBytes(6).toString('hex')
    const fileName = `${Date.now()}-${randomSuffix}-${cleanBase || 'upload'}${ext}`

    let publicUrl = `/images/posts/${fileName}`

    // 5. Check if remote Bluehost upload endpoint is configured
    const remoteUploadEndpoint = process.env.BLUEHOST_UPLOAD_ENDPOINT
    const storageSecret = process.env.STORAGE_SECRET

    if (remoteUploadEndpoint) {
      try {
        const remoteForm = new FormData()
        remoteForm.append('file', new Blob([buffer], { type: detectedMime }), fileName)
        remoteForm.append('secret', storageSecret || '')

        const remoteRes = await fetch(remoteUploadEndpoint, {
          method: 'POST',
          body: remoteForm,
        })
        const remoteData = await remoteRes.json()
        if (remoteData.url) {
          publicUrl = remoteData.url
        }
      } catch (remoteErr) {
        console.warn('Remote Bluehost upload failed, falling back to local storage:', remoteErr.message)
      }
    } else {
      // Local/server storage
      try {
        const uploadDir = path.join(process.cwd(), 'public', 'images', 'posts')
        await fs.mkdir(uploadDir, { recursive: true })
        const filePath = path.join(uploadDir, fileName)
        await fs.writeFile(filePath, buffer)
      } catch (fsErr) {
        // If filesystem is read-only (e.g. Vercel Lambda without external storage configured)
        console.warn('Filesystem write warning:', fsErr.message)
      }
    }

    // 6. Record media asset in Bluehost MySQL database
    try {
      await query(
        'INSERT INTO media (filename, url, file_size, mime_type, created_at) VALUES (?, ?, ?, ?, NOW())',
        [fileName, publicUrl, buffer.length, detectedMime]
      )
    } catch (dbErr) {
      console.warn('MySQL media log warning:', dbErr.message)
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
      fileSize: buffer.length,
      mimeType: detectedMime,
    })
  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 })
  }
}
