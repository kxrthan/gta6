import { getPublishedPosts, getFeaturedPost } from '@/lib/posts'
import { getCheats, getVehicles } from '@/lib/data'
import HeroSection from '@/components/home/HeroSection'
import CarCruiseAnimation from '@/components/ui/CarCruiseAnimation'
import PostCard from '@/components/ui/PostCard'
import TrendingCheats from '@/components/home/TrendingCheats'
import NewsletterSignup from '@/components/ui/NewsletterSignup'
import LandingCategories from '@/components/home/LandingCategories'
import Link from 'next/link'
import { Zap, ArrowRight, ShieldCheck, Car, Gauge } from 'lucide-react'

export const revalidate = 60 // ISR revalidation

export const metadata = {
  title: {
    absolute: 'GTA 6 Fan Hub – News, Guides, Cheats, Vehicles & Map',
  },
  description:
    'Explore GTA 6 news, Vice City guides, cheat codes, vehicle information, characters and map updates. Your independent GTA 6 fan resource.',
  alternates: {
    canonical: 'https://gta6fanpage.com',
  },
  openGraph: {
    title: 'GTA 6 Fan Hub – News, Guides, Cheats, Vehicles & Map',
    description:
      'Explore GTA 6 news, Vice City guides, cheat codes, vehicle information, characters and map updates. Your independent GTA 6 fan resource.',
    url: 'https://gta6fanpage.com',
    siteName: 'GTA 6 Fan Hub',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/gta6-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'GTA 6 Fan Hub - Vice City and Leonida Guide',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GTA 6 Fan Hub – News, Guides, Cheats, Vehicles & Map',
    description:
      'Explore GTA 6 news, Vice City guides, cheat codes, vehicle information, characters and map updates. Your independent GTA 6 fan resource.',
    images: ['/images/gta6-hero.jpg'],
  },
}

