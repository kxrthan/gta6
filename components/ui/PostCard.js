'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, ArrowRight, Sparkles } from 'lucide-react'

const categoryColors = {
  News: 'text-gta-teal border-gta-teal/50 bg-gta-teal/10',
  Guides: 'text-gta-orange border-gta-orange/50 bg-gta-orange/10',
  Cheats: 'text-gta-pink border-gta-pink/50 bg-gta-pink/10',
  Characters: 'text-gta-purple border-gta-purple/50 bg-gta-purple/10',
  default: 'text-gray-400 border-gray-600 bg-gray-800/50',
}

export default function PostCard({ post, featured = false }) {
  const [imgError, setImgError] = useState(false)
  const colorClass = categoryColors[post.category] || categoryColors.default

  return (
    <motion.article
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className={`card-gta group border border-gta-border/80 hover:border-gta-pink/50 transition-all duration-300 shadow-xl ${
        featured ? 'md:flex md:items-stretch overflow-hidden' : ''
      }`}
    >
      {/* Cover Image / Art Banner */}
      <div className={`relative overflow-hidden ${featured ? 'md:w-1/2 min-h-[260px]' : 'h-52'}`}>
        {post.coverImage && !imgError ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            onError={() => setImgError(true)}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes={featured ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, 33vw'}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-tr from-[#120624] via-[#2d0938] to-[#631343] flex items-center justify-center p-6">
            <div className="absolute inset-0 retro-grid opacity-30" />
            <div className="relative text-center">
              <span className="font-heading text-4xl text-gta-pink/40 drop-shadow-[0_0_15px_rgba(255,46,136,0.3)]">
                GTA VI
              </span>
              <span className="block text-[10px] font-heading tracking-widest text-gta-teal/60 uppercase mt-1">
                VICE CITY WIRE
              </span>
            </div>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gta-dark via-transparent to-transparent opacity-80 z-10 pointer-events-none" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3 z-20 flex gap-2">
          <span className={`px-2.5 py-1 text-[10px] font-heading tracking-widest border rounded-md uppercase backdrop-blur-md ${colorClass}`}>
            {post.category}
          </span>
          {post.featured && (
            <span className="px-2.5 py-1 text-[10px] font-heading tracking-widest border rounded-md uppercase text-yellow-300 border-yellow-400/50 bg-black/60 backdrop-blur-md flex items-center gap-1">
              <Sparkles size={11} /> FEATURED
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className={`p-6 flex flex-col justify-between ${featured ? 'md:w-1/2 md:p-8' : ''}`}>
        <div>
          {/* Metadata Row */}
          <div className="flex items-center gap-3 text-[11px] text-gray-400 mb-3 flex-wrap font-body">
            <span className="flex items-center gap-1">
              <Calendar size={12} className="text-gta-teal" />
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
            {post.readingTime && (
              <span className="flex items-center gap-1">
                <Clock size={12} className="text-gta-orange" />
                {post.readingTime}
              </span>
            )}
            {post.author && (
              <span className="flex items-center gap-1 text-gray-500">
                <User size={12} />
                {post.author}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className={`font-heading tracking-wide mb-2 text-white group-hover:text-gta-pink transition-colors leading-tight ${
            featured ? 'text-2xl sm:text-3xl' : 'text-xl'
          }`}>
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </h3>

          {/* Excerpt */}
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3 font-body">
            {post.excerpt}
          </p>
        </div>

        <div>
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 rounded bg-gta-dark border border-gta-border/60 text-gray-400"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Read Dispatch Link */}
          <Link
            href={`/blog/${post.slug}`}
            className="text-gta-teal text-xs font-heading tracking-widest uppercase hover:text-white transition-colors inline-flex items-center gap-1.5 group/link"
          >
            <span>READ FULL DISPATCH</span>
            <ArrowRight size={14} className="transform group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.article>
  )
}
