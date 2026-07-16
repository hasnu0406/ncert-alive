import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, BookOpen, Trophy, Clock, TrendingUp, Zap, Target, Plus } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useLanguage } from '../lib/LanguageContext'
import { t } from '../lib/i18n'
import { getChildrenProgress, linkStudent, getParentGoals, createGoal } from '../lib/api'

function LinkStudentModal({ isOpen, onClose, onSuccess, language }) {
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
      const res = await linkStudent(email.trim())
      setSuccessMsg(res.message || 'Successfully linked student!')
      setEmail('')
      setTimeout(() => {
        onSuccess()
        onClose()
      }, 1500)
    } catch (err) {
      setError(err.message || 'Failed to link student')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(5, 4, 10, 0.8)', backdropFilter: 'blur(8px)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        style={{ width: '90%', maxWidth: 440, background: 'rgba(20, 18, 36, 0.95)', border: '1px solid rgba(99, 102, 241, 0.25)', borderRadius: 24, padding: 28, boxShadow: '0 12px 48px rgba(99,102,241,0.25)', color: '#fff' }}>
        <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 20, marginBottom: 8 }}>🔗 Link a Student Account</h3>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, marginBottom: 20 }}>
          Enter the registered email address of your child. This will link their study progress and quiz scores directly to your parent dashboard.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.65)', display: 'block', marginBottom: 6 }}>Student Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="child@student.com"
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
              {loading ? 'Linking...' : 'Link Account'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

function SetGoalModal({ isOpen, onClose, onSuccess, childrenList }) {
  const [studentId, setStudentId] = useState(childrenList[0]?.child?.id || '')
  const [targetXp, setTargetXp] = useState(100)
  const [rewardName, setRewardName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (childrenList.length > 0 && !studentId) {
      setStudentId(childrenList[0]?.child?.id)
    }
  }, [childrenList])

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!studentId || !rewardName.trim()) return
    setLoading(true)
    setError('')
    try {
      await createGoal(studentId, targetXp, rewardName.trim())
      setRewardName('')
      onSuccess()
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to set goal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(5, 4, 10, 0.8)', backdropFilter: 'blur(8px)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        style={{ width: '90%', maxWidth: 440, background: 'rgba(20, 18, 36, 0.95)', border: '1px solid rgba(99, 102, 241, 0.25)', borderRadius: 24, padding: 28, boxShadow: '0 12px 48px rgba(99,102,241,0.25)', color: '#fff' }}>
        <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 20, marginBottom: 8 }}>🎯 Set a Study Goal</h3>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, marginBottom: 20 }}>
          Define an XP milestone for your child and set a custom reward to keep them motivated!
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {childrenList.length > 1 && (
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.65)', display: 'block', marginBottom: 6 }}>Select Child</label>
              <select
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: 14, outline: 'none' }}
              >
                {childrenList.map((c) => (
                  <option key={c.child.id} value={c.child.id} style={{ background: '#141224', color: '#fff' }}>
                    {c.child.name} (Class {c.child.class})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.65)', display: 'block', marginBottom: 6 }}>Target XP Milestone</label>
            <select
              value={targetXp}
              onChange={(e) => setTargetXp(Number(e.target.value))}
              style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: 14, outline: 'none' }}
            >
              <option value={50} style={{ background: '#141224' }}>50 XP (Quick Target)</option>
              <option value={100} style={{ background: '#141224' }}>100 XP (Standard Study)</option>
              <option value={250} style={{ background: '#141224' }}>250 XP (Weekly Goal)</option>
              <option value={500} style={{ background: '#141224' }}>500 XP (Super Learner)</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.65)', display: 'block', marginBottom: 6 }}>Reward Description</label>
            <input
              type="text"
              required
              value={rewardName}
              onChange={(e) => setRewardName(e.target.value)}
              placeholder="e.g., Pizza Night 🍕 or 1 Hour Game Time 🎮"
              style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: 14, outline: 'none' }}
            />
          </div>

          {error && <div style={{ fontSize: 13, color: '#f87171', fontWeight: 600 }}>⚠️ {error}</div>}

          <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
            <button
              type="button"
              onClick={onClose}
              style={{ flex: 1, padding: '12px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{ flex: 1, padding: '12px 20px', borderRadius: 12, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Setting...' : 'Set Goal'}
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
      <motion.div
        animate={{ scale: [1, 1.12, 1], x: [0, 25, 0], y: [0, -15, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', width: 600, height: 600, top: -200, right: -100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(196,181,253,0.12), transparent 70%)', filter: 'blur(60px)' }}
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
        style={{ position: 'absolute', width: 450, height: 450, bottom: -80, left: '10%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.1), transparent 70%)', filter: 'blur(60px)' }}
      />
    </div>
  )
}

