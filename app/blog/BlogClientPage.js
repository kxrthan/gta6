'use client'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import PostCard from '@/components/ui/PostCard'
import { Search, Filter, Tag as TagIcon, X, Sparkles, ArrowRight } from 'lucide-react'

const COVER_SPOTLIGHTS = [
  {
    title: 'GTA 6 Release Date Officially Confirmed: Everything We Know',
    slug: 'gta6-release-date-confirmed',
    category: 'News',
    coverImage: '/images/posts/release-date.jpg',
    tagline: 'LUCIA & JASON ESCAPE // VICE CITY DOCKS',
    excerpt: 'Rockstar Games has locked in the release window. Water chases, police helicopters, and high-stakes criminal contracts.',
  },
  {
    title: 'Top 10 Things to Do First in GTA 6 Vice City',
    slug: 'top-10-things-to-do-first',
    category: 'Guides',
    coverImage: '/images/posts/top-10.jpg',
    tagline: 'JACK OF HEARTS // NEON STRIP DISPATCH',
    excerpt: 'Neon lights, underground clubs, and safehouse operations. Essential day-one priorities for surviving Vice City.',
  },
  {
    title: 'Complete GTA 6 Cheat Codes Guide: All Platforms (PS5, Xbox, PC)',
    slug: 'complete-cheat-codes-guide',
    category: 'Cheats',
    coverImage: '/images/posts/cheats.jpg',
    tagline: 'SYNDICATE BOSS // UNLIMITED WEAPONS & BOUNTY',
    excerpt: 'Every confirmed button combination across PS5, Xbox Series X/S, and PC console commands.',
  },
]

