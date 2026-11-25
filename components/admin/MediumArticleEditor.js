'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Image as ImageIcon,
  Heading2,
  Heading3,
  Quote,
  List,
  MapPin,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
  Eye,
  FileText,
  Calendar,
  User,
  Tag,
  ExternalLink,
  Sparkles,
  X,
  Type,
  Code,
  Upload,
} from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

// Markdown parser into structured sections
export function markdownToSections(markdown) {
  if (!markdown || typeof markdown !== 'string') return []

  const rawBlocks = markdown.split(/\n\n+/)
  const sections = []

  rawBlocks.forEach((block, index) => {
    const trimmed = block.trim()
    if (!trimmed) return

    // Heading 2: ## text
    if (trimmed.startsWith('## ')) {
      sections.push({
        id: `sec-${Date.now()}-${index}`,
        type: 'heading2',
        content: trimmed.replace(/^##\s+/, ''),
      })
      return
    }

    // Heading 3: ### text
    if (trimmed.startsWith('### ')) {
      sections.push({
        id: `sec-${Date.now()}-${index}`,
        type: 'heading3',
        content: trimmed.replace(/^###\s+/, ''),
      })
      return
    }

    // Heading 1: # text
    if (trimmed.startsWith('# ')) {
      sections.push({
        id: `sec-${Date.now()}-${index}`,
        type: 'heading2',
        content: trimmed.replace(/^#\s+/, ''),
      })
      return
    }

    // DispatchImage JSX block: <DispatchImage src="..." ... />
    const dispatchImgMatch = trimmed.match(/<DispatchImage\s+([^>]+)\/?>/i)
    if (dispatchImgMatch) {
      const attrsStr = dispatchImgMatch[1]
      const getAttr = (name) => {
        const m = attrsStr.match(new RegExp(`${name}=["']([^"']*)["']`, 'i'))
        return m ? m[1] : ''
      }
      const subCaption = getAttr('subCaption') || ''
      const caption = getAttr('mainCaption') || getAttr('caption') || ''
      sections.push({
        id: `sec-${Date.now()}-${index}`,
        type: 'image',
        url: getAttr('src') || '/images/posts/map-coords.jpg',
        alt: getAttr('alt') || 'GTA 6 Image',
        subCaption,
        caption,
        mainCaption: caption,
      })
      return
    }

    // Image: ![alt](url) \n *caption*
    const imgMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)(?:\s*\n\s*\*([^*]+)\*)?/)
    if (imgMatch) {
      const fullCap = (imgMatch[3] || '').trim()
      let subCaption = ''
      let caption = fullCap
      if (fullCap.includes('//')) {
        const parts = fullCap.split('//').map((p) => p.trim())
        subCaption = parts[0]
        caption = parts.slice(1).join(' // ')
      }
      sections.push({
        id: `sec-${Date.now()}-${index}`,
        type: 'image',
        alt: imgMatch[1] || 'GTA 6 Image',
        url: imgMatch[2],
        caption,
        subCaption,
        mainCaption: caption,
      })
      return
    }

    // Blockquote: > text
    if (trimmed.startsWith('> ')) {
      const quoteText = trimmed.replace(/^>\s*/gm, '')
      const parts = quoteText.split('—')
      sections.push({
        id: `sec-${Date.now()}-${index}`,
        type: 'quote',
        quote: parts[0]?.trim() || '',
        author: parts[1]?.trim() || '',
      })
      return
    }

    // Bullet / Numbered List
    if (/^(\*|-|\d+\.)\s+/m.test(trimmed)) {
      const lines = trimmed.split('\n').filter(Boolean)
      const items = lines.map((l) => l.replace(/^(\*|-|\d+\.)\s+/, '').trim())
      sections.push({
        id: `sec-${Date.now()}-${index}`,
        type: 'list',
        items,
      })
      return
    }

    // Coordinates Card check
    if (trimmed.includes('Latitude / Longitude') || trimmed.includes('Coordinates')) {
      sections.push({
        id: `sec-${Date.now()}-${index}`,
        type: 'coordinates',
        content: trimmed,
      })
      return
    }

    // Default: Paragraph
    sections.push({
      id: `sec-${Date.now()}-${index}`,
      type: 'paragraph',
      content: trimmed,
    })
  })

  return sections
}

// Convert structured sections back to clean Markdown
export function sectionsToMarkdown(sections) {
  if (!Array.isArray(sections)) return ''

  return sections
    .map((sec) => {
      switch (sec.type) {
        case 'heading2':
          return `## ${sec.content || ''}`
        case 'heading3':
          return `### ${sec.content || ''}`
        case 'paragraph':
          return sec.content || ''
        case 'image': {
          const sub = (sec.subCaption || '').replace(/"/g, '&quot;')
          const main = (sec.caption || sec.mainCaption || '').replace(/"/g, '&quot;')
          const alt = (sec.alt || main || 'GTA 6 Intel Image').replace(/"/g, '&quot;')
          const src = sec.url || '/images/posts/map-coords.jpg'
          return `<DispatchImage src="${src}" alt="${alt}" subCaption="${sub}" mainCaption="${main}" />`
        }
        case 'quote': {
          const author = sec.author ? ` — ${sec.author}` : ''
          return `> "${sec.quote || ''}"${author}`
        }
        case 'list': {
          if (!Array.isArray(sec.items)) return ''
          return sec.items.map((it, idx) => `${idx + 1}. ${it}`).join('\n')
        }
        case 'coordinates':
          return sec.content || ''
        default:
          return sec.content || ''
      }
    })
    .filter(Boolean)
    .join('\n\n')
}

export default function MediumArticleEditor({
  post,
  onSave,
  onCancel,
}) {
  const [title, setTitle] = useState(post?.title || 'New Leaked Map Coordinates Discovered in Vice City Suburbs')
  const [excerpt, setExcerpt] = useState(
    post?.excerpt ||
      'Data miners have decrypted coordinate sets pointing to a massive underground bunker complex in the northern Leonida mountain ranges.'
  )
  const [author, setAuthor] = useState(post?.author || 'Vice City Reporter')
  const [category, setCategory] = useState(post?.category || 'News')
  const [date, setDate] = useState(post?.date || '2026-11-16')
  const [coverImage, setCoverImage] = useState(post?.coverImage || '/images/posts/map-coords.jpg')
  const [coverMainCaption, setCoverMainCaption] = useState(
    post?.coverMainCaption || `CASE FILE #${(post?.slug || 'NEW-LEAKED').toUpperCase().slice(0, 10)}`
  )
  const [coverSubCaption, setCoverSubCaption] = useState(
    post?.coverSubCaption || 'VICE CITY POLICE DEPARTMENT ARCHIVE // RECON PHOTO'
  )
  const [tags, setTags] = useState(() => {
    if (Array.isArray(post?.tags)) {
      return post.tags.map((t) => (t.startsWith('#') ? t : `#${t}`)).join(', ')
    }
    return post?.tags || '#news, #vice-city'
  })

  // Tag helper utilities
  const cleanTagList = (tags || '')
    .split(/[,\s]+/)
    .map((t) => t.trim().replace(/^#/, ''))
    .filter(Boolean)

  const hasTag = (tag) => cleanTagList.map((t) => t.toLowerCase()).includes(tag.toLowerCase().replace(/^#/, ''))

  const toggleTag = (tag) => {
    const clean = tag.toLowerCase().replace(/^#/, '')
    let current = cleanTagList.map((t) => t.toLowerCase())
    if (current.includes(clean)) {
      current = current.filter((t) => t !== clean)
    } else {
      current.push(clean)
    }
    setTags(current.map((t) => `#${t}`).join(', '))
  }

  const removeTag = (tag) => {
    const clean = tag.toLowerCase().replace(/^#/, '')
    const current = cleanTagList.filter((t) => t.toLowerCase() !== clean)
    setTags(current.map((t) => `#${t}`).join(', '))
  }
  const [sections, setSections] = useState(() => markdownToSections(post?.content || ''))
  const [activeMenuIndex, setActiveMenuIndex] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [editorMode, setEditorMode] = useState('medium') // 'medium' | 'markdown'
  const [rawMarkdown, setRawMarkdown] = useState('')
  const [lastSaved, setLastSaved] = useState('All changes in sync')

  const { addToast } = useToast()

  // Image Upload State & Refs
  const [isUploading, setIsUploading] = useState(false)
  const globalImageInputRef = useRef(null)
  const coverImageInputRef = useRef(null)
  const sectionFileInputRefs = useRef({})
  const pendingInsertIndexRef = useRef(null)

  const uploadImageFile = async (file) => {
    if (!file) return null
    if (!file.type.startsWith('image/')) {
      if (addToast) addToast('Please select a valid image file (.png, .jpg, .webp, .gif)', 'cheat')
      return null
    }

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      if (addToast) addToast(`Uploading "${file.name}"...`, 'mission', 2000)
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to upload image')
      }

      const data = await res.json()
      if (addToast) addToast(`📸 Image "${file.name}" uploaded successfully!`, 'mission', 2500)
      return data.url
    } catch (err) {
      console.error(err)
      if (addToast) addToast(`Upload failed: ${err.message}`, 'cheat')
      return null
    } finally {
      setIsUploading(false)
    }
  }

  // Triggered when user clicks "+ Image"
  const handleTriggerAddImage = (index) => {
    pendingInsertIndexRef.current = index
    if (globalImageInputRef.current) {
      globalImageInputRef.current.value = ''
      globalImageInputRef.current.click()
    }
  }

  // When file is picked from the file dialog after clicking "+ Image"
  const handleGlobalImageChange = async (e) => {
    const file = e.target.files?.[0]
    const targetIdx = pendingInsertIndexRef.current !== null ? pendingInsertIndexRef.current : sections.length
    if (file) {
      const uploadedUrl = await uploadImageFile(file)
      if (uploadedUrl) {
        const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ').toUpperCase()
        insertSection(targetIdx, 'image', {
          url: uploadedUrl,
          alt: file.name,
          subCaption: 'OFFICIAL INTEL // FIELD CAPTURE',
          caption: cleanTitle,
          mainCaption: cleanTitle,
        })
      }
    } else {
      // If user opened file picker and pressed cancel, insert block in ready-to-upload state
      insertSection(targetIdx, 'image', {
        url: '',
        alt: 'GTA 6 Dispatch Image',
        subCaption: 'OFFICIAL INTEL // FIELD CAPTURE',
        caption: 'NEW DISPATCH INTEL',
        mainCaption: 'NEW DISPATCH INTEL',
      })
    }
    pendingInsertIndexRef.current = null
  }

  // Calculate reading stats
  const totalWords = [
    title,
    excerpt,
    sections.map((s) => s.content || s.quote || (s.items && s.items.join(' ')) || '').join(' '),
  ]
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length

  const readingTime = `${Math.max(1, Math.ceil(totalWords / 180))} min read`

  // Switch between Medium live canvas and raw markdown
  const handleToggleMode = (mode) => {
    if (mode === 'markdown') {
      setRawMarkdown(sectionsToMarkdown(sections))
    } else {
      setSections(markdownToSections(rawMarkdown))
    }
    setEditorMode(mode)
  }

  // Section manipulation
  const updateSection = (id, fields) => {
    setSections((prev) =>
      prev.map((sec) => (sec.id === id ? { ...sec, ...fields } : sec))
    )
    setLastSaved('Draft updated...')
  }

  const deleteSection = (id) => {
    setSections((prev) => prev.filter((sec) => sec.id !== id))
    setLastSaved('Section deleted')
  }

  const moveSection = (index, direction) => {
    const newIdx = direction === 'up' ? index - 1 : index + 1
    if (newIdx < 0 || newIdx >= sections.length) return
    setSections((prev) => {
      const copy = [...prev]
      const [moved] = copy.splice(index, 1)
      copy.splice(newIdx, 0, moved)
      return copy
    })
    setLastSaved('Section reordered')
  }

  // Insert section at index
  const insertSection = (index, type, initialData = {}) => {
    let newSec = {
      id: `sec-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type,
      ...initialData,
    }

    switch (type) {
      case 'heading2':
        newSec.content = initialData.content || 'New Section Heading'
        break
      case 'heading3':
        newSec.content = initialData.content || 'Sub-section Heading'
        break
      case 'paragraph':
        newSec.content = initialData.content || 'Start typing your dispatch paragraph here...'
        break
      case 'image':
        newSec.url = initialData.url !== undefined ? initialData.url : ''
        newSec.alt = initialData.alt || 'Leonida Satellite Intel'
        newSec.subCaption = initialData.subCaption || 'OFFICIAL INTEL // SATELLITE RECON'
        newSec.caption = initialData.caption || initialData.mainCaption || 'CASE FILE PHOTO EVIDENCE'
        newSec.mainCaption = initialData.mainCaption || initialData.caption || 'CASE FILE PHOTO EVIDENCE'
        break
      case 'quote':
        newSec.quote = initialData.quote || 'Rockstar seems to have built dynamic interior streaming for deep installations without any visible loading screens.'
        newSec.author = initialData.author || 'Mapping Community Lead'
        break
      case 'list':
        newSec.items = initialData.items || [
          'Sub-level Blast Doors: Accessible via heavy industrial keycard',
          'Subterranean Vehicle Test Track: Designed for high-speed military prototypes',
          'Radar Jamming Station: Blocks all minimap radar within a 1-mile radius',
        ]
        break
      case 'coordinates':
        newSec.content = initialData.content || `- **Sector:** Ambrosia Agri-Corridor\n- **Latitude / Longitude:** \`26.1420° N, 80.3840° W\`\n- **Elevation:** 850m above sea level`
        break
      default:
        newSec.content = initialData.content || ''
    }

    setSections((prev) => {
      const copy = [...prev]
      copy.splice(index, 0, newSec)
      return copy
    })

    setActiveMenuIndex(null)
    setLastSaved('New section added')
  }

  // Save changes to backend
  const handleSaveArticle = async () => {
    setIsSaving(true)
    const finalContent = editorMode === 'markdown' ? rawMarkdown : sectionsToMarkdown(sections)

    const tagList = cleanTagList

    const postPayload = {
      ...post,
      slug: post?.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      title,
      excerpt,
      author,
      category,
      date,
      tags: tagList,
      coverImage,
      coverMainCaption,
      coverSubCaption,
      content: finalContent,
      readingTime,
      featured: post?.featured ?? true,
    }

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postPayload),
      })

      if (!res.ok) {
        throw new Error('Failed to persist post to server')
      }

      const data = await res.json()
      setLastSaved('Published to Leonida')
      if (addToast) {
        addToast(`📰 DISPATCH PUBLISHED: ${title}`, 'mission', 4000)
      }
      if (onSave) {
        onSave(data.post || postPayload)
      }
    } catch (err) {
      console.error(err)
      if (addToast) {
        addToast(`Error saving post: ${err.message}`, 'cheat')
      }
    } finally {
      setIsSaving(false)
    }
  }

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel?.()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onCancel])

  return (
    <div className="fixed inset-0 z-[100] bg-[#05070e] text-white flex flex-col overflow-hidden select-text">
      {/* Hidden File Input for + Image Upload */}
      <input
        type="file"
        ref={globalImageInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleGlobalImageChange}
      />

      {/* 1. Medium-Style Top Navigation App Bar */}
      <header className="h-16 px-4 sm:px-8 bg-black/95 border-b border-gta-border/80 flex items-center justify-between flex-shrink-0 z-30">
          {/* Left: Branding & Status */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-gta-pink to-purple-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(255,46,136,0.5)] flex-shrink-0">
              <Sparkles size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                <span className="font-heading text-xs sm:text-sm tracking-wider uppercase text-white font-bold">
                  MEDIUM LIVE STUDIO // DISPATCH EDITOR
                </span>
              </div>
              <span className="text-[10px] text-gray-400 font-mono hidden sm:block">
                Draft in <span className="text-gta-teal">{author}</span> · {lastSaved}
              </span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Stats */}
            <div className="hidden md:flex items-center gap-3 text-[11px] font-mono text-gray-400 px-3 py-1 rounded-lg bg-black/50 border border-white/10">
              <span>{totalWords} words</span>
              <span>•</span>
              <span className="text-gta-teal font-bold">{readingTime}</span>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center bg-black/60 p-1 rounded-xl border border-gta-border/80">
              <button
                type="button"
                onClick={() => handleToggleMode('medium')}
                className={`px-3 py-1.5 rounded-lg text-xs font-heading tracking-wider uppercase transition-all flex items-center gap-1.5 ${
                  editorMode === 'medium'
                    ? 'bg-gta-pink text-white font-bold shadow-[0_0_15px_rgba(255,46,136,0.5)]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <FileText size={13} />
                <span>Live Medium</span>
              </button>
              <button
                type="button"
                onClick={() => handleToggleMode('markdown')}
                className={`px-3 py-1.5 rounded-lg text-xs font-heading tracking-wider uppercase transition-all flex items-center gap-1.5 ${
                  editorMode === 'markdown'
                    ? 'bg-gta-teal text-gta-dark font-bold shadow-[0_0_15px_rgba(0,229,255,0.5)]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Code size={13} />
                <span>Markdown</span>
              </button>
            </div>

            {/* Preview Live Link */}
            {post?.slug && (
              <a
                href={`/blog/${post.slug}`}
                target="_blank"
                rel="noreferrer"
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/60 border border-gta-border text-gray-300 hover:text-white hover:border-gta-teal text-xs font-heading tracking-wider transition-colors"
              >
                <Eye size={13} />
                <span>View Live</span>
                <ExternalLink size={11} />
              </a>
            )}

            {/* Publish Button (Iconic Medium Green / GTA Pink Glow) */}
            <button
              type="button"
              onClick={handleSaveArticle}
              disabled={isSaving}
              className="px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-heading text-xs tracking-wider uppercase font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Save size={14} className={isSaving ? 'animate-spin' : ''} />
              <span>{isSaving ? 'PUBLISHING...' : 'SAVE & PUBLISH'}</span>
            </button>

            {/* X Close Button on the Right Side */}
            <button
              type="button"
              onClick={onCancel}
              className="p-2 rounded-xl bg-black/60 border border-gta-border hover:border-red-500 text-gray-400 hover:text-white hover:bg-red-500/20 transition-all flex items-center justify-center ml-1 group"
              title="Close Edit Page"
            >
              <X size={18} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </header>

      {/* 2. Main Content Canvas */}
      <div className="flex-1 overflow-y-auto no-scrollbar bg-[#05070e] py-8 px-4 sm:px-6">
        {editorMode === 'markdown' ? (
          /* Raw Markdown Mode */
          <div className="max-w-4xl mx-auto bg-black/70 rounded-2xl border border-gta-border/80 p-6">
            <div className="flex items-center justify-between mb-3 text-xs font-heading text-gta-teal">
              <span>RAW MARKDOWN BUFFER</span>
              <span className="text-gray-400 font-mono text-[11px]">
                Direct gray-matter formatting
              </span>
            </div>
            <textarea
              rows={28}
              value={rawMarkdown}
              onChange={(e) => {
                setRawMarkdown(e.target.value)
                setLastSaved('Markdown edited')
              }}
              className="w-full bg-[#0a0d1a] border border-gta-border/80 rounded-xl p-4 text-white font-mono text-xs sm:text-sm leading-relaxed focus:outline-none focus:border-gta-teal resize-y"
            />
          </div>
        ) : (
          /* Authentic Medium WYSIWYG Live Canvas */
          <div className="max-w-4xl mx-auto bg-[#080b18] border border-gta-border/50 rounded-3xl p-6 sm:p-12 shadow-2xl relative">
            {/* Story Category & Metadata Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-gta-border/40 mb-8">
              <div className="flex items-center gap-3">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="px-3 py-1 rounded-full text-xs font-heading tracking-widest uppercase border border-gta-pink/40 bg-gta-pink/10 text-gta-pink focus:outline-none focus:border-gta-pink cursor-pointer"
                >
                  <option value="News" className="bg-gta-dark text-white">News</option>
                  <option value="Leaks" className="bg-gta-dark text-white">Leaks</option>
                  <option value="Guides" className="bg-gta-dark text-white">Guides</option>
                  <option value="Cheats" className="bg-gta-dark text-white">Cheats</option>
                  <option value="Characters" className="bg-gta-dark text-white">Characters</option>
                  <option value="Vehicles" className="bg-gta-dark text-white">Vehicles</option>
                </select>

                <div className="flex items-center gap-1.5 text-xs text-gray-400 font-body">
                  <User size={12} className="text-gta-teal" />
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Author Name"
                    className="bg-transparent border-b border-transparent hover:border-gray-600 focus:border-gta-teal text-gray-200 text-xs focus:outline-none px-1"
                  />
                </div>

                <div className="flex items-center gap-1.5 text-xs text-gray-400 font-body">
                  <Calendar size={12} className="text-gta-purple" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-transparent border-b border-transparent hover:border-gray-600 focus:border-gta-purple text-gray-300 text-xs focus:outline-none px-1"
                  />
                </div>
              </div>

              {/* Tags & Section Targeting Box */}
              <div className="p-4 rounded-2xl bg-black/70 border border-gta-border/80 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Tag size={14} className="text-gta-pink" />
                    <span className="text-xs font-heading tracking-widest uppercase text-white font-bold">
                      DISPATCH #TAGS &amp; SECTION ROUTING:
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-400">
                    Tag <strong className="text-gta-teal">#news</strong> for News section, <strong className="text-gta-orange">#guide</strong> for Guides section, or both!
                  </span>
                </div>

                {/* Section Quick Toggle Buttons */}
                <div className="flex items-center gap-2 flex-wrap pt-1">
                  <button
                    type="button"
                    onClick={() => toggleTag('news')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-heading tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                      hasTag('news')
                        ? 'bg-gta-teal text-black font-bold shadow-[0_0_15px_rgba(0,229,255,0.4)] border border-gta-teal'
                        : 'bg-black/80 text-gray-300 border border-gta-border hover:border-gta-teal hover:text-white'
                    }`}
                  >
                    <span>{hasTag('news') ? '✓ IN NEWS SECTION (#news)' : '+ ADD #news (NEWS PAGE)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleTag('guide')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-heading tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                      hasTag('guide') || hasTag('guides')
                        ? 'bg-gta-orange text-black font-bold shadow-[0_0_15px_rgba(255,138,61,0.4)] border border-gta-orange'
                        : 'bg-black/80 text-gray-300 border border-gta-border hover:border-gta-orange hover:text-white'
                    }`}
                  >
                    <span>{hasTag('guide') || hasTag('guides') ? '✓ IN GUIDES SECTION (#guide)' : '+ ADD #guide (GUIDES PAGE)'}</span>
                  </button>

                  {/* Popular Tags */}
                  {['vice-city', 'leaks', 'map', 'vehicles', 'cheats'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleTag(t)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
                        hasTag(t)
                          ? 'bg-gta-pink/20 text-gta-pink border border-gta-pink/50 font-bold'
                          : 'bg-black/50 text-gray-400 border border-gta-border/50 hover:text-gray-200'
                      }`}
                    >
                      #{t}
                    </button>
                  ))}
                </div>

                {/* Tags Text Input & Active Chips */}
                <div>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Type tags (e.g. #news, #guide, #vice-city, #bunkers)..."
                    className="w-full px-3.5 py-2 bg-black border border-gta-border/90 rounded-xl text-xs font-mono text-gray-200 focus:outline-none focus:border-gta-pink"
                  />
                  {cleanTagList.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                      <span className="text-[10px] font-mono text-gray-500 uppercase mr-1">ACTIVE TAGS:</span>
                      {cleanTagList.map((tag) => (
                        <span
                          key={tag}
                          className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded border ${
                            tag === 'news'
                              ? 'bg-gta-teal/20 text-gta-teal border-gta-teal/50 font-bold'
                              : tag === 'guide' || tag === 'guides'
                              ? 'bg-gta-orange/20 text-gta-orange border-gta-orange/50 font-bold'
                              : 'bg-gray-800 text-gray-300 border-gray-700'
                          }`}
                        >
                          #{tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="hover:text-red-400 ml-1 text-xs"
                            title={`Remove #${tag}`}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Title (Big Heading like Medium) */}
            <div className="mb-4">
              <textarea
                rows={2}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  setLastSaved('Title edited')
                }}
                placeholder="Title..."
                className="w-full bg-transparent font-heading text-3xl sm:text-5xl text-white tracking-tight leading-tight focus:outline-none border-b border-transparent hover:border-white/10 focus:border-gta-teal resize-none placeholder:text-gray-600"
              />
            </div>

            {/* Subtitle / Excerpt (Medium Dek) */}
            <div className="mb-8">
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => {
                  setExcerpt(e.target.value)
                  setLastSaved('Excerpt edited')
                }}
                placeholder="Tell your story summary / excerpt..."
                className="w-full bg-transparent text-lg sm:text-xl text-gray-300 font-body leading-relaxed italic border-l-2 border-gta-teal pl-4 focus:outline-none focus:border-gta-pink resize-none placeholder:text-gray-600"
              />
            </div>

            {/* Featured Story Cover Image */}
            <div className="mb-10 p-5 rounded-2xl bg-black/60 border border-gta-border/60 space-y-4">
              <div className="flex items-center justify-between text-xs font-heading text-gray-400">
                <span className="flex items-center gap-1.5 text-gta-teal font-bold uppercase tracking-wider">
                  <ImageIcon size={14} />
                  FEATURED DISPATCH COVER IMAGE &amp; ON-IMAGE CAPTIONS
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={coverImageInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const url = await uploadImageFile(file)
                        if (url) setCoverImage(url)
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => coverImageInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-3 py-1.5 rounded-xl bg-gta-teal/20 border border-gta-teal/50 hover:bg-gta-teal hover:text-black text-gta-teal text-xs font-heading uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                  >
                    <Upload size={13} />
                    <span>Upload Cover Image</span>
                  </button>
                </div>
              </div>

              {/* Cover Image Container with Live Overlay ON the Image */}
              <div
                className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/10 bg-black group shadow-2xl cursor-pointer"
                onDragOver={(e) => e.preventDefault()}
                onDrop={async (e) => {
                  e.preventDefault()
                  const file = e.dataTransfer.files?.[0]
                  if (file) {
                    const url = await uploadImageFile(file)
                    if (url) setCoverImage(url)
                  }
                }}
                onClick={() => coverImageInputRef.current?.click()}
                title="Click or drag image file here to upload"
              >
                <Image
                  src={coverImage || '/images/posts/map-coords.jpg'}
                  alt="Cover Image Preview"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent z-10" />

                {/* Top overlay upload hint */}
                <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                  <span className="px-3 py-1 rounded bg-black/80 border border-gta-teal/50 text-gta-teal font-heading text-xs tracking-widest uppercase backdrop-blur-md flex items-center gap-1.5 hover:bg-gta-teal hover:text-black transition-colors">
                    <Upload size={12} />
                    UPLOAD / REPLACE
                  </span>
                </div>

                {/* Live On-Image Captions Overlay */}
                <div className="absolute bottom-5 left-5 right-5 z-20 flex items-end justify-between pointer-events-none">
                  <div className="space-y-1">
                    <span className="font-heading text-xs sm:text-sm tracking-widest text-gta-teal uppercase block drop-shadow font-semibold">
                      {coverSubCaption || 'VICE CITY POLICE DEPARTMENT ARCHIVE // RECON PHOTO'}
                    </span>
                    <span className="font-heading text-2xl sm:text-3xl text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] font-bold block">
                      {coverMainCaption || `CASE FILE #${(post?.slug || 'DISPATCH').toUpperCase().slice(0, 10)}`}
                    </span>
                  </div>
                  <span className="hidden sm:inline-block px-3 py-1 rounded bg-black/80 border border-gta-pink/50 text-gta-pink font-heading text-xs tracking-widest uppercase backdrop-blur-md">
                    OFFICIAL INTEL
                  </span>
                </div>
              </div>

              {/* Cover Presets */}
              <div className="flex items-center gap-2 flex-wrap text-[11px] font-mono text-gray-400">
                <span className="uppercase text-[10px] text-gray-500 font-bold">COVER PRESETS:</span>
                {[
                  { label: '🗺️ Map Coords', url: '/images/posts/map-coords.jpg' },
                  { label: '🚤 Dock Surveillance', url: '/images/posts/gta6-dock-lucia-jason.jpg' },
                  { label: '📅 Release Date', url: '/images/posts/release-date.jpg' },
                  { label: '🎮 Cheats Intel', url: '/images/posts/cheats.jpg' },
                  { label: '🌆 Vice City Hero', url: '/images/gta6-hero.jpg' },
                ].map((p) => (
                  <button
                    key={p.url}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setCoverImage(p.url)
                    }}
                    className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      coverImage === p.url
                        ? 'bg-gta-teal/20 text-gta-teal border-gta-teal font-bold'
                        : 'bg-black/50 text-gray-400 border-gta-border/60 hover:text-white'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* 3 Inputs: URL, Sub-Caption, Main Caption */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">
                      Cover Image URL:
                    </label>
                    <button
                      type="button"
                      onClick={() => coverImageInputRef.current?.click()}
                      className="text-[10px] text-gta-teal hover:underline flex items-center gap-1 cursor-pointer font-mono"
                    >
                      <Upload size={10} />
                      <span>Upload from PC</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="/images/posts/map-coords.jpg"
                    className="w-full px-3 py-2 bg-black border border-gta-border rounded-xl text-xs font-mono text-white focus:outline-none focus:border-gta-teal"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-gta-teal block mb-1 uppercase font-bold flex items-center justify-between">
                    <span>1. Sub-Caption (Top Label):</span>
                    <span className="text-gray-500 font-normal">Recon text</span>
                  </label>
                  <input
                    type="text"
                    value={coverSubCaption}
                    onChange={(e) => setCoverSubCaption(e.target.value)}
                    placeholder="e.g. VICE CITY POLICE ARCHIVE // RECON PHOTO"
                    className="w-full px-3 py-2 bg-black border border-gta-teal/50 rounded-xl text-xs font-mono text-gray-200 focus:outline-none focus:border-gta-teal"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-yellow-400 block mb-1 uppercase font-bold flex items-center justify-between">
                    <span>2. Main Caption (Title):</span>
                    <span className="text-gray-500 font-normal">Case file #</span>
                  </label>
                  <input
                    type="text"
                    value={coverMainCaption}
                    onChange={(e) => setCoverMainCaption(e.target.value)}
                    placeholder="e.g. CASE FILE #LEONIDA-SURVEILLANCE"
                    className="w-full px-3 py-2 bg-black border border-yellow-400/50 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-yellow-400 font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Medium Block Stream (Each Section is an editable block) */}
            <div className="space-y-6">
              {sections.map((section, index) => {
                return (
                  <div key={section.id} className="relative group">
                    {/* The Medium-Style Hover Action Bar (Up, Down, Delete) */}
                    <div className="absolute right-0 -top-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-black/90 p-1 rounded-lg border border-gta-border/80 shadow-lg z-20">
                      <button
                        type="button"
                        onClick={() => moveSection(index, 'up')}
                        disabled={index === 0}
                        className="p-1 rounded text-gray-400 hover:text-white disabled:opacity-30"
                        title="Move Section Up"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSection(index, 'down')}
                        disabled={index === sections.length - 1}
                        className="p-1 rounded text-gray-400 hover:text-white disabled:opacity-30"
                        title="Move Section Down"
                      >
                        <ArrowDown size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteSection(section.id)}
                        className="p-1 rounded text-red-400 hover:text-red-300"
                        title="Delete Section"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                    {/* RENDER THE BLOCK BY TYPE */}
                    {section.type === 'heading2' && (
                      <div className="border-b border-gta-border/40 pb-2">
                        <input
                          type="text"
                          value={section.content || ''}
                          onChange={(e) => updateSection(section.id, { content: e.target.value })}
                          placeholder="Heading 2..."
                          className="w-full bg-transparent font-heading text-2xl sm:text-3xl text-white tracking-wide leading-tight focus:outline-none focus:text-gta-pink"
                        />
                      </div>
                    )}

                    {section.type === 'heading3' && (
                      <div>
                        <input
                          type="text"
                          value={section.content || ''}
                          onChange={(e) => updateSection(section.id, { content: e.target.value })}
                          placeholder="Sub-heading..."
                          className="w-full bg-transparent font-heading text-lg sm:text-xl text-gta-teal tracking-wide leading-tight focus:outline-none"
                        />
                      </div>
                    )}

                    {section.type === 'paragraph' && (
                      <div>
                        <textarea
                          rows={Math.max(2, Math.ceil((section.content?.length || 0) / 75))}
                          value={section.content || ''}
                          onChange={(e) => updateSection(section.id, { content: e.target.value })}
                          placeholder="Write paragraph text..."
                          className="w-full bg-transparent text-base sm:text-lg text-gray-200 leading-relaxed font-body focus:outline-none resize-none p-1 rounded hover:bg-white/[0.02] focus:bg-white/[0.04] transition-colors"
                        />
                      </div>
                    )}

                    {section.type === 'image' && (
                      <div className="my-4 p-4 rounded-2xl bg-black/50 border border-white/10 space-y-4">
                        <input
                          type="file"
                          ref={(el) => {
                            if (el) sectionFileInputRefs.current[section.id] = el
                          }}
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              const url = await uploadImageFile(file)
                              if (url) {
                                const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ').toUpperCase()
                                updateSection(section.id, {
                                  url,
                                  alt: file.name,
                                  caption: section.caption || cleanName,
                                  mainCaption: section.mainCaption || cleanName,
                                })
                              }
                            }
                          }}
                        />

                        {/* If no image uploaded yet: interactive dropzone */}
                        {!section.url ? (
                          <div
                            onClick={() => sectionFileInputRefs.current[section.id]?.click()}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={async (e) => {
                              e.preventDefault()
                              const file = e.dataTransfer.files?.[0]
                              if (file) {
                                const url = await uploadImageFile(file)
                                if (url) {
                                  const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ').toUpperCase()
                                  updateSection(section.id, {
                                    url,
                                    alt: file.name,
                                    caption: cleanName,
                                    mainCaption: cleanName,
                                  })
                                }
                              }
                            }}
                            className="relative aspect-[16/9] w-full rounded-2xl border-2 border-dashed border-gta-border hover:border-gta-teal bg-black/70 flex flex-col items-center justify-center p-6 cursor-pointer transition-all group shadow-inner"
                          >
                            <div className="w-14 h-14 rounded-2xl bg-gta-teal/10 border border-gta-teal/30 flex items-center justify-center text-gta-teal mb-3 group-hover:scale-110 group-hover:bg-gta-teal/20 transition-all">
                              <Upload size={26} />
                            </div>
                            <span className="font-heading text-sm sm:text-base text-white uppercase tracking-wider mb-1 font-bold">
                              CLICK TO UPLOAD DISPATCH IMAGE FROM COMPUTER
                            </span>
                            <span className="text-xs font-mono text-gray-400">
                              or drag and drop your image file here (.png, .jpg, .webp, .gif)
                            </span>
                          </div>
                        ) : (
                          /* Live On-Image Preview with Dual Captions */
                          <div
                            className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-white/15 bg-black group shadow-lg cursor-pointer"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={async (e) => {
                              e.preventDefault()
                              const file = e.dataTransfer.files?.[0]
                              if (file) {
                                const url = await uploadImageFile(file)
                                if (url) updateSection(section.id, { url })
                              }
                            }}
                            onClick={() => sectionFileInputRefs.current[section.id]?.click()}
                            title="Click or drag file here to replace image"
                          >
                            <Image
                              src={section.url}
                              alt={section.alt || 'Section Image'}
                              fill
                              className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                            />
                            {/* Live On-Image Dark Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />

                            {/* Top Evidence Badge & Replace Button */}
                            <div className="absolute top-3 right-3 flex items-center gap-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  sectionFileInputRefs.current[section.id]?.click()
                                }}
                                className="px-2.5 py-1 rounded bg-black/85 border border-gta-teal/60 hover:bg-gta-teal hover:text-black text-gta-teal font-mono text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                              >
                                <Upload size={11} />
                                <span>Replace Image</span>
                              </button>
                            </div>

                            {/* Bottom Dual Captions on the Image */}
                            <div className="absolute bottom-3 left-4 right-4 pointer-events-none">
                              <span className="font-heading text-[11px] tracking-widest text-gta-teal uppercase block drop-shadow font-semibold">
                                {section.subCaption || 'OFFICIAL INTEL // SATELLITE RECON'}
                              </span>
                              <span className="font-heading text-lg sm:text-xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] font-bold block leading-tight">
                                {section.caption || section.mainCaption || 'NORTHERN LEONIDA RESEARCH PERIMETER'}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Image Presets */}
                        <div className="flex items-center gap-2 flex-wrap text-[11px] font-mono text-gray-400">
                          <span className="uppercase text-[10px] text-gray-500 font-bold">PRESETS:</span>
                          {[
                            { label: '🗺️ Map Coords', url: '/images/posts/map-coords.jpg' },
                            { label: '🚤 Dock Intel', url: '/images/posts/gta6-dock-lucia-jason.jpg' },
                            { label: '📅 Release Date', url: '/images/posts/release-date.jpg' },
                            { label: '🎮 Cheats', url: '/images/posts/cheats.jpg' },
                            { label: '🌆 Leonida Map', url: '/images/gta6-leonida-map.jpg' },
                          ].map((p) => (
                            <button
                              key={p.url}
                              type="button"
                              onClick={() => updateSection(section.id, { url: p.url })}
                              className={`px-2 py-0.5 rounded border transition-all cursor-pointer ${
                                section.url === p.url
                                  ? 'bg-gta-teal/20 text-gta-teal border-gta-teal font-bold'
                                  : 'bg-black/50 text-gray-400 border-gta-border/60 hover:text-white'
                              }`}
                            >
                              {p.label}
                            </button>
                          ))}
                        </div>

                        {/* Two Caption Inputs & URL/Alt in Admin Page */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-[10px] text-gray-400 uppercase font-bold">
                                Image URL:
                              </label>
                              <button
                                type="button"
                                onClick={() => sectionFileInputRefs.current[section.id]?.click()}
                                className="text-[10px] text-gta-teal hover:underline flex items-center gap-1 cursor-pointer font-mono"
                              >
                                <Upload size={10} />
                                <span>Upload File from PC</span>
                              </button>
                            </div>
                            <input
                              type="text"
                              value={section.url || ''}
                              onChange={(e) => updateSection(section.id, { url: e.target.value })}
                              placeholder="/images/posts/your-image.jpg or upload"
                              className="w-full px-3 py-2 bg-black border border-gta-border rounded-xl text-white focus:outline-none focus:border-gta-teal"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-gray-400 block mb-1 uppercase font-bold">
                              Alt / Recon Tag:
                            </label>
                            <input
                              type="text"
                              value={section.alt || ''}
                              onChange={(e) => updateSection(section.id, { alt: e.target.value })}
                              placeholder="e.g. Satellite Map Recon"
                              className="w-full px-3 py-2 bg-black border border-gta-border rounded-xl text-white focus:outline-none focus:border-gta-teal"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-gta-teal block mb-1 uppercase font-bold flex items-center justify-between">
                              <span>1. Sub-Caption (Top Label on Image):</span>
                              <span className="text-gray-500 font-normal">Recon text</span>
                            </label>
                            <input
                              type="text"
                              value={section.subCaption || ''}
                              onChange={(e) => updateSection(section.id, { subCaption: e.target.value })}
                              placeholder="e.g. OFFICIAL INTEL // SATELLITE RECON"
                              className="w-full px-3 py-2 bg-black border border-gta-teal/50 rounded-xl text-gray-200 focus:outline-none focus:border-gta-teal"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-yellow-400 block mb-1 uppercase font-bold flex items-center justify-between">
                              <span>2. Main Caption (Title on Image):</span>
                              <span className="text-gray-500 font-normal">Bold title</span>
                            </label>
                            <input
                              type="text"
                              value={section.caption || section.mainCaption || ''}
                              onChange={(e) =>
                                updateSection(section.id, {
                                  caption: e.target.value,
                                  mainCaption: e.target.value,
                                })
                              }
                              placeholder="e.g. CASE FILE #NORTHERN-LEONIDA"
                              className="w-full px-3 py-2 bg-black border border-yellow-400/50 rounded-xl text-white font-semibold focus:outline-none focus:border-yellow-400"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {section.type === 'quote' && (
                      <div className="my-4 pl-4 border-l-4 border-gta-pink bg-gta-pink/5 p-3 rounded-r-xl space-y-2">
                        <textarea
                          rows={2}
                          value={section.quote || ''}
                          onChange={(e) => updateSection(section.id, { quote: e.target.value })}
                          placeholder="Blockquote text..."
                          className="w-full bg-transparent text-lg text-gray-200 italic font-body focus:outline-none resize-none"
                        />
                        <input
                          type="text"
                          value={section.author || ''}
                          onChange={(e) => updateSection(section.id, { author: e.target.value })}
                          placeholder="Attribution / Author (e.g. Mapping Community Lead)"
                          className="w-full bg-transparent text-xs font-mono text-gta-teal focus:outline-none"
                        />
                      </div>
                    )}

                    {section.type === 'list' && (
                      <div className="my-3 space-y-2 p-3 rounded-xl bg-black/40 border border-white/5">
                        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block mb-1">
                          LIST / CHECKLIST ITEMS:
                        </span>
                        {section.items?.map((item, itemIdx) => (
                          <div key={itemIdx} className="flex items-center gap-2">
                            <span className="text-xs text-gta-pink font-bold">{itemIdx + 1}.</span>
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => {
                                const newItems = [...section.items]
                                newItems[itemIdx] = e.target.value
                                updateSection(section.id, { items: newItems })
                              }}
                              className="flex-1 bg-transparent text-sm text-gray-200 border-b border-white/10 focus:border-gta-pink focus:outline-none py-1"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newItems = section.items.filter((_, i) => i !== itemIdx)
                                updateSection(section.id, { items: newItems })
                              }}
                              className="text-gray-500 hover:text-red-400 p-1"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            const newItems = [...(section.items || []), 'New checklist point...']
                            updateSection(section.id, { items: newItems })
                          }}
                          className="text-[11px] font-heading text-gta-teal hover:text-white flex items-center gap-1 mt-2"
                        >
                          <Plus size={12} /> ADD LIST ITEM
                        </button>
                      </div>
                    )}

                    {section.type === 'coordinates' && (
                      <div className="my-4 p-4 rounded-2xl bg-black/80 border border-gta-teal/40 space-y-2">
                        <span className="text-[10px] font-heading tracking-widest text-gta-teal uppercase block">
                          GTA LEONIDA DECRYPTED COORDINATES BOX
                        </span>
                        <textarea
                          rows={3}
                          value={section.content || ''}
                          onChange={(e) => updateSection(section.id, { content: e.target.value })}
                          className="w-full bg-black/60 border border-white/10 rounded-lg p-2.5 text-xs font-mono text-gray-200 focus:outline-none focus:border-gta-teal"
                        />
                      </div>
                    )}

                    {/* MEDIUM '+' QUICK-INSERT BAR BETWEEN BLOCKS */}
                    <div className="py-2 flex items-center justify-center relative">
                      {activeMenuIndex === index ? (
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="flex items-center gap-2 p-1.5 rounded-full bg-black/95 border border-gta-teal/60 shadow-[0_0_20px_rgba(0,229,255,0.3)] z-30"
                        >
                          <button
                            type="button"
                            onClick={() => insertSection(index + 1, 'paragraph')}
                            className="p-1.5 rounded-full hover:bg-gta-teal hover:text-black text-gray-300 transition-colors"
                            title="Add Paragraph"
                          >
                            <Type size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertSection(index + 1, 'heading2')}
                            className="p-1.5 rounded-full hover:bg-gta-pink hover:text-white text-gray-300 transition-colors"
                            title="Add Heading"
                          >
                            <Heading2 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertSection(index + 1, 'heading3')}
                            className="p-1.5 rounded-full hover:bg-gta-pink hover:text-white text-gray-300 transition-colors"
                            title="Add Subheading"
                          >
                            <Heading3 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleTriggerAddImage(index + 1)}
                            className="p-1.5 rounded-full hover:bg-yellow-400 hover:text-black text-gray-300 transition-colors"
                            title="Upload / Add Image from Computer"
                          >
                            <Upload size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertSection(index + 1, 'quote')}
                            className="p-1.5 rounded-full hover:bg-gta-pink hover:text-white text-gray-300 transition-colors"
                            title="Add Quote"
                          >
                            <Quote size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertSection(index + 1, 'list')}
                            className="p-1.5 rounded-full hover:bg-emerald-400 hover:text-black text-gray-300 transition-colors"
                            title="Add Checklist"
                          >
                            <List size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertSection(index + 1, 'coordinates')}
                            className="p-1.5 rounded-full hover:bg-cyan-400 hover:text-black text-gray-300 transition-colors"
                            title="Add Coordinates"
                          >
                            <MapPin size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveMenuIndex(null)}
                            className="p-1.5 rounded-full hover:bg-red-500 hover:text-white text-gray-400 transition-colors"
                            title="Close Menu"
                          >
                            <X size={14} />
                          </button>
                        </motion.div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setActiveMenuIndex(index)}
                          className="opacity-20 hover:opacity-100 transition-opacity w-7 h-7 rounded-full border border-gray-600 hover:border-gta-teal hover:text-gta-teal flex items-center justify-center text-gray-400 hover:scale-110"
                          title="Click '+' to insert a section here"
                        >
                          <Plus size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}

              {/* Bottom Quick-Add Bar */}
              <div className="pt-6 border-t border-gta-border/60 flex flex-wrap items-center justify-center gap-2">
                <span className="text-xs font-heading tracking-widest text-gray-400 uppercase mr-2">
                  + INSERT SECTION AT BOTTOM:
                </span>
                <button
                  type="button"
                  onClick={() => insertSection(sections.length, 'paragraph')}
                  className="px-3 py-1.5 rounded-xl bg-black/60 border border-gta-border/80 hover:border-gta-teal text-gray-300 hover:text-white text-xs font-heading flex items-center gap-1.5"
                >
                  <Type size={12} /> + Paragraph
                </button>
                <button
                  type="button"
                  onClick={() => insertSection(sections.length, 'heading2')}
                  className="px-3 py-1.5 rounded-xl bg-black/60 border border-gta-border/80 hover:border-gta-pink text-gray-300 hover:text-white text-xs font-heading flex items-center gap-1.5"
                >
                  <Heading2 size={12} /> + Heading
                </button>
                <button
                  type="button"
                  onClick={() => handleTriggerAddImage(sections.length)}
                  className="px-3 py-1.5 rounded-xl bg-black/60 border border-gta-border/80 hover:border-yellow-400 text-gray-300 hover:text-white text-xs font-heading flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Upload size={12} className="text-yellow-400" /> + Upload Image
                </button>
                <button
                  type="button"
                  onClick={() => insertSection(sections.length, 'quote')}
                  className="px-3 py-1.5 rounded-xl bg-black/60 border border-gta-border/80 hover:border-gta-pink text-gray-300 hover:text-white text-xs font-heading flex items-center gap-1.5"
                >
                  <Quote size={12} /> + Quote
                </button>
                <button
                  type="button"
                  onClick={() => insertSection(sections.length, 'list')}
                  className="px-3 py-1.5 rounded-xl bg-black/60 border border-gta-border/80 hover:border-emerald-400 text-gray-300 hover:text-white text-xs font-heading flex items-center gap-1.5"
                >
                  <List size={12} /> + Checklist
                </button>
                <button
                  type="button"
                  onClick={() => insertSection(sections.length, 'coordinates')}
                  className="px-3 py-1.5 rounded-xl bg-black/60 border border-gta-border/80 hover:border-cyan-400 text-gray-300 hover:text-white text-xs font-heading flex items-center gap-1.5"
                >
                  <MapPin size={12} /> + Coordinates
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
