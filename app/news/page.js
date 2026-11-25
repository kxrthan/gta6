import { getPublishedPosts } from '@/lib/posts'
import PostCard from '@/components/ui/PostCard'
import Link from 'next/link'
import { Zap, BellRing } from 'lucide-react'

export const metadata = {
  title: 'GTA 6 News & Rockstar Updates | Daily Dispatches',
  description: 'Breaking GTA 6 news, official Rockstar Games announcements, release dates, gameplay trailers, and verified leaks.',
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
    { title: 'Worldwide Launch Active', desc: 'Rockstar Games officially released GTA 6 on November 19, 2026, on PS5 and Xbox Series X/S.', tag: 'OFFICIAL' },
    { title: 'Trailer 2 In Production', desc: 'Industry insiders report a full 3-minute story trailer is scheduled soon.', tag: 'LEAK' },
    { title: 'DualSense 2 Features', desc: 'Adaptive triggers for over 150 unique weapons and vehicles mapped.', tag: 'INTEL' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-gta-teal/40 bg-gta-teal/10 text-gta-teal text-xs font-heading tracking-[0.25em] mb-4">
          <Zap size={14} />
          OFFICIAL DISPATCH WIRE
        </div>
        <h1 className="font-heading text-5xl sm:text-7xl text-white tracking-wide mb-4">
          GTA 6 <span className="text-gta-teal neon-text-teal">NEWS</span>
        </h1>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
          The fastest source for verified Grand Theft Auto VI news, official press updates from Take-Two Interactive,
          and community coverage.
        </p>
      </div>

      {/* Quick Alert Ticker Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        {quickAlerts.map((alert, i) => (
          <div key={i} className="card-gta p-5 border-l-4 border-l-gta-teal">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-heading tracking-widest px-2 py-0.5 rounded bg-gta-teal/15 text-gta-teal border border-gta-teal/30">
                {alert.tag}
              </span>
              <BellRing size={14} className="text-gray-500" />
            </div>
            <h3 className="font-heading text-xl text-white mb-1">{alert.title}</h3>
            <p className="text-xs text-gray-400 leading-relaxed font-body">{alert.desc}</p>
          </div>
        ))}
      </div>

      {/* News Posts Grid */}
      <div className="mb-6 flex justify-between items-center text-xs text-gray-400">
        <div>LATEST NEWS ARTICLES ({posts.length})</div>
        <Link href="/blog" className="text-gta-teal font-heading tracking-wider hover:underline">
          ALL POSTS →
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
    </div>
  )
}