/* ── Progress bar ── */
function ProgressBar({ value, color = '#6366f1' }) {
  return (
    <div style={{ width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: 6, height: 6, overflow: 'hidden' }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(value, 100)}%` }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{ height: '100%', borderRadius: 6, background: color }}
      />
    </div>
  )
}

/* ── Stat card ── */
function StatCard({ icon: Icon, label, value, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -4, borderColor: `${color}40` }}
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 18, padding: '20px 22px',
        display: 'flex', alignItems: 'center', gap: 16,
        transition: 'border-color 0.3s',
      }}
    >
      <motion.div
        animate={{ boxShadow: [`0 0 0px ${color}00`, `0 0 16px ${color}55`, `0 0 0px ${color}00`] }}
        transition={{ duration: 3, repeat: Infinity, delay }}
        style={{ width: 44, height: 44, borderRadius: 13, background: `${color}14`, border: `1px solid ${color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
      >
        <Icon size={20} color={color} />
      </motion.div>
      <div>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 500, marginBottom: 4 }}>{label}</p>
        <p style={{ fontSize: 22, fontWeight: 800, color, fontFamily: "'Outfit',sans-serif" }}>{value}</p>
      </div>
    </motion.div>
  )
}

export default function ParentDashboard() {
  const user = JSON.parse(localStorage.getItem('ncert_user') || '{}')
  const { language } = useLanguage()

  const LOCAL_TRANS = {
    en: {
      time_studied: "Time Studied",
      min_abbr: "m",
      excellent: "⭐ Excellent",
      improving: "📈 Improving",
      needs_support: "💪 Needs Support",
    },
    hi: {
      time_studied: "अध्ययन का समय",
      min_abbr: "मिनट",
      excellent: "⭐ उत्कृष्ट",
      improving: "📈 सुधार हो रहा है",
      needs_support: "💪 सहायता की आवश्यकता",
    },
    ta: {
      time_studied: "படித்த நேரம்",
      min_abbr: "நிமி",
      excellent: "⭐ மிகச் சிறந்தது",
      improving: "📈 முன்னேறுகிறது",
      needs_support: "💪 ஆதரவு தேவை",
    },
    te: {
      time_studied: "చదివిన సమయం",
      min_abbr: "నిమి",
      excellent: "⭐ అద్భుతం",
      improving: "📈 మెరుగుపడుతోంది",
      needs_support: "💪 సహాయం అవసరం",
    },
    kn: {
      time_studied: "ಅಧ್ಯಯನ ಮಾಡಿದ ಸಮಯ",
      min_abbr: "ನಿಮಿ",
      excellent: "⭐ ಅತ್ಯುತ್ತม",
      improving: "📈 ಸುಧಾರಿಸುತ್ತಿದೆ",
      needs_support: "💪 ಬೆಂಬಲದ ಅಗತ್ಯವಿದೆ",
    },
    ml: {
      time_studied: "പഠിച്ച സമയം",
      min_abbr: "മിനി",
      excellent: "⭐ മികച്ചത്",
      improving: "📈 മെച്ചപ്പെടുന്നു",
      needs_support: "💪 പിന്തുണ ആവശ്യമാണ്",
    },
    mr: {
      time_studied: "अभ्यास वेळ",
      min_abbr: "मि.",
      excellent: "⭐ उत्कृष्ट",
      improving: "📈 सुधारत आहे",
      needs_support: "💪 मदतीची गरज",
    },
    bn: {
      time_studied: "অধ্যয়নের সময়",
      min_abbr: "মি.",
      excellent: "⭐ চমৎকার",
      improving: "📈 উন্নতি হচ্ছে",
      needs_support: "💪 सहायता প্রয়োজন",
    },
    gu: {
      time_studied: "અભ્યાસનો સમય",
      min_abbr: "મિનિટ",
      excellent: "⭐ ઉત્કૃષ્ટ",
      improving: "📈 સુધારો થઈ રહ્યો છે",
      needs_support: "💪 સહાયની જરૂર છે",
    },
    pa: {
      time_studied: "ਪੜ੍ਹਾਈ ਦਾ ਸਮਾਂ",
      min_abbr: "ਮਿੰਟ",
      excellent: "⭐ ਬਹੁਤ ਵਧੀਆ",
      improving: "📈 ਸੁਧਾਰ ਹੋ ਰਿਹਾ ਹੈ",
      needs_support: "💪 ਮਦਦ ਦੀ ਲੋੜ",
    },
    or: {
      time_studied: "ପଢିବା ସମୟ",
      min_abbr: "ମି.",
      excellent: "⭐ ଚମତ୍କାର",
      improving: "📈 ଉନ୍ନତି ହେଉଛି",
      needs_support: "💪 ସାହାଯ୍ୟ ଆବଶ୍ୟକ",
    },
    ur: {
      time_studied: "مطالعہ کا وقت",
      min_abbr: "منٹ",
      excellent: "⭐ بہترین",
      improving: "📈 بہتری آ رہی ہے",
      needs_support: "💪 مدد کی ضرورت",
    },
    as: {
      time_studied: "অধ্যয়ন কৰা সময়",
      min_abbr: "মি.",
      excellent: "⭐ উৎকৃষ্ট",
      improving: "📈 উন্নতি হৈছে",
      needs_support: "💪 সহায়ৰ প্ৰয়োজন",
    }
  }

  const getTrans = (key) => {
    return LOCAL_TRANS[language]?.[key] || LOCAL_TRANS['en']?.[key] || key
  }

  const [childrenData, setChildrenData] = useState([])
  const [selected, setSelected] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false)
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false)
  const [goals, setGoals] = useState([])

  const refreshChildren = () => {
    setLoading(true)
    getChildrenProgress().then(data => {
      setChildrenData(data || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  const refreshGoals = () => {
    getParentGoals().then(data => {
      setGoals(data || [])
    }).catch(e => console.error("Error fetching goals:", e))
  }

  useEffect(() => {
    refreshChildren()
    refreshGoals()
  }, [])

  const child = childrenData[selected]
  const progress = child?.progress || []

  const stats = {
    pages: progress.length,
    avgScore: progress.length
      ? Math.round(progress.reduce((a, b) => a + (b.quizScore || 0), 0) / progress.length)
      : 0,
    totalTime: progress.reduce((a, b) => a + (b.timeSpent || 0), 0),
    completed: progress.filter(p => p.status === 'completed').length,
  }

  const firstName = user.name?.split(' ')[0] || t(language, 'role_parent')
  const hour = new Date().getHours()
  const greetKey = hour < 12 ? 'good_morning' : hour < 17 ? 'good_afternoon' : 'good_evening'

  return (
    <div className="mesh-grid" style={{ display: 'flex', minHeight: '100dvh', color: '#f8f7ff', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <BgOrbs />
      <Navbar activeTab="dashboard" onTabChange={() => {}} />

      <main className="main-content" style={{ flex: 1, padding: '36px 40px 120px', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 36, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 10, color: '#9ea4d4', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6, fontWeight: 700 }}>
              {t(language, greetKey)} 👋
            </div>
            <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 32, letterSpacing: '-0.8px', marginBottom: 10 }}>
              {t(language, 'role_parent')}{' '}
              <span style={{ background: 'linear-gradient(90deg,#c4b5fd,#818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Dashboard
              </span>
            </h1>
            <p style={{ fontSize: 13, color: '#9ea4d4', fontWeight: 500 }}>
              {t(language, 'role_parent_f1')} — {t(language, 'role_parent_f2')}
            </p>
          </div>
        </motion.div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
            {[1, 2, 3, 4].map(i => (
              <motion.div
                key={i}
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, height: 90 }}
              />
            ))}
          </div>
        ) : childrenData.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 24, padding: '64px 48px', textAlign: 'center',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18,
            }}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ width: 70, height: 70, borderRadius: '50%', background: 'rgba(196,181,253,0.08)', border: '1px solid rgba(196,181,253,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Users size={30} color="#c4b5fd" />
            </motion.div>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 20, color: '#f0eeff' }}>
              {t(language, 'role_parent_f4')}
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', maxWidth: 340, lineHeight: 1.7, marginBottom: 16 }}>
              Ask your child to register with your email as their Parent Email, or link their account directly here.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsLinkModalOpen(true)}
              style={{
                padding: '12px 24px', borderRadius: 14,
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                border: 'none', color: '#fff', fontSize: 13, fontWeight: 700,
                cursor: 'pointer', fontFamily: "'Outfit',sans-serif",
                boxShadow: '0 4px 20px rgba(99,102,241,0.3)',
                display: 'flex', alignItems: 'center', gap: 8
              }}
            >
              <Users size={16} /> Link Student Account
            </motion.button>
          </motion.div>
        ) : (
          <>
            {/* Child selector */}
            {childrenData.length > 1 && (
              <div style={{ display: 'flex', gap: 10, marginBottom: 24, overflowX: 'auto' }}>
                {childrenData.map((c, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setSelected(i)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '10px 18px', borderRadius: 14, border: 'none',
                      background: selected === i ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'rgba(255,255,255,0.06)',
                      color: selected === i ? '#fff' : 'rgba(255,255,255,0.5)',
                      cursor: 'pointer', fontWeight: 700, fontSize: 13,
                      fontFamily: "'Outfit',sans-serif", whiteSpace: 'nowrap',
                      boxShadow: selected === i ? '0 4px 20px rgba(99,102,241,0.35)' : 'none',
                    }}
                  >
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800 }}>
                      {c.child.name?.[0]}
                    </div>
                    {c.child.name}
                  </motion.button>
                ))}
              </div>
            )}

            {/* Child header card */}
            {child && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(196,181,253,0.12)',
                  borderRadius: 20, padding: '20px 24px',
                  display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24,
                }}
              >
                <div style={{ width: 54, height: 54, borderRadius: 16, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 22, color: '#fff', flexShrink: 0 }}>
                  {child.child.name?.[0]}
                </div>
                <div>
                  <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 18, marginBottom: 4 }}>{child.child.name}</h2>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{t(language, 'class_label')} {child.child.class || '?'} · CBSE</p>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '5px 14px', borderRadius: 100,
                    background: stats.avgScore >= 70 ? 'rgba(16,185,129,0.1)' : stats.avgScore >= 40 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                    border: `1px solid ${stats.avgScore >= 70 ? 'rgba(16,185,129,0.3)' : stats.avgScore >= 40 ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.3)'}`,
                    color: stats.avgScore >= 70 ? '#34d399' : stats.avgScore >= 40 ? '#fcd34d' : '#f87171',
                    fontSize: 12, fontWeight: 700,
                  }}>
                    {stats.avgScore >= 70 ? getTrans('excellent') : stats.avgScore >= 40 ? getTrans('improving') : getTrans('needs_support')}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 28 }}>
              <StatCard icon={BookOpen} label={t(language, 'role_parent_f3')} value={stats.pages} color="#818cf8" delay={0.05} />
              <StatCard icon={Trophy} label={t(language, 'dash_metric_quiz')} value={`${stats.avgScore}%`} color="#fcd34d" delay={0.10} />
              <StatCard icon={Clock} label={getTrans('time_studied')} value={`${Math.round(stats.totalTime / 60)}${getTrans('min_abbr')}`} color="#67e8f9" delay={0.15} />
              <StatCard icon={TrendingUp} label={t(language, 'role_parent_f2')} value={stats.completed} color="#6ee7b7" delay={0.20} />
            </div>


            {/* Activity list */}
            {progress.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, overflow: 'hidden' }}
              >
                <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Zap size={14} color="#818cf8" />
                  <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 13, color: '#a5b4fc' }}>Recent Activity</h3>
                </div>
                <div>
                  {progress.slice(0, 8).map((p, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 * i }}
                      style={{
                        padding: '14px 24px',
                        borderBottom: i < Math.min(progress.length, 8) - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                        display: 'flex', alignItems: 'center', gap: 16,
                      }}
                    >
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.status === 'completed' ? '#34d399' : '#fcd34d', flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.topic || 'Study Session'} <span style={{ opacity: 0.5, fontSize: 11 }}>({p.subject || 'general'})</span>
                        </p>
                        <ProgressBar
                          value={p.quizScore || 0}
                          color={p.quizScore >= 70 ? '#34d399' : p.quizScore >= 40 ? '#fcd34d' : '#f87171'}
                        />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', flexShrink: 0 }}>
                        {Math.round(p.quizScore || 0)}%
                      </span>
                      <span style={{
                        fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 100, flexShrink: 0,
                        background: p.status === 'completed' ? 'rgba(52,211,153,0.1)' : 'rgba(252,211,77,0.08)',
                        border: `1px solid ${p.status === 'completed' ? 'rgba(52,211,153,0.25)' : 'rgba(252,211,77,0.2)'}`,
                        color: p.status === 'completed' ? '#34d399' : '#fcd34d',
                      }}>
                        {p.status === 'completed' ? '✓ Done' : '⏳'}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}
      </main>

      <AnimatePresence>
        {isLinkModalOpen && (
          <LinkStudentModal
            isOpen={isLinkModalOpen}
            onClose={() => setIsLinkModalOpen(false)}
            onSuccess={refreshChildren}
            language={language}
          />
        )}
        {isGoalModalOpen && (
          <SetGoalModal
            isOpen={isGoalModalOpen}
            onClose={() => setIsGoalModalOpen(false)}
            onSuccess={refreshGoals}
            childrenList={childrenData}
          />
        )}
      </AnimatePresence>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@700;800;900&family=Plus Jakarta Sans:wght@400;500;600&display=swap');
        @media(min-width: 769px) and (max-width: 1024px) {
          main { margin-left: 240px !important; padding: 24px 20px 120px !important; }
        }
        @media(max-width:768px){
          .bottom-nav{ display:flex !important; }
          main { margin-left: 0 !important; padding: 20px 16px 120px !important; }
        }
      `}</style>
    </div>
  )
}
