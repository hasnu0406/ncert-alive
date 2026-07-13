import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import {
  Mail, Lock, User, BookOpen, Users,
  Eye, EyeOff, ArrowRight, Star, Award, TrendingUp
} from 'lucide-react'
import { login, register } from '../lib/api'
import { useLanguage } from '../lib/LanguageContext'
import { t } from '../lib/i18n'
import LanguageDropdown from '../components/LanguageDropdown'
import Logo from '../components/Logo'
import FloatingEduIcons from '../components/FloatingEduIcons'

const ROLE_DEFS = [
  { id: 'student', icon: BookOpen, labelKey: 'role_student', descKey: 'role_student_f1', color: '#818cf8' },
  { id: 'parent',  icon: Users,   labelKey: 'role_parent',  descKey: 'role_parent_f1', color: '#c4b5fd' },
]
const CLASSES = [6,7,8,9,10,11,12]

/* ── Animated background orbs ── */
function OrbLayer() {
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {[
        { color: 'rgba(99,102,241,0.25)', size: 700, top: '-20%', left: '-15%', dur: 18, delay: 0 },
        { color: 'rgba(139,92,246,0.18)', size: 600, top: '40%', right: '-15%', dur: 22, delay: 4 },
        { color: 'rgba(6,182,212,0.12)',  size: 450, bottom: '-10%', left: '25%', dur: 14, delay: 8 },
      ].map((o, i) => (
        <motion.div key={i}
          animate={{ scale: [1, 1.2, 0.93, 1.1, 1], x: [0,35,-25,18,0], y: [0,-28,22,-12,0] }}
          transition={{ duration: o.dur, repeat: Infinity, ease: 'easeInOut', delay: o.delay }}
          style={{
            position: 'absolute', width: o.size, height: o.size, borderRadius: '50%',
            background: `radial-gradient(circle, ${o.color}, transparent 70%)`,
            filter: 'blur(40px)', top: o.top, left: o.left, right: o.right, bottom: o.bottom,
          }}
        />
      ))}
      {/* Grid overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />
    </div>
  )
}

/* ── Floating card on the left panel ── */
function PreviewCard({ icon: Icon, title, value, color, delay, x, y }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
      transition={{
        opacity: { delay, duration: 0.5 },
        scale:   { delay, duration: 0.5 },
        y: { delay: delay + 0.5, duration: 3.5 + delay, repeat: Infinity, ease: 'easeInOut' },
      }}
      style={{
        position: 'absolute', left: x, top: y,
        background: 'rgba(13,11,30,0.82)',
        border: `1px solid ${color}30`,
        backdropFilter: 'blur(16px)',
        borderRadius: 16, padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: 12,
        boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${color}15`,
        minWidth: 175, zIndex: 3,
      }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}18`, border: `1px solid ${color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
        <Icon size={16} />
      </div>
      <div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 2 }}>{title}</div>
        <div style={{ fontSize: 15, fontWeight: 800, color, fontFamily: "'Outfit',sans-serif" }}>{value}</div>
      </div>
    </motion.div>
  )
}

/* ── Input field ── */
function InputField({ label, icon: Icon, type = 'text', placeholder, value, onChange, rightEl, required }) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.45)', marginBottom: 8, letterSpacing: '0.03em' }}>
        {label}
      </label>
      <motion.div
        animate={{ borderColor: focused ? 'rgba(99,102,241,0.7)' : 'rgba(255,255,255,0.1)' }}
        style={{
          position: 'relative', display: 'flex', alignItems: 'center',
          background: focused ? 'rgba(99,102,241,0.06)' : 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 14, overflow: 'hidden', transition: 'background 0.3s',
        }}>
        {/* Focus glow */}
        <AnimatePresence>
          {focused && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'absolute', inset: 0, boxShadow: '0 0 0 2px rgba(99,102,241,0.3)', borderRadius: 14, pointerEvents: 'none' }} />
          )}
        </AnimatePresence>
        <div style={{ paddingLeft: 14, color: focused ? '#818cf8' : 'rgba(255,255,255,0.25)', transition: 'color 0.3s', flexShrink: 0 }}>
          <Icon size={15} />
        </div>
        <input
          type={type} placeholder={placeholder} value={value} onChange={onChange}
          required={required}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            color: '#f0eeff', fontSize: 14, padding: '13px 14px',
            fontFamily: "'Plus Jakarta Sans',sans-serif",
          }}
        />
        {rightEl}
      </motion.div>
    </div>
  )
}

/* ════════════════════════════════════════════
   MAIN LOGIN COMPONENT
   ════════════════════════════════════════════ */
export default function Login() {
  const navigate = useNavigate()
  const { language } = useLanguage()
  const [mode, setMode] = useState('login')
  const [role, setRole] = useState('student')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [classLevel, setClassLevel] = useState(10)
  const [parentEmail, setParentEmail] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [demoRole, setDemoRole] = useState(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      let res
      if (mode === 'login') {
        res = await login(email, password)
      } else {
        res = await register({
          name, email, password, role,
          class_level: role === 'student' ? classLevel : undefined,
          linked_parent_email: role === 'student' && parentEmail ? parentEmail : undefined,
        })
      }
      if (res.access_token) {
        localStorage.setItem('ncert_token', res.access_token)
        localStorage.setItem('ncert_user', JSON.stringify(res.user))
        navigate(res.user.role === 'parent' ? '/parent' : '/student')
      } else {
        setError(res.detail || 'Something went wrong')
      }
    } catch (err) { setError(err.message || 'Failed — please try again') }
    setLoading(false)
  }

  const demoLogin = async (dRole) => {
    setDemoRole(dRole); setError('')
    try {
      const demoEmail = `demo_${dRole}@ncertalive.app`, demoPass = 'Demo@123'
      try { await register({ name: `Demo ${dRole}`, email: demoEmail, password: demoPass, role: dRole, class_level: 10 }) } catch {}
      const res = await login(demoEmail, demoPass)
      if (res.access_token) {
        localStorage.setItem('ncert_token', res.access_token)
        localStorage.setItem('ncert_user', JSON.stringify(res.user))
        navigate(dRole === 'parent' ? '/parent' : '/student')
      } else { setError(res.detail || 'Demo login failed') }
    } catch (err) { setError(err.message) }
    setDemoRole(null)
  }

  return (
    <div className="login-container" style={{
      minHeight: '100vh', background: '#09081A', display: 'flex',
      fontFamily: "'Plus Jakarta Sans',sans-serif", color: '#f0eeff', overflow: 'hidden',
      position: 'relative',
    }}>
      <OrbLayer />
      <FloatingEduIcons />

      {/* Language dropdown in absolute position (top right) */}
      <div style={{ position: 'absolute', top: 24, right: 24, zIndex: 100 }}>
        <LanguageDropdown compact />
      </div>

      {/* ── LEFT PANEL — visual/brand ── */}
      <div className="login-left" style={{
        flex: '0 0 46%', position: 'relative', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '60px 48px',
        borderRight: '1px solid rgba(255,255,255,0.05)', zIndex: 1,
        background: 'rgba(255,255,255,0.01)',
      }}>
        {/* Brand */}
        <motion.div initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22,1,0.36,1] }}
          style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{ display: 'inline-block', marginBottom: 20 }}>
            <Logo size="lg" />
          </div>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.38)', maxWidth: 280, lineHeight: 1.6, margin: '0 auto' }}>
            {t(language, 'tagline')}
          </p>
        </motion.div>

        {/* Floating stat cards (localized and non-boastful) */}
        <div style={{ position: 'relative', width: 340, height: 300 }}>
          <PreviewCard icon={BookOpen} title={t(language, 'preview_stat_1_title')} value={t(language, 'preview_stat_1_val')} color="#818cf8" delay={0.4} x="0%" y="0%" />
          <PreviewCard icon={Award} title={t(language, 'preview_stat_2_title')} value={t(language, 'preview_stat_2_val')} color="#67e8f9" delay={0.7} x="25%" y="42%" />
          <PreviewCard icon={TrendingUp} title={t(language, 'preview_stat_3_title')} value={t(language, 'preview_stat_3_val')} color="#6ee7b7" delay={1.0} x="5%" y="75%" />
        </div>

        {/* Stars */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginTop: 40 }}>
          <div style={{ display: 'flex', gap: 3 }}>
            {[0,1,2,3,4].map(i => (
              <motion.div key={i} animate={{ scale: [1,1.3,1] }} transition={{ delay: 1.5 + i*0.12, duration: 0.4, repeat: Infinity, repeatDelay: 4 }}>
                <Star size={14} fill="#f59e0b" color="#f59e0b" />
              </motion.div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>{t(language, 'login_footer_note')}</p>
        </motion.div>
      </div>

      {/* ── RIGHT PANEL — form ── */}
      <div className="login-right" style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '60px 48px', position: 'relative', zIndex: 1,
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          {/* Mode toggle */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22,1,0.36,1] }}>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 26, letterSpacing: '-0.5px', marginBottom: 6 }}>
              {mode === 'login' ? t(language, 'welcome_back') : t(language, 'create_account')}
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', marginBottom: 32 }}>
              {mode === 'login'
                ? t(language, 'sign_in_continue')
                : t(language, 'join_thousands')}
            </p>

            {/* Toggle pill */}
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 4, marginBottom: 28, border: '1px solid rgba(255,255,255,0.07)' }}>
              {['login', 'register'].map(m => (
                <motion.button key={m}
                  onClick={() => { setMode(m); setError('') }}
                  style={{
                    flex: 1, padding: '10px 0', borderRadius: 11, border: 'none', cursor: 'pointer',
                    fontSize: 13, fontWeight: 700, fontFamily: "'Outfit',sans-serif",
                    background: mode === m ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'transparent',
                    color: mode === m ? '#fff' : 'rgba(255,255,255,0.35)',
                    boxShadow: mode === m ? '0 4px 16px rgba(99,102,241,0.4)' : 'none',
                    transition: 'all 0.3s',
                  }}>
                  {m === 'login' ? t(language, 'sign_in') : t(language, 'register')}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.form onSubmit={handleSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Role picker (register) */}
            <AnimatePresence>
              {mode === 'register' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.45)', marginBottom: 10, letterSpacing: '0.03em' }}>{t(language, 'i_am_a')}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                    {ROLE_DEFS.map(r => {
                      const Icon = r.icon
                      const active = role === r.id
                      return (
                        <motion.button key={r.id} type="button" whileTap={{ scale: 0.95 }}
                          onClick={() => setRole(r.id)}
                          style={{
                            padding: '12px 8px', borderRadius: 14, border: `1px solid ${active ? r.color + '50' : 'rgba(255,255,255,0.08)'}`,
                            background: active ? `${r.color}16` : 'rgba(255,255,255,0.03)',
                            cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                            transition: 'all 0.25s', boxShadow: active ? `0 4px 20px ${r.color}22` : 'none',
                          }}>
                          <Icon size={18} color={active ? r.color : 'rgba(255,255,255,0.3)'} />
                          <span style={{ fontSize: 12, fontWeight: 700, color: active ? '#fff' : 'rgba(255,255,255,0.4)', fontFamily: "'Outfit',sans-serif" }}>{t(language, r.labelKey)}</span>
                          <span style={{ fontSize: 10, color: active ? r.color : 'rgba(255,255,255,0.22)' }}>{t(language, r.descKey)}</span>
                        </motion.button>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Name (register) */}
            <AnimatePresence>
              {mode === 'register' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <InputField label={t(language, 'full_name')} icon={User} placeholder={t(language, 'full_name')} value={name} onChange={e => setName(e.target.value)} required />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <InputField label="Email" icon={Mail} type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required />

            {/* Password */}
            <InputField
              label={t(language, 'password')} icon={Lock} type={showPwd ? 'text' : 'password'}
              placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required
              rightEl={
                <button type="button" onClick={() => setShowPwd(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 14px', color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center' }}>
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              }
            />

            {/* Class level (student register) */}
            <AnimatePresence>
              {mode === 'register' && role === 'student' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.45)', marginBottom: 10, letterSpacing: '0.03em' }}>{t(language, 'your_class')}</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {CLASSES.map(c => (
                      <motion.button key={c} type="button" whileTap={{ scale: 0.92 }} onClick={() => setClassLevel(c)}
                        style={{
                          width: 44, height: 36, borderRadius: 10, border: `1px solid ${classLevel === c ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.08)'}`,
                          background: classLevel === c ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
                          color: classLevel === c ? '#a5b4fc' : 'rgba(255,255,255,0.38)',
                          fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                        }}>
                        {c}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Parent email (student register) */}
            <AnimatePresence>
              {mode === 'register' && role === 'student' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <InputField label="Parent's Email Address" icon={Mail} type="email" placeholder="parent@email.com" value={parentEmail} onChange={e => setParentEmail(e.target.value)} required />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  style={{ padding: '10px 14px', borderRadius: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', fontSize: 13, color: '#fca5a5', textAlign: 'center' }}>
                  ⚠️ {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              type="submit" disabled={loading}
              whileHover={!loading ? { scale: 1.02, boxShadow: '0 14px 48px rgba(99,102,241,0.55)' } : {}}
              whileTap={{ scale: 0.97 }}
              style={{
                width: '100%', padding: '15px 0', borderRadius: 14, border: 'none',
                background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                color: '#fff', fontWeight: 700, fontSize: 15, cursor: loading ? 'default' : 'pointer',
                fontFamily: "'Outfit',sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: '0 8px 32px rgba(99,102,241,0.35)', marginTop: 4,
              }}>
              {loading
                ? <><motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ display: 'inline-block', fontSize: 18 }}>⟳</motion.span> {t(language, 'please_wait')}</>
                : <>{mode === 'login' ? t(language, 'sign_in') : t(language, 'create_account')} <ArrowRight size={16} /></>}
            </motion.button>
          </motion.form>

          {/* Demo logins */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            style={{ marginTop: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', fontWeight: 500, whiteSpace: 'nowrap' }}>{t(language, 'or_try_demo')}</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {ROLE_DEFS.map(r => (
                <motion.button key={r.id}
                  whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}
                  onClick={() => demoLogin(r.id)} disabled={demoRole !== null}
                  style={{
                    padding: '11px 0', borderRadius: 12,
                    background: `${r.color}10`, border: `1px solid ${r.color}28`,
                    color: r.color, fontWeight: 700, fontSize: 12, cursor: 'pointer',
                    fontFamily: "'Outfit',sans-serif",
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => { if (e?.currentTarget?.style) e.currentTarget.style.background = `${r.color}22` }}
                  onMouseLeave={e => { if (e?.currentTarget?.style) e.currentTarget.style.background = `${r.color}10` }}
                >
                  {demoRole === r.id
                    ? <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}>⟳</motion.span>
                    : <r.icon size={13} />}
                  {demoRole === r.id ? t(language, 'please_wait') : t(language, r.labelKey)}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.18)', marginTop: 28 }}>
            {t(language, 'login_footer_note')}
          </p>
        </div>
      </div>

       <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@700;800;900&family=Plus Jakarta Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        input::placeholder { color: rgba(255,255,255,0.2); }
        input:-webkit-autofill { -webkit-box-shadow: 0 0 0 100px #09081A inset !important; -webkit-text-fill-color: #f0eeff !important; }
        @media (max-width: 868px) {
          .login-container {
            flex-direction: column !important;
            overflow-y: auto !important;
          }
          .login-left {
            display: none !important;
          }
          .login-right {
            padding: 48px 24px !important;
            align-items: center !important;
          }
        }
      `}</style>
    </div>
  )
}