export default function BlogClientPage({ posts, categories }) {
  const [activeCoverIndex, setActiveCoverIndex] = useState(0)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedTag, setSelectedTag] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 6

  // Extract all unique tags
  const allTags = useMemo(() => {
    const set = new Set()
    posts.forEach((p) => {
      if (Array.isArray(p.tags)) {
        p.tags.forEach((t) => set.add(t))
      }
    })
    return Array.from(set)
  }, [posts])

  // Filter posts based on category, tag, and search query
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        post.category?.toLowerCase() === selectedCategory.toLowerCase() ||
        (Array.isArray(post.tags) &&
          post.tags.some((t) => {
            const clean = String(t).toLowerCase().replace(/^#/, '').trim()
            const sel = selectedCategory.toLowerCase()
            return clean === sel || clean === sel.replace(/s$/, '') || `${clean}s` === sel
          }))

      const matchesTag =
        !selectedTag ||
        (Array.isArray(post.tags) && post.tags.includes(selectedTag))

      const matchesSearch =
        !search ||
        post.title?.toLowerCase().includes(search.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(search.toLowerCase()) ||
        (Array.isArray(post.tags) &&
          post.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())))

      return matchesCategory && matchesTag && matchesSearch
    })
  }, [posts, selectedCategory, selectedTag, search])

  // Pagination calculation
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage) || 1
  const displayedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage
    return filteredPosts.slice(startIndex, startIndex + postsPerPage)
  }, [filteredPosts, currentPage, postsPerPage])

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat)
    setCurrentPage(1)
  }

  const handleTagClick = (tag) => {
    setSelectedTag(selectedTag === tag ? null : tag)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setSearch('')
    setSelectedCategory('All')
    setSelectedTag(null)
    setCurrentPage(1)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gta-teal/40 bg-gta-teal/10 text-gta-teal text-xs font-heading tracking-[0.25em] mb-4"
        >
          <Sparkles size={14} />
          DAILY POSTS & LEAKS DISPATCH
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="font-heading text-5xl sm:text-7xl text-white tracking-wide mb-4"
        >
          VICE CITY <span className="gradient-text">BLOG</span>
        </motion.h1>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
          Daily dispatches from across Leonida. In-depth analysis of trailer details, verified cheat codes,
          character breakdowns, and step-by-step game guides.
        </p>
      </div>

      {/* Featured Cover Showcase Banner */}
      <div className="mb-12">
        <div className="relative rounded-2xl overflow-hidden border-2 border-gta-border/80 hover:border-gta-pink/60 transition-all duration-500 shadow-2xl bg-black/90">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px] sm:min-h-[440px]">
            {/* Visual Artwork Left Side (Main Hero Image) */}
            <div className="relative lg:col-span-7 min-h-[260px] sm:min-h-[340px] lg:min-h-full overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={COVER_SPOTLIGHTS[activeCoverIndex].coverImage}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={COVER_SPOTLIGHTS[activeCoverIndex].coverImage}
                    alt={COVER_SPOTLIGHTS[activeCoverIndex].title}
                    fill
                    priority
                    className="object-cover object-center brightness-[0.98] contrast-[1.05]"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/90" />
                </motion.div>
              </AnimatePresence>

              {/* Cover Art Watermark Pill */}
              <div className="absolute top-4 left-4 z-20">
                <span className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-heading tracking-widest uppercase bg-black/75 backdrop-blur-md border border-gta-teal/50 text-gta-teal flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-gta-teal animate-ping" />
                  OFFICIAL COVER ARTWORK
                </span>
              </div>
            </div>

            {/* Intel Details Right Side */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-b from-gta-card/95 via-gta-dark/95 to-black z-10 border-t lg:border-t-0 lg:border-l border-gta-border/60">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-heading tracking-widest px-2.5 py-1 rounded bg-gta-pink/20 text-gta-pink border border-gta-pink/40 uppercase">
                    {COVER_SPOTLIGHTS[activeCoverIndex].category}
                  </span>
                  <span className="text-xs text-gta-teal font-heading tracking-wider">
                    FEATURED STORY #{activeCoverIndex + 1}
                  </span>
                </div>

                <div className="text-[11px] font-mono text-gray-400 uppercase tracking-widest mb-2">
                  {COVER_SPOTLIGHTS[activeCoverIndex].tagline}
                </div>

                <h2 className="font-heading text-2xl sm:text-3xl text-white mb-3 leading-snug">
                  {COVER_SPOTLIGHTS[activeCoverIndex].title}
                </h2>

                <p className="text-xs sm:text-sm text-gray-300 font-body leading-relaxed mb-6">
                  {COVER_SPOTLIGHTS[activeCoverIndex].excerpt}
                </p>

                <Link
                  href={`/blog/${COVER_SPOTLIGHTS[activeCoverIndex].slug}`}
                  className="inline-flex items-center gap-2 gta-btn-primary py-2.5 px-5 text-sm uppercase tracking-wider"
                >
                  <span>READ INTEL DISPATCH</span>
                  <ArrowRight size={15} />
                </Link>
              </div>

              {/* 3-Thumbnail Cover Art Switcher */}
              <div className="pt-6 mt-6 border-t border-gta-border/60">
                <div className="text-[10px] font-heading tracking-widest text-gray-400 uppercase mb-2.5">
                  SELECT COVER ARTWORK:
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {COVER_SPOTLIGHTS.map((item, idx) => {
                    const isSelected = activeCoverIndex === idx
                    return (
                      <button
                        key={item.coverImage}
                        type="button"
                        onClick={() => setActiveCoverIndex(idx)}
                        className={`group relative h-16 sm:h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-gta-pink ring-2 ring-gta-pink/50 scale-[1.02]'
                            : 'border-gta-border/80 opacity-60 hover:opacity-100 hover:border-gta-teal'
                        }`}
                        title={item.title}
                      >
                        <Image
                          src={item.coverImage}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="150px"
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors" />
                        <span className="absolute bottom-1 left-1 text-[8px] font-heading px-1 rounded bg-black/80 text-white tracking-widest uppercase">
                          COVER {idx + 1}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar Container */}
      <div className="bg-gta-card/90 border border-gta-border/80 rounded-2xl p-4 sm:p-6 mb-10 shadow-xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
          {/* Live Search Input */}
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              placeholder="Search posts by title, excerpt, keywords..."
              className="w-full pl-11 pr-10 py-3 bg-gta-dark/90 border border-gta-border/80 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gta-pink focus:ring-1 focus:ring-gta-pink font-body text-sm transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-gray-400 font-heading tracking-wider mr-1 hidden sm:inline">
              CATEGORY:
            </span>
            {categories.map((cat) => {
              const active = selectedCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-3.5 py-2 rounded-lg font-heading text-xs tracking-wider uppercase transition-all duration-200 ${
                    active
                      ? 'bg-gta-pink text-white shadow-[0_0_15px_rgba(255,46,136,0.5)] border border-gta-pink'
                      : 'bg-gta-dark/70 text-gray-300 border border-gta-border hover:border-gray-500 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </div>

        {/* Popular Tags Row */}
        {allTags.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gta-border/50 flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 text-xs text-gray-400 font-heading tracking-wider mr-2">
              <TagIcon size={12} className="text-gta-teal" />
              <span>TAGS:</span>
            </div>
            {allTags.map((tag) => {
              const active = selectedTag === tag
              return (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                    active
                      ? 'bg-gta-teal text-gta-dark border-gta-teal font-semibold'
                      : 'border-gta-border bg-gta-dark/50 text-gray-400 hover:text-gta-teal hover:border-gta-teal/40'
                  }`}
                >
                  #{tag}
                </button>
              )
            })}

            {(search || selectedCategory !== 'All' || selectedTag) && (
              <button
                onClick={clearFilters}
                className="text-xs text-gta-pink hover:underline ml-auto font-heading tracking-wider flex items-center gap-1"
              >
                <X size={12} /> RESET FILTERS
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6 text-xs text-gray-400">
        <div>
          SHOWING <span className="text-white font-bold">{filteredPosts.length}</span> POSTS
          {selectedCategory !== 'All' && <span> IN <strong className="text-gta-pink">{selectedCategory.toUpperCase()}</strong></span>}
          {selectedTag && <span> TAGGED WITH <strong className="text-gta-teal">#{selectedTag}</strong></span>}
        </div>
        <div>
          PAGE {currentPage} OF {totalPages}
        </div>
      </div>

      {/* Posts Grid */}
      {displayedPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {displayedPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-gta-card/40 rounded-2xl border border-gta-border/60">
          <div className="font-heading text-4xl text-gray-500 mb-2">NO DISPATCHES FOUND</div>
          <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
            No posts matched your current search parameters. Clear the filters to see all available posts.
          </p>
          <button onClick={clearFilters} className="gta-btn-primary">
            RESET ALL FILTERS
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg bg-gta-card border border-gta-border text-xs font-heading tracking-wider uppercase text-gray-300 disabled:opacity-40 hover:border-gta-teal hover:text-white transition-all"
          >
            PREVIOUS
          </button>

          {[...Array(totalPages)].map((_, i) => {
            const pageNum = i + 1
            const isCurrent = currentPage === pageNum
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-10 h-10 rounded-lg font-heading text-sm transition-all ${
                  isCurrent
                    ? 'bg-gta-pink text-white border border-gta-pink shadow-[0_0_15px_rgba(255,46,136,0.5)]'
                    : 'bg-gta-card border border-gta-border text-gray-400 hover:border-gray-500 hover:text-white'
                }`}
              >
                {pageNum}
              </button>
            )
          })}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg bg-gta-card border border-gta-border text-xs font-heading tracking-wider uppercase text-gray-300 disabled:opacity-40 hover:border-gta-teal hover:text-white transition-all"
          >
            NEXT
          </button>
        </div>
      )}
    </div>
  )
}
