'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import GtaMapModal from '@/components/home/GtaMapModal'

const MapModalContext = createContext(null)

export function MapModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeBlipId, setActiveBlipId] = useState(null)

  const openMap = (blipId = null) => {
    if (blipId && typeof blipId === 'string') {
      setActiveBlipId(blipId)
    }
    setIsOpen(true)
  }

  const closeMap = () => {
    setIsOpen(false)
  }

  // Global 'M' shortcut to open/close GTA Map
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <MapModalContext.Provider value={{ isOpen, openMap, closeMap }}>
      {children}
      <GtaMapModal isOpen={isOpen} onClose={closeMap} initialBlipId={activeBlipId} />
    </MapModalContext.Provider>
  )
}

export function useMapModal() {
  const ctx = useContext(MapModalContext)
  return ctx || { isOpen: false, openMap: () => {}, closeMap: () => {} }
}
