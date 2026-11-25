import { getPublishedPosts } from '@/lib/posts'
import PostCard from '@/components/ui/PostCard'
import Link from 'next/link'
import { BookOpen, Trophy, Target, DollarSign } from 'lucide-react'

export const metadata = {
  title: 'GTA 6 Guides & Walkthroughs | Tips, Heists & Strategies',
  description: 'Master Vice City with our GTA 6 strategy guides, mission walkthroughs, easter egg locations, and money-making strategies.',
}

export const revalidate = 60

export default async function GuidesPage() {
  const allPosts = await getPublishedPosts()
  const posts = allPosts.filter((p) => {
    const cat = p.category?.toLowerCase() || ''
    const tags = (p.tags || []).map((t) => String(t).toLowerCase().replace(/^#/, '').trim())
    return cat === 'guides' || cat === 'guide' || tags.includes('guide') || tags.includes('guides')
  })

  const quickTips = [
    { icon: DollarSign, title: 'Real Estate Empires', desc: 'Acquire Port Gellhorn shipping docks early for maximum passive cashflow.' },
    { icon: Target, title: 'Weapon Upgrades', desc: 'Silenced combat pistols are key for 3-star stealth robberies.' },
    { icon: Trophy, title: '100% Checklist', desc: 'Find all 100 hidden art deco packages scattered across Vice Beach.' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-gta-orange/40 bg-gta-orange/10 text-gta-orange text-xs font-heading tracking-[0.25em] mb-4">
          <BookOpen size={14} />
          STRATEGY & OPERATIONS MANUAL
        </div>
        <h1 className="font-heading text-5xl sm:text-7xl text-white tracking-wide mb-4">
          GTA 6 <span className="text-gta-orange neon-text-orange">GUIDES</span>
        </h1>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
          Comprehensive walkthroughs, mission solutions, secret weapon caches, and tactical advice from
          veteran Grand Theft Auto players.
        </p>
      </div>

      {/* Guide Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
        {quickTips.map((tip, i) => {
          const Icon = tip.icon
          return (
            <div key={i} className="card-gta p-6 border-l-4 border-l-gta-orange">
              <div className="w-10 h-10 rounded-lg bg-gta-orange/10 text-gta-orange flex items-center justify-center mb-3">
                <Icon size={20} />
              </div>
              <h3 className="font-heading text-2xl text-white mb-1">{tip.title}</h3>
              <p className="text-xs text-gray-400 font-body leading-relaxed">{tip.desc}</p>
            </div>
          )
        })}
      </div>

      <div className="mb-6 flex justify-between items-center text-xs text-gray-400">
        <div>FIELD MANUAL ARTICLES ({posts.length})</div>
        <Link href="/blog" className="text-gta-orange font-heading tracking-wider hover:underline">
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
          <p className="font-heading text-2xl text-gray-400">NO GUIDES PUBLISHED YET</p>
        </div>
      )}
    </div>
  )
}
