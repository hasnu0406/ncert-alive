import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, RotateCcw, Lightbulb, BookOpen, Tag, ChevronDown } from 'lucide-react'
import { t } from '../lib/i18n'

const SUBJECT_COLORS = {
  science: { bg: 'rgba(6,182,212,0.15)', border: 'rgba(6,182,212,0.3)', text: '#67e8f9', label: '🔬 Science' },
  math: { bg: 'rgba(99,102,241,0.15)', border: 'rgba(99,102,241,0.3)', text: '#a5b4fc', label: '📐 Math' },
  history: { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)', text: '#fcd34d', label: '📜 History' },
  geography: { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)', text: '#6ee7b7', label: '🗺️ Geography' },
  economics: { bg: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.3)', text: '#c4b5fd', label: '📊 Economics' },
  hindi: { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)', text: '#fcd34d', label: '📙 Hindi' },
  sanskrit: { bg: 'rgba(234,179,8,0.15)', border: 'rgba(234,179,8,0.3)', text: '#fde047', label: '📜 Sanskrit' },
  english: { bg: 'rgba(236,72,153,0.15)', border: 'rgba(236,72,153,0.3)', text: '#f9a8d4', label: '📝 English' },
  default: { bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.2)', text: '#a5b4fc', label: '📚 General' },
}

const TOPIC_TRANSLATIONS = {
  hi: { "The French Revolution": "फ़्रांसीसी क्रांति" },
  ta: { "The French Revolution": "பிரெஞ்சு புரட்சி" },
  te: { "The French Revolution": "ఫ్రెంచ్ విప్లవం" },
  bn: { "The French Revolution": "ফরাসি বিপ্লব" },
  mr: { "The French Revolution": "फ्रेंच राज्यक्रांती" },
  gu: { "The French Revolution": "ફ્રેન્ચ ક્રાંતિ" },
  ml: { "The French Revolution": "ഫ്രഞ്ച് വിപ്ലവം" },
  kn: { "The French Revolution": "ಫ್ರೆಂಚ್ ಕ್ರಾಂತಿ" },
  pa: { "The French Revolution": "ਫਰਾਂਸੀਸੀ ਇਨਕਲਾਬ" },
  ur: { "The French Revolution": "انقلاب فرانس" },

};