export default async function HomePage() {
  const allPosts = await getPublishedPosts()
  const featured = await getFeaturedPost()
  const latestPosts = allPosts.filter((p) => p.slug !== featured?.slug).slice(0, 6)
  const vehiclesData = await getVehicles()
  const cheatsData = await getCheats()

  const homeSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://gta6fanpage.com/#website',
        name: 'GTA 6 Fan Hub',
        url: 'https://gta6fanpage.com',
        description:
          'Explore GTA 6 news, Vice City guides, cheat codes, vehicle information, characters and map updates. Your independent GTA 6 fan resource.',
        inLanguage: 'en-US',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://gta6fanpage.com/blog?q={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
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
      {
        '@type': 'WebPage',
        '@id': 'https://gta6fanpage.com/#webpage',
        url: 'https://gta6fanpage.com',
        name: 'GTA 6 Fan Hub – News, Guides, Cheats, Vehicles & Map',
        description:
          'Explore GTA 6 news, Vice City guides, cheat codes, vehicle information, characters and map updates. Your independent GTA 6 fan resource.',
        isPartOf: {
          '@type': 'WebSite',
          '@id': 'https://gta6fanpage.com/#website',
        },
        about: {
          '@type': 'VideoGame',
          name: 'Grand Theft Auto VI',
          genre: ['Action-adventure', 'Open world'],
          gamePlatform: ['PlayStation 5', 'Xbox Series X/S'],
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
          ],
        },
      },
    ],
  }

  return (
    <div>
      {/* Google Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }}
      />

      {/* 1. Fullscreen Hero Section */}
      <HeroSection />

      {/* Main Page Content with Top-View Car Cruise Track (Starts at FEATURED DISPATCH and ends at FEATURED DISPATCH) */}
      <div className="relative overflow-x-clip">
        {/* Top-View U-Shaped Moving Car Pursuit (Transparent, No Background) */}
        <CarCruiseAnimation />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 3. Featured Post Banner */}
        {featured && (
          <section className="py-12 sm:py-16">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-gta-pink animate-pulse" />
                <span className="font-heading text-xs tracking-[0.3em] text-gta-pink uppercase">
                  FEATURED DISPATCH
                </span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl text-white tracking-wide">
                FEATURED <span className="gradient-text">STORY &amp; DISPATCH</span>
              </h2>
            </div>
            <PostCard post={featured} featured />
          </section>
        )}

        {/* 4. Confirmed GTA 6 Cars Showcase */}
        <section className="py-12 sm:py-16 border-t border-gta-border/50">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-gta-pink font-heading tracking-widest text-xs uppercase mb-2">
                <Car size={16} className="text-gta-pink" />
                CONFIRMED RIDES &amp; POLICE INTERCEPTORS
              </div>
              <h2 className="font-heading text-4xl sm:text-5xl text-white tracking-wide">
                GTA 6 <span className="text-gta-pink neon-text-pink">VEHICLES</span>
              </h2>
            </div>
            <Link
              href="/vehicles"
              aria-label="Explore all GTA 6 vehicles, supercars, and performance statistics"
              className="inline-flex items-center gap-2 text-gta-teal hover:text-white font-heading text-sm tracking-wider uppercase transition-colors group"
            >
              EXPLORE ALL CARS &amp; STATS
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {vehiclesData.slice(0, 3).map((car) => (
              <div key={car.id} className="card-gta p-6 border border-gta-border/80 hover:border-gta-pink/60 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-heading tracking-widest px-2.5 py-1 rounded bg-gta-pink/10 border border-gta-pink/30 text-gta-pink uppercase">
                      {car.badge}
                    </span>
                    <span className="text-xs font-mono font-bold text-green-400">{car.price}</span>
                  </div>
                  <h3 className="font-heading text-2xl text-white mb-1 leading-tight">{car.name}</h3>
                  <p className="text-xs text-gray-400 mb-4 line-clamp-2">{car.desc}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-300 bg-black/40 p-2.5 rounded-lg border border-gta-border/60 mb-4">
                    <span className="flex items-center gap-1"><Gauge size={12} className="text-gta-teal" /> {car.topSpeed} MPH</span>
                    <span className="flex items-center gap-1"><Zap size={12} className="text-gta-orange" /> {car.acceleration}s (0-60)</span>
                    <span className="flex items-center gap-1"><ShieldCheck size={12} className="text-green-400" /> {car.armor}/10 Armor</span>
                  </div>
                </div>

                <Link
                  href="/vehicles"
                  aria-label={`View full specifications for ${car.name}`}
                  className="text-xs font-heading tracking-widest uppercase text-gta-teal hover:text-white flex items-center justify-between"
                >
                  <span>VIEW FULL SPECS</span>
                  <span>→</span>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Trending Cheats Quick-Access */}
        <TrendingCheats cheats={cheatsData} />

        {/* 6. Latest Posts Grid */}
        <section className="py-12 sm:py-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="font-heading text-xs tracking-[0.3em] text-gta-teal uppercase block mb-1">
                DAILY INTEL FEED
              </span>
              <h2 className="font-heading text-4xl sm:text-5xl text-white tracking-wide">
                LATEST <span className="gradient-text">DISPATCHES</span>
              </h2>
            </div>
            <Link
              href="/blog"
              aria-label="Explore all GTA 6 news, guides, and blog posts"
              className="inline-flex items-center gap-2 text-gta-teal hover:text-white font-heading text-sm tracking-wider uppercase transition-colors group"
            >
              EXPLORE ALL POSTS
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>

        {/* 7. Browse by Category */}
        <section className="py-16 sm:py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="font-heading text-xs tracking-[0.3em] text-gta-purple uppercase block mb-2">
              DISCOVER VICE CITY
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl text-white tracking-wide mb-3">
              EXPLORE THE <span className="gradient-text">SECTORS</span>
            </h2>
            <p className="text-gray-400 text-sm">
              From supercars and high-speed VCPD chases to interactive maps and cheat codes.
            </p>
          </div>

          <LandingCategories />
        </section>
      </div>

      {/* 8. Newsletter Subscription with "Mission Passed" banner */}
      <NewsletterSignup />
      </div>
    </div>
  )
}
