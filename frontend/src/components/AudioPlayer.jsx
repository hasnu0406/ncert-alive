import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Volume2, Loader2, AlertCircle } from 'lucide-react'
import { generateAudio } from '../lib/api'
import LanguageSelector from './LanguageSelector'
import { LANGUAGES } from '../lib/i18n'
import { t } from '../lib/i18n'

export default function AudioPlayer({ text, language, onLanguageChange }) {
  const [loading, setLoading] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [audioUrl, setAudioUrl] = useState(null)
  const [error, setError] = useState('')
  const [currentLang, setCurrentLang] = useState(language)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef()

  useEffect(() => {
    return () => { if (audioUrl) URL.revokeObjectURL(audioUrl) }
  }, [audioUrl])

  useEffect(() => {
    if (language !== currentLang) {
      setCurrentLang(language)
      setPlaying(false)
      if (audioRef.current) audioRef.current.pause()
      if (audioUrl) { URL.revokeObjectURL(audioUrl); setAudioUrl(null) }
      setError('')
    }
  }, [language])

  const handleGenerate = async (lang) => {
    setLoading(true); setError(''); setPlaying(false)
    if (audioUrl) { URL.revokeObjectURL(audioUrl); setAudioUrl(null) }
    try {
      const blob = await generateAudio(text, lang || currentLang)
      const url = URL.createObjectURL(blob)
      setAudioUrl(url)
    } catch (e) { setError('Audio generation failed. Check your API key.') }
    setLoading(false)
  }

  const handleLangChange = (l) => { setCurrentLang(l); onLanguageChange?.(l) }

  const togglePlay = () => {
    if (!audioRef.current) return
    if (playing) { audioRef.current.pause(); setPlaying(false) }
    else { audioRef.current.play(); setPlaying(true) }
  }

  const handleTimeUpdate = () => {
    if (!audioRef.current) return
    setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100 || 0)
  }

  const handleLoadedMetadata = () => setDuration(audioRef.current?.duration || 0)
  const handleEnded = () => setPlaying(false)
  const formatTime = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

  const langLabel = LANGUAGES.find(l => l.code === currentLang)?.native || LANGUAGES.find(l => l.code === currentLang)?.label || 'English'

  return (
    <div className="glass rounded-2xl" style={{ overflow: 'hidden' }}>

      {/* ── Header ── */}
      <div style={{
        padding: '20px 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 16,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(6,182,212,0.04)',
        minHeight: 72,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 14, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, rgba(6,182,212,0.25), rgba(99,102,241,0.25))',
          }}>
            <Volume2 size={20} style={{ color: '#06b6d4' }} />
          </div>
          <div>
            {/* ✅ FIX: use t() for translated strings */}
            <p style={{ fontSize: 15, fontWeight: 700, color: '#f0eeff', fontFamily: 'Outfit, sans-serif', marginBottom: 3 }}>
              {t(currentLang, 'nav_listen')}
            </p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: 0 }}>
              {t(currentLang, 'simplified_explanation')}
            </p>
          </div>
        </div>
        <LanguageSelector value={currentLang} onChange={handleLangChange} compact />
      </div>

      {/* ── Body ── */}
      <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Generate button */}
        {!audioUrl && !loading && (
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => handleGenerate(currentLang)}
            className="btn-primary"
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 10, padding: '14px 24px', fontSize: 15, borderRadius: 14,
            }}
          >
            <Volume2 size={17} />
            {/* ✅ FIX: show native language name, not hardcoded English */}
            {t(currentLang, 'simplify')} — {langLabel}
          </motion.button>
        )}

        {/* Loading */}
        <AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '20px 0', justifyContent: 'center' }}>
              <Loader2 size={20} style={{ color: '#06b6d4' }} className="animate-spin" />
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>
                {t(currentLang, 'processing_ai')}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Player */}
        <AnimatePresence>
          {audioUrl && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <audio ref={audioRef} src={audioUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded} />

              {/* Waveform */}
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 2, height: 48 }}>
                {Array.from({ length: 40 }).map((_, i) => (
                  <motion.div key={i}
                    animate={playing ? {
                      height: [4, Math.random() * 28 + 4, 4],
                      transition: { duration: 0.5 + Math.random() * 0.5, repeat: Infinity, delay: i * 0.03 }
                    } : { height: 4 }}
                    style={{
                      width: 3, minHeight: 4, borderRadius: 99,
                      background: i / 40 < progress / 100 ? '#06b6d4' : 'rgba(255,255,255,0.12)',
                    }}
                  />
                ))}
              </div>

              {/* Progress bar */}
              <div style={{ width: '100%', background: 'rgba(255,255,255,0.08)', borderRadius: 99, height: 6, cursor: 'pointer' }}
                onClick={e => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const pct = (e.clientX - rect.left) / rect.width
                  if (audioRef.current) audioRef.current.currentTime = pct * duration
                }}>
                <motion.div style={{ height: 6, borderRadius: 99, width: `${progress}%`, background: 'linear-gradient(90deg, #06b6d4, #6366f1)' }} />
              </div>

              {/* Controls */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                  {audioRef.current ? formatTime(audioRef.current.currentTime) : '0:00'}
                </span>
                <motion.button whileTap={{ scale: 0.85 }} onClick={togglePlay}
                  style={{
                    width: 52, height: 52, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: 'none', cursor: 'pointer',
                    background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
                    boxShadow: '0 4px 20px rgba(6,182,212,0.3)',
                  }}>
                  <AnimatePresence mode="wait">
                    <motion.div key={playing ? 'pause' : 'play'} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                      {playing
                        ? <Pause size={22} style={{ color: '#fff' }} />
                        : <Play size={22} style={{ color: '#fff', marginLeft: 2 }} />}
                    </motion.div>
                  </AnimatePresence>
                </motion.button>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{formatTime(duration)}</span>
              </div>

              {/* Regenerate */}
              <button onClick={() => handleGenerate(currentLang)} className="btn-secondary"
                style={{ width: '100%', padding: '12px 0', fontSize: 14, borderRadius: 12 }}>
                {t(currentLang, 'simplify')} — {langLabel}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#fca5a5', padding: '12px 16px', borderRadius: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <AlertCircle size={14} style={{ flexShrink: 0 }} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}