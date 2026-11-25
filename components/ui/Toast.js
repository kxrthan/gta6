'use client'
import { useState, useEffect, createContext, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, duration)
  }

  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id))

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 max-w-sm">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              className={`flex items-start gap-3 p-4 rounded-lg border backdrop-blur-sm shadow-xl ${
                toast.type === 'success' ? 'bg-green-900/90 border-green-500/50 text-green-100' :
                toast.type === 'mission' ? 'bg-black/90 border-yellow-400/50 text-yellow-400' :
                toast.type === 'cheat' ? 'bg-gta-dark/90 border-gta-teal/50 text-gta-teal' :
                toast.type === 'error' ? 'bg-red-900/90 border-red-500/50 text-red-100' :
                'bg-gta-card/90 border-gta-border text-white'
              }`}
            >
              <span className="flex-shrink-0 mt-0.5">
                {toast.type === 'success' && <CheckCircle size={18} />}
                {toast.type === 'mission' && <span className="text-lg">🏆</span>}
                {toast.type === 'cheat' && <span className="text-lg">🎮</span>}
                {toast.type === 'error' && <AlertCircle size={18} />}
                {toast.type === 'info' && <Info size={18} />}
              </span>
              <div className="flex-1">
                {toast.type === 'mission' && (
                  <div className="font-heading text-xs tracking-widest mb-1 text-yellow-400/70">MISSION PASSED</div>
                )}
                {toast.type === 'cheat' && (
                  <div className="font-heading text-xs tracking-widest mb-1 text-gta-teal/70">CHEAT ACTIVATED</div>
                )}
                <p className="text-sm font-body">{toast.message}</p>
              </div>
              <button onClick={() => removeToast(toast.id)} className="flex-shrink-0 opacity-50 hover:opacity-100">
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