// ── Normalize AI text ─────────────────────────────────────────────────────────
function normalizeText(text) {
  if (!text) return ''
  return text
    .replace(/\r\n/g, '\n')
    // Strip all markdown headings (##, ###, etc.)
    .replace(/^#{1,6}\s+/gm, '')
    // Collapse 3+ newlines
    .replace(/\n{3,}/g, '\n\n')
    // Single newline after sentence-ending punctuation → paragraph break
    .replace(/([।.!?])\n(?!\n)/g, '$1\n\n')
    // Ensure bullet lines are separated from surrounding text
    .replace(/([^\n])\n([-*•])/g, '$1\n\n$2')
    .replace(/([-*•][^\n]+)\n([^-*•\n])/g, '$1\n\n$2')
    .trim()
}

// ── Parse inline bold **text** ────────────────────────────────────────────────
function parseBold(text) {
  if (!text) return text
  const parts = text.split(/(\*\*.*?\*\*|\*\*.*?$)/g)
  return parts.map((part, k) => {
    if (part.startsWith('**')) {
      const clean = part.endsWith('**') ? part.slice(2, -2) : part.slice(2)
      return <strong key={k} style={{ color: '#a5b4fc', fontWeight: 800 }}>{clean}</strong>
    }
    return part
  })
}

function formatExplanationText(text, showCursor = false, language) {
  if (!text) return null
  const normalized = normalizeText(text)
  const paragraphs = normalized.split(/\n\n+/)

  return paragraphs.map((para, i) => {
    const isLast = i === paragraphs.length - 1
    const cursorEl = showCursor && isLast
      ? <span className="inline-block w-1.5 h-4 bg-indigo-400 ml-1 animate-pulse align-middle" />
      : null

    const trimmed = para.trim()
    if (!trimmed) return null

    // ── Key Takeaway ────────────────────────────────────────────────────────
    if (trimmed.toLowerCase().includes('key takeaway') || trimmed.includes('🎯')) {
      const clean = trimmed.replace(/key takeaway\s*🎯?:?/i, '').trim()
      return (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            margin: '32px 0',
            padding: '24px 28px',
            borderRadius: 18,
            background: 'linear-gradient(135deg, rgba(245,158,11,0.09), rgba(251,146,60,0.09))',
            border: '1px solid rgba(245,158,11,0.25)',
            boxShadow: '0 8px 32px rgba(245,158,11,0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 16, fontWeight: 800, color: '#fbbf24', marginBottom: 8, fontFamily: 'Outfit, sans-serif' }}>
            🎯 {t(language, 'key_takeaway') || 'Key Takeaway'}
          </div>
          <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: '1.08rem', color: '#fef3c7', lineHeight: '2.05', margin: 0 }}>
            {parseBold(clean)}{cursorEl}
          </p>
        </motion.div>
      )
    }

    // ── Bold-only line = section heading ────────────────────────────────────
    const isBoldHeading = /^\*\*[^*]+\*\*[:.：]?$/.test(trimmed)
    const isShortHeading =
      trimmed.length < 80 &&
      !trimmed.startsWith('-') &&
      !trimmed.startsWith('*') &&
      (trimmed.endsWith(':') || trimmed.endsWith('：'))

    if (isBoldHeading || isShortHeading) {
      const clean = trimmed.replace(/^\*\*|\*\*[:.：]?$|[:.：]$/g, '').trim()
      return (
        <h3
          key={i}
          style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: '1.25rem',
            fontWeight: 800,
            margin: '32px 0 14px',
            background: 'linear-gradient(90deg, #fff, #c4b5fd)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'block',
          }}
        >
          {clean}{cursorEl}
        </h3>
      )
    }

    // ── Bullet / numbered list ──────────────────────────────────────────────
    const lines = trimmed.split('\n').map(l => l.trim()).filter(Boolean)
    const isBulletLine = l => /^[-*•]/.test(l) || /^\d+[.)]\s/.test(l)
    const hasBullets = lines.some(isBulletLine)

    if (hasBullets) {
      // Collect items — lines that are bullets OR continuation of previous bullet
      const items = []
      let current = null
      for (const line of lines) {
        if (isBulletLine(line)) {
          if (current !== null) items.push(current)
          current = line.replace(/^[-*•]\s*|^\d+[.)]\s*/, '').trim()
        } else if (current !== null) {
          // continuation line — append to current bullet
          current += ' ' + line
        } else {
          // non-bullet line before any bullet
          items.push({ plain: line })
        }
      }
      if (current !== null) items.push(current)

      return (
        <ul key={i} style={{ margin: '20px 0', paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {items.map((item, j) => {
            const isLastItem = j === items.length - 1
            if (item && typeof item === 'object' && item.plain) {
              // plain text line mixed in
              return (
                <p key={j} style={{ fontFamily: "'Lora', Georgia, serif", fontSize: '1.08rem', color: '#d1d5db', lineHeight: '2.0', margin: 0 }}>
                  {parseBold(item.plain)}
                </p>
              )
            }
            if (!item || !item.trim()) return null
            return (
              <li
                key={j}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14,
                  fontFamily: "'Lora', Georgia, serif",
                  fontSize: '1.08rem',
                  color: '#e5e7eb',
                  lineHeight: '1.9',
                }}
              >
                <span style={{ color: '#818cf8', fontSize: 20, marginTop: 1, flexShrink: 0, lineHeight: 1 }}>•</span>
                <span style={{ flex: 1 }}>
                  {parseBold(item)}
                  {isLastItem ? cursorEl : null}
                </span>
              </li>
            )
          })}
        </ul>
      )
    }

    // ── Normal paragraph ────────────────────────────────────────────────────
    return (
      <p
        key={i}
        style={{
          fontFamily: "'Lora', Georgia, serif",
          fontSize: '1.08rem',
          color: '#d1d5db',
          lineHeight: '2.05',
          marginBottom: 20,
          letterSpacing: '0.01em',
        }}
      >
        {parseBold(trimmed)}{cursorEl}
      </p>
    )
  })
}

