import { Shield, Sparkles, Terminal, FileCheck2, Globe, Heart, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: {
    absolute: 'About GTA 6 Fan Hub – Mission, Editorial Policy & Disclaimer',
  },
  description:
    'About GTA 6 Fan Hub: An independent fan publication dedicated to Grand Theft Auto VI. Read our editorial standards, accuracy policies, and trademark notice.',
  alternates: {
    canonical: 'https://gta6fanpage.com/about',
  },
  openGraph: {
    title: 'About GTA 6 Fan Hub – Mission, Editorial Policy & Disclaimer',
    description:
      'About GTA 6 Fan Hub: An independent fan publication dedicated to Grand Theft Auto VI. Read our editorial standards, accuracy policies, and trademark notice.',
    url: 'https://gta6fanpage.com/about',
    siteName: 'GTA 6 Fan Hub',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/gta6-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'About GTA 6 Fan Hub - Editorial Standards and Mission',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About GTA 6 Fan Hub – Mission, Editorial Policy & Disclaimer',
    description:
      'About GTA 6 Fan Hub: An independent fan publication dedicated to Grand Theft Auto VI. Read our editorial standards, accuracy policies, and trademark notice.',
    images: ['/images/gta6-hero.jpg'],
  },
}

export default function AboutPage() {
  const editorialPrinciples = [
    {
      icon: FileCheck2,
      title: 'Fact Verification Standards',
      desc: 'We strictly distinguish official Rockstar Games announcements from community discoveries and unconfirmed leaks. Speculative content is explicitly labeled.',
    },
    {
      icon: Shield,
      title: 'Cheat Code Testing',
      desc: 'All cheat button combinations published in our catalog are physically verified on PlayStation 5, Xbox Series X/S, or PC controllers to guarantee accuracy.',
    },
    {
      icon: Globe,
      title: 'Open Fan Community',
      desc: 'Created by passionate, lifelong Grand Theft Auto fans since the original Vice City release. We build tools, maps, and guides for players worldwide.',
    },
    {
      icon: Heart,
      title: 'Independent & Non-Commercial',
      desc: 'An independent, non-commercial fan initiative built to preserve gaming history, analyze trailer telemetry, and help players navigate Leonida.',
    },
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        '@id': 'https://gta6fanpage.com/about#webpage',
        url: 'https://gta6fanpage.com/about',
        name: 'About GTA 6 Fan Hub – Mission, Editorial Policy & Disclaimer',
        description:
          'About GTA 6 Fan Hub: An independent fan publication dedicated to Grand Theft Auto VI. Read our editorial standards, accuracy policies, and trademark notice.',
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
              name: 'About',
              item: 'https://gta6fanpage.com/about',
            },
          ],
        },
      },
      {
        '@type': 'Organization',
        '@id': 'https://gta6fanpage.com/#organization',
        name: 'GTA 6 Fan Hub',
        url: 'https://gta6fanpage.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://gta6fanpage.com/images/gta6-hero.jpg',
          width: 1200,
          height: 630,
        },
      },
    ],
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-gta-purple/40 bg-gta-purple/10 text-gta-purple text-xs font-heading tracking-[0.25em] mb-4">
          <Sparkles size={14} />
          OUR STORY &amp; EDITORIAL STANDARDS
        </div>
        <h1 className="font-heading text-5xl sm:text-7xl text-white tracking-wide mb-4">
          ABOUT <span className="gradient-text">GTA 6 FAN HUB</span>
        </h1>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
          An independent, community-driven resource covering Grand Theft Auto VI news, verified cheat codes,
          in-depth guides, vehicle breakdowns, and Vice City interactive cartography.
        </p>
      </header>

      {/* Main Content Card */}
      <article className="card-gta p-6 sm:p-10 space-y-8 text-gray-300 font-body leading-relaxed mb-10">
        <section>
          <h2 className="font-heading text-3xl text-white tracking-wide mb-3">
            THE VICE CITY COMMUNITY VISION
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-gray-300 mb-4">
            For over two decades, Vice City has remained a monumental cultural landmark in gaming history. When Rockstar Games
            unveiled the official Grand Theft Auto VI Trailer 1 confirming the state of Leonida with protagonists Lucia and Jason,
            our community assembled to build the most comprehensive, accurate, and responsive fan hub on the web.
          </p>
          <p className="text-sm sm:text-base leading-relaxed text-gray-300">
            Our mission is simple: provide players with rigorously verified news, tested cheat codes, high-speed interactive map
            exploration, and detailed vehicle performance statistics without misleading clickbait or unverified rumors.
          </p>
        </section>

        {/* Editorial Standards Grid */}
        <section className="pt-2">
          <h2 className="font-heading text-2xl text-gta-teal mb-4">
            EDITORIAL STANDARDS &amp; ACCURACY POLICY
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {editorialPrinciples.map((item, i) => {
              const Icon = item.icon
              return (
                <div key={i} className="p-4 rounded-xl bg-gta-dark/70 border border-gta-border/60">
                  <div className="flex items-center gap-2 text-gta-teal mb-2">
                    <Icon size={18} />
                    <h3 className="font-heading text-lg text-white">{item.title}</h3>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Modern Web Tech Architecture */}
        <section className="pt-6 border-t border-gta-border/60">
          <h2 className="font-heading text-2xl text-gta-pink mb-4 flex items-center gap-2">
            <Terminal size={20} />
            POWERED BY HIGH-PERFORMANCE WEB TECH
          </h2>
          <p className="text-xs text-gray-400 mb-4">
            Designed for instant page loads, sub-second route transitions, and responsive mobile rendering across USA, UK, Canada, and European networks:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono text-center">
            <div className="p-3 rounded-lg bg-gta-dark border border-gta-border">
              <span className="text-white block font-bold">Next.js 14</span>
              <span className="text-gray-500 text-[10px]">App Router &amp; SSG</span>
            </div>
            <div className="p-3 rounded-lg bg-gta-dark border border-gta-border">
              <span className="text-white block font-bold">Tailwind CSS</span>
              <span className="text-gray-500 text-[10px]">Custom Neon Palette</span>
            </div>
            <div className="p-3 rounded-lg bg-gta-dark border border-gta-border">
              <span className="text-white block font-bold">Framer Motion</span>
              <span className="text-gray-500 text-[10px]">60FPS UI Physics</span>
            </div>
            <div className="p-3 rounded-lg bg-gta-dark border border-gta-border">
              <span className="text-white block font-bold">MySQL + ISR</span>
              <span className="text-gray-500 text-[10px]">60s Cache Invalidation</span>
            </div>
          </div>
        </section>

        {/* Strict Legal Disclaimer & Trademark Attribution */}
        <section className="p-5 rounded-xl bg-red-950/20 border border-red-500/30 text-xs text-gray-400 leading-relaxed">
          <div className="flex items-center gap-2 font-heading text-sm text-red-400 uppercase tracking-wider mb-2">
            <Shield size={16} />
            NON-AFFILIATION NOTICE &amp; TRADEMARK ATTRIBUTION
          </div>
          <p className="mb-2">
            <strong>GTA 6 Fan Hub</strong> is an independent, non-commercial fan website created by enthusiasts for the gaming community.
            This site is not affiliated with, sponsored by, authorized by, or endorsed by <strong>Rockstar Games</strong>, <strong>Take-Two Interactive Software, Inc.</strong>, or any of their subsidiaries.
          </p>
          <p>
            Grand Theft Auto, GTA, Vice City, and all associated logos, character likenesses, and game assets are registered trademarks
            of Rockstar Games and Take-Two Interactive Software, Inc. All trademarks and copyrighted materials belong to their respective owners.
          </p>
        </section>
      </article>

      {/* Editorial Contact CTA */}
      <footer className="text-center space-y-4">
        <Link href="/contact" className="gta-btn-primary inline-flex items-center gap-2 text-lg py-3 px-8">
          <span>CONTACT THE EDITORIAL TEAM</span>
          <ArrowRight size={18} />
        </Link>
        <div className="flex justify-center gap-6 text-xs text-gray-500 font-heading tracking-wider">
          <Link href="/news" className="hover:text-gta-teal transition-colors">NEWS FEED</Link>
          <Link href="/guides" className="hover:text-gta-orange transition-colors">GAME GUIDES</Link>
          <Link href="/vehicles" className="hover:text-gta-pink transition-colors">CONFIRMED CARS</Link>
          <Link href="/map" className="hover:text-green-400 transition-colors">RADAR MAP</Link>
        </div>
      </footer>
    </div>
  )
}
