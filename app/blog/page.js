import { getPublishedPosts, getAllCategories } from '@/lib/posts'
import BlogClientPage from './BlogClientPage'

export const metadata = {
  title: {
    absolute: 'GTA 6 Blog & Daily Dispatches | News, Guides & Vice City Intel',
  },
  description:
    'Read the latest daily GTA 6 blog posts, trailer analysis, mission guides, and Vice City gameplay tips from verified sources.',
  alternates: {
    canonical: 'https://gta6fanpage.com/blog',
  },
  openGraph: {
    title: 'GTA 6 Blog & Daily Dispatches | News, Guides & Vice City Intel',
    description:
      'Read the latest daily GTA 6 blog posts, trailer analysis, mission guides, and Vice City gameplay tips from verified sources.',
    url: 'https://gta6fanpage.com/blog',
    siteName: 'GTA 6 Fan Hub',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/posts/map-coords.jpg',
        width: 1200,
        height: 630,
        alt: 'GTA 6 Blog and Daily Dispatches',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GTA 6 Blog & Daily Dispatches | News, Guides & Vice City Intel',
    description:
      'Read the latest daily GTA 6 blog posts, trailer analysis, mission guides, and Vice City gameplay tips from verified sources.',
    images: ['/images/posts/map-coords.jpg'],
  },
}

export const revalidate = 60

export default async function BlogPage() {
  const posts = await getPublishedPosts()
  const categories = ['All', ...(await getAllCategories())]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://gta6fanpage.com/blog#webpage',
        url: 'https://gta6fanpage.com/blog',
        name: 'GTA 6 Blog & Daily Dispatches | News, Guides & Vice City Intel',
        description:
          'Read the latest daily GTA 6 blog posts, trailer analysis, mission guides, and Vice City gameplay tips from verified sources.',
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
              name: 'Blog',
              item: 'https://gta6fanpage.com/blog',
            },
          ],
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogClientPage posts={posts} categories={categories} />
    </>
  )
}
