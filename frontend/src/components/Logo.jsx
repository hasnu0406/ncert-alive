import { motion } from 'framer-motion'
import { useLanguage } from '../lib/LanguageContext'
import { t } from '../lib/i18n'

export default function Logo({ size = 'md', style = {} }) {
  const { language } = useLanguage()

  const config = {
    sm: { iconSize: 32, fontSize: 15, gap: 8 },
    md: { iconSize: 40, fontSize: 18, gap: 10 },
    lg: { iconSize: 56, fontSize: 32, gap: 12 },
  }[size] || { iconSize: 40, fontSize: 18, gap: 10 }

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: config.gap, ...style }}>
      {/* SVG Icon Container with floating and glowing animation */}
      <motion.div
        animate={{
          y: [0, -4, 0],
          filter: [
            'drop-shadow(0 0 4px rgba(99,102,241,0.3))',
            'drop-shadow(0 0 12px rgba(139,92,246,0.6))',
            'drop-shadow(0 0 4px rgba(99,102,241,0.3))'
          ]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: config.iconSize,
          height: config.iconSize,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="bookGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <linearGradient id="sparkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#67e8f9" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Book Shape */}
          <path
            d="M12 21C12 21 8.5 18 3 18V5C8.5 5 12 8 12 8C12 8 15.5 5 21 5V18C15.5 18 12 21 12 21Z"
            stroke="url(#bookGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="rgba(13,11,30,0.6)"
          />

          {/* Book Center spine */}
          <path
            d="M12 8V21"
            stroke="url(#bookGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Glowing electric spark/neuron in center */}
          <motion.path
            d="M12 4.5L14 9.5H12.5L13.5 14.5L9.5 9.5H11.5L12 4.5Z"
            fill="url(#sparkGrad)"
            filter="url(#neonGlow)"
            animate={{
              scale: [0.95, 1.05, 0.95],
              opacity: [0.9, 1, 0.9]
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '12px 9.5px' }}
          />
        </svg>
      </motion.div>

      {/* Website brand name text */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 900,
            fontSize: config.fontSize,
            letterSpacing: '-0.03em',
            background: 'linear-gradient(90deg, #f0eeff, #c4b5fd, #a5b4fc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1.1,
            whiteSpace: 'nowrap'
          }}
        >
          {t(language, 'brand_name')}
        </span>
      </div>
    </div>
  )
}
