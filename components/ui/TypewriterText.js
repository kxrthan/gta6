'use client'
import { useState, useEffect } from 'react'

export default function TypewriterText({ texts, className = '' }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!texts || texts.length === 0) return

    const current = texts[currentIndex]
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayed.length < current.length) {
          setDisplayed(current.slice(0, displayed.length + 1))
        } else {
          setTimeout(() => setIsDeleting(true), 2200)
        }
      } else {
        if (displayed.length > 0) {
          setDisplayed(current.slice(0, displayed.length - 1))
        } else {
          setIsDeleting(false)
          setCurrentIndex((prev) => (prev + 1) % texts.length)
        }
      }
    }, isDeleting ? 45 : 90)

    return () => clearTimeout(timeout)
  }, [displayed, isDeleting, currentIndex, texts])

  return (
    <span className={`inline-block ${className}`}>
      {displayed}
      <span className="animate-flicker text-gta-pink font-bold ml-0.5">_</span>
    </span>
  )
}
