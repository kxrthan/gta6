import { getPublishedPosts } from '@/lib/posts'
import PostCard from '@/components/ui/PostCard'
import Link from 'next/link'
import { BookOpen, Trophy, Target, DollarSign, HelpCircle, ArrowRight, ShieldCheck } from 'lucide-react'

export const metadata = {
  title: {
    absolute: 'GTA 6 Guides, Tips & Walkthroughs – Vice City Strategy',
  },
  description:
    'Master Vice City with verified GTA 6 walkthroughs, weapon management tips, mission preparation, safehouse locations, and gameplay strategies.',
  alternates: {
    canonical: 'https://gta6fanpage.com/guides',
  },
  openGraph: {
    title: 'GTA 6 Guides, Tips & Walkthroughs – Vice City Strategy',
    description:
      'Master Vice City with verified GTA 6 walkthroughs, weapon management tips, mission preparation, safehouse locations, and gameplay strategies.',
    url: 'https://gta6fanpage.com/guides',
    siteName: 'GTA 6 Fan Hub',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/posts/top-10.jpg',
        width: 1200,
        height: 630,
        alt: 'GTA 6 Strategy Guides and Vice City Walkthroughs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GTA 6 Guides, Tips & Walkthroughs – Vice City Strategy',
    description:
      'Master Vice City with verified GTA 6 walkthroughs, weapon management tips, mission preparation, safehouse locations, and gameplay strategies.',
    images: ['/images/posts/top-10.jpg'],
  },
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
    {
      icon: Target,
      title: 'Weapon Inventory & Trunk Stash',
      desc: 'GTA 6 features a physicalized weapon inventory. Plan loadouts carefully and use personal vehicle trunks to store heavy firearms and tactical gear.',
      linkText: 'WEAPON LOADOUT TIPS',
      href: '/blog/top-10-things-to-do-first',
    },
    {
      icon: DollarSign,
      title: 'Early Cashflow & Robberies',
      desc: 'Small-scale convenience store hold-ups and cash courier van interceptions provide essential starting funds before high-risk bank heist opportunities.',
      linkText: 'DAY-ONE CASH GUIDE',
      href: '/blog/top-10-things-to-do-first',
    },
    {
      icon: Trophy,
      title: 'Leonida Exploration & Radar',
      desc: 'Scout Vice Beach, Port Gellhorn, and the Keys early to uncover police response times, hidden vehicle spawn points, and tactical safehouses.',
      linkText: 'EXPLORE RADAR MAP',
      href: '/map',
    },
  ]

  const faqs = [
    {
      q: 'When will complete story mission walkthroughs be available?',
      a: 'Full step-by-step mission guides, gold medal requirements, and story branch walkthroughs will be published on day one of the November 19, 2026 launch.',
    },
    {
      q: 'Do cheat codes disable achievements and trophies in GTA 6?',
      a: 'In all previous Grand Theft Auto installments, activating button cheat codes disables PlayStation trophies and Xbox achievements for that active session. We recommend keeping an unmodded clean manual save.',
    },
    {
      q: 'Which platforms do these GTA 6 guides cover?',
      a: 'Our guides provide specific button prompts and tactical strategies for PlayStation 5 and Xbox Series X/S, with PC coverage following its platform release.',
    },
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://gta6fanpage.com/guides#webpage',
        url: 'https://gta6fanpage.com/guides',
        name: 'GTA 6 Guides, Tips & Walkthroughs – Vice City Strategy',
        description:
          'Master Vice City with verified GTA 6 walkthroughs, weapon management tips, mission preparation, safehouse locations, and gameplay strategies.',
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
              name: 'Guides',
              item: 'https://gta6fanpage.com/guides',
            },
          ],
        },
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://gta6fanpage.com/guides#faq',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.a,
          },
        })),
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
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-gta-orange/40 bg-gta-orange/10 text-gta-orange text-xs font-heading tracking-[0.25em] mb-4">
          <BookOpen size={14} />
          STRATEGY &amp; OPERATIONS MANUAL
        </div>
        <h1 className="font-heading text-5xl sm:text-7xl text-white tracking-wide mb-4">
          GTA 6 <span className="text-gta-orange neon-text-orange">GUIDES</span>
        </h1>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
          Tactical advice, gameplay mechanics analysis, mission preparation, and survival strategies for navigating
          the high-stakes criminal underworld of Vice City and Leonida.
        </p>
      </header>

      {/* Guide Highlights / Core Tips */}
      <section className="mb-14" aria-labelledby="core-tips-heading">
        <div className="flex items-center justify-between mb-4">
          <h2 id="core-tips-heading" className="font-heading text-2xl text-white tracking-wider flex items-center gap-2">
            <Trophy size={18} className="text-gta-orange" />
            CORE GAMEPLAY <span className="text-gta-orange">STRATEGY BRIEFS</span>
          </h2>
          <span className="text-xs text-gray-500 font-mono">TACTICAL ESSENTIALS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {quickTips.map((tip, i) => {
            const Icon = tip.icon
            return (
              <div key={i} className="card-gta p-6 border-l-4 border-l-gta-orange flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-gta-orange/10 text-gta-orange flex items-center justify-center mb-3">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-heading text-2xl text-white mb-2">{tip.title}</h3>
                  <p className="text-xs text-gray-400 font-body leading-relaxed mb-4">{tip.desc}</p>
                </div>
                <Link
                  href={tip.href}
                  className="text-xs font-heading tracking-wider text-gta-orange hover:text-white inline-flex items-center gap-1 transition-colors"
                >
                  {tip.linkText} <ArrowRight size={12} />
                </Link>
              </div>
            )
          })}
        </div>
      </section>

      {/* Published Guides Grid */}
      <section className="mb-14" aria-labelledby="field-manuals-heading">
        <div className="mb-6 flex justify-between items-center text-xs text-gray-400">
          <h2 id="field-manuals-heading" className="font-heading text-xl sm:text-2xl text-white tracking-wide">
            FIELD MANUAL <span className="gradient-text">ARTICLES</span> ({posts.length})
          </h2>
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
      </section>

      {/* Frequently Asked Questions */}
      <section className="card-gta p-6 sm:p-8 border border-gta-border/80 mb-12" aria-labelledby="guides-faq-heading">
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle size={20} className="text-gta-orange" />
          <h2 id="guides-faq-heading" className="font-heading text-2xl text-white tracking-wide">
            FREQUENTLY ASKED <span className="text-gta-orange">QUESTIONS</span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-black/40 border border-gta-border/60">
              <h3 className="font-heading text-lg text-white mb-2">{faq.q}</h3>
              <p className="text-xs text-gray-300 font-body leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contextual Hub Footer */}
      <footer className="pt-8 border-t border-gta-border/60 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-gta-orange" />
          <span>Walkthroughs and strategies developed for GTA 6 story mode and mission systems.</span>
        </div>
        <div className="flex items-center gap-4 font-heading tracking-wider">
          <Link href="/cheats" className="hover:text-gta-orange transition-colors">CHEAT CODES</Link>
          <Link href="/map" className="hover:text-gta-teal transition-colors">RADAR MAP</Link>
          <Link href="/vehicles" className="hover:text-gta-pink transition-colors">VEHICLES</Link>
        </div>
      </footer>
    </div>
  )
}
