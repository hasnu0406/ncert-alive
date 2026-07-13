import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence, useInView } from 'framer-motion'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useLanguage } from '../lib/LanguageContext'
import { t } from '../lib/i18n'
import LanguageDropdown from '../components/LanguageDropdown'
import Logo from '../components/Logo'
import { ArrowRight, Sparkles, BookOpen, MessageSquare, Award, TrendingUp } from 'lucide-react'
import { register, login } from '../lib/api'

function ParticleOrb({ scrollY }) {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const scrollRef = useRef(0)
  const animRef = useRef(null)

  useEffect(() => {
    return scrollY.on('change', v => {
      scrollRef.current = Math.min(v / (window.innerHeight * 0.45), 1)
    })
  }, [scrollY])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    const NUM = 1200
    const getRadius = () => Math.min(window.innerWidth, window.innerHeight) * 0.44
    const buildParticles = () => {
      const RADIUS = getRadius()
      return Array.from({ length: NUM }, (_, i) => {
        const phi = Math.acos(1 - 2 * (i + 0.5) / NUM)
        const theta = Math.PI * (1 + Math.sqrt(5)) * i
        const r = RADIUS * (0.50 + Math.random() * 0.70)
        const ox = r * Math.sin(phi) * Math.cos(theta)
        const oy = r * Math.sin(phi) * Math.sin(theta)
        const oz = r * Math.cos(phi)
        const escapeLen = Math.random() * 1.6 + 1.2
        const ex = ox / RADIUS * escapeLen
        const ey = oy / RADIUS * escapeLen
        return { ox, oy, oz, ex, ey, alpha: Math.random() * 0.75 + 0.2, size: Math.random() * 2.2 + 0.4, hue: 252 + Math.random() * 65, sat: 65 + Math.random() * 35, lum: 55 + Math.random() * 38, speed: Math.random() * 0.0005 + 0.0002, phase: Math.random() * Math.PI * 2 }
      })
    }
    let particles = buildParticles()
    let rotY = 0, rotX = 0, tick = 0
    const onMouse = (e) => { mouseRef.current = { x: (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2), y: (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2) } }
    window.addEventListener('mousemove', onMouse, { passive: true })
    const draw = () => {
      const W = canvas.width, H = canvas.height
      ctx.clearRect(0, 0, W, H)
      // Normalize time step to simulate 60fps clock independently of actual screen refresh rate (60Hz vs 120Hz/144Hz+)
      const tVal = performance.now() * 0.06
      const sc = Math.min(scrollRef.current, 1)
      const RADIUS = getRadius()
      const targetRotY = mouseRef.current.x * 0.45 * (1 - sc)
      const targetRotX = -mouseRef.current.y * 0.32 * (1 - sc)
      rotY += (targetRotY - rotY) * 0.025
      rotX += (targetRotX - rotX) * 0.025
      const totalRotY = rotY + tVal * 0.003
      const totalRotX = rotX
      const CX = W / 2, CY = H / 2
      const scatter = sc * (W * 1.8)
      const projected = particles.map(p => {
        const pulse = 1 + 0.04 * Math.sin(tVal * p.speed * 60 + p.phase)
        const cosY = Math.cos(totalRotY), sinY = Math.sin(totalRotY)
        const x1 = p.ox * cosY - p.oz * sinY
        const z1 = p.ox * sinY + p.oz * cosY
        const cosX = Math.cos(totalRotX), sinX = Math.sin(totalRotX)
        const y1 = p.oy * cosX - z1 * sinX
        const z2 = p.oy * sinX + z1 * cosX
        const px = CX + x1 * pulse + p.ex * scatter
        const py = CY + y1 * pulse + p.ey * scatter
        const depth = (z2 + RADIUS) / (2 * RADIUS)
        const alpha = p.alpha * (0.12 + depth * 0.88) * (1 - sc * 0.2)
        const sz = p.size * (0.4 + depth * 0.85) * (1 + sc * 1.4)
        return { px, py, z: z2, alpha, sz, hue: p.hue, sat: p.sat, lum: p.lum }
      })
      projected.sort((a, b) => a.z - b.z)
      if (sc < 0.55) {
        const conn = projected.filter((_, i) => i % 5 === 0)
        for (let i = 0; i < conn.length; i++) {
          for (let j = i + 1; j < conn.length; j++) {
            const dx = conn[i].px - conn[j].px
            const dy = conn[i].py - conn[j].py
            const d = Math.sqrt(dx * dx + dy * dy)
            if (d < 50) {
              ctx.beginPath()
              ctx.moveTo(conn[i].px, conn[i].py)
              ctx.lineTo(conn[j].px, conn[j].py)
              ctx.strokeStyle = `hsla(268,80%,68%,${(1 - d / 50) * 0.07 * (1 - sc)})`
              ctx.lineWidth = 0.6
              ctx.stroke()
            }
          }
        }
      }
      projected.forEach(({ px, py, alpha, sz, hue, sat, lum }) => {
        if (alpha < 0.01) return
        ctx.beginPath()
        ctx.arc(px, py, sz, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${hue},${sat}%,${lum}%,${alpha})`
        ctx.fill()
      })
      animRef.current = requestAnimationFrame(draw)
    }
    draw()
    const onResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; particles = buildParticles() }
    window.addEventListener('resize', onResize, { passive: true })
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('mousemove', onMouse); window.removeEventListener('resize', onResize) }
  }, [])

  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', display: 'block' }} />
}

const EDU_ICONS = [
  { id: 'atom', svg: <svg viewBox="0 0 40 40" fill="none"><ellipse cx="20" cy="20" rx="18" ry="7" stroke="currentColor" strokeWidth="1.5" opacity="0.7" /><ellipse cx="20" cy="20" rx="18" ry="7" stroke="currentColor" strokeWidth="1.5" opacity="0.7" transform="rotate(60 20 20)" /><ellipse cx="20" cy="20" rx="18" ry="7" stroke="currentColor" strokeWidth="1.5" opacity="0.7" transform="rotate(120 20 20)" /><circle cx="20" cy="20" r="2.5" fill="currentColor" /></svg> },
  { id: 'flask', svg: <svg viewBox="0 0 40 40" fill="none"><path d="M14 6h12M15 6v14l-7 14h24L25 20V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" /><circle cx="17" cy="28" r="1.5" fill="currentColor" opacity="0.5" /><circle cx="23" cy="25" r="1" fill="currentColor" opacity="0.5" /></svg> },
  { id: 'pi', svg: <svg viewBox="0 0 40 40" fill="none"><text x="6" y="30" fontSize="28" fontWeight="700" fill="currentColor" opacity="0.6" fontFamily="serif">π</text></svg> },
  { id: 'inf', svg: <svg viewBox="0 0 40 40" fill="none"><path d="M8 20c0-4 3-7 6-7s6 7 10 7 6-3 6-7-3-7-6-7-6 7-10 7-6 3-6 7z" stroke="currentColor" strokeWidth="1.8" fill="none" opacity="0.7" strokeLinecap="round" /></svg> },
  { id: 'grad', svg: <svg viewBox="0 0 40 40" fill="none"><path d="M20 10L4 18l16 8 16-8-16-8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" opacity="0.7" /><path d="M10 22v8c0 2 4.5 5 10 5s10-3 10-5v-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" /><line x1="36" y1="18" x2="36" y2="26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" /></svg> },
  { id: 'dna', svg: <svg viewBox="0 0 40 40" fill="none"><path d="M14 4c4 4 8 4 12 8s4 8 0 12-8 4-12 8-4 8 0 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" /><path d="M26 4c-4 4-8 4-12 8s-4 8 0 12 8 4 12 8 4 8 0 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" /><line x1="14" y1="16" x2="26" y2="16" stroke="currentColor" strokeWidth="1" opacity="0.4" /><line x1="14" y1="24" x2="26" y2="24" stroke="currentColor" strokeWidth="1" opacity="0.4" /></svg> },
  { id: 'pencil', svg: <svg viewBox="0 0 40 40" fill="none"><path d="M8 32l4-12L28 6l6 6L18 28 8 32z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" opacity="0.7" /><line x1="22" y1="10" x2="30" y2="18" stroke="currentColor" strokeWidth="1.5" opacity="0.5" /></svg> },
  { id: 'sigma', svg: <svg viewBox="0 0 40 40" fill="none"><text x="8" y="32" fontSize="28" fontWeight="700" fill="currentColor" opacity="0.6" fontFamily="serif">Σ</text></svg> },
  { id: 'book', svg: <svg viewBox="0 0 40 40" fill="none"><rect x="6" y="6" width="28" height="30" rx="3" stroke="currentColor" strokeWidth="1.5" opacity="0.6" /><line x1="20" y1="6" x2="20" y2="36" stroke="currentColor" strokeWidth="1.5" opacity="0.4" /><line x1="12" y1="14" x2="18" y2="14" stroke="currentColor" strokeWidth="1" opacity="0.4" /><line x1="12" y1="19" x2="18" y2="19" stroke="currentColor" strokeWidth="1" opacity="0.4" /><line x1="22" y1="14" x2="28" y2="14" stroke="currentColor" strokeWidth="1" opacity="0.4" /></svg> },
  { id: 'scope', svg: <svg viewBox="0 0 40 40" fill="none"><path d="M8 24L20 14l14 4-12 10-14-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" opacity="0.6" /><line x1="20" y1="24" x2="16" y2="34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" /><line x1="18" y1="30" x2="22" y2="30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" /></svg> },
  { id: 'calc', svg: <svg viewBox="0 0 40 40" fill="none"><rect x="8" y="4" width="24" height="32" rx="4" stroke="currentColor" strokeWidth="1.5" opacity="0.6" /><rect x="12" y="8" width="16" height="8" rx="2" stroke="currentColor" strokeWidth="1" opacity="0.4" /><circle cx="14" cy="22" r="2" fill="currentColor" opacity="0.4" /><circle cx="20" cy="22" r="2" fill="currentColor" opacity="0.4" /><circle cx="26" cy="22" r="2" fill="currentColor" opacity="0.4" /><circle cx="14" cy="30" r="2" fill="currentColor" opacity="0.4" /><circle cx="20" cy="30" r="2" fill="currentColor" opacity="0.4" /><circle cx="26" cy="30" r="2" fill="currentColor" opacity="0.4" /></svg> },
]

const ICON_PLACEMENTS = [
  { x: '5%', y: '8%', size: 44, color: '#818cf8', rot: -12, delay: 0 },
  { x: '88%', y: '5%', size: 36, color: '#c4b5fd', rot: 18, delay: 0.8 },
  { x: '92%', y: '28%', size: 40, color: '#67e8f9', rot: -8, delay: 1.4 },
  { x: '3%', y: '38%', size: 38, color: '#a5b4fc', rot: 22, delay: 2.1 },
  { x: '82%', y: '52%', size: 34, color: '#818cf8', rot: -16, delay: 0.5 },
  { x: '7%', y: '62%', size: 42, color: '#c4b5fd', rot: 10, delay: 1.8 },
  { x: '94%', y: '70%', size: 36, color: '#6ee7b7', rot: -20, delay: 2.6 },
  { x: '2%', y: '80%', size: 40, color: '#67e8f9', rot: 14, delay: 0.3 },
  { x: '87%', y: '85%', size: 38, color: '#a5b4fc', rot: -6, delay: 1.1 },
  { x: '45%', y: '3%', size: 34, color: '#818cf8', rot: 26, delay: 3.0 },
  { x: '55%', y: '94%', size: 40, color: '#c4b5fd', rot: -14, delay: 1.7 },
  { x: '18%', y: '92%', size: 36, color: '#6ee7b7', rot: 8, delay: 2.3 },
]

function FloatingEduIcons() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
      {ICON_PLACEMENTS.map((p, i) => {
        const icon = EDU_ICONS[i % EDU_ICONS.length]
        return (
          <motion.div key={icon.id + i}
            initial={{ opacity: 0, scale: 0.5, rotate: p.rot - 10 }}
            animate={{ opacity: [0, 0.18, 0.12, 0.18], scale: [0.85, 1, 0.9, 1], rotate: [p.rot, p.rot + 8, p.rot - 4, p.rot], y: [0, -14, 8, 0] }}
            transition={{ opacity: { duration: 0.8, delay: p.delay }, scale: { duration: 6 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: p.delay }, rotate: { duration: 8 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: p.delay }, y: { duration: 5 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: p.delay } }}
            style={{ position: 'absolute', left: p.x, top: p.y, width: p.size, height: p.size, color: p.color }}>
            {icon.svg}
          </motion.div>
        )
      })}
    </div>
  )
}

function AmbientNumbers({ opacity }) {
  const nums = [{ v: '23', x: '14%', y: '22%', d: 0 }, { v: '36', x: '78%', y: '15%', d: 0.4 }, { v: '84', x: '8%', y: '55%', d: 0.8 }, { v: '52', x: '72%', y: '72%', d: 1.2 }, { v: '76', x: '30%', y: '85%', d: 1.6 }, { v: '91', x: '88%', y: '44%', d: 0.6 }]
  return (
    <motion.div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1, opacity }}>
      {nums.map((n, i) => (
        <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: [0, 0.2, 0.12, 0.2] }} transition={{ duration: 4, delay: n.d, repeat: Infinity }}
          style={{ position: 'absolute', left: n.x, top: n.y, fontSize: 11, fontWeight: 500, color: 'rgba(165,180,252,0.4)', fontFamily: "'Plus Jakarta Sans',sans-serif", letterSpacing: '0.06em' }}>
          {n.v}
        </motion.div>
      ))}
    </motion.div>
  )
}

function ScanLine() {
  return (
    <motion.div animate={{ y: ['-5%', '105%'] }} transition={{ duration: 9, repeat: Infinity, ease: 'linear', repeatDelay: 5 }}
      style={{ position: 'fixed', left: 0, right: 0, height: 1, zIndex: 1, pointerEvents: 'none', top: 0, background: 'linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.3) 30%, rgba(139,92,246,0.5) 50%, rgba(99,102,241,0.3) 70%, transparent 100%)' }} />
  )
}

function ScrollReveal({ children, delay = 0, direction = 'up', distance = 60 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px 0px' })
  const getInitial = () => {
    if (direction === 'up') return { opacity: 0, y: distance, scale: 0.97 }
    if (direction === 'down') return { opacity: 0, y: -distance, scale: 0.97 }
    if (direction === 'left') return { opacity: 0, x: distance, scale: 0.97 }
    if (direction === 'right') return { opacity: 0, x: -distance, scale: 0.97 }
    return { opacity: 0, y: distance }
  }
  return (
    <motion.div ref={ref} initial={getInitial()} animate={isInView ? { opacity: 1, y: 0, x: 0, scale: 1 } : getInitial()} transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}

function TypeWriter({ lines, speed = 65 }) {
  const [lineIdx, setLineIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)
  useEffect(() => { if (lineIdx >= lines.length) { setLineIdx(0); setCharIdx(0); setDeleting(false) } }, [lines, lineIdx])
  useEffect(() => {
    const cur = lines[lineIdx]; if (!cur) return
    let timer
    if (!deleting && charIdx < cur.length) timer = setTimeout(() => setCharIdx(c => c + 1), speed)
    else if (!deleting && charIdx === cur.length) timer = setTimeout(() => setDeleting(true), 1800)
    else if (deleting && charIdx > 0) timer = setTimeout(() => setCharIdx(c => c - 1), speed / 2)
    else { setDeleting(false); setLineIdx(l => (l + 1) % lines.length) }
    return () => clearTimeout(timer)
  }, [charIdx, deleting, lineIdx, lines, speed])
  if (lineIdx >= lines.length || !lines[lineIdx]) return null
  return (
    <span>
      <span style={{ background: 'linear-gradient(90deg,#818cf8,#c4b5fd,#67e8f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
        {lines[lineIdx].slice(0, charIdx)}
      </span>
      <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.9, repeat: Infinity }}
        style={{ display: 'inline-block', width: 3, height: '1em', background: '#818cf8', marginLeft: 3, verticalAlign: 'middle', borderRadius: 2 }} />
    </span>
  )
}

function StaggerWords({ text, style, delay = 0 }) {
  return (
    <span style={{ display: 'inline', ...style }}>
      {text.split(' ').map((w, i) => (
        <motion.span key={i}
          initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, delay: delay + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'inline-block', marginRight: '0.28em' }}>
          {w}
        </motion.span>
      ))}
    </span>
  )
}

function TiltCard({ children, style }) {
  const ref = useRef(null)
  const rx = useMotionValue(0), ry = useMotionValue(0)
  const spX = useSpring(rx, { stiffness: 150, damping: 20 })
  const spY = useSpring(ry, { stiffness: 150, damping: 20 })
  const onMove = useCallback(e => {
    const el = ref.current; if (!el) return
    const { left, top, width, height } = el.getBoundingClientRect()
    rx.set(((e.clientY - top) / height - 0.5) * -12)
    ry.set(((e.clientX - left) / width - 0.5) * 12)
  }, [rx, ry])
  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={() => { rx.set(0); ry.set(0) }}
      style={{ ...style, rotateX: spX, rotateY: spY, transformStyle: 'preserve-3d', perspective: 1000 }}>
      {children}
    </motion.div>
  )
}

function FeatureCard({ icon: Icon, title, desc, color, index }) {
  return (
    <ScrollReveal delay={index * 0.12} direction="up" distance={50}>
      <TiltCard style={{ height: '100%' }}>
        <motion.div whileHover={{ y: -10, scale: 1.025 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          style={{ height: '100%', borderRadius: 20, padding: 28, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', position: 'relative', overflow: 'hidden', cursor: 'default' }}
          onHoverStart={e => { if (e?.currentTarget?.style) { e.currentTarget.style.borderColor = `${color}44`; e.currentTarget.style.boxShadow = `0 16px 48px ${color}18` } }}
          onHoverEnd={e => { if (e?.currentTarget?.style) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.boxShadow = 'none' } }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: 140, height: 140, background: `radial-gradient(circle at 100% 0%, ${color}1a 0%, transparent 70%)`, pointerEvents: 'none' }} />
          <motion.div animate={{ boxShadow: [`0 0 0px ${color}00`, `0 0 24px ${color}60`, `0 0 0px ${color}00`] }} transition={{ duration: 3, repeat: Infinity, delay: index * 0.6 }}
            style={{ width: 48, height: 48, borderRadius: 14, marginBottom: 22, background: `${color}14`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
            <Icon size={22} />
          </motion.div>
          <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 10, fontFamily: "'Outfit',sans-serif", color: '#f0eeff' }}>{title}</div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.38)', lineHeight: 1.75 }}>{desc}</div>
        </motion.div>
      </TiltCard>
    </ScrollReveal>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()
  const { language } = useLanguage()

  const [demoLoading, setDemoLoading] = useState(null)
  const { scrollY } = useScroll()
  const navBg = useTransform(scrollY, [0, 80], ['rgba(0,0,0,0)', 'rgba(9,8,26,0.97)'])
  const navBorder = useTransform(scrollY, [0, 80], ['rgba(255,255,255,0)', 'rgba(255,255,255,0.06)'])
  const ambientOpacity = useTransform(scrollY, [0, 200], [1, 0])

  const handleDemo = async (role) => {
    setDemoLoading(role)
    try {
      const email = `demo_${role}@ncertalive.app`, pass = 'Demo@123'
      try { await register({ name: `Demo ${role}`, email, password: pass, role, class_level: 10 }) } catch { }
      const res = await login(email, pass)
      if (res.access_token) {
        localStorage.setItem('ncert_token', res.access_token)
        localStorage.setItem('ncert_user', JSON.stringify(res.user))
        navigate(role === 'parent' ? '/parent' : '/student')
      }
    } catch { }
    setDemoLoading(null)
  }

  const roleCards = [
    { labelKey: 'role_label_student', color: '#818cf8', emoji: '📚', featuresKeys: ['role_student_f1', 'role_student_f2', 'role_student_f3', 'role_student_f4'], btnKey: 'role_btn_student', roleId: 'student' },
    { labelKey: 'role_label_parent', color: '#c4b5fd', emoji: '👨‍👩‍👧', featuresKeys: ['role_parent_f1', 'role_parent_f2', 'role_parent_f3', 'role_parent_f4'], btnKey: 'role_btn_parent', roleId: 'parent' },
  ]

  return (
    <div style={{ background: '#000005', minHeight: '100vh', color: '#f0eeff', fontFamily: "'Plus Jakarta Sans',sans-serif", overflowX: 'hidden' }}>

      <ParticleOrb scrollY={scrollY} />
      <FloatingEduIcons />
      <AmbientNumbers opacity={ambientOpacity} />
      <ScanLine />
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', backgroundImage: `radial-gradient(rgba(99,102,241,0.055) 1px, transparent 1px)`, backgroundSize: '42px 42px' }} />

      {/* ── NAVBAR ── */}
      <motion.nav className="landing-nav" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', backdropFilter: 'blur(24px)', borderBottom: '1px solid', borderBottomColor: navBorder, background: navBg }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <Logo size="sm" />
        </motion.div>
        <motion.div className="landing-nav-links" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ display: 'flex', gap: 36, fontSize: 13, fontWeight: 500 }}>
          {[{ label: t(language, 'nav_features'), href: '#features' }, { label: t(language, 'nav_forschools'), href: '#forschools' }, { label: t(language, 'nav_demo'), href: '#demo' }].map(item => (
            <motion.a key={item.href} href={item.href} whileHover={{ color: '#fff', y: -1 }} style={{ color: 'rgba(255,255,255,0.38)', textDecoration: 'none', transition: 'color 0.2s' }}>
              {item.label}
            </motion.a>
          ))}
        </motion.div>
        <motion.div className="landing-nav-right" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.15 }} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <LanguageDropdown compact />
          <motion.button whileHover={{ scale: 1.04, boxShadow: '0 8px 32px rgba(99,102,241,0.5)' }} whileTap={{ scale: 0.96 }} onClick={() => navigate('/login')}
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', color: '#fff', fontWeight: 700, fontSize: 13, padding: '9px 20px', borderRadius: 100, cursor: 'pointer', fontFamily: "'Outfit',sans-serif" }}>
            {t(language, 'sign_in')}
          </motion.button>
        </motion.div>
      </motion.nav>

      {/* ── HERO ── */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 2, padding: '120px 48px 80px', textAlign: 'center' }}>

        {/* Badge */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }} style={{ marginBottom: 24 }}>
          <motion.div
            animate={{ boxShadow: ['0 0 0px rgba(99,102,241,0)', '0 0 32px rgba(99,102,241,0.45)', '0 0 0px rgba(99,102,241,0)'] }}
            transition={{ duration: 2.8, repeat: Infinity, delay: 1 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 18px', borderRadius: 100, border: '1px solid rgba(99,102,241,0.35)', background: 'rgba(99,102,241,0.08)', fontSize: 13, fontWeight: 600, color: '#a5b4fc' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}><Sparkles size={13} /></motion.div>
            {t(language, 'hero_badge_text')}
          </motion.div>
        </motion.div>

        <h1 style={{
          fontFamily: "'Outfit',sans-serif",
          fontWeight: 900,
          fontSize: 'clamp(28px, 5.2vw, 68px)',
          lineHeight: 1.15,
          letterSpacing: '-1px',
          marginBottom: 28,
          color: '#fff',
          maxWidth: 960,
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
        }}>
          <StaggerWords text={t(language, 'hero1')} delay={0.3} style={{ display: 'block', color: '#fff' }} />
          <div style={{ display: 'block', marginTop: 10 }}>
            <TypeWriter lines={[t(language, 'tw_smarter_way'), t(language, 'tw_ai_tutor'), t(language, 'tw_multilingual'), t(language, 'tw_score_higher')]} />
          </div>
        </h1>

        {/* Sub */}
        <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.8 }}
          style={{ maxWidth: 500, fontSize: 18, lineHeight: 1.78, color: 'rgba(255,255,255,0.38)', marginBottom: 52 }}>
          {t(language, 'hero_sub')}
        </motion.p>

        {/* CTAs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.95 }}
          style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 80 }}>
          <motion.button whileHover={{ scale: 1.06, boxShadow: '0 16px 52px rgba(99,102,241,0.65)' }} whileTap={{ scale: 0.96 }} onClick={() => navigate('/login')}
            style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', color: '#fff', fontWeight: 700, fontSize: 16, padding: '16px 34px', borderRadius: 100, cursor: 'pointer', fontFamily: "'Outfit',sans-serif", boxShadow: '0 8px 36px rgba(99,102,241,0.4)' }}>
            {t(language, 'start_free')}
            <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.4, repeat: Infinity }}><ArrowRight size={18} /></motion.span>
          </motion.button>
          <motion.button whileHover={{ scale: 1.04, background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.3)' }} whileTap={{ scale: 0.96 }} onClick={() => handleDemo('student')}
            style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.75)', fontWeight: 600, fontSize: 16, padding: '16px 30px', borderRadius: 100, cursor: 'pointer' }}>
            {demoLoading === 'student' ? <><motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>⟳</motion.span> Loading…</> : `▶  ${t(language, 'live_demo')}`}
          </motion.button>
        </motion.div>

        {/* Scroll cue */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }} style={{ position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)' }}>
          <motion.div animate={{ y: [0, 10, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.8, repeat: Infinity }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 1, height: 38, background: 'linear-gradient(to bottom, transparent, rgba(99,102,241,0.7), transparent)' }} />
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>scroll</div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ position: 'relative', zIndex: 2, maxWidth: 1100, margin: '0 auto', padding: '40px 48px 120px' }}>
        <ScrollReveal>
          <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.4), rgba(139,92,246,0.4), transparent)', marginBottom: 90 }} />
        </ScrollReveal>
        <ScrollReveal direction="up">
          <div style={{ textAlign: 'center', marginBottom: 70 }}>
            <motion.div animate={{ background: ['rgba(139,92,246,0.08)', 'rgba(99,102,241,0.14)', 'rgba(139,92,246,0.08)'] }} transition={{ duration: 4, repeat: Infinity }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 18px', borderRadius: 100, border: '1px solid rgba(139,92,246,0.3)', fontSize: 13, fontWeight: 600, color: '#c4b5fd', marginBottom: 22 }}>
              <Sparkles size={13} /> {t(language, 'features_badge')}
            </motion.div>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 'clamp(28px, 4.5vw, 56px)', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 16 }}>
              {t(language, 'features_title_1')}<br />
              <span style={{ color: 'rgba(255,255,255,0.25)' }}>{t(language, 'features_title_2')}</span>
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.32)', maxWidth: 420, margin: '0 auto' }}>{t(language, 'features_sub')}</p>
          </div>
        </ScrollReveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 22 }}>
          <FeatureCard index={0} icon={BookOpen} color="#818cf8" title={t(language, 'feat_simplifier_title')} desc={t(language, 'feat_simplifier_desc')} />
          <FeatureCard index={1} icon={MessageSquare} color="#c4b5fd" title={t(language, 'feat_doubt_title')} desc={t(language, 'feat_doubt_desc')} />
          <FeatureCard index={2} icon={Award} color="#67e8f9" title={t(language, 'feat_quiz_title')} desc={t(language, 'feat_quiz_desc')} />
          <FeatureCard index={3} icon={TrendingUp} color="#6ee7b7" title={t(language, 'feat_progress_title')} desc={t(language, 'feat_progress_desc')} />
        </div>
      </section>

      {/* ── ROLES ── */}
      <section id="forschools" style={{ position: 'relative', zIndex: 2, maxWidth: 1100, margin: '0 auto', padding: '0 48px 100px' }}>
        <ScrollReveal direction="up">
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 'clamp(28px, 4.5vw, 54px)', letterSpacing: '-1.5px', marginBottom: 14 }}>
              {t(language, 'roles_title')}
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.32)', maxWidth: 400, margin: '0 auto' }}>{t(language, 'roles_sub')}</p>
          </div>
        </ScrollReveal>
        <div className="landing-roles-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 28, maxWidth: 780, margin: '0 auto' }}>
          {roleCards.map((p, i) => (
            <ScrollReveal key={i} delay={i * 0.18} direction={i === 0 ? 'left' : 'right'} distance={60}>
              <TiltCard style={{ height: '100%' }}>
                <motion.div whileHover={{ y: -8, scale: 1.015 }} transition={{ type: 'spring', stiffness: 280, damping: 18 }}
                  style={{ height: '100%', borderRadius: 22, padding: 32, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', position: 'relative', overflow: 'hidden' }}
                  onHoverStart={e => { if (e?.currentTarget?.style) e.currentTarget.style.borderColor = `${p.color}40` }}
                  onHoverEnd={e => { if (e?.currentTarget?.style) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)' }}>
                  <div style={{ position: 'absolute', top: 0, right: 0, width: 150, height: 150, background: `radial-gradient(circle at 100% 0%, ${p.color}16 0%, transparent 70%)`, pointerEvents: 'none' }} />
                  <div style={{ fontSize: 42, marginBottom: 18 }}>{p.emoji}</div>
                  <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', color: p.color, background: `${p.color}14`, borderRadius: 100, padding: '4px 13px', border: `1px solid ${p.color}25`, marginBottom: 20, textTransform: 'uppercase' }}>
                    {t(language, p.labelKey)}
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {p.featuresKeys.map(fk => (
                      <li key={fk} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.48)' }}>
                        <div style={{ width: 18, height: 18, borderRadius: '50%', background: `${p.color}14`, border: `1px solid ${p.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: p.color }} />
                        </div>
                        {t(language, fk)}
                      </li>
                    ))}
                  </ul>
                  <motion.button whileHover={{ scale: 1.03, background: `${p.color}28` }} whileTap={{ scale: 0.97 }}
                    onClick={() => handleDemo(p.roleId)} disabled={demoLoading !== null}
                    style={{ width: '100%', padding: '13px 0', borderRadius: 14, background: `${p.color}12`, border: `1px solid ${p.color}22`, color: p.color, fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: "'Outfit',sans-serif" }}>
                    {demoLoading === p.roleId ? '⟳ Loading…' : t(language, p.btnKey)}
                  </motion.button>
                </motion.div>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="demo" style={{ position: 'relative', zIndex: 2, maxWidth: 1100, margin: '0 auto', padding: '0 48px 120px' }}>
        <ScrollReveal direction="up" delay={0.1}>
          <div style={{ position: 'relative', borderRadius: 28, overflow: 'hidden', padding: '88px 48px', textAlign: 'center' }}>
            <motion.div animate={{ background: ['linear-gradient(135deg, rgba(99,102,241,0.14) 0%, rgba(139,92,246,0.09) 100%)', 'linear-gradient(225deg, rgba(139,92,246,0.17) 0%, rgba(6,182,212,0.08) 100%)', 'linear-gradient(135deg, rgba(99,102,241,0.14) 0%, rgba(139,92,246,0.09) 100%)'] }} transition={{ duration: 8, repeat: Infinity }}
              style={{ position: 'absolute', inset: 0, border: '1px solid rgba(99,102,241,0.25)', borderRadius: 28 }} />
            <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 4.5, repeat: Infinity }}
              style={{ position: 'absolute', width: 320, height: 320, background: 'radial-gradient(circle, rgba(99,102,241,0.25), transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
              style={{ position: 'absolute', width: 420, height: 420, top: '50%', left: '50%', marginLeft: -210, marginTop: -210, borderRadius: '50%', border: '1px dashed rgba(99,102,241,0.14)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 'clamp(26px, 4.5vw, 52px)', letterSpacing: '-1px', marginBottom: 18, lineHeight: 1.15, wordBreak: 'break-word' }}>
                {t(language, 'cta_title')}
              </h2>
              <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.38)', marginBottom: 48, maxWidth: 400, margin: '0 auto 48px' }}>
                {t(language, 'cta_sub')}
              </p>
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                <motion.button whileHover={{ scale: 1.06, boxShadow: '0 18px 56px rgba(99,102,241,0.6)' }} whileTap={{ scale: 0.96 }} onClick={() => navigate('/login')}
                  style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', color: '#fff', fontWeight: 700, fontSize: 16, padding: '16px 36px', borderRadius: 100, cursor: 'pointer', fontFamily: "'Outfit',sans-serif", boxShadow: '0 8px 36px rgba(99,102,241,0.4)' }}>
                  {t(language, 'cta_btn_get_started')} <ArrowRight size={18} />
                </motion.button>
                <motion.button whileHover={{ scale: 1.04, background: 'rgba(255,255,255,0.1)' }} whileTap={{ scale: 0.96 }} onClick={() => handleDemo('student')}
                  style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: 16, padding: '16px 30px', borderRadius: 100, cursor: 'pointer' }}>
                  {demoLoading === 'student' ? '⟳ Loading…' : t(language, 'cta_btn_live_demo')}
                </motion.button>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── FOOTER ── */}
      <ScrollReveal direction="up" delay={0.05}>
        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', maxWidth: 1100, margin: '0 auto', padding: '32px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, color: 'rgba(255,255,255,0.22)', position: 'relative', zIndex: 2, flexWrap: 'wrap', gap: 12 }}>
          <Logo size="sm" />
          <span>{t(language, 'footer_copyright')}</span>
          <div style={{ display: 'flex', gap: 24 }}>
            {[{ key: 'footer_privacy' }, { key: 'footer_terms' }].map(item => (
              <motion.a key={item.key} href="#" whileHover={{ color: '#fff' }} style={{ color: 'inherit', textDecoration: 'none' }}>{t(language, item.key)}</motion.a>
            ))}
          </div>
        </footer>
      </ScrollReveal>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');
        html { scroll-behavior: smooth; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 14px; }
        ::-webkit-scrollbar-track { background: #000005; }
        ::-webkit-scrollbar-thumb { background: #4f46e5; border-radius: 10px; border: 4px solid #000005; }
        ::-webkit-scrollbar-thumb:hover { background: #6366f1; }
        @media (max-width: 768px) {
          h1 { letter-spacing: -0.5px !important; white-space: normal !important; font-size: clamp(24px, 7vw, 40px) !important; word-break: break-word !important; }
          section { padding-left: 24px !important; padding-right: 24px !important; }
          .landing-nav { padding: 0 16px !important; }
          .landing-nav-links { display: none !important; }
          .landing-nav-right { gap: 6px !important; }
          .landing-nav-right button { padding: 8px 14px !important; font-size: 11px !important; }
          .landing-roles-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
          footer { padding: 24px 20px !important; justify-content: center !important; text-align: center !important; flex-direction: column !important; gap: 16px !important; }
        }
        @media (max-width: 480px) {
          h1 { font-size: clamp(22px, 7.5vw, 32px) !important; }
        }
      `}</style>
    </div>
  )
}