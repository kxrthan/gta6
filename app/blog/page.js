import { getPublishedPosts, getAllCategories } from '@/lib/posts'
import BlogClientPage from './BlogClientPage'

export const metadata = {
  title: 'GTA 6 Blog & Daily Dispatches | News, Guides, Cheats',
  description: 'Read the latest daily GTA 6 blog posts, analysis, mission guides, and Vice City gameplay tips.',
}

export const revalidate = 60

export default async function BlogPage() {
  const posts = await getPublishedPosts()
  const categories = ['All', ...(await getAllCategories())]

  return <BlogClientPage posts={posts} categories={categories} />
}
