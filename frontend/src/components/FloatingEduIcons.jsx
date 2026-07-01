import { motion } from 'framer-motion'
import { GraduationCap, Atom, FlaskConical, Ruler, Compass, BookOpen, Sparkles, Zap } from 'lucide-react'

export default function FloatingEduIcons() {
  const icons = [
    { icon: GraduationCap, color: '#818cf8', top: '12%', left: '8%', size: 36, delay: 0 },
    { icon: Atom, color: '#67e8f9', top: '22%', right: '12%', size: 42, delay: 1.5 },
    { icon: FlaskConical, color: '#c4b5fd', top: '48%', left: '15%', size: 34, delay: 3.2 },
    { icon: Ruler, color: '#6ee7b7', top: '65%', right: '8%', size: 28, delay: 4.8 },
    { icon: BookOpen, color: '#fcd34d', top: '78%', left: '6%', size: 38, delay: 0.8 },
    { icon: Compass, color: '#fca5a5', top: '85%', right: '18%', size: 32, delay: 2.2 },
    { icon: Sparkles, color: '#67e8f9', top: '35%', left: '88%', size: 24, delay: 1.0 },
    { icon: Zap, color: '#818cf8', top: '60%', left: '4%', size: 30, delay: 4.0 },
    { icon: GraduationCap, color: '#c4b5fd', top: '90%', left: '42%', size: 32, delay: 5.5 },
    { icon: Atom, color: '#6ee7b7', top: '55%', left: '85%', size: 38, delay: 2.7 },
  ]

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {icons.map((item, i) => {
        const IconComponent = item.icon
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{
              opacity: [0.06, 0.12, 0.06],
              y: [0, -28, 0],
              x: [0, 14, 0],
              rotate: [0, 360],
            }}
            transition={{
              opacity: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
              y: { duration: 12 + item.delay, repeat: Infinity, ease: 'easeInOut', delay: item.delay },
              x: { duration: 16 + item.delay, repeat: Infinity, ease: 'easeInOut', delay: item.delay },
              rotate: { duration: 25 + item.delay, repeat: Infinity, ease: 'linear', delay: item.delay },
            }}
            style={{
              position: 'absolute',
              top: item.top,
              left: item.left,
              right: item.right,
              color: item.color,
              filter: 'blur(0.5px)',
            }}
          >
            <IconComponent size={item.size} />
          </motion.div>
        )
      })}
    </div>
  )
}
