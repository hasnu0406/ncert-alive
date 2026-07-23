import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, MessageCircle, HelpCircle, Layers, Volume2, Trophy, ArrowRight, Zap, Upload, Camera, Type, Sparkles, AlertTriangle, Info, Trash2, Users } from 'lucide-react'
import { useLanguage } from '../lib/LanguageContext'
import { t } from '../lib/i18n'
import Navbar from '../components/Navbar'
import PageUploader from '../components/PageUploader'
import FloatingEduIcons from '../components/FloatingEduIcons'
import ExplanationCard from '../components/ExplanationCard'
import DoubtChat from '../components/DoubtChat'
import QuizCard from '../components/QuizCard'
import Flashcard from '../components/Flashcard'
import AudioPlayer from '../components/AudioPlayer'
import Leaderboard from '../components/Leaderboard'
import SyllabusRoadmap from '../components/SyllabusRoadmap'
import MockExamCard from '../components/MockExamCard'
import { 
  simplifyPage, generateQuiz, generateFlashcards, 
  getLeaderboard, getMyGamification, simplifyStream, detectSubject,
  getSimplifyHistory, getCachedPage, deleteCachedPage, deleteAllCachedPages,
  linkParent, getMe, getStudentGoals
} from '../lib/api'

function LinkParentModal({ isOpen, onClose, onSuccess, language }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')
    setSuccessMsg('')
    try {
      const res = await linkParent(email.trim())
      setSuccessMsg(res.message || 'Successfully linked to parent!')
      setEmail('')
      setTimeout(() => {
        onSuccess(email.trim())
        onClose()
      }, 1500)
    } catch (err) {
      setError(err.message || 'Failed to link parent')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(5, 4, 10, 0.8)', backdropFilter: 'blur(8px)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        style={{ width: '90%', maxWidth: 440, background: 'rgba(20, 18, 36, 0.95)', border: '1px solid rgba(99, 102, 241, 0.25)', borderRadius: 24, padding: 28, boxShadow: '0 12px 48px rgba(99,102,241,0.25)', color: '#fff' }}>
        <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 20, marginBottom: 8 }}>🔗 Link a Parent Account</h3>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, marginBottom: 20 }}>
          Enter your parent's registered email address. This will allow them to check your study milestones, quizzes, and learning analytics.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.65)', display: 'block', marginBottom: 6 }}>Parent Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="parent@example.com"
              style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: 14, outline: 'none', transition: 'border-color 0.2s' }}
              onFocus={(e) => e.target.style.borderColor = '#6366f1'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
            />
          </div>

          {error && <div style={{ fontSize: 13, color: '#f87171', fontWeight: 600 }}>⚠️ {error}</div>}
          {successMsg && <div style={{ fontSize: 13, color: '#34d399', fontWeight: 600 }}>✓ {successMsg}</div>}

          <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
            <button
              type="button"
              onClick={onClose}
              style={{ flex: 1, padding: '12px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'background 0.2s' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{ flex: 1, padding: '12px 20px', borderRadius: 12, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 14px rgba(99,102,241,0.3)', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Linking...' : 'Link Parent'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

/* ── Ambient background ── */
function BgOrbs() {
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      <motion.div animate={{ scale: [1, 1.15, 1], x: [0, 30, 0], y: [0, -20, 0] }} transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', width: 700, height: 700, top: -250, right: -150, borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,0.14),transparent 70%)', filter: 'blur(60px)' }} />
      <motion.div animate={{ scale: [1, 1.2, 1], x: [0, -20, 0], y: [0, 25, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
        style={{ position: 'absolute', width: 500, height: 500, bottom: -100, left: '20%', borderRadius: '50%', background: 'radial-gradient(circle,rgba(139,92,246,0.11),transparent 70%)', filter: 'blur(60px)' }} />
      <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        style={{ position: 'absolute', width: 400, height: 400, top: '40%', left: -100, borderRadius: '50%', background: 'radial-gradient(circle,rgba(6,182,212,0.09),transparent 70%)', filter: 'blur(60px)' }} />
    </div>
  )
}

/* ── API Key Error Banner ── */
function ApiKeyBanner({ language }) {
  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
      style={{ marginBottom: 20, padding: '14px 18px', borderRadius: 16, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.22)', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
      <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} style={{ fontSize: 22, flexShrink: 0 }}>⚠️</motion.div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#f87171', marginBottom: 5, fontFamily: "'Outfit',sans-serif" }}>{t(language, 'api_key_missing')}</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65 }}>
          {t(language, 'api_key_desc1')} <code style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 5, padding: '1px 6px', fontFamily: 'monospace', color: '#f87171' }}>GROQ_API_KEY</code> {t(language, 'in_text') || 'in'} <code style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 5, padding: '1px 6px', fontFamily: 'monospace', color: '#a5b4fc' }}>backend/.env</code> {t(language, 'api_key_desc2')}{' '}
          <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>{t(language, 'api_key_get')}</a>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Grade Mismatch Banner ── */
