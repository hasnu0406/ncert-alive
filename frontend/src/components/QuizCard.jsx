import { t } from '../lib/i18n'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, ChevronRight, Trophy, RotateCcw, Loader2, Sparkles } from 'lucide-react'
import confetti from 'canvas-confetti'
import { submitQuizScore } from '../lib/api'

const LOCAL_TRANSLATIONS = {
  en: {
    submit_quiz: "Submit Quiz & Earn Points 🎯",
    check_btn: "Check",
    show_answer: "Show Answer",
    questions_correct: "questions correct",
    try_again: "Try Again",
    type_answer: "Type your answer…",
    new_badge: "🏅 New badge!",
    tab_mcq: "MCQ",
    tab_fill: "Fill",
    tab_short: "Short",
  },
  hi: {
    submit_quiz: "क्विज़ सबमिट करें और अंक अर्जित करें 🎯",
    check_btn: "जांचें",
    show_answer: "उत्तर दिखाएं",
    questions_correct: "प्रश्न सही हैं",
    try_again: "पुनः प्रयास करें",
    type_answer: "अपना उत्तर टाइप करें…",
    new_badge: "🏅 नया बैज!",
    tab_mcq: "MCQ",
    tab_fill: "रिक्त स्थान",
    tab_short: "लघु उत्तर",
  },
  ta: {
    submit_quiz: "விடை சமர்ப்பித்து புள்ளிகள் பெறுக 🎯",
    check_btn: "சரிபார்",
    show_answer: "விடையைக் காட்டு",
    questions_correct: "சரியான பதில்கள்",
    try_again: "மீண்டும் முயற்சி செய்",
    type_answer: "உங்கள் பதிலை தட்டச்சு செய்யவும்…",
    new_badge: "🏅 புதிய பேட்ஜ்!",
    tab_mcq: "MCQ",
    tab_fill: "கோடிட்ட இடம்",
    tab_short: "குறு வினா",
  },
  te: {
    submit_quiz: "క్విజ్‌ను సమర్పించి పాయింట్లను పొందండి 🎯",
    check_btn: "తనిఖీ చేయి",
    show_answer: "సమాధానం చూపించు",
    questions_correct: "ప్రశ్నలు సరైనవి",
    try_again: "మరోసారి ప్రయత్నించండి",
    type_answer: "మీ సమాధానాన్ని టైప్ చేయండి…",
    new_badge: "🏅 కొత్త బ్యాడ్జ్!",
    tab_mcq: "MCQ",
    tab_fill: "ఖాళీలు",
    tab_short: "ลఘు సమాధానం",
  },
  kn: {
    submit_quiz: "ಕ್ವಿಜ್ ಸಲ್ಲಿಸಿ ಮತ್ತು ಅಂಕಗಳನ್ನು ಗಳಿಸಿ 🎯",
    check_btn: "ಪರಿಶೀಲಿಸಿ",
    show_answer: "ಉತ್ತರವನ್ನು ತೋರಿಸು",
    questions_correct: "ಪ್ರಶ್ನೆಗಳು ಸರಿಯಾಗಿವೆ",
    try_again: "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ",
    type_answer: "ನಿಮ್ಮ ಉತ್ತರವನ್ನು ಟೈಪ್ ಮಾಡಿ…",
    new_badge: "🏅 ಹೊಸ ಬ್ಯಾಡ್ಜ್!",
    tab_mcq: "MCQ",
    tab_fill: "ಖಾಲಿ ಜಾಗ",
    tab_short: "ಲಘು ಪ್ರಶ್ನೆ",
  },
  ml: {
    submit_quiz: "ക്വിസ് സമർപ്പിച്ച് പോയിന്റുകൾ നേടുക 🎯",
    check_btn: "പരിശോധിക്കുക",
    show_answer: "ഉത്തരം കാണിക്കുക",
    questions_correct: "ചോദ്യങ്ങൾ ശരിയാണ്",
    try_again: "വീണ്ടും ശ്രമിക്കുക",
    type_answer: "നിങ്ങളുടെ ഉത്തരം ടൈപ്പ് ചെയ്യുക…",
    new_badge: "🏅 പുതിയ ബാഡ്ജ്!",
    tab_mcq: "MCQ",
    tab_fill: "കോടിട്ട ഇടം",
    tab_short: "ലഘു ചോദ്യം",
  },
  mr: {
    submit_quiz: "क्विझ सबमिट करा आणि गुण मिळवा 🎯",
    check_btn: "तपासा",
    show_answer: "उत्तर दाखवा",
    questions_correct: "प्रश्न बरोबर आहेत",
    try_again: "पुन्हा प्रयत्न करा",
    type_answer: "तुमचे उत्तर टाईप करा…",
    new_badge: "🏅 नवीन बॅज!",
    tab_mcq: "MCQ",
    tab_fill: "रिकाम्या जागा",
    tab_short: "लघु उत्तर",
  },
  bn: {
    submit_quiz: "কুইজ জমা দিন এবং পয়েন্ট অর্জন করুন 🎯",
    check_btn: "যাচাই করুন",
    show_answer: "উত্তর দেখান",
    questions_correct: "টি প্রশ্ন সঠিক হয়েছে",
    try_again: "আবার চেষ্টা করুন",
    type_answer: "আপনার উত্তর টাইপ করুন…",
    new_badge: "🏅 নতুন ব্যাজ!",
    tab_mcq: "MCQ",
    tab_fill: "শূন্যস্থান",
    tab_short: "সংক্ষিপ্ত উত্তর",
  },
  gu: {
    submit_quiz: "ક્વિઝ સબમિટ કરો અને પોઇન્ટ મેળવો 🎯",
    check_btn: "તપાસો",
    show_answer: "જવાબ બતાવો",
    questions_correct: "પ્રશ્નો સાચા છે",
    try_again: "ફરીથી પ્રયાસ કરો",
    type_answer: "તમારો જવાબ લખો…",
    new_badge: "🏅 નવો બેજ!",
    tab_mcq: "MCQ",
    tab_fill: "ખાલી જગ્યા",
    tab_short: "ટૂંકો જવાબ",
  },
  pa: {
    submit_quiz: "ਕਵਿਜ਼ ਸਬਮਿਟ ਕਰੋ ਅਤੇ ਅੰਕ ਪ੍ਰਾਪਤ ਕਰੋ 🎯",
    check_btn: "ਚੈੱਕ ਕਰੋ",
    show_answer: "ਉੱਤਰ ਦਿਖਾਓ",
    questions_correct: "ਪ੍ਰਸ਼ਨ ਸਹੀ ਹਨ",
    try_again: "ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ",
    type_answer: "ਆਪਣਾ ਉੱਤਰ ਟਾਈਪ ਕਰੋ…",
    new_badge: "🏅 ਨਵਾਂ ਬੈਜ!",
    tab_mcq: "MCQ",
    tab_fill: "ਖਾਲੀ ਥਾਂ",
    tab_short: "ਛੋਟਾ ਉੱਤਰ",
  },
  or: {
    submit_quiz: "କ୍ୱିଜ୍ ସବମିଟ୍ କରି ପଏଣ୍ଟ୍ ଅର୍ଜନ କରନ୍ତୁ 🎯",
    check_btn: "ଯାଞ୍ଚ କରନ୍ତୁ",
    show_answer: "ଉତ୍ତର ଦେଖାନ୍ତୁ",
    questions_correct: "ପ୍ରଶ୍ନ ସଠିକ୍ ଅଛି",
    try_again: "ପୁଣି ଚେଷ୍ଟာ କରନ୍ତୁ",
    type_answer: "ଆପଣଙ୍କର ଉତ୍ତର ଟାଇପ୍ କରନ୍ତୁ…",
    new_badge: "🏅 ନୂତନ ବ୍ୟାଜ୍!",
    tab_mcq: "MCQ",
    tab_fill: "ଶୂନ୍ୟସ୍ଥାନ",
    tab_short: "ସଂକ୍ଷିପ୍ତ ଉତ୍ତର",
  },
  ur: {
    submit_quiz: "کوئز جمع کروائیں اور پوائنٹس حاصل کریں 🎯",
    check_btn: "चेक करें",
    show_answer: "جواب دکھائیں",
    questions_correct: "سوالات درست ہیں",
    try_again: "دوبارہ کوشش کریں",
    type_answer: "अपना उत्तर टाइप करें…",
    new_badge: "🏅 نیا بیج!",
    tab_mcq: "MCQ",
    tab_fill: "خالی جگہ",
    tab_short: "مختصر جواب",
  },
  as: {
    submit_quiz: "কুইজ জমা দিয়ক আৰু পইণ্ট অৰ্জন কৰক 🎯",
    check_btn: "পৰীক্ষা কৰক",
    show_answer: "উত্তৰ দেখুৱাওক",
    questions_correct: "প্ৰশ্ন শুদ্ধ হৈছে",
    try_again: "পুনৰ চেষ্টা কৰক",
    type_answer: "আপোনাৰ উত্তৰ টাইপ কৰক…",
    new_badge: "🏅 নতুন বেজ!",
    tab_mcq: "MCQ",
    tab_fill: "খালী ঠাই",
    tab_short: "চমু উত্তৰ",
  },
  ne: {
    submit_quiz: "क्विज सबमिट गर्नुहोस् र अंक प्राप्त गर्नुहोस् 🎯",
    check_btn: "जाँच गर्नुहोस्",
    show_answer: "उत्तर देखाउनुहोस्",
    questions_correct: "प्रश्नहरू सही छन्",
    try_again: "पुनः प्रयास गर्नुहोस्",
    type_answer: "आफ्नो उत्तर टाइप गर्नुहोस्…",
    new_badge: "🏅 नयाँ ब्याज!",
    tab_mcq: "MCQ",
    tab_fill: "खाली ठाउँ",
    tab_short: "छोटो उत्तर",
  },
  mai: {
    submit_quiz: "क्विज सबमिट करू आ अंक अर्जित करू 🎯",
    check_btn: "जाँचू",
    show_answer: "उत्तर देखाउ",
    questions_correct: "प्रश्न सभ सही अछि",
    try_again: "पुनः प्रयास करू",
    type_answer: "अपना उत्तर टाइप करू…",
    new_badge: "🏅 नव बैज!",
    tab_mcq: "MCQ",
    tab_fill: "रिक्त स्थान",
    tab_short: "लघु उत्तर",
  },
  kok: {
    submit_quiz: "क्विज सबमिट करात आनी गुण मेळयात 🎯",
    check_btn: "तपासून पळयात",
    show_answer: "जाप दाखयात",
    questions_correct: "प्रश्न सारके आसात",
    try_again: "परतून यत्न करात",
    type_answer: "तुमची जाप टाईপ करात…",
    new_badge: "🏅 नभो बॅज!",
    tab_mcq: "MCQ",
    tab_fill: "रिक्त सुवात",
    tab_short: "ल्हान जाप",
  },
  doi: {
    submit_quiz: "क्विज सबमिट करो ते अंक हासल करो 🎯",
    check_btn: "जांचो",
    show_answer: "उत्तर दस्सो",
    questions_correct: "सच्चे उत्तर",
    try_again: "परत कोशश करो",
    type_answer: "अपना उत्तर टाइप करो…",
    new_badge: "🏅 नमां बैज!",
    tab_mcq: "MCQ",
    tab_fill: "खाली थाह",
    tab_short: "निक्का उत्तर",
  },
  mni: {
    submit_quiz: "কুইজ থাদোকউ অমসুং পোইন্ট তানৌ 🎯",
    check_btn: "য়েংউ",
    show_answer: "পাউখুম উতলু",
    questions_correct: "পাউখুম চুম্বা মশিং",
    try_again: "অমুক হন্না হোৎনৌ",
    type_answer: "পাউখুম ইও…",
    new_badge: "🏅 অনৌবা ব্যাজ!",
    tab_mcq: "MCQ",
    tab_fill: "খালি মফম",
    tab_short: "অতেনবা পাউখুম",
  },
  san: {
    submit_quiz: "प्रश्नोत्तरीं प्रेषयन्तु अङ्कान् च प्राप्नुवन्तु 🎯",
    check_btn: "परीक्षताम्",
    show_answer: "उत्तरं दर्शयन्तु",
    questions_correct: "प्रश्नाः शुद्धाः सन्ति",
    try_again: "पुनः प्रयतताम्",
    type_answer: "स्वकीयमुत्तरं लिखत…",
    new_badge: "🏅 नूतनः पदकः!",
    tab_mcq: "MCQ",
    tab_fill: "रिक्तस्थानम्",
    tab_short: "लघूत्तरम्",
  }
};

