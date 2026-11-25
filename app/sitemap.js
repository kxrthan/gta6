import { getPublishedPosts } from '@/lib/posts'

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gta6fanpage.com'
  const posts = await getPublishedPosts()

  // Fixed stable audit date for static routes to prevent volatile timestamps on unchanged content
  const siteAuditDate = new Date('2026-11-25T00:00:00.000Z')

  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: siteAuditDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: siteAuditDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cheats`,
      lastModified: siteAuditDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/vehicles`,
      lastModified: siteAuditDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: siteAuditDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: siteAuditDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/characters`,
      lastModified: siteAuditDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/map`,
      lastModified: siteAuditDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: siteAuditDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: siteAuditDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  const postRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date || siteAuditDate),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [...staticRoutes, ...postRoutes]
}