function GradeBanner({ detectedClass, userClass, language }) {
  const [dismissed, setDismissed] = useState(false)
  if (!detectedClass || !userClass || dismissed) return null

  const detected = parseInt(detectedClass)
  const current = parseInt(userClass)
  if (detected === current) return null

  const isRevisiting = detected < current
  const isAdvanced = detected > current

  // Config per scenario
  const config = isRevisiting ? {
    emoji: '📚',
    color: '#818cf8',
    bg: 'rgba(99,102,241,0.08)',
    border: 'rgba(99,102,241,0.25)',
    tagBg: 'rgba(99,102,241,0.15)',
    tagColor: '#a5b4fc',
    tagBorder: 'rgba(99,102,241,0.3)',
    tag: `${t(language, 'class_label')} ${detected}`,
    title: `${t(language, 'revisit_class1') || 'Class '}${detected}${t(language, 'revisit_class2') || ' Content'} 🌟`,
    desc: `${t(language, 'class_label')} ${detected} ${t(language, 'nav_study')}! ${t(language, 'simplify')} ✨`,
    tip: `💡 ${t(language, 'nav_study')} ${t(language, 'class_label')} ${detected}`,
  } : {
    emoji: '🚀',
    color: '#06b6d4',
    bg: 'rgba(6,182,212,0.08)',
    border: 'rgba(6,182,212,0.25)',
    tagBg: 'rgba(6,182,212,0.15)',
    tagColor: '#67e8f9',
    tagBorder: 'rgba(6,182,212,0.3)',
    tag: `${t(language, 'class_label')} ${detected}`,
    title: `${t(language, 'class_label')} ${detected} 🌟`,
    desc: `${t(language, 'class_label')} ${detected} ${t(language, 'nav_study')}! ${t(language, 'simplify')} ✨`,
    tip: `💡 ${t(language, 'nav_study')} ${t(language, 'class_label')} ${detected}`,
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      style={{
        marginBottom: 20,
        borderRadius: 18,
        background: config.bg,
        border: `1px solid ${config.border}`,
        overflow: 'hidden',
      }}
    >
      {/* Top strip */}
      <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 26, flexShrink: 0 }}>{config.emoji}</div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#f0eeff', fontFamily: "'Outfit', sans-serif" }}>
                {config.title}
              </span>
              <span style={{
                fontSize: 11, fontWeight: 700, color: config.tagColor,
                background: config.tagBg, border: `1px solid ${config.tagBorder}`,
                borderRadius: 99, padding: '2px 10px', letterSpacing: '0.04em',
              }}>
                {config.tag}
              </span>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.6 }}>
              {config.desc}
            </p>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', fontSize: 18, padding: '4px 8px', flexShrink: 0, lineHeight: 1 }}
          title="Dismiss"
        >✕</button>
      </div>

      {/* Tip footer */}
      <div style={{
        padding: '8px 20px',
        background: 'rgba(0,0,0,0.12)',
        borderTop: `1px solid ${config.border}`,
        fontSize: 12,
        color: config.tagColor,
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <span>💡</span>
        {config.tip}
      </div>
    </motion.div>
  )
}

