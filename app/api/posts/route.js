import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getPostsFromDisk } from '@/lib/posts'

export const dynamic = 'force-dynamic'

const postsDirectory = path.join(process.cwd(), 'content', 'posts')

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const statusFilter = searchParams.get('status') // 'Published', 'Draft', or null (all)

    let posts = []

    try {
      let sql = 'SELECT * FROM posts ORDER BY id DESC'
      let params = []
      if (statusFilter) {
        sql = 'SELECT * FROM posts WHERE LOWER(status) = LOWER(?) ORDER BY id DESC'
        params = [statusFilter]
      }

      const rows = await query(sql, params)
      if (rows && rows.length > 0) {
        posts = rows.map((r) => ({
          id: r.id,
          slug: r.slug,
          title: r.title,
          excerpt: r.excerpt || '',
          content: r.content || '',
          category: r.category || 'News',
          tags: r.tags ? r.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
          coverImage: r.cover_image || '/images/posts/map-coords.jpg',
          coverMainCaption: r.cover_main_caption || '',
          coverSubCaption: r.cover_sub_caption || '',
          author: r.author || 'Vice City Reporter',
          readingTime: r.reading_time || '4 min read',
          featured: Boolean(r.featured),
          status: r.status || 'Published',
          views: '1,500',
          date: r.created_at
            ? new Date(r.created_at).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
        }))
        return NextResponse.json({ success: true, posts })
      }
    } catch (dbErr) {
      console.warn('MySQL posts fetch warning, using disk fallback:', dbErr.message)
    }

    // Disk fallback if MySQL is empty or unreachable
    const diskPosts = getPostsFromDisk(true)
    const filtered = statusFilter
      ? diskPosts.filter((p) => (p.status || 'Published').toLowerCase() === statusFilter.toLowerCase())
      : diskPosts

    return NextResponse.json({ success: true, posts: filtered })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const {
      title,
      slug: customSlug,
      category = 'News',
      author = 'Vice City Reporter',
      excerpt = '',
      content = '',
      coverImage = '/images/posts/map-coords.jpg',
      coverMainCaption = '',
      coverSubCaption = '',
      tags = ['GTA 6', 'Vice City'],
      date = new Date().toISOString().split('T')[0],
      featured = false,
      readingTime = '4 min read',
      status = 'Published',
    } = body

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const slug =
      customSlug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

    const tagStr = Array.isArray(tags) ? tags.join(', ') : tags || ''
    const finalStatus = status || 'Published'

    // 1. MySQL IS THE PRIMARY SINGLE SOURCE OF TRUTH (PERSISTENT ACROSS VERCEL DEPLOYMENTS)
    let dbSuccess = false
    try {
      await query(
        `INSERT INTO posts (slug, title, excerpt, content, category, tags, cover_image, cover_main_caption, cover_sub_caption, author, reading_time, featured, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           title = VALUES(title),
           excerpt = VALUES(excerpt),
           content = VALUES(content),
           category = VALUES(category),
           tags = VALUES(tags),
           cover_image = VALUES(cover_image),
           cover_main_caption = VALUES(cover_main_caption),
           cover_sub_caption = VALUES(cover_sub_caption),
           author = VALUES(author),
           reading_time = VALUES(reading_time),
           featured = VALUES(featured),
           status = VALUES(status)`,
        [
          slug,
          title.trim(),
          excerpt.trim(),
          content,
          category,
          tagStr,
          coverImage,
          coverMainCaption,
          coverSubCaption,
          author,
          readingTime,
          featured ? 1 : 0,
          finalStatus,
        ]
      )
      dbSuccess = true
    } catch (dbErr) {
      console.warn('MySQL posts save error:', dbErr.message)
    }

    // 2. Safe local file mirror (only if in a writable development environment)
    if (process.env.VERCEL !== '1') {
      try {
        if (!fs.existsSync(postsDirectory)) {
          fs.mkdirSync(postsDirectory, { recursive: true })
        }
        const frontmatter = {
          title,
          date,
          excerpt,
          category,
          tags: Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t) => t.trim()) : [],
          coverImage,
          coverMainCaption,
          coverSubCaption,
          author,
          featured: Boolean(featured),
          readingTime,
          status: finalStatus,
        }
        const fileContent = matter.stringify(content, frontmatter)
        const filePath = path.join(postsDirectory, `${slug}.mdx`)
        fs.writeFileSync(filePath, fileContent, 'utf8')
      } catch (fsErr) {
        // Read-only filesystem warning, safe to ignore since DB is source of truth
        console.warn('Filesystem sync skipped (environment is read-only):', fsErr.message)
      }
    }

    const savedPost = {
      slug,
      title: title.trim(),
      excerpt,
      content,
      category,
      tags: Array.isArray(tags) ? tags : tagStr.split(',').map((t) => t.trim()).filter(Boolean),
      coverImage,
      coverMainCaption,
      coverSubCaption,
      author,
      featured: Boolean(featured),
      readingTime,
      status: finalStatus,
      date,
      persistedToDb: dbSuccess,
    }

    return NextResponse.json({
      success: true,
      slug,
      post: savedPost,
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    // 1. Delete from MySQL database (single source of truth)
    try {
      await query('DELETE FROM posts WHERE slug = ?', [slug])
    } catch (dbErr) {
      console.warn('MySQL posts delete warning:', dbErr.message)
    }

    // 2. Safe local file unlink if writable
    if (process.env.VERCEL !== '1') {
      try {
        const mdxPath = path.join(postsDirectory, `${slug}.mdx`)
        const mdPath = path.join(postsDirectory, `${slug}.md`)
        if (fs.existsSync(mdxPath)) fs.unlinkSync(mdxPath)
        else if (fs.existsSync(mdPath)) fs.unlinkSync(mdPath)
      } catch (fsErr) {
        console.warn('Filesystem unlink skipped:', fsErr.message)
      }
    }

    return NextResponse.json({ success: true, slug })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
