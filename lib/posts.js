import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import { query } from '@/lib/db'

const postsDirectory = path.join(process.cwd(), 'content', 'posts')

// Helper: Read posts from local filesystem (fallback and static build seed)
export function getPostsFromDisk(includeDrafts = false) {
  if (!fs.existsSync(postsDirectory)) return []

  const fileNames = fs.readdirSync(postsDirectory).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))

  const posts = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.(mdx|md)$/, '')
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)
    const rt = readingTime(content)

    return {
      slug,
      content,
      ...data,
      status: data.status || 'Published',
      readingTime: data.readingTime || rt.text,
      date: data.date ? String(data.date) : new Date().toISOString().split('T')[0],
    }
  })

  const filtered = includeDrafts
    ? posts
    : posts.filter((p) => (p.status || 'Published').toLowerCase() === 'published')

  return filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
}

export function getPostBySlugFromDisk(slug, includeDrafts = false) {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`)
  const mdPath = path.join(postsDirectory, `${slug}.md`)

  let filePath = null
  if (fs.existsSync(fullPath)) filePath = fullPath
  else if (fs.existsSync(mdPath)) filePath = mdPath
  else return null

  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)
  const rt = readingTime(content)
  const status = data.status || 'Published'

  if (!includeDrafts && status.toLowerCase() === 'draft') {
    return null
  }

  return {
    slug,
    content,
    ...data,
    status,
    readingTime: data.readingTime || rt.text,
    date: data.date ? String(data.date) : new Date().toISOString().split('T')[0],
  }
}

// -------------------------------------------------------------
// DATABASE SINGLE SOURCE OF TRUTH (PERSISTENT ON VERCEL & BLUEHOST)
// -------------------------------------------------------------

function formatDbPost(row) {
  const content = row.content || ''
  const rt = row.reading_time || readingTime(content).text

  let tagsArray = []
  if (Array.isArray(row.tags)) {
    tagsArray = row.tags
  } else if (typeof row.tags === 'string' && row.tags.trim()) {
    tagsArray = row.tags.split(',').map((t) => t.trim()).filter(Boolean)
  }

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt || '',
    content,
    category: row.category || 'News',
    tags: tagsArray,
    coverImage: row.cover_image || '/images/posts/map-coords.jpg',
    coverMainCaption: row.cover_main_caption || '',
    coverSubCaption: row.cover_sub_caption || '',
    author: row.author || 'Vice City Reporter',
    readingTime: rt,
    featured: Boolean(row.featured),
    status: row.status || 'Published',
    date: row.created_at
      ? new Date(row.created_at).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
  }
}

export async function getPublishedPosts(includeDrafts = false) {
  try {
    const sql = includeDrafts
      ? 'SELECT * FROM posts ORDER BY id DESC'
      : "SELECT * FROM posts WHERE LOWER(status) = 'published' ORDER BY id DESC"

    const rows = await query(sql)
    if (rows && rows.length > 0) {
      return rows.map(formatDbPost)
    }
  } catch (err) {
    console.warn('MySQL posts query failed, falling back to disk:', err.message)
  }

  return getPostsFromDisk(includeDrafts)
}

export async function getPostBySlug(slug, includeDrafts = false) {
  if (!slug) return null

  try {
    const rows = await query('SELECT * FROM posts WHERE slug = ? LIMIT 1', [slug])
    if (rows && rows.length > 0) {
      const post = formatDbPost(rows[0])
      if (!includeDrafts && post.status.toLowerCase() === 'draft') {
        return null
      }
      return post
    }
  } catch (err) {
    console.warn('MySQL getPostBySlug failed, falling back to disk:', err.message)
  }

  return getPostBySlugFromDisk(slug, includeDrafts)
}

export async function getFeaturedPost() {
  try {
    const rows = await query(
      "SELECT * FROM posts WHERE LOWER(status) = 'published' AND featured = 1 ORDER BY id DESC LIMIT 1"
    )
    if (rows && rows.length > 0) {
      return formatDbPost(rows[0])
    }
    const fallbackRows = await query(
      "SELECT * FROM posts WHERE LOWER(status) = 'published' ORDER BY id DESC LIMIT 1"
    )
    if (fallbackRows && fallbackRows.length > 0) {
      return formatDbPost(fallbackRows[0])
    }
  } catch (err) {
    console.warn('MySQL getFeaturedPost failed, falling back to disk:', err.message)
  }

  const posts = getPostsFromDisk(false)
  return posts.find((p) => p.featured) || posts[0] || null
}

export async function getPostsByCategory(category) {
  const posts = await getPublishedPosts()
  return posts.filter((p) => p.category?.toLowerCase() === category.toLowerCase())
}

export async function getAllCategories() {
  const posts = await getPublishedPosts()
  const cats = [...new Set(posts.map((p) => p.category).filter(Boolean))]
  return cats
}

export async function getAllTags() {
  const posts = await getPublishedPosts()
  const tags = posts.flatMap((p) => p.tags || [])
  return [...new Set(tags)]
}

// Synchronous wrapper maintained for backwards compatibility
export function getAllPosts(includeDrafts = false) {
  return getPostsFromDisk(includeDrafts)
}