// ── Typewriter ────────────────────────────────────────────────────────────────
function TypewriterText({ text, speed = 10, language, isStreaming = false }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (isStreaming) {
      setDisplayed(text)
      setDone(false)
      return
    }
    
    // If we just finished streaming, text is already fully displayed!
    if (displayed === text && text.length > 0) {
      setDone(true)
      return
    }

    setDisplayed('')
    setDone(false)
    if (!text) return
    let i = 0
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i))
      i++
      if (i > text.length) {
        setDone(true)
        clearInterval(interval)
      }
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed, isStreaming])

  return <div style={{ position: 'relative' }}>{formatExplanationText(displayed, !done && !isStreaming, language)}</div>
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ExplanationCard({ explanation, detected = {}, onAudio, onRegenerate, isLoading, language, isStreaming = false, studentClass = 10 }) {
  const [eli10, setEli10] = useState(false)
  const [expanded, setExpanded] = useState(true)
  const rawSubj = (detected?.subject || 'default').trim().toLowerCase()
  let subject = 'default'
  if (['science', 'physics', 'chemistry', 'biology'].includes(rawSubj)) subject = 'science'
  else if (['math', 'mathematics'].includes(rawSubj)) subject = 'math'
  else if (['history', 'civics', 'political science', 'politics', 'social science', 'social studies'].includes(rawSubj)) subject = 'history'
  else if (['geography', 'earth science', 'disaster management'].includes(rawSubj)) subject = 'geography'
  else if (['economics', 'economy'].includes(rawSubj)) subject = 'economics'
  else if (['hindi', 'hindi literature', 'hindi bhasha'].includes(rawSubj)) subject = 'hindi'
  else if (['sanskrit'].includes(rawSubj)) subject = 'sanskrit'
  else if (['english', 'literature', 'english literature'].includes(rawSubj)) subject = 'english'

  const colors = SUBJECT_COLORS[subject] || SUBJECT_COLORS.default

  if (isLoading) {
    return (
      <div className="glass rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="shimmer h-4 w-24 rounded-full" />
          <div className="shimmer h-4 w-16 rounded-full" />
        </div>
        <div className="space-y-2">
          {[100, 90, 95, 80, 85].map((w, i) => (
            <div key={i} className="shimmer h-3 rounded-full" style={{ width: `${w}%` }} />
          ))}
        </div>
        <div className="flex items-center gap-2 text-indigo-400 text-sm mt-2">
          <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
          <span className="text-xs text-gray-500 ml-1">AI is simplifying...</span>
        </div>
      </div>
    )
  }

  if (!explanation) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl overflow-hidden"
      style={{ border: `1px solid ${colors.border}` }}
    >
      {/* ── Header ── */}
      <div
        style={{
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          background: colors.bg,
          borderBottom: `1px solid ${colors.border}`,
          minHeight: 64,
        }}
      >
        {/* Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span className="badge" style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}`, padding: '6px 14px', fontSize: 13 }}>
            {colors.label.split(' ')[0]} {t(language, `subj_${subject}`) || colors.label.split(' ')[1]}
          </span>
          {detected?.class_level && (
            <span className="badge badge-purple" style={{ padding: '6px 14px', fontSize: 13 }}>
              {t(language, 'class_label')} {detected.class_level}
            </span>
          )}
          {detected?.topic && (
            <span className="badge badge-cyan" style={{ padding: '6px 14px', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <Tag size={11} /> {TOPIC_TRANSLATIONS[language]?.[detected.topic] || detected.topic}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

          {onAudio && (
            <motion.button whileTap={{ scale: 0.9 }} onClick={onAudio}
              style={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'all 0.2s' }}>
              <Volume2 size={15} />
            </motion.button>
          )}

          {onRegenerate && (
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => onRegenerate(eli10)}
              style={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'all 0.2s' }}>
              <RotateCcw size={15} />
            </motion.button>
          )}

          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setExpanded(!expanded)}
            style={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'all 0.2s' }}>
            <motion.div animate={{ rotate: expanded ? 0 : -90 }}>
              <ChevronDown size={15} />
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* ── Content ── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="card-content-padding"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <BookOpen size={16} style={{ color: '#818cf8' }} />
              <span style={{ fontSize: 14, fontWeight: 600, color: '#a5b4fc', fontFamily: 'Outfit, sans-serif' }}>
                {t(language, 'simplified_explanation') || 'Simplified Explanation'}
              </span>
            </div>
            <TypewriterText text={explanation} speed={8} language={language} isStreaming={isStreaming} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}