import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Search, Check } from 'lucide-react'
import { LANGUAGES } from '../lib/i18n'
import { t } from '../lib/i18n'

export const getFlagUrl = (code) => {
  if (code === 'en') return 'https://flagcdn.com/w40/gb.png'
  if (code === 'ne') return 'https://flagcdn.com/w40/np.png'
  return 'https://flagcdn.com/w40/in.png'
}

export default function LanguageModal({ isOpen, onClose, value, onChange }) {
  const [search, setSearch] = useState('')

  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'Escape') onClose() }
    if (isOpen) { window.addEventListener('keydown', handleKeyDown); setSearch('') }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const filtered = LANGUAGES.filter(l =>
    l.label.toLowerCase().includes(search.toLowerCase()) ||
    l.native.toLowerCase().includes(search.toLowerCase()) ||
    l.region.toLowerCase().includes(search.toLowerCase())
  )

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>

          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'absolute', inset: 0, background: 'rgba(4, 3, 14, 0.82)', backdropFilter: 'blur(18px)' }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            style={{
              position: 'relative', zIndex: 100001,
              width: '100%', maxWidth: 560,
              maxHeight: '88vh',
              background: 'linear-gradient(160deg, rgba(16,13,38,0.98), rgba(8,6,22,0.99))',
              border: '1px solid rgba(99,102,241,0.22)',
              borderRadius: 28,
              boxShadow: '0 40px 100px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.06)',
              padding: '32px 36px',
              display: 'flex', flexDirection: 'column', gap: 28,
              overflow: 'hidden',
            }}
          >
            {/* ── HEADER ── */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: 26 }}>
              <div style={{ flex: 1 }}>
                <h2 style={{
                  fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 24, margin: '0 0 10px',
                  background: 'linear-gradient(90deg, #f0eeff, #c4b5fd, #a5b4fc)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1.2,
                }}>
                  {t(value, 'choose_lang')}
                </h2>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.38)', margin: 0, lineHeight: 1.7, fontFamily: "'Plus Jakarta Sans', sans-serif", maxWidth: 400 }}>
                  Select your preferred language for textbook explanations, chatbot queries, and audio summaries.
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.5)', cursor: 'pointer', outline: 'none',
                  transition: 'all 0.2s',
                }}
              >
                <X size={17} />
              </motion.button>
            </div>

            {/* ── SEARCH ── */}
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                <Search size={17} />
              </div>
              <input
                autoFocus
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search from 20+ languages..."
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
                  borderRadius: 16, padding: '15px 18px 15px 50px',
                  color: '#f0eeff', fontSize: 15, outline: 'none',
                  fontFamily: "'Plus Jakarta Sans', sans-serif", transition: 'all 0.25s',
                  lineHeight: 1.5,
                }}
                onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.55)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.09)'; e.target.style.boxShadow = 'none' }}
              />
            </div>

            {/* ── LANGUAGE LIST ── */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, paddingRight: 4 }}>
              {filtered.map((lang, i) => {
                const active = lang.code === value
                return (
                  <motion.button
                    key={lang.code}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.025 }}
                    whileHover={{ x: 5, borderColor: active ? 'rgba(99,102,241,0.6)' : 'rgba(255,255,255,0.14)', background: active ? 'rgba(99,102,241,0.16)' : 'rgba(255,255,255,0.04)' }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => { onChange(lang.code); onClose() }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 18,
                      padding: '18px 22px',
                      borderRadius: 18,
                      background: active ? 'rgba(99,102,241,0.13)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${active ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.07)'}`,
                      boxShadow: active ? '0 0 24px rgba(99,102,241,0.14)' : 'none',
                      cursor: 'pointer', textAlign: 'left',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      transition: 'all 0.18s',
                      width: '100%',
                    }}
                  >
                    {/* Flag */}
                    <img
                      src={getFlagUrl(lang.code)}
                      alt={lang.label}
                      style={{ width: 36, height: 26, borderRadius: 6, objectFit: 'cover', flexShrink: 0, border: '1px solid rgba(255,255,255,0.14)' }}
                    />

                    {/* Text */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 17, fontWeight: 700,
                        color: active ? '#a5b4fc' : '#f0eeff',
                        lineHeight: 1.35, marginBottom: 6,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {lang.native}
                      </div>
                      <div style={{
                        fontSize: 13, fontWeight: 500,
                        color: active ? 'rgba(165,180,252,0.65)' : 'rgba(255,255,255,0.38)',
                        lineHeight: 1.4,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {lang.label} · {lang.region}
                      </div>
                    </div>

                    {/* Checkmark */}
                    {active && (
                      <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        boxShadow: '0 0 14px rgba(99,102,241,0.55)',
                      }}>
                        <Check size={14} strokeWidth={3} color="#fff" />
                      </div>
                    )}
                  </motion.button>
                )
              })}

              {filtered.length === 0 && (
                <div style={{ textAlign: 'center', padding: '56px 0', color: 'rgba(255,255,255,0.25)', fontSize: 14.5, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  No languages match your search.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
