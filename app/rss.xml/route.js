import RSS from 'rss'
import { getPublishedPosts } from '@/lib/posts'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gta6fanpage.com'
  const posts = await getPublishedPosts()

  const feed = new RSS({
    title: 'GTA 6 Fan Hub | Daily Vice City News, Cheats & Intel',
    description: 'Your ultimate unofficial source for daily GTA 6 news, cheats, guides, and Vice City dispatches.',
    feed_url: `${baseUrl}/rss.xml`,
    site_url: baseUrl,
    image_url: `${baseUrl}/og-image.png`,
    managingEditor: 'editor@gta6fanpage.com (GTA 6 Fan Hub Editorial)',
    webMaster: 'admin@gta6fanpage.com',
    copyright: `${new Date().getFullYear()} GTA 6 Fan Hub`,
    language: 'en-US',
    pubDate: new Date().toUTCString(),
    ttl: 60,
  })

  posts.forEach((post) => {
    feed.item({
      title: post.title,
      description: post.excerpt,
      url: `${baseUrl}/blog/${post.slug}`,
      guid: post.slug,
      categories: [post.category, ...(post.tags || [])],
      author: post.author || 'Vice City Reporter',
      date: new Date(post.date || new Date()),
    })
  })

  return new Response(feed.xml({ indent: true }), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  })
}