export default function QuizCard({ quiz: rawQuiz, pageId, userId, onPointsAwarded, isLoading, language = 'en' }) {
  const quiz = (rawQuiz && !rawQuiz.mcq && !rawQuiz.fill_blanks && typeof rawQuiz === 'object')
    ? (rawQuiz[language] || rawQuiz['en'] || Object.values(rawQuiz)[0] || rawQuiz)
    : rawQuiz

  const tl = (key) => LOCAL_TRANSLATIONS[language]?.[key] || LOCAL_TRANSLATIONS['en']?.[key] || key
  const [tab, setTab] = useState('mcq')
  const [answers, setAnswers] = useState({})
  const [revealed, setRevealed] = useState({})
  const [fillAnswers, setFillAnswers] = useState({})
  const [fillRevealed, setFillRevealed] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(null)
  const [gamification, setGamification] = useState(null)

  if (quiz?.error) {
    return (
      <div style={{ padding: '28px 24px', borderRadius: 20, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.18)', textAlign: 'center' }}>
        <p style={{ color: '#fca5a5', fontSize: 14, margin: 0, lineHeight: 1.7 }}>⚠️ {quiz.error}</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div style={{ background: 'rgba(18,16,35,0.65)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: '40px 36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <Loader2 size={20} style={{ color: '#818cf8', animation: 'spin 1s linear infinite' }} />
          <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t(language, 'generating_quiz')}</span>
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ marginBottom: 32 }}>
            <div className="shimmer" style={{ height: 16, borderRadius: 8, width: '78%', marginBottom: 16 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[1, 2, 3, 4].map(j => <div key={j} className="shimmer" style={{ height: 52, borderRadius: 14 }} />)}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!quiz?.mcq?.length && !quiz?.fill_blanks?.length) return null

  const mcqs = quiz.mcq || []
  const fills = quiz.fill_blanks || []
  const oneLiners = quiz.one_liners || []

  const handleMCQAnswer = (qIdx, option) => {
    if (revealed[qIdx]) return
    setAnswers(prev => ({ ...prev, [qIdx]: option }))
    setRevealed(prev => ({ ...prev, [qIdx]: true }))
  }

  const handleSubmit = async () => {
    const correct = mcqs.filter((q, i) => answers[i] === q.answer).length
    setScore({ correct, total: mcqs.length })
    setSubmitted(true)
    if (correct === mcqs.length && mcqs.length > 0) {
      confetti({ particleCount: 140, spread: 90, origin: { y: 0.6 }, colors: ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#fcd34d'] })
    }
    try {
      if (userId && pageId) {
        const res = await submitQuizScore(userId, pageId, correct, mcqs.length)
        setGamification(res.gamification)
        onPointsAwarded?.(res.gamification)
      }
    } catch {}
  }

  const reset = () => {
    setAnswers({}); setRevealed({}); setFillAnswers({}); setFillRevealed({})
    setSubmitted(false); setScore(null); setGamification(null)
  }

  const allTabs = [
    { id: 'mcq', labelKey: 'tab_mcq', count: mcqs.length, color: '#818cf8' },
    { id: 'fill', labelKey: 'tab_fill', count: fills.length, color: '#c4b5fd' },
    { id: 'short', labelKey: 'tab_short', count: oneLiners.length, color: '#67e8f9' },
  ].filter(t => t.count > 0)

  return (
    <div style={{
      background: 'rgba(14,12,27,0.7)',
      backdropFilter: 'blur(24px)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 24,
      overflow: 'hidden',
    }}>
      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.015)' }}>
        {allTabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{
              flex: 1, padding: '16px 12px', border: 'none', cursor: 'pointer', background: 'transparent',
              fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: '0.02em',
              color: tab === t.id ? t.color : 'rgba(255,255,255,0.3)',
              borderBottom: tab === t.id ? `2px solid ${t.color}` : '2px solid transparent',
              transition: 'all 0.2s',
            }}>
            {tl(t.labelKey)} <span style={{ fontSize: 11, opacity: 0.7 }}>({t.count})</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: '32px 28px' }}>

        {/* MCQ Questions */}
        {tab === 'mcq' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
            {mcqs.map((q, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}>

                {/* Question */}
                <div style={{ marginBottom: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      minWidth: 28, height: 28, borderRadius: 8,
                      background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
                      fontSize: 12, fontWeight: 800, color: '#818cf8',
                      fontFamily: "'Outfit', sans-serif", flexShrink: 0, marginTop: 2,
                    }}>Q{i + 1}</span>
                    <p style={{
                      fontSize: 15.5, fontWeight: 600, color: '#eeeeff', lineHeight: 1.75,
                      fontFamily: "'Plus Jakarta Sans', sans-serif", margin: 0,
                    }}>{q.question}</p>
                  </div>
                </div>

                {/* Options — single column always for clean look */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginLeft: 40 }}>
                  {q.options.map((opt, j) => {
                    const isSelected = answers[i] === opt
                    const isCorrect = opt === q.answer
                    const show = revealed[i]

                    let bg = 'rgba(255,255,255,0.03)'
                    let border = '1px solid rgba(255,255,255,0.07)'
                    let color = 'rgba(255,255,255,0.7)'

                    if (show && isCorrect) {
                      bg = 'rgba(16,185,129,0.1)'
                      border = '1px solid rgba(16,185,129,0.5)'
                      color = '#6ee7b7'
                    } else if (show && isSelected && !isCorrect) {
                      bg = 'rgba(239,68,68,0.08)'
                      border = '1px solid rgba(239,68,68,0.45)'
                      color = '#fca5a5'
                    }

                    const letter = ['A', 'B', 'C', 'D'][j]

                    return (
                      <motion.button key={j}
                        whileTap={!show ? { scale: 0.985 } : undefined}
                        whileHover={!show ? { borderColor: 'rgba(99,102,241,0.4)', background: 'rgba(99,102,241,0.06)' } : undefined}
                        onClick={() => handleMCQAnswer(i, opt)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 14,
                          padding: '14px 18px', borderRadius: 14,
                          background: bg, border, cursor: show ? 'default' : 'pointer',
                          textAlign: 'left', transition: 'all 0.2s',
                          animation: (show && isCorrect) ? 'correctPulse 0.5s ease-out' : (show && isSelected && !isCorrect) ? 'wrongShake 0.5s ease-out' : undefined,
                        }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          minWidth: 26, height: 26, borderRadius: 7,
                          background: show && isCorrect ? 'rgba(16,185,129,0.2)' : show && isSelected && !isCorrect ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.06)',
                          fontSize: 11, fontWeight: 800, color: color,
                          fontFamily: "'Outfit', sans-serif", flexShrink: 0,
                          border: `1px solid ${show && isCorrect ? 'rgba(16,185,129,0.4)' : show && isSelected && !isCorrect ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.08)'}`,
                        }}>{letter}</span>
                        <span style={{ fontSize: 14.5, lineHeight: 1.65, color, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500 }}>{opt}</span>
                        {show && isCorrect && <CheckCircle size={16} style={{ color: '#34d399', marginLeft: 'auto', flexShrink: 0 }} />}
                        {show && isSelected && !isCorrect && <XCircle size={16} style={{ color: '#f87171', marginLeft: 'auto', flexShrink: 0 }} />}
                      </motion.button>
                    )
                  })}
                </div>

                {/* Explanation */}
                <AnimatePresence>
                  {revealed[i] && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                      style={{
                        marginTop: 14, marginLeft: 40,
                        padding: '14px 18px', borderRadius: 14,
                        background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.18)',
                        display: 'flex', alignItems: 'flex-start', gap: 10,
                      }}>
                      <Sparkles size={14} style={{ color: '#818cf8', flexShrink: 0, marginTop: 2 }} />
                      <p style={{ fontSize: 13.5, lineHeight: 1.7, color: 'rgba(255,255,255,0.55)', margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {q.explanation}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}

        {/* Fill in the Blank */}
        {tab === 'fill' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {fills.map((q, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    minWidth: 28, height: 28, borderRadius: 8,
                    background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)',
                    fontSize: 12, fontWeight: 800, color: '#c4b5fd',
                    fontFamily: "'Outfit', sans-serif", flexShrink: 0, marginTop: 2,
                  }}>Q{i + 1}</span>
                  <p style={{ fontSize: 15.5, fontWeight: 600, color: '#eeeeff', lineHeight: 1.75, fontFamily: "'Plus Jakarta Sans', sans-serif", margin: 0 }}>{q.question}</p>
                </div>
                <div style={{ display: 'flex', gap: 12, marginLeft: 40 }}>
                  <input type="text"
                    style={{
                      flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 12, color: '#f8f7ff', padding: '12px 16px',
                      fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14,
                      outline: 'none', transition: 'all 0.3s ease',
                    }}
                    onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)' }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
                    placeholder={tl('type_answer')}
                    value={fillAnswers[i] || ''}
                    onChange={e => setFillAnswers(prev => ({ ...prev, [i]: e.target.value }))}
                    disabled={fillRevealed[i]}
                  />
                  <button onClick={() => setFillRevealed(prev => ({ ...prev, [i]: true }))}
                    disabled={fillRevealed[i]}
                    style={{
                      padding: '12px 20px', borderRadius: 12, border: 'none', cursor: 'pointer',
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff',
                      fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 13,
                      whiteSpace: 'nowrap', opacity: fillRevealed[i] ? 0.5 : 1, transition: 'opacity 0.2s',
                    }}>{tl('check_btn')}</button>
                </div>
                <AnimatePresence>
                  {fillRevealed[i] && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      style={{
                        marginTop: 14, marginLeft: 40, padding: '14px 18px', borderRadius: 14,
                        background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)',
                        display: 'flex', alignItems: 'flex-start', gap: 10,
                      }}>
                      <CheckCircle size={14} style={{ color: '#34d399', flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <p style={{ fontSize: 13.5, fontWeight: 700, color: '#6ee7b7', margin: '0 0 4px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Answer: {q.answer}</p>
                        <p style={{ fontSize: 13, lineHeight: 1.65, color: 'rgba(255,255,255,0.45)', margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{q.explanation}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}

        {/* Short Answer */}
        {tab === 'short' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {oneLiners.map((q, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                style={{
                  background: 'rgba(6,182,212,0.04)', border: '1px solid rgba(6,182,212,0.12)',
                  borderRadius: 16, padding: '20px 22px',
                }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    minWidth: 28, height: 28, borderRadius: 8,
                    background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)',
                    fontSize: 12, fontWeight: 800, color: '#67e8f9',
                    fontFamily: "'Outfit', sans-serif", flexShrink: 0, marginTop: 2,
                  }}>Q{i + 1}</span>
                  <p style={{ fontSize: 15.5, fontWeight: 600, color: '#eeeeff', lineHeight: 1.75, fontFamily: "'Plus Jakarta Sans', sans-serif", margin: 0 }}>{q.question}</p>
                </div>
                <details style={{ paddingLeft: 40 }}>
                  <summary style={{ fontSize: 13, color: '#818cf8', cursor: 'pointer', fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif", listStyle: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ChevronRight size={14} /> {tl('show_answer')}
                  </summary>
                  <p style={{ fontSize: 14.5, lineHeight: 1.75, color: '#6ee7b7', marginTop: 12, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{q.answer}</p>
                </details>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Submit / Score footer */}
      {tab === 'mcq' && mcqs.length > 0 && (
        <div style={{ padding: '0 28px 28px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 24 }}>
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.button key="submit"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(99,102,241,0.35)' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={Object.keys(revealed).length < mcqs.length}
                style={{
                  width: '100%', padding: '16px 24px', borderRadius: 16, border: 'none', cursor: 'pointer',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: '#fff', fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 15,
                  opacity: Object.keys(revealed).length < mcqs.length ? 0.45 : 1,
                  transition: 'opacity 0.2s, box-shadow 0.2s',
                  boxShadow: '0 4px 20px rgba(99,102,241,0.2)',
                }}>
                {tl('submit_quiz')}
              </motion.button>
            ) : (
              <motion.div key="score"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '20px 24px', borderRadius: 18,
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15))',
                  border: '1px solid rgba(99,102,241,0.3)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <Trophy size={24} style={{ color: '#fcd34d' }} />
                    <div>
                      <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', fontFamily: "'Outfit', sans-serif" }}>{score.correct}/{score.total}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{tl('questions_correct')}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {gamification && <div style={{ fontSize: 16, fontWeight: 800, color: '#818cf8', fontFamily: "'Outfit', sans-serif" }}>+{gamification.pointsAwarded} XP 🔥</div>}
                    {gamification?.newBadge?.length > 0 && <div style={{ fontSize: 12, color: '#fcd34d', marginTop: 4 }}>{tl('new_badge')}</div>}
                  </div>
                </div>
                <button onClick={reset}
                  style={{
                    width: '100%', padding: '14px 24px', borderRadius: 14,
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.7)', fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 14,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.09)' }}
                  onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.05)' }}>
                  <RotateCcw size={15} /> {tl('try_again')}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
