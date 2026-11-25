import { getPostBySlug, getPublishedPosts } from '@/lib/posts'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, ArrowLeft, Tag, Sparkles } from 'lucide-react'
import ReadingProgress from '@/components/ui/ReadingProgress'
import PostClientView from '@/components/blog/PostClientView'
import PostCard from '@/components/ui/PostCard'
import DispatchImage from '@/components/blog/DispatchImage'

export const dynamicParams = true // Enable on-demand SSR/ISR for new articles created after deployment

const mdxComponents = {
  DispatchImage,
  img: (props) => <DispatchImage {...props} />,
}

export async function generateStaticParams() {
  const posts = await getPublishedPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug)
  if (!post) {
    return { title: 'Post Not Found | GTA 6 Fan Hub' }
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gta6fanpage.com'
  const canonicalUrl = `${baseUrl}/blog/${post.slug}`
  const ogImageUrl = post.coverImage?.startsWith('http')
    ? post.coverImage
    : `${baseUrl}${post.coverImage || '/og-image.png'}`

  return {
    title: {
      absolute: `${post.title} | GTA 6 Fan Hub`,
    },
    description: post.excerpt,
    keywords: post.tags || ['GTA 6', 'Vice City', 'Grand Theft Auto VI'],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${post.title} | GTA 6 Fan Hub`,
      description: post.excerpt,
      url: canonicalUrl,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author || 'Vice City Reporter'],
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [ogImageUrl],
    },
  }
}

// Simple heading extractor from markdown
function extractHeadings(markdown) {
  if (!markdown) return []
  const headingRegex = /^(#{2,3})\s+(.+)$/gm
  const headings = []
  let match
  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    const slug = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    headings.push({ level, text, slug })
  }
  return headings
}

export default async function SinglePostPage({ params }) {
  const post = await getPostBySlug(params.slug)
  if (!post) notFound()

  const allPosts = await getPublishedPosts()
  const headings = extractHeadings(post.content)

  // Related posts from same category, excluding current post
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3)

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gta6fanpage.com'
  const articleUrl = `${baseUrl}/blog/${post.slug}`
  const imageUrl = post.coverImage?.startsWith('http')
    ? post.coverImage
    : `${baseUrl}${post.coverImage || '/og-image.png'}`

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: post.author || 'Vice City Reporter',
    },
    publisher: {
      '@type': 'Organization',
      name: 'GTA 6 Fan Hub',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/og-image.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    image: imageUrl,
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${baseUrl}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: articleUrl,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ReadingProgress />

      <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-xs font-heading tracking-wider">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-gray-400 hover:text-gta-teal transition-colors"
          >
            <ArrowLeft size={14} />
            BACK TO ALL DISPATCHES
          </Link>
          <span className="text-gray-600">/</span>
          <span className="text-gta-pink uppercase">{post.category}</span>
        </div>

        {/* Post Header */}
        <header className="max-w-4xl mb-10">
          <div className="flex items-center gap-2.5 flex-wrap mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-heading tracking-widest uppercase border border-gta-pink/40 bg-gta-pink/10 text-gta-pink">
              {post.category}
            </span>
            {post.featured && (
              <span className="px-3 py-1 rounded-full text-xs font-heading tracking-widest uppercase border border-yellow-400/40 bg-yellow-400/10 text-yellow-400 flex items-center gap-1">
                <Sparkles size={12} /> FEATURED
              </span>
            )}
            {post.readingTime && (
              <span className="text-xs text-gray-400 font-body flex items-center gap-1">
                <Clock size={12} className="text-gta-teal" />
                {post.readingTime}
              </span>
            )}
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl text-white tracking-tight leading-tight mb-6">
            {post.title}
          </h1>

          <p className="text-lg text-gray-300 font-body leading-relaxed mb-6 border-l-2 border-gta-teal pl-4 italic">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-6 text-xs text-gray-400 border-t border-b border-gta-border/60 py-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-gta-pink to-gta-purple flex items-center justify-center text-white font-heading font-bold text-xs">
                {(post.author || 'V')[0]}
              </div>
              <span className="text-gray-200 font-medium">{post.author || 'Vice City Reporter'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-gta-teal" />
              <span>
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Tag size={13} className="text-gta-purple" />
                {post.tags.map((t) => (
                  <span key={t} className="text-gray-400 hover:text-white">
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* 2-Column Layout: Article Body + Interactive Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Article Content */}
          <div className="lg:col-span-8">
            {/* Visual Cover Banner */}
            <div className="relative w-full h-72 sm:h-[420px] rounded-2xl overflow-hidden mb-10 border border-gta-border shadow-2xl bg-gradient-to-tr from-gta-navy via-gta-dark to-[#1f0b2e] group">
              {post.coverImage ? (
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  priority
                  className="object-cover object-center brightness-[0.95] contrast-[1.05] transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 800px"
                />
              ) : (
                <div className="absolute inset-0 retro-grid opacity-30" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-gta-dark via-black/30 to-transparent z-10" />
              <div className="absolute bottom-6 left-6 right-6 z-20 flex items-end justify-between">
                <div>
                  <span className="font-heading text-xs tracking-widest text-gta-teal uppercase block mb-1 drop-shadow">
                    {post.coverSubCaption || 'VICE CITY POLICE DEPARTMENT ARCHIVE // RECON PHOTO'}
                  </span>
                  <span className="font-heading text-2xl sm:text-3xl text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] font-bold">
                    {post.coverMainCaption || `CASE FILE #${post.slug.toUpperCase().slice(0, 10)}`}
                  </span>
                </div>
                <span className="hidden sm:inline-block px-3 py-1 rounded bg-black/75 border border-gta-pink/50 text-gta-pink font-heading text-xs tracking-widest uppercase backdrop-blur-md">
                  OFFICIAL INTEL
                </span>
              </div>
            </div>

            {/* Markdown Body with Tailwind Typography */}
            <div className="prose prose-invert prose-lg max-w-none
              prose-headings:font-heading prose-headings:tracking-wide prose-headings:text-white
              prose-h1:text-4xl prose-h2:text-3xl prose-h2:text-gta-teal prose-h2:border-b prose-h2:border-gta-border/60 prose-h2:pb-2
              prose-h3:text-2xl prose-h3:text-gta-orange
              prose-p:text-gray-300 prose-p:leading-relaxed prose-p:font-body
              prose-a:text-gta-pink prose-a:font-semibold hover:prose-a:text-gta-teal
              prose-strong:text-white prose-strong:font-bold
              prose-code:text-gta-pink prose-code:bg-black/60 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono
              prose-pre:bg-gta-card prose-pre:border prose-pre:border-gta-border/80 prose-pre:rounded-xl
              prose-blockquote:border-l-4 prose-blockquote:border-gta-pink prose-blockquote:bg-gta-card/40 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:text-gray-300
              prose-table:border prose-table:border-gta-border prose-table:rounded-xl prose-table:overflow-hidden
              prose-th:bg-gta-navy prose-th:text-gta-teal prose-th:font-heading prose-th:tracking-wider prose-th:p-3
              prose-td:p-3 prose-td:border-t prose-td:border-gta-border/50
              prose-li:text-gray-300">
              <MDXRemote source={post.content} components={mdxComponents} />
            </div>

            {/* Author Bio Box */}
            <div className="mt-14 p-6 rounded-2xl bg-gta-card border border-gta-border/80 flex flex-col sm:flex-row items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-gta-pink via-gta-purple to-gta-teal p-0.5 flex-shrink-0">
                <div className="w-full h-full rounded-full bg-gta-dark flex items-center justify-center font-heading text-2xl text-gta-pink">
                  {(post.author || 'V')[0]}
                </div>
              </div>
              <div className="text-center sm:text-left flex-1">
                <div className="font-heading text-lg text-white mb-1">
                  DISPATCH FILED BY: {post.author || 'Vice City Underground Reporter'}
                </div>
                <p className="text-xs text-gray-400 font-body leading-relaxed">
                  Covering Miami&apos;s criminal underbelly and Rockstar Games releases since 2002.
                  Providing daily news, verified cheat codes, and tactical walkthroughs for GTA 6.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Sidebar (Sticky) */}
          <div className="lg:col-span-4">
            <div className="sticky top-28">
              <PostClientView post={post} headings={headings} />
            </div>
          </div>
        </div>

        {/* Related Dispatches Section */}
        {relatedPosts.length > 0 && (
          <section className="mt-20 pt-12 border-t border-gta-border/60">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="font-heading text-xs tracking-[0.25em] text-gta-pink uppercase block mb-1">
                  MORE IN THIS CATEGORY
                </span>
                <h2 className="font-heading text-3xl sm:text-4xl text-white">
                  RELATED <span className="gradient-text">DISPATCHES</span>
                </h2>
              </div>
              <Link
                href="/blog"
                className="text-xs font-heading tracking-wider text-gta-teal hover:underline"
              >
                VIEW ALL →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <PostCard key={related.slug} post={related} />
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  )
}
