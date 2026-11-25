import { getPublishedPosts } from '@/lib/posts'
import PostCard from '@/components/ui/PostCard'
import Link from 'next/link'
import { Zap, BellRing, ArrowRight, ShieldCheck, Newspaper } from 'lucide-react'

export const metadata = {
  title: {
    absolute: 'GTA 6 News & Rockstar Games Updates – Daily Intel & Leaks',
  },
  description:
    'Stay ahead with verified GTA 6 news, official Rockstar Games announcements, release schedule updates, trailer breakdowns, and confirmed features.',
  alternates: {
    canonical: 'https://gta6fanpage.com/news',
  },
  openGraph: {
    title: 'GTA 6 News & Rockstar Games Updates – Daily Intel & Leaks',
    description:
      'Stay ahead with verified GTA 6 news, official Rockstar Games announcements, release schedule updates, trailer breakdowns, and confirmed features.',
    url: 'https://gta6fanpage.com/news',
    siteName: 'GTA 6 Fan Hub',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/posts/release-date.jpg',
        width: 1200,
        height: 630,
        alt: 'GTA 6 Breaking News and Official Rockstar Announcements',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GTA 6 News & Rockstar Games Updates – Daily Intel & Leaks',
    description:
      'Stay ahead with verified GTA 6 news, official Rockstar Games announcements, release schedule updates, trailer breakdowns, and confirmed features.',
    images: ['/images/posts/release-date.jpg'],
  },
}

export const revalidate = 60

export default async function NewsPage() {
  const allPosts = await getPublishedPosts()
  const posts = allPosts.filter((p) => {
    const cat = p.category?.toLowerCase() || ''
    const tags = (p.tags || []).map((t) => String(t).toLowerCase().replace(/^#/, '').trim())
    return cat === 'news' || tags.includes('news') || tags.includes('new')
  })

  const quickAlerts = [
    {
      title: 'Launch Confirmed for Fall 2026',
      desc: 'Rockstar Games and Take-Two have scheduled Grand Theft Auto VI for November 19, 2026, on PlayStation 5 and Xbox Series X/S.',
      tag: 'OFFICIAL',
      source: 'Rockstar Games Press Release',
      href: '/blog/gta6-release-date-confirmed',
    },
    {
      title: 'Vice City & Leonida Setting',
      desc: 'Trailer 1 confirmed the return to Vice City and the surrounding state of Leonida, showcasing the most immersive open world to date.',
      tag: 'VERIFIED',
      source: 'Official Trailer 1',
      href: '/map',
    },
    {
      title: 'DualSense 5 Haptic Integration',
      desc: 'Next-gen console mapping leverages adaptive triggers for realistic weapon recoil and dynamic vehicular throttle control.',
      tag: 'TECH INTEL',
      source: 'Sony PS5 Hardware Spec',
      href: '/vehicles',
    },
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://gta6fanpage.com/news#webpage',
        url: 'https://gta6fanpage.com/news',
        name: 'GTA 6 News & Rockstar Games Updates – Daily Intel & Leaks',
        description:
          'Stay ahead with verified GTA 6 news, official Rockstar Games announcements, release schedule updates, trailer breakdowns, and confirmed features.',
        isPartOf: {
          '@type': 'WebSite',
          '@id': 'https://gta6fanpage.com/#website',
          name: 'GTA 6 Fan Hub',
          url: 'https://gta6fanpage.com',
        },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://gta6fanpage.com',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'News',
              item: 'https://gta6fanpage.com/news',
            },
          ],
        },
      },
    ],
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-gta-teal/40 bg-gta-teal/10 text-gta-teal text-xs font-heading tracking-[0.25em] mb-4">
          <Zap size={14} />
          OFFICIAL DISPATCH WIRE
        </div>
        <h1 className="font-heading text-5xl sm:text-7xl text-white tracking-wide mb-4">
          GTA 6 <span className="text-gta-teal neon-text-teal">NEWS</span>
        </h1>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
          The verified intelligence feed for Grand Theft Auto VI news, official announcements from Rockstar Games
          and Take-Two Interactive, trailer analysis, and confirmed game features.
        </p>
      </header>

      {/* Quick Alert Ticker Cards */}
      <section className="mb-14" aria-labelledby="news-briefs-heading">
        <div className="flex items-center justify-between mb-4">
          <h2 id="news-briefs-heading" className="font-heading text-2xl text-white tracking-wider flex items-center gap-2">
            <Newspaper size={18} className="text-gta-teal" />
            CONFIRMED <span className="text-gta-teal">INTEL BRIEFS</span>
          </h2>
          <span className="text-xs text-gray-500 font-mono">ROCKSTAR &amp; COMMUNITY FEEDS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickAlerts.map((alert, i) => (
            <div key={i} className="card-gta p-5 border-l-4 border-l-gta-teal flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-heading tracking-widest px-2 py-0.5 rounded bg-gta-teal/15 text-gta-teal border border-gta-teal/30">
                    {alert.tag}
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono">{alert.source}</span>
                </div>
                <h3 className="font-heading text-xl text-white mb-1.5">{alert.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed font-body mb-3">{alert.desc}</p>
              </div>
              <Link
                href={alert.href}
                className="text-xs font-heading tracking-wider text-gta-teal hover:text-white inline-flex items-center gap-1 transition-colors"
              >
                READ INTEL BREAKDOWN <ArrowRight size={12} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* News Posts Grid */}
      <section aria-labelledby="news-articles-heading">
        <div className="mb-6 flex justify-between items-center text-xs text-gray-400">
          <h2 id="news-articles-heading" className="font-heading text-xl sm:text-2xl text-white tracking-wide">
            PUBLISHED <span className="gradient-text">DISPATCHES</span> ({posts.length})
          </h2>
          <Link
            href="/blog"
            className="text-gta-teal font-heading tracking-wider hover:underline inline-flex items-center gap-1"
          >
            ALL ARCHIVES →
          </Link>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gta-card/40 rounded-xl border border-gta-border">
            <p className="font-heading text-2xl text-gray-400">NO NEWS DISPATCHES YET</p>
          </div>
        )}
      </section>

      {/* Contextual Hub Footer */}
      <footer className="mt-16 pt-8 border-t border-gta-border/60 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-gta-teal" />
          <span>All news items verified against official Take-Two and Rockstar Games press releases.</span>
        </div>
        <div className="flex items-center gap-4 font-heading tracking-wider">
          <Link href="/guides" className="hover:text-gta-teal transition-colors">GAME GUIDES</Link>
          <Link href="/vehicles" className="hover:text-gta-pink transition-colors">VEHICLE ROSTER</Link>
          <Link href="/cheats" className="hover:text-gta-orange transition-colors">CHEAT CODES</Link>
        </div>
      </footer>
    </div>
  )
}
