import { useState } from 'react'
import { Globe, ChevronDown } from 'lucide-react'
import { LANGUAGES } from '../lib/i18n'
import LanguageModal, { getFlagUrl } from './LanguageModal'

export default function LanguageSelector({ value, onChange, compact = false }) {
  const [open, setOpen] = useState(false)
  const current = LANGUAGES.find(l => l.code === value) || LANGUAGES[0]

  return (
    <div style={{ display: 'inline-block' }}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: compact ? '4px 10px' : '6px 12px',
          borderRadius: 8,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          color: '#f0eeff', cursor: 'pointer', fontSize: compact ? 11 : 12, fontWeight: 600,
          fontFamily: "'Plus Jakarta Sans', sans-serif", transition: 'all 0.2s', whiteSpace: 'nowrap',
          outline: 'none',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'
          e.currentTarget.style.background = 'rgba(99,102,241,0.08)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
          e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
        }}
      >
        <Globe size={compact ? 12 : 14} color="#818cf8" />
        <span style={{ color: '#a5b4fc' }}>{current.native}</span>
        <img
          src={getFlagUrl(current.code)}
          alt=""
          style={{ width: 16, height: 11, borderRadius: 1.5, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.15)' }}
        />
        <ChevronDown size={11} color="rgba(255,255,255,0.3)" />
      </button>

      <LanguageModal
        isOpen={open}
        onClose={() => setOpen(false)}
        value={value}
        onChange={onChange}
      />
    </div>
  )
}
