export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gta6fanpage.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
