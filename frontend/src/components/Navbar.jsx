import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, MessageCircle, HelpCircle, Layers, Trophy, LogOut, Home, Users, ClipboardList, Zap, Library, Map, Globe } from 'lucide-react'
import { useLanguage } from '../lib/LanguageContext'
import { t, LANGUAGES } from '../lib/i18n'
import LanguageDropdown from './LanguageDropdown'
import LanguageModal from './LanguageModal'
import Logo from './Logo'

const LIB_TRANSLATIONS = {
  en: "Library",
  hi: "पुस्तकालय",
  ta: "நூலகம்",
  te: "లైబ్రరీ",
  kn: "ಲೈಬ್ರರಿ",
  ml: "ലൈബ്രറി",
  mr: "ग्रंथालय",
  bn: "লাইব্রেরি",
  gu: "લાઇબ્રેરી",
  pa: "ਲਾਇਬ੍ਰേരി",
  or: "ପାଠାଗାର",
  ur: "لائبریری",
  as: "পুথিভঁৰাল",
  ne: "पुस्तकालय",
  mai: "पुस्तकालय",
  kok: "ग्रंथालय",
  doi: "पुस्तकालय",
  mni: "লাইব্রেরী",
  san: "ग्रन्थालायः"
}

export default function Navbar({ activeTab, onTabChange }) {
  const navigate = useNavigate()
  const { language, changeLanguage } = useLanguage()
  const [langOpen, setLangOpen] = useState(false)
  const user = JSON.parse(localStorage.getItem('ncert_user') || 'null')

  const NAV_TRANS = {
    en: {
      dashboard: "Dashboard",
      roadmap: "Syllabus Roadmap",
      mockexam: "CBSE Mock Exam"
    },
    hi: {
      dashboard: "डैशबोर्ड",
      roadmap: "पाठ्यक्रम रोडमैप",
      mockexam: "CBSE मॉक परीक्षा"
    },
    ta: {
      dashboard: "டாஷ்போர்டு",
      roadmap: "பாடத்திட்டம்",
      mockexam: "CBSE மாதிரி தேர்வு"
    },
    te: {
      dashboard: "డాష్‌బోర్డ్",
      roadmap: "సిలబస్ రోడ్‌మ్యాప్",
      mockexam: "CBSE మాక్ పరీక్ష"
    },
    kn: {
      dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
      roadmap: "ಪಠ್ಯಕ್ರಮದ ಮಾರ್ಗಸೂಚಿ",
      mockexam: "CBSE ಮಾದರಿ ಪರೀಕ್ಷೆ"
    },
    ml: {
      dashboard: "ഡാഷ്‌ബോർഡ്",
      roadmap: "സിലബസ് റോഡ്മാപ്പ്",
      mockexam: "CBSE മോക്ക് പരീക്ഷ"
    },
    mr: {
      dashboard: "डॅशबोर्ड",
      roadmap: "अभ्यासक्रम रोडमॅप",
      mockexam: "CBSE मॉक परीक्षा"
    },
    bn: {
      dashboard: "ড্যাশবোর্ড",
      roadmap: "সিলেবাস রোডম্যাপ",
      mockexam: "CBSE মক পরীক্ষা"
    },
    gu: {
      dashboard: "ડેશબોર્ડ",
      roadmap: "અભ્યાસક્રમ રોડમેપ",
      mockexam: "CBSE મોક પરીક્ષા"
    },
    pa: {
      dashboard: "ਡੈਸ਼ਬੋਰਡ",
      roadmap: "ਸਿਲੇਬਸ ਰੋਡਮੈਪ",
      mockexam: "CBSE ਮੌਕ ਪ੍ਰੀਖਿਆ"
    },
    or: {
      dashboard: "ଡ୍ୟାସବୋର୍ଡ",
      roadmap: "ପାଠ୍ୟକ୍ରମ ରୋଡମ୍ୟାପ୍",
      mockexam: "CBSE ମକ୍ ପରୀକ୍ଷା"
    },
    ur: {
      dashboard: "ڈیش بورڈ",
      roadmap: "نصاب کا روڈ میپ",
      mockexam: "CBSE موک امتحان"
    },
    as: {
      dashboard: "ড্যাশব’ৰ্ড",
      roadmap: "চিলেবাছ ৰোডমেপ",
      mockexam: "CBSE মক পৰীক্ষা"
    },
    ne: {
      dashboard: "डैशबोर्ड",
      roadmap: "पाठ्यक्रम रोडम्याप",
      mockexam: "CBSE मॉक परीक्षा"
    },
    mai: {
      dashboard: "डैशबोर्ड",
      roadmap: "पाठ्यक्रम रोडमैप",
      mockexam: "CBSE मॉक परीक्षा"
    },
    kok: {
      dashboard: "डॅशबोर्ड",
      roadmap: "अभ्यासक्रम रोडमॅप",
      mockexam: "CBSE मॉक परीक्षा"
    },
    doi: {
      dashboard: "डैशबोर्ड",
      roadmap: "पाठ्यक्रम रोडमैप",
      mockexam: "CBSE मॉक परीक्षा"
    },
    mni: {
      dashboard: "ড্যাসবোর্ড",
      roadmap: "সিলেবাস রোডম্যাপ",
      mockexam: "CBSE মক পরীক্ষা"
    },
    san: {
      dashboard: "फलकम्",
      roadmap: "पाठ्यक्रममार्गचित्रम्",
      mockexam: "CBSE मॉक परीक्षा"
    }
  }

  const getNavLabel = (key, defaultText) => {
    return NAV_TRANS[language]?.[key] || NAV_TRANS['en']?.[key] || defaultText
  }

  const studentLinks = [
    { tab: 'upload',      label: t(language, 'nav_study'),   icon: BookOpen,      color: '#818cf8' },
    { tab: 'library',     label: LIB_TRANSLATIONS[language] || LIB_TRANSLATIONS['en'], icon: Library, color: '#a5b4fc' },
    { tab: 'mockexam',    label: getNavLabel('mockexam', 'CBSE Mock Exam'), icon: ClipboardList, color: '#67e8f9' },
    { tab: 'chat',        label: t(language, 'nav_doubts'),  icon: MessageCircle, color: '#c4b5fd' },
    { tab: 'quiz',        label: t(language, 'nav_quiz'),    icon: HelpCircle,    color: '#67e8f9' },
    { tab: 'flashcards',  label: t(language, 'nav_cards'),   icon: Layers,        color: '#6ee7b7' },
    { tab: 'leaderboard', label: t(language, 'nav_rank'),    icon: Trophy,        color: '#fcd34d' },
  ]
  const parentLinks  = [{ tab: 'dashboard', label: getNavLabel('dashboard', 'Dashboard'), icon: Home,         color: '#818cf8' }]
  const links = user?.role === 'parent' ? parentLinks : studentLinks

  const handleLogout = () => {
    localStorage.removeItem('ncert_token')
    localStorage.removeItem('ncert_user')
    navigate('/login')
  }

  return (
    <>
      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="sidebar" style={{
        width: 240, minHeight: '100dvh', flexShrink: 0,
        background: 'rgba(10, 8, 20, 0.78)',
        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '24px 14px', display: 'flex', flexDirection: 'column', gap: 4,
        position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 50,
        backdropFilter: 'blur(32px)', overflowY: 'auto',
      }}>
        {/* Logo */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 20, paddingLeft: 6 }}>
          <Logo size="sm" />
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', marginTop: 1, paddingLeft: 40 }}>{t(language, 'tagline')}</div>
        </motion.div>

        {/* User card */}
        {user && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
            style={{ 
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05))',
              border: '1px solid rgba(99, 102, 241, 0.12)',
              borderRadius: 16, padding: '12px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 
            }}>
            <div style={{ 
              width: 36, height: 36, borderRadius: '50%', 
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', 
              display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', 
              fontWeight: 800, fontSize: 14, color: '#fff', flexShrink: 0,
              boxShadow: '0 0 12px rgba(99, 102, 241, 0.3)'
            }}>
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#f8f7ff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: "'Outfit',sans-serif" }}>{user.name}</div>
              <div style={{ fontSize: 10, color: '#9ea4d4', textTransform: 'capitalize', marginTop: 1 }}>
                {t(language, 'role_' + user.role)}{user.class ? ` · ${t(language, 'class_label')} ${user.class}` : ''}
              </div>
            </div>
          </motion.div>
        )}

        {/* Section label */}
        <div style={{ fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.12em', textTransform: 'uppercase', paddingLeft: 10, marginBottom: 6 }}>
          {t(language, 'nav_study').toUpperCase()}
        </div>

        {/* Nav links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, position: 'relative' }}>
          <AnimatePresence>
            {links.map((link, i) => {
              const Icon = link.icon
              const active = activeTab === link.tab || (!activeTab && link.tab === 'upload')
              return (
                <motion.button key={link.tab}
                  initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.06 }}
                  whileHover={{ x: active ? 0 : 3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onTabChange ? onTabChange(link.tab) : navigate('/')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 11,
                    padding: '11px 14px', borderRadius: 12, border: 'none', cursor: 'pointer',
                    background: 'transparent',
                    color: active ? '#ffffff' : '#9ea4d4',
                    fontWeight: active ? 700 : 500, fontSize: 13,
                    position: 'relative', textAlign: 'left',
                    transition: 'color 0.2s', zIndex: 1,
                    fontFamily: "'Plus Jakarta Sans', sans-serif"
                  }}>
                  {active && (
                    <motion.div layoutId="sidebar-active-pill"
                      style={{ 
                        position: 'absolute', inset: 0, borderRadius: 12, 
                        background: 'linear-gradient(90deg, rgba(99,102,241,0.14), rgba(139,92,246,0.14))',
                        border: `1px solid ${link.color}25`,
                        zIndex: -1,
                        boxShadow: `0 4px 20px ${link.color}05`
                      }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {active && (
                    <motion.div layoutId="sidebar-active-dot"
                      style={{ 
                        position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', 
                        width: 3, height: 16, borderRadius: 2, background: link.color, 
                        boxShadow: `0 0 10px ${link.color}` 
                      }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon size={16} style={{ color: active ? link.color : 'rgba(255,255,255,0.3)', transition: 'color 0.2s' }} />
                  {link.label}
                </motion.button>
              )
            })}
          </AnimatePresence>
        </nav>

        {/* Language dropdown in sidebar */}
        <div style={{ padding: '14px 4px 10px', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: 8 }}>
          <div style={{ fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8, paddingLeft: 6 }}>{t(language, 'choose_lang')}</div>
          <LanguageDropdown compact />
        </div>

        {/* Logout */}
        <motion.button whileHover={{ color: '#f87171', background: 'rgba(239,68,68,0.07)' }} whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12, border: 'none', cursor: 'pointer', background: 'transparent', color: 'rgba(255,255,255,0.28)', fontSize: 13, fontWeight: 500, transition: 'all 0.2s', marginTop: 4, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
          <LogOut size={15} /> {t(language, 'nav_logout')}
        </motion.button>
      </aside>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="bottom-nav" style={{ 
        display: 'none', position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100, 
        background: 'rgba(10, 8, 20, 0.85)', backdropFilter: 'blur(30px)', 
        borderTop: '1px solid rgba(255,255,255,0.06)', 
        paddingTop: '12px', paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)',
        justifyContent: 'space-around', alignItems: 'center' 
      }}>
        {links.map(link => {
          const Icon = link.icon
          const active = activeTab === link.tab || (!activeTab && link.tab === 'upload')
          return (
            <button key={link.tab} onClick={() => onTabChange?.(link.tab)}
              style={{ 
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, 
                padding: '4px 12px', background: 'transparent', border: 'none', cursor: 'pointer', 
                color: active ? link.color : 'rgba(255,255,255,0.35)', 
                fontSize: 10, fontWeight: active ? 700 : 500,
                transition: 'all 0.2s'
              }}>
              <Icon size={19} style={{ transform: active ? 'scale(1.08)' : 'scale(1)', color: active ? link.color : 'rgba(255,255,255,0.35)', transition: 'transform 0.2s, color 0.2s' }} />
              {link.label}
            </button>
          )
        })}
        <button onClick={() => setLangOpen(true)}
          style={{ 
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, 
            padding: '4px 12px', background: 'transparent', border: 'none', cursor: 'pointer', 
            color: 'rgba(255,255,255,0.35)', 
            fontSize: 10, fontWeight: 500,
            transition: 'all 0.2s'
          }}>
          <Globe size={19} style={{ color: 'rgba(255,255,255,0.35)' }} />
          <span>{LANGUAGES.find(l => l.code === language)?.label?.split(' ')[0] || 'Language'}</span>
        </button>
        <button onClick={handleLogout}
          style={{ 
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, 
            padding: '4px 12px', background: 'transparent', border: 'none', cursor: 'pointer', 
            color: 'rgba(239,68,68,0.75)', 
            fontSize: 10, fontWeight: 500,
            transition: 'all 0.2s'
          }}>
          <LogOut size={19} style={{ color: 'rgba(239,68,68,0.75)' }} />
          {t(language, 'nav_logout')}
        </button>
      </nav>
      <LanguageModal isOpen={langOpen} onClose={() => setLangOpen(false)} value={language} onChange={changeLanguage} />
    </>
  )
}
