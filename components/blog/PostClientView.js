'use client'
import { useState } from 'react'
import {
  Share2,
  Link as LinkIcon,
  Check,
  Bookmark,
  ThumbsUp,
} from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

// Inline Social SVGs
function XSocialIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function RedditSocialIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" {...props}>
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.702zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.688-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.197-2.512-.73a.326.326 0 0 0-.232-.095z" />
    </svg>
  )
}

export default function PostClientView({ post, headings = [] }) {
  const [copied, setCopied] = useState(false)
  const [likes, setLikes] = useState(88)
  const [hasLiked, setHasLiked] = useState(false)
  const { addToast } = useToast()

  const postUrl =
    typeof window !== 'undefined'
      ? window.location.href
      : `https://gta6fansite.vercel.app/blog/${post.slug}`

  const handleCopy = () => {
    navigator.clipboard.writeText(postUrl)
    setCopied(true)
    addToast('Dispatch link copied to clipboard!', 'info')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleLike = () => {
    if (!hasLiked) {
      setLikes((l) => l + 1)
      setHasLiked(true)
      addToast('Respect +1! Post upvoted.', 'mission', 2500)
    }
  }

  const shareTwitter = () => {
    const text = encodeURIComponent(`${post.title} — GTA 6 Fan Hub`)
    const url = encodeURIComponent(postUrl)
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank')
  }

  const shareReddit = () => {
    const title = encodeURIComponent(post.title)
    const url = encodeURIComponent(postUrl)
    window.open(`https://reddit.com/submit?url=${url}&title=${title}`, '_blank')
  }

  return (
    <aside className="space-y-6">

        {/* Interactive Respect / Like Counter */}
        <div className="card-gta p-5 text-center border-yellow-400/40">
          <button
            type="button"
            onClick={handleLike}
            className={`w-full py-3.5 px-4 rounded-xl font-heading text-lg tracking-wider flex items-center justify-center gap-2 transition-all ${
              hasLiked
                ? 'bg-yellow-400 text-black shadow-[0_0_20px_rgba(250,204,21,0.5)]'
                : 'bg-gta-dark border border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10'
            }`}
          >
            <ThumbsUp size={18} className={hasLiked ? 'fill-current' : ''} />
            {hasLiked ? 'RESPECT GIVEN! ★' : 'GIVE RESPECT'} ({likes})
          </button>
        </div>

        {/* Table of Contents */}
        {headings.length > 0 && (
          <div className="card-gta p-5">
            <div className="flex items-center gap-2 font-heading text-xs text-gta-teal uppercase tracking-widest mb-4">
              <Bookmark size={14} />
              DISPATCH SECTIONS
            </div>
            <nav className="space-y-2.5">
              {headings.map((h, i) => (
                <a
                  key={i}
                  href={`#${h.slug}`}
                  className={`block text-xs text-gray-400 hover:text-gta-pink transition-colors font-body ${
                    h.level === 3 ? 'pl-3 text-gray-500' : 'font-medium'
                  }`}
                >
                  • {h.text}
                </a>
              ))}
            </nav>
          </div>
        )}

        {/* Social Share Box */}
        <div className="card-gta p-5">
          <div className="flex items-center gap-2 font-heading text-xs text-gta-pink uppercase tracking-widest mb-4">
            <Share2 size={14} />
            SHARE DISPATCH
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={shareTwitter}
              className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-gta-dark border border-gta-border hover:border-gta-teal text-gray-300 hover:text-gta-teal transition-all text-[10px] font-heading tracking-wider"
            >
              <XSocialIcon className="mb-1" />
              POST ON X
            </button>
            <button
              type="button"
              onClick={shareReddit}
              className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-gta-dark border border-gta-border hover:border-orange-400 text-gray-300 hover:text-orange-400 transition-all text-[10px] font-heading tracking-wider"
            >
              <RedditSocialIcon className="mb-1" />
              REDDIT
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-gta-dark border border-gta-border hover:border-green-400 text-gray-300 hover:text-green-400 transition-all text-[10px] font-heading tracking-wider"
            >
              {copied ? <Check size={15} className="text-green-400 mb-1" /> : <LinkIcon size={15} className="mb-1" />}
              {copied ? 'COPIED' : 'COPY'}
            </button>
          </div>
        </div>
      </aside>
  )
}