/* ── Empty state ── */
function EmptyState({ language, onAction }) {
  const actions = [
    { key: 'upload_pdf', color: '#818cf8', icon: Upload, actionId: 'pdf' },
    { key: 'photo', color: '#c4b5fd', icon: Camera, actionId: 'image' },
    { key: 'webcam', color: '#67e8f9', icon: Camera, actionId: 'webcam' },
    { key: 'paste_text', color: '#6ee7b7', icon: Type, actionId: 'text' },
  ]
  const tips = [
    { icon: '📄', key: 'tip_pdf' },
    { icon: '📷', key: 'tip_photo' },
    { icon: '🌐', key: 'tip_lang' },
    { icon: '🏆', key: 'tip_xp' },
  ]
  const tipTexts = {
    tip_pdf: t(language, 'tip_pdf'),
    tip_photo: t(language, 'tip_photo'),
    tip_lang: t(language, 'tip_lang'),
    tip_xp: t(language, 'tip_xp'),
  }
  const [tip, setTip] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTip(i => (i + 1) % tips.length), 3200)
    return () => clearInterval(id)
  }, [])

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 440, gap: 30, textAlign: 'center' }}>
      <div style={{ position: 'relative', width: 140, height: 140 }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1.5px dashed rgba(99,102,241,0.2)' }} />
        <motion.div animate={{ rotate: -360 }} transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', inset: 18, borderRadius: '50%', border: '1px dashed rgba(139,92,246,0.15)' }} />
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', inset: 0, borderRadius: '50%' }}>
          <div style={{ position: 'absolute', top: 0, left: '50%', marginLeft: -5, width: 10, height: 10, borderRadius: '50%', background: '#818cf8', boxShadow: '0 0 8px #818cf8' }} />
        </motion.div>
        <motion.div
          animate={{ boxShadow: ['0 0 0 rgba(99,102,241,0)', '0 0 40px rgba(99,102,241,0.45)', '0 0 0 rgba(99,102,241,0)'] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ position: 'absolute', inset: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BookOpen size={36} color="#fff" />
        </motion.div>
      </div>
      <div>
        <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 24, marginBottom: 10, letterSpacing: '-0.4px' }}>{t(language, 'add_page')}</h2>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', maxWidth: 340, lineHeight: 1.75 }}>{t(language, 'upload_first_desc')}</p>
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
        {actions.map(({ key, color, icon: Icon, actionId }) => (
          <motion.button key={actionId} whileHover={{ scale: 1.07, y: -3, boxShadow: `0 10px 32px ${color}28` }} whileTap={{ scale: 0.95 }}
            onClick={() => onAction(actionId)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 20px', borderRadius: 14, background: `${color}12`, border: `1px solid ${color}28`, color, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Outfit',sans-serif", transition: 'all 0.2s' }}>
            <Icon size={14} />{t(language, key)}
          </motion.button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={tip} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '11px 20px', borderRadius: 100, background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.14)', fontSize: 13, color: 'rgba(255,255,255,0.45)', maxWidth: 380 }}>
          <span style={{ fontSize: 18 }}>{tips[tip].icon}</span>
          {tipTexts[tips[tip].key]}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

/* ── Need content placeholder ── */
function NeedContent({ emoji, title, desc, onSampleQuiz, onOpenLibrary }) {
  const { language } = useLanguage()
  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 360, gap: 18, textAlign: 'center', background: 'rgba(14,12,27,0.7)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: 48 }}>
      <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }} style={{ fontSize: 56 }}>{emoji}</motion.div>
      <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Outfit',sans-serif", color: '#fff' }}>{title}</div>
      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', maxWidth: 380, lineHeight: 1.65 }}>{desc}</div>
      <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        {onSampleQuiz && (
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={onSampleQuiz}
            style={{ padding: '12px 22px', borderRadius: 14, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', color: '#fff', fontSize: 13.5, fontWeight: 700, cursor: 'pointer', fontFamily: "'Outfit',sans-serif", display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 16px rgba(99,102,241,0.3)' }}>
            <Sparkles size={16} /> Load Practice Quiz
          </motion.button>
        )}
        {onOpenLibrary && (
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={onOpenLibrary}
            style={{ padding: '12px 22px', borderRadius: 14, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#a5b4fc', fontSize: 13.5, fontWeight: 700, cursor: 'pointer', fontFamily: "'Outfit',sans-serif", display: 'flex', alignItems: 'center', gap: 8 }}>
            <BookOpen size={16} /> Open NCERT Library
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

/* ── Loading spinner ── */
function LoadingCard({ language }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(99,102,241,0.1)', borderRadius: 20, padding: '44px 36px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
      <div style={{ position: 'relative', width: 60, height: 60 }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid rgba(99,102,241,0.12)', borderTopColor: '#818cf8' }} />
        <motion.div animate={{ rotate: -360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', inset: 8, borderRadius: '50%', border: '2px solid rgba(139,92,246,0.2)', borderRightColor: '#c4b5fd' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Sparkles size={18} color="#818cf8" />
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Outfit',sans-serif", marginBottom: 6 }}>{t(language, 'simplify')}…</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{t(language, 'please_wait')}</div>
      </div>
      <div style={{ width: 300, height: 3, borderRadius: 3, background: 'rgba(255,255,255,0.04)', overflow: 'hidden' }}>
        <motion.div animate={{ x: ['-100%', '120%'] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: '45%', height: '100%', background: 'linear-gradient(90deg,transparent,#818cf8,#c4b5fd,transparent)', borderRadius: 3 }} />
      </div>
    </motion.div>
  )
}

const HIST_TRANS = {
  en: { header: "Study History", sub: "Previously simplified CBSE pages & documents", open: "Open" },
  hi: { header: "अध्ययन इतिहास", sub: "पहले से सरल बनाए गए सीबीएसई पृष्ठ और दस्तावेज़", open: "खोलें" },
  ta: { header: "படிப்பின் வரலாறு", sub: "முன்பு எளிமையாக்கப்பட்ட சிபிஎஸ்இ பக்கங்கள் & ஆவணங்கள்", open: "திறக்க" },
  te: { header: "అధ్యయన చరిత్ర", sub: "గతంలో సరళీకరించిన సిబిఎస్‌ఇ పేజీలు & పత్రాలు", open: "తెరవండి" },
  kn: { header: "ಅಧ್ಯಯನ ಇತಿಹಾಸ", sub: "ಹಿಂದೆ ಸರಳಗೊಳಿಸಲಾದ ಸಿಬಿಎಸ್‌ಇ ಪುಟಗಳು ಮತ್ತು ದಾಖಲೆಗಳು", open: "ತೆರೆಯಿರಿ" },
  ml: { header: "പഠന ചരിത്രം", sub: "മുമ്പ് ലളിതമാക്കിയ സിബിഎസ്ഇ പേജുകളും രേഖകളും", open: "തുറക്കുക" },
  mr: { header: "अभ्यास इतिहास", sub: "पूर्वी सुलभ केलेले सीबीएसई पृष्ठे आणि दस्तऐवज", open: "उघडा" },
  bn: { header: "অধ্যয়নের ইতিহাস", sub: "পূর্বে সরলীকৃত সিবিএসই পৃষ্ঠা ও নথিপত্র", open: "খুলুন" },
  gu: { header: "અભ્યાસ ઇતિહાસ", sub: "અગાઉ સરળ કરાયેલા સીબીએસઈ પૃષ્ઠો અને દસ્તાવેજો", open: "ખોલો" },
  pa: { header: "ਪੜ੍ਹਾਈ ਦਾ ਇਤਿਹਾਸ", sub: "ਪਹਿਲਾਂ ਸਰਲ ਕੀਤੇ ਗਏ ਸੀਬੀਐਸਈ ਪੰਨੇ ਅਤੇ ਦਸਤਾਵੇਜ਼", open: "ਖੋਲ੍ਹੋ" },
  or: { header: "ପଠନ ଇତିହାସ", sub: "ପୂର୍ବରୁ ସରଳୀକୃତ ସିବିଏସଇ ପୃଷ୍ଠା ଏବଂ ଦଲିଲଗୁଡ଼ିକ", open: "ଖୋଲନ୍ତୁ" },
  ur: { header: "مطالعہ کی تاریخ", sub: "پہلے سے آسان بنائے گئے سی بی ایس ای صفحات اور دستاویزات", open: "کھولیں" },
  as: { header: "অধ্যয়নৰ ইতিহাস", sub: "পূৰ্বতে সৰলীকৃত চিবিএছই পৃষ্ঠা আৰু নথিপত্ৰসমূহ", open: "খোলক" },
  ne: { header: "अध्ययन इतिहास", sub: "पहिले सरल गरिएका सीबीएसई पृष्ठहरू र कागजातहरू", open: "खोल्नुहोस्" },
  mai: { header: "अध्ययन इतिहास", sub: "पहिने सरल कएल सीबीएसई पृष्ठ आ दस्तावेज", open: "खोलू" },
  kok: { header: "अभ्यास इतिहास", sub: "पयलीं सुलभ केल्लीं सीबीएसई पानां आनी दस्तावेजां", open: "उकतात" },
  doi: { header: "पढ़ाई दा इतिहास", sub: "पहले सरल कीते गेदे सीबीएसई सफे ते दस्तावेज", open: "खोलें" },
  mni: { header: "মহৈ তম্বগী পুৱারী", sub: "মমাংদা লাইথোকহনখ্রবা সিবিএসই লমাইশিং অমসুং লাইরিকশিং", open: "হাংউ" },
  san: { header: "अध्ययनस्य इतिहासः", sub: "पूर्वं सरलीकृतानि सीबीएसई-पृष्ठानि तथा प्रलेखाः", open: "उद्घाटयन्तु" }
}

/* ══════════════════════════════════════════════════════════════════════════════
   MAIN STUDENT VIEW
══════════════════════════════════════════════════════════════════════════════ */
export default function StudentView() {
  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('ncert_user') || '{}'))
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false)
  const { language, changeLanguage } = useLanguage()

  const syncProfile = useCallback(async () => {
    try {
      const updatedUser = await getMe()
      if (updatedUser) {
        setCurrentUser(updatedUser)
        localStorage.setItem('ncert_user', JSON.stringify(updatedUser))
      }
    } catch (err) {
      console.error("Failed to sync user profile", err)
    }
  }, [])

  useEffect(() => {
    syncProfile()
  }, [syncProfile])
  const getDeleteAllText = () => {
    const clearAllTrans = {
      en: "Delete All", hi: "सभी हटाएं", ta: "அனைத்தையும் நீக்கு", te: "అన్నీ తొలగించు",
      kn: "ಎಲ್ಲವನ್ನೂ ಅಳಿಸಿ", ml: "എല്ലാം ഇല്ലാതാക്കുക", mr: "सर्व हटवा", bn: "সব মুছুন",
      gu: "બધું કાઢી નાખો", pa: "ਸਭ ਹਟਾਓ", or: "ସବୁ ବିଲୋପ କରନ୍ତু", ur: "تمام حذف کریں",
      as: "সকলো মচি পেলাওক", ne: "सबै हटाउनुहोस्", mai: "सभटा हटाउ", kok: "सगळें काडून उडयात",
      doi: "सारे हटाओ", mni: "পুম্নمক মুত্থতউ", san: "सर्वं दूरीकुर्वन्तु"
    }
    return clearAllTrans[language] || clearAllTrans['en']
  }
  const userClass = currentUser.class || 10

  const quizTimeoutRef = useRef(null)
  const cardsTimeoutRef = useRef(null)
  const [tab, setTab] = useState('upload')
  const [rawText, setRawText] = useState('')
  const [pageMeta, setPageMeta] = useState({})
  const [explanation, setExplanation] = useState('')
  const [detected, setDetected] = useState({})
  const [quiz, setQuiz] = useState(null)
  const [flashcards, setFlashcards] = useState([])
  const [gamification, setGamification] = useState(null)
  const [studentGoals, setStudentGoals] = useState([])
  const [leaderboard, setLeaderboard] = useState([])

  const refreshStudentGoals = () => {
    getStudentGoals().then(setStudentGoals).catch(() => {})
  }

  useEffect(() => {
    refreshStudentGoals()
  }, [gamification])
  const [loadingExplain, setLoadingExplain] = useState(false)
  const [loadingQuiz, setLoadingQuiz] = useState(false)
  const [loadingCards, setLoadingCards] = useState(false)
  const [pointsAnim, setPointsAnim] = useState(null)
  const [historyList, setHistoryList] = useState([])

  const loadHistoryList = async () => {
    try {
      const res = await getSimplifyHistory()
      if (res && res.history) {
        setHistoryList(res.history)
      }
    } catch (e) {
      console.error('Failed to load history list', e)
    }
  }

  useEffect(() => {
    loadHistoryList()
  }, [rawText])
  const [uploaderTrigger, setUploaderTrigger] = useState(null)
  const [apiKeyError, setApiKeyError] = useState(false)
  const prevLangRef = useRef(language)
  const activeStreamIdRef = useRef(0)
  const activeGenIdRef = useRef(0)

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get('tab')
    if (p) setTab(p)
  }, [])
  useEffect(() => { getMyGamification().then(setGamification).catch(() => { }) }, [])
  useEffect(() => { if (tab === 'leaderboard') getLeaderboard().then(setLeaderboard).catch(() => { }) }, [tab])

  useEffect(() => {
    if (language !== prevLangRef.current) {
      prevLangRef.current = language
      if (rawText) {
        setExplanation(''); setQuiz(null); setFlashcards([])
        triggerParallelGenerations(rawText, language, pageMeta)
        fetchExplanation(rawText, language, pageMeta, false)
      }
    }
  }, [language, rawText])


  const triggerParallelGenerations = (text, lang, meta) => {
    const genId = ++activeGenIdRef.current
    if (quizTimeoutRef.current) clearTimeout(quizTimeoutRef.current);
    if (cardsTimeoutRef.current) clearTimeout(cardsTimeoutRef.current);

    // Quiz and flashcards use the fast 8B model, explanation uses 17B
    // Different models = different rate limits = truly parallel, no competition!
    setLoadingQuiz(true);
    let quizRetries = 0;
    const fetchQuiz = async () => {
      try {
        const r = await generateQuiz(text, userClass, lang, meta?.pageId, meta?.docId);
        if (genId !== activeGenIdRef.current) return;
        if (r.status === 'processing' && quizRetries < 8) {
          quizRetries++;
          quizTimeoutRef.current = setTimeout(fetchQuiz, 4000);
        } else if (r.quiz) {
          setQuiz(r.quiz); setLoadingQuiz(false);
        } else {
          setLoadingQuiz(false);
        }
      } catch (err) {
        if (genId !== activeGenIdRef.current) return;
        setQuiz({ error: err.message || 'Failed to generate quiz' }); setLoadingQuiz(false);
      }
    }
    fetchQuiz();

    setLoadingCards(true);
    let cardsRetries = 0;
    const fetchCards = async () => {
      try {
        const r = await generateFlashcards(text, userClass, lang, meta?.pageId, meta?.docId);
        if (genId !== activeGenIdRef.current) return;
        if (r.status === 'processing' && cardsRetries < 8) {
          cardsRetries++;
          cardsTimeoutRef.current = setTimeout(fetchCards, 4000);
        } else if (r.flashcards) {
          setFlashcards(r.flashcards); setLoadingCards(false);
        } else {
          setLoadingCards(false);
        }
      } catch (err) {
        if (genId !== activeGenIdRef.current) return;
        setFlashcards([{ error: err.message || 'Failed to generate flashcards' }]); setLoadingCards(false);
      }
    }
    fetchCards();
  }

  const handleTextExtracted = async (text, meta = {}) => {

    setRawText(text); setPageMeta(meta)
    setExplanation(''); setQuiz(null); setFlashcards([])
    setApiKeyError(false); setTab('upload')
    triggerParallelGenerations(text, language, meta)
    await fetchExplanation(text, language, meta, false)
  }

  const fetchExplanation = async (text, lang, meta = pageMeta, eli10 = false) => {
    if (!text) return
    const streamId = ++activeStreamIdRef.current
    setLoadingExplain(true); setApiKeyError(false); setExplanation('')
    try {
      // Only detect subject if it's a new document or we haven't detected yet
      const currentDocId = meta?.docId
      const prevDocId = detected?.docId

      if (!detected || Object.keys(detected).length === 0 || (currentDocId && currentDocId !== prevDocId)) {
        detectSubject(text, userClass)
          .then(res => {
            if (streamId !== activeStreamIdRef.current) return;
            const newDetected = res || {}
            if (currentDocId) newDetected.docId = currentDocId
            setDetected(newDetected)
          })
          .catch(err => console.error('Detection failed', err))
      }

      // Stream the explanation
      let fullExplanation = ''
      for await (const chunk of simplifyStream(text, lang, userClass, 'default', eli10, meta.pageId)) {
        if (streamId !== activeStreamIdRef.current) return;
        fullExplanation += chunk
        setExplanation(fullExplanation)
      }
    } catch (err) {
      if (streamId !== activeStreamIdRef.current) return;
      const msg = err.message || ''
      if (msg.includes('GROQ_API_KEY') || msg.includes('console.groq.com') || msg.includes('authenticate') || msg.includes('API Key')) {
        setApiKeyError(true); setExplanation('')
      } else {
        setExplanation(`⚠️ ${msg || 'Could not simplify. Please check your Groq API key in backend/.env'}`)
      }
    }
    if (streamId === activeStreamIdRef.current) {
      setLoadingExplain(false)
    }
  }

  const handleClearAll = () => {
    setRawText(''); setExplanation(''); setQuiz(null)
    setFlashcards([]); setDetected({}); setPageMeta({}); setApiKeyError(false)
  }

  const handleSampleQuiz = () => {
    const sampleText = "Photosynthesis is the process by which green plants and certain other organisms transform light energy into chemical energy. During photosynthesis in green plants, light energy is captured and used to convert water, carbon dioxide, and minerals into oxygen and energy-rich organic compounds. Leaves have tiny pores called stomata for gas exchange."
    setRawText(sampleText)
    setPageMeta({ pageId: 'sample-quiz-page', docId: 'sample-quiz-doc' })
    setQuiz(null)
    setLoadingQuiz(true)
    generateQuiz(sampleText, userClass, language, 'sample-quiz-page', 'sample-quiz-doc')
      .then(r => {
        setQuiz(r.quiz || r)
        setLoadingQuiz(false)
      })
      .catch(err => {
        setQuiz({ error: err.message || 'Failed to generate quiz' })
        setLoadingQuiz(false)
      })
  }

  const handleTabChange = async (newTab) => {
    setTab(newTab)
    if (newTab === 'quiz' && (!quiz || quiz.error) && !loadingQuiz && rawText) {
      setLoadingQuiz(true)
      const fetchQuiz = async () => {
        try { 
          const r = await generateQuiz(rawText, userClass, language, pageMeta.pageId, pageMeta.docId);
          if (r.status === 'processing') {
            setTimeout(fetchQuiz, 3000);
          } else {
            setQuiz(r.quiz || r); 
            setLoadingQuiz(false);
          }
        } catch (err) { 
          setQuiz({ error: err.message || 'Failed to generate quiz' }); 
          setLoadingQuiz(false); 
        }
      }
      fetchQuiz();
    }
    if (newTab === 'flashcards' && !flashcards.length && !loadingCards && rawText) {
      setLoadingCards(true)
      const fetchCards = async () => {
        try { 
          const r = await generateFlashcards(rawText, userClass, language, pageMeta.pageId, pageMeta.docId);
          if (r.status === 'processing') {
            setTimeout(fetchCards, 3000);
          } else {
            setFlashcards(r.flashcards); 
            setLoadingCards(false);
          }
        } catch (err) { 
          setFlashcards([{ error: err.message || 'Failed to generate flashcards' }]); 
          setLoadingCards(false); 
        }
      }
      fetchCards();
    }
  }

  const handlePointsAwarded = async (g) => {
    setPointsAnim(g); setTimeout(() => setPointsAnim(null), 3500)
    try { const fresh = await getMyGamification(); setGamification(fresh) } catch { }
  }

  const handleLoadSavedPage = async (pageId) => {
    setLoadingExplain(true)
    try {
      const res = await getCachedPage(pageId)
      setRawText(res.originalText)
      setPageMeta({
        pageId: res.pageId,
        subject: res.subject,
        class_level: res.classLevel,
        topic: res.topic,
        totalPages: res.totalPages,
        pages: res.pages
      })
      setDetected({
        subject: res.subject,
        class_level: res.classLevel,
        topic: res.topic
      })
      
      const simplifiedForLang = res.simplifiedText?.[language] || Object.values(res.simplifiedText)?.[0] || ''
      setExplanation(simplifiedForLang)
      setQuiz(res.quiz && Object.keys(res.quiz).length ? res.quiz : null)
      setFlashcards(res.flashcards || [])
    } catch (err) {
      console.error('Failed to load page:', err)
    }
    setLoadingExplain(false)
  }

  const handleDeleteSavedPage = async (e, pageId) => {
    e.stopPropagation()
    if (!window.confirm("Are you sure you want to delete this saved page and all associated doubts?")) return
    try {
      await deleteCachedPage(pageId)
      loadHistoryList()
      if (pageMeta.pageId === pageId) {
        handleClearAll()
      }
    } catch (e) {
      console.error('Failed to delete saved page', e)
    }
  }

  const handleDeleteAllSavedPages = async () => {
    if (!window.confirm("Are you sure you want to delete ALL saved simplified contents and all associated doubts? This cannot be undone.")) return
    try {
      await deleteAllCachedPages()
      loadHistoryList()
      handleClearAll()
    } catch (e) {
      console.error('Failed to delete all saved pages', e)
    }
  }

  const hour = new Date().getHours()
  const greetKey = hour < 12 ? 'good_morning' : hour < 17 ? 'good_afternoon' : 'good_evening'
  const firstName = currentUser.name?.split(' ')[0] || 'Student'

  const detectedClass = detected?.class_level
  const showGradeBanner = detectedClass && parseInt(detectedClass) !== parseInt(userClass)

  return (
    <div className="mesh-grid" style={{ display: 'flex', minHeight: '100dvh', color: '#f8f7ff', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <BgOrbs />
      <FloatingEduIcons />
      <Navbar activeTab={tab} onTabChange={handleTabChange} />

      <main className="main-content" style={{ flex: 1, minHeight: '100dvh', padding: '40px 48px 120px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>

          {/* ── Header ── */}
          {tab !== 'chat' && (
            <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 36 }}>
              <div style={{ fontSize: 10, color: '#9ea4d4', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6, fontWeight: 700 }}>
                {t(language, greetKey)} 👋
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 32, letterSpacing: '-0.8px', marginBottom: 10 }}>
                  {t(language, 'hey_user')}{' '}
                  <span style={{ background: 'linear-gradient(90deg,#818cf8,#c4b5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{firstName}</span>!
                </h1>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginTop: 4 }}>
                <span style={{ fontSize: 12, color: '#9ea4d4', fontWeight: 500 }}>{t(language, 'class_label')} {userClass} · CBSE</span>
                {gamification && (
                  <>
                    <motion.div whileHover={{ scale: 1.05 }}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg,rgba(252,211,77,0.12),rgba(245,158,11,0.05))', border: '1px solid rgba(252,211,77,0.22)', borderRadius: 100, padding: '5px 14px' }}>
                      <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ fontSize: 14 }}>⭐</motion.span>
                      <span style={{ fontSize: 12, fontWeight: 800, color: '#fcd34d' }}>{gamification.points?.toLocaleString() || 0}</span>
                      <span style={{ fontSize: 10, color: '#9ea4d4', fontWeight: 500 }}>{t(language, 'xp_points')}</span>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg,rgba(251,146,60,0.12),rgba(239,68,68,0.05))', border: '1px solid rgba(251,146,60,0.22)', borderRadius: 100, padding: '5px 14px' }}>
                      <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ fontSize: 14 }}>🔥</motion.span>
                      <span style={{ fontSize: 12, fontWeight: 800, color: '#fb923c' }}>{gamification.streakCount || 0}d</span>
                      <span style={{ fontSize: 10, color: '#9ea4d4', fontWeight: 500 }}>{t(language, 'streak')}</span>
                    </motion.div>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {/* Chat compact header */}
          {tab === 'chat' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 20, background: 'linear-gradient(90deg,#818cf8,#c4b5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>NCERT AI</span>
                <span style={{ fontSize: 12, color: '#9ea4d4', fontWeight: 500 }}>· {t(language, 'ask_anything')}</span>
              </div>
              {gamification && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#fcd34d' }}>⭐ {gamification.points?.toLocaleString() || 0} XP</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#fb923c' }}>🔥 {gamification.streakCount || 0}d</span>
                </div>
              )}
            </motion.div>
          )}

          {/* ── Points toast ── */}
          <AnimatePresence>
            {pointsAnim && (
              <motion.div initial={{ opacity: 0, y: -24, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9, y: -10 }}
                style={{ position: 'fixed', top: 24, right: 24, zIndex: 200, background: 'rgba(13,11,30,0.97)', border: '1px solid rgba(99,102,241,0.4)', borderRadius: 18, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14, backdropFilter: 'blur(20px)', boxShadow: '0 8px 48px rgba(99,102,241,0.3)' }}>
                <motion.span animate={{ rotate: [0, 20, -10, 0], scale: [1, 1.3, 1] }} transition={{ duration: 0.6 }} style={{ fontSize: 24 }}>🎉</motion.span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Outfit',sans-serif", color: '#a5b4fc' }}>+{pointsAnim.pointsAwarded} XP!</div>
                  {pointsAnim.newBadge?.length > 0 && (
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>🏅 {t(language, 'badge_text')} {pointsAnim.newBadge[0]}</div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Tab content ── */}
          <AnimatePresence mode="wait">

            {tab === 'upload' && (
              <motion.div key="upload" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>

                {/* Uploader */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  style={explanation ? { marginBottom: 24 } : { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: '28px 30px', marginBottom: 28 }}>
                  {!explanation && !loadingExplain && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
                      <motion.div animate={{ boxShadow: ['0 0 0 rgba(99,102,241,0)', '0 0 20px rgba(99,102,241,0.45)', '0 0 0 rgba(99,102,241,0)'] }} transition={{ duration: 2.5, repeat: Infinity }}
                        style={{ width: 44, height: 44, borderRadius: 13, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <BookOpen size={20} color="#818cf8" />
                      </motion.div>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 800, fontFamily: "'Outfit',sans-serif", marginBottom: 4, color: '#f0eeff' }}>{t(language, 'add_page')}</div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>PDF · {t(language, 'photo')} · {t(language, 'webcam')} · {t(language, 'paste_text')}</div>
                      </div>
                    </div>
                  )}
                  <PageUploader
                    onTextExtracted={handleTextExtracted}
                    triggerAction={uploaderTrigger}
                    onTriggerConsumed={() => setUploaderTrigger(null)}
                    isMinimized={!!(explanation || loadingExplain)}
                    onClear={handleClearAll}
                    language={language}
                    classLevel={userClass}
                    pageMeta={pageMeta}
                  />
                </motion.div>


                {/* Parent Goals and Milestones Card */}
                {!explanation && !loadingExplain && studentGoals.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    style={{ marginTop: 24, padding: '24px 28px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                      <Target size={18} color="#c4b5fd" />
                      <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 16, color: '#f0eeff', margin: 0 }}>Active Parent Milestones</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      {studentGoals.map((g) => {
                        const currentPoints = gamification?.points || 0
                        const pct = Math.min(Math.round((currentPoints / g.targetXp) * 100), 100)
                        return (
                          <div key={g._id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, padding: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                              <div>
                                <span style={{ fontSize: 14, fontWeight: 700, color: '#f0eeff' }}>{g.rewardName}</span>
                                <span style={{ fontSize: 11, color: '#a5b4fc', background: 'rgba(165,180,252,0.1)', border: '1px solid rgba(165,180,252,0.2)', padding: '2px 8px', borderRadius: 100, marginLeft: 10, fontWeight: 600 }}>
                                  Goal: {g.targetXp} XP
                                </span>
                              </div>
                              <span style={{
                                fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 100,
                                background: g.status === 'completed' ? 'rgba(52,211,153,0.1)' : 'rgba(245,158,11,0.08)',
                                border: `1px solid ${g.status === 'completed' ? 'rgba(52,211,153,0.25)' : 'rgba(245,158,11,0.2)'}`,
                                color: g.status === 'completed' ? '#34d399' : '#fbbf24',
                              }}>
                                {g.status === 'completed' ? '🎉 Completed!' : '⏳ In Progress'}
                              </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1 }}
                                  style={{ height: '100%', background: g.status === 'completed' ? '#34d399' : '#818cf8', borderRadius: 3 }} />
                              </div>
                              <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', width: 35, textAlign: 'right' }}>
                                {pct}%
                              </span>
                            </div>
                            <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.3)', margin: '6px 0 0' }}>
                              Your XP: {currentPoints} / {g.targetXp} XP
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}

                {/* ── Grade Banner (shown after detection, before explanation) ── */}
                <AnimatePresence>
                  {showGradeBanner && !loadingExplain && (
                    <GradeBanner
                      detectedClass={detectedClass}
                      userClass={userClass}
                      language={language}
                    />
                  )}
                </AnimatePresence>

                {/* API key error */}
                {apiKeyError && <ApiKeyBanner language={language} />}

                {/* Loading State */}
                {loadingExplain && !explanation && <LoadingCard language={language} />}

                {/* Explanation */}
                {explanation && (
                  <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
                    <ExplanationCard
                      explanation={explanation}
                      detected={detected}
                      language={language}
                      studentClass={userClass}
                      isStreaming={loadingExplain}
                      onRegenerate={(eli) => fetchExplanation(rawText, language, detected, eli)}
                      onAudio={explanation ? () => handleTabChange('audio') : undefined}
                    />
                  </motion.div>
                )}

                {/* Empty state */}
                {!rawText && !loadingExplain && !apiKeyError && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                    <EmptyState language={language} onAction={a => setUploaderTrigger(a)} />
                  </div>
                )}

              </motion.div>
            )}

            {tab === 'library' && (
              <motion.div key="library" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div style={{ background: 'rgba(14,12,27,0.7)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: '28px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <BookOpen size={18} style={{ color: '#a5b4fc' }} />
                      <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 18, color: '#fff', margin: 0 }}>
                        {HIST_TRANS[language]?.header || HIST_TRANS['en'].header}
                      </h3>
                    </div>
                    {historyList.length > 0 && (
                      <motion.button whileHover={{ scale: 1.05, backgroundColor: 'rgba(239,68,68,0.2)' }} whileTap={{ scale: 0.95 }}
                        onClick={handleDeleteAllSavedPages}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', fontFamily: "'Outfit',sans-serif" }}>
                        <Trash2 size={14} />
                        {getDeleteAllText()}
                      </motion.button>
                    )}
                  </div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', margin: '0 0 20px 28px' }}>
                    {HIST_TRANS[language]?.sub || HIST_TRANS['en'].sub}
                  </p>
                  
                  {historyList.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.3)' }}>
                      No simplified pages saved yet. Upload a PDF in the Study tab to get started! 📚
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {historyList.map((item) => (
                        <motion.div key={item.pageId}
                          whileHover={{ background: 'rgba(255,255,255,0.02)' }}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderRadius: 16, background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)' }}>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', fontFamily: "'Outfit',sans-serif", marginBottom: 4 }}>
                              {item.topic && item.topic !== 'Unknown' ? item.topic : `Document Page (${item.pageId.split('-p').slice(-1)[0] || '1'})`}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
                              <span style={{ textTransform: 'uppercase', background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', padding: '2px 8px', borderRadius: 6, fontWeight: 600 }}>
                                {/[\u0900-\u097F]/.test(item.topic || '') && (item.subject === 'english' || item.subject === 'default') ? 'hindi' : item.subject}
                              </span>
                              <span>·</span>
                              <span>{t(language, 'class_label')} {item.classLevel}</span>
                              {item.updatedAt && (
                                <>
                                  <span>·</span>
                                  <span>{new Date(item.updatedAt).toLocaleDateString()}</span>
                                </>
                              )}
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                              onClick={() => { handleLoadSavedPage(item.pageId); setTab('upload') }}
                              style={{ padding: '8px 16px', borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: "'Outfit',sans-serif" }}>
                              {HIST_TRANS[language]?.open || HIST_TRANS['en'].open}
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.05, backgroundColor: 'rgba(239,68,68,0.15)' }} whileTap={{ scale: 0.95 }}
                              onClick={(e) => handleDeleteSavedPage(e, item.pageId)}
                              style={{ padding: 8, borderRadius: 10, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Trash2 size={15} />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {tab === 'chat' && (
              <motion.div key="chat" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {!rawText && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    style={{ marginBottom: 12, padding: '11px 16px', borderRadius: 14, background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.16)', fontSize: 13, color: '#fcd34d', display: 'flex', alignItems: 'center', gap: 10 }}>
                    💡 <span>{t(language, 'upload_first')} {t(language, 'for_smarter_answers')}</span>
                  </motion.div>
                )}
                <DoubtChat context={explanation || rawText} language={language} onLanguageChange={changeLanguage} hasContext={!!rawText} pageId={pageMeta.pageId} userId={currentUser.id} />
              </motion.div>
            )}

            {tab === 'quiz' && (
              <motion.div key="quiz" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {!rawText
                  ? <NeedContent emoji="🎯" title="NCERT AI Quiz Generator" desc="Upload a chapter PDF page or click below to generate an instant conceptual practice quiz!" onSampleQuiz={handleSampleQuiz} onOpenLibrary={() => setTab('library')} />
                  : <QuizCard quiz={quiz} pageId={pageMeta.pageId} userId={currentUser.id} onPointsAwarded={handlePointsAwarded} isLoading={loadingQuiz} language={language} />
                }
              </motion.div>
            )}

            {tab === 'flashcards' && (
              <motion.div key="flash" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {!rawText
                  ? <NeedContent emoji="🃏" title={t(language, 'nav_cards')} desc={`${t(language, 'upload_first')} ${t(language, 'to_generate_flashcards')}`} />
                  : (
                    <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 24 }}>
                      <Flashcard cards={flashcards} isLoading={loadingCards} language={language} />
                    </div>
                  )
                }
              </motion.div>
            )}

            {tab === 'audio' && (
              <motion.div key="audio" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {!explanation
                  ? <NeedContent emoji="🔊" title={t(language, 'nav_listen')} desc={`${t(language, 'upload_first')} ${t(language, 'to_enable_audio')}`} />
                  : <AudioPlayer text={explanation} language={language} onLanguageChange={changeLanguage} />
                }
              </motion.div>
            )}

            {tab === 'leaderboard' && (
              <motion.div key="lb" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <Leaderboard entries={leaderboard} currentUserId={currentUser.id} language={language} />
              </motion.div>
            )}

            {tab === 'roadmap' && (
              <motion.div key="roadmap" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <SyllabusRoadmap language={language} />
              </motion.div>
            )}

            {tab === 'mockexam' && (
              <motion.div key="mockexam" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {!rawText
                  ? <NeedContent emoji="📝" title="CBSE Mock Exam" desc="Upload a chapter PDF page first to generate a sectional CBSE Mock Exam!" />
                  : <MockExamCard pageId={pageMeta.pageId} language={language} onPointsAwarded={handlePointsAwarded} />
                }
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        {isLinkModalOpen && (
          <LinkParentModal
            isOpen={isLinkModalOpen}
            onClose={() => setIsLinkModalOpen(false)}
            onSuccess={() => syncProfile()}
            language={language}
          />
        )}
      </AnimatePresence>

      <style>{`
        @media(min-width:769px) and (max-width:1024px){main{margin-left:240px!important;padding:28px 24px 120px!important;}}
        @media(max-width:768px){.bottom-nav{display:flex!important;}main{margin-left:0!important;padding:20px 16px 120px!important;}main>div{max-width:100%!important;}}
      `}</style>
    </div>
  )
}