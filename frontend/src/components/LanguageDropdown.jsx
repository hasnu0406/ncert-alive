import { useState } from 'react'
import { Globe, ChevronDown } from 'lucide-react'
import { LANGUAGES } from '../lib/i18n'
import { useLanguage } from '../lib/LanguageContext'
import LanguageModal, { getFlagUrl } from './LanguageModal'

export default function LanguageDropdown({ compact = false }) {
  const { language, changeLanguage } = useLanguage()
  const [open, setOpen] = useState(false)
  const current = LANGUAGES.find(l => l.code === language) || LANGUAGES[0]

  // Show just the short code (2-3 chars) to keep it compact
  const shortLabel = current.code.toUpperCase()

  return (
    <div style={{ display: 'inline-block', position: 'relative' }}>
      <button
        onClick={() => setOpen(true)}
        title={current.label}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 10px',
          borderRadius: 100,
          background: 'rgba(99,102,241,0.08)',
          border: '1px solid rgba(99,102,241,0.25)',
          color: '#a5b4fc', cursor: 'pointer', fontSize: 12, fontWeight: 700,
          fontFamily: "'Plus Jakarta Sans', sans-serif", transition: 'all 0.2s', whiteSpace: 'nowrap',
          outline: 'none', letterSpacing: '0.04em',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'rgba(99,102,241,0.6)'
          e.currentTarget.style.background = 'rgba(99,102,241,0.16)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'rgba(99,102,241,0.25)'
          e.currentTarget.style.background = 'rgba(99,102,241,0.08)'
        }}
      >
        <Globe size={12} color="#818cf8" />
        <img
          src={getFlagUrl(current.code)}
          alt=""
          style={{ width: 16, height: 11, borderRadius: 2, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.12)' }}
        />
        <span>{shortLabel}</span>
        <ChevronDown size={10} style={{ opacity: 0.6 }} />
      </button>

      <LanguageModal
        isOpen={open}
        onClose={() => setOpen(false)}
        value={language}
        onChange={changeLanguage}
      />
    </div>
  )
}
