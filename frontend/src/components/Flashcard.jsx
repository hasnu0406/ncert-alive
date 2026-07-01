import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, RotateCcw, Layers } from 'lucide-react'

const LOCAL_TRANSLATIONS = {
  en: {
    tap_reveal: "Tap to reveal →",
    tap_flip_back: "Tap to flip back ←",
    start_over: "Start over",
    label_term: "Term",
    label_formula: "Formula",
    label_concept: "Concept",
    label_fact: "Fact",
  },
  hi: {
    tap_reveal: "देखने के लिए टैप करें →",
    tap_flip_back: "वापस पलटने के लिए टैप करें ←",
    start_over: "फिर से शुरू करें",
    label_term: "पारिभाषिक शब्द",
    label_formula: "सूत्र",
    label_concept: "अवधारणा",
    label_fact: "तथ्य",
  },
  ta: {
    tap_reveal: "வெளிப்படுத்த தட்டவும் →",
    tap_flip_back: "திரும்பத் தட்டவும் ←",
    start_over: "ஆரம்பத்தில் இருந்து",
    label_term: "கலைச்சொல்",
    label_formula: "சூத்திரம்",
    label_concept: "கருத்து",
    label_fact: "உண்மை",
  },
  te: {
    tap_reveal: "చూడటానికి నొక్కండి →",
    tap_flip_back: "తిరిగి తిప్పడానికి నొక్కండి ←",
    start_over: "మొదటి నుండి ప్రారంభించండి",
    label_term: "పదం",
    label_formula: "సూత్రం",
    label_concept: "భావన",
    label_fact: "వాస్తవం",
  },
  kn: {
    tap_reveal: "ನೋಡಲು ಟ್ಯಾಪ್ ಮಾಡಿ →",
    tap_flip_back: "ಹಿಂದಕ್ಕೆ ತಿರುಗಿಸಲು ಟ್ಯಾಪ್ ಮಾಡಿ ←",
    start_over: "ಮೊದಲಿನಿಂದ ಪ್ರಾರಂಭಿಸಿ",
    label_term: "ಪದ",
    label_formula: "ಸೂತ್ರ",
    label_concept: "ಪರಿಕಲ್ಪನೆ",
    label_fact: "ಸಂಗತಿ",
  },
  ml: {
    tap_reveal: "കാണാൻ ടാപ്പ് ചെയ്യുക →",
    tap_flip_back: "തിരിച്ചു മറിക്കാൻ ടാപ്പ് ചെയ്യുക ←",
    start_over: "വീണ്ടും തുടങ്ങുക",
    label_term: "പദം",
    label_formula: "സൂത്രം",
    label_concept: "ആശയം",
    label_fact: "വസ്തുത",
  },
  mr: {
    tap_reveal: "पाहण्यासाठी टॅप करा →",
    tap_flip_back: "मागे फिरवण्यासाठी टॅप करा ←",
    start_over: "पुन्हा सुरू करा",
    label_term: "शब्द",
    label_formula: "सूत्र",
    label_concept: "संकल्पना",
    label_fact: "तथ्य",
  },
  bn: {
    tap_reveal: "দেখার জন্য আলতো চাপুন →",
    tap_flip_back: "আগের পৃষ্ঠায় যেতে আলতো চাপুন ←",
    start_over: "আবার শুরু করুন",
    label_term: "শব্দ",
    label_formula: "সূত্র",
    label_concept: "ধারণা",
    label_fact: "তথ্য",
  },
  gu: {
    tap_reveal: "જોવા માટે ટેप કરો →",
    tap_flip_back: "પાછા ફેરવવા માટે ટેપ કરો ←",
    start_over: "ફરીથી શરૂ કરો",
    label_term: "શબ્દ",
    label_formula: "સૂત્ર",
    label_concept: "ખ્યાલ",
    label_fact: "હકીકત",
  },
  pa: {
    tap_reveal: "ਦੇਖਣ ਲਈ ਟੈਪ ਕਰੋ →",
    tap_flip_back: "ਵਾਪਸ ਮੋੜਨ ਲਈ ਟੈਪ ਕਰੋ ←",
    start_over: "ਮੁੜ ਸ਼ੁਰੂ ਕਰੋ",
    label_term: "ਸ਼ਬਦ",
    label_formula: "ਫਾਰਮੂਲਾ",
    label_concept: "ਸੰਕਲਪ",
    label_fact: "ਤੱਥ",
  },
  or: {
    tap_reveal: "ଦେଖିବା ପାଇଁ ଟାପ୍ କରନ୍ତୁ →",
    tap_flip_back: "ପଛକୁ ଫେରିବା ପାଇଁ ଟାପ୍ କରନ୍ତୁ ←",
    start_over: "ପୁନର୍ବାର ଆରମ୍ଭ କରନ୍ତୁ",
    label_term: "ଶବ୍ଦ",
    label_formula: "ସୂତ୍ର",
    label_concept: "ଧାରଣା",
    label_fact: "ତଥ୍ୟ",
  },
  ur: {
    tap_reveal: "دیکھنے کے لیے ٹیپ کریں →",
    tap_flip_back: "واپس پلٹنے کے لیے ٹیپ کریں ←",
    start_over: "دوبارہ شروع کریں",
    label_term: "اصطلاح",
    label_formula: "فارمولا",
    label_concept: "تصور",
    label_fact: "حقیقت",
  },
  as: {
    tap_reveal: "চাবলৈ টেপ কৰক →",
    tap_flip_back: "উভতি যাবলৈ টেপ কৰক ←",
    start_over: "পুনৰ আৰম্ভ কৰক",
    label_term: "শব্দ",
    label_formula: "সূত্ৰ",
    label_concept: "ধাৰণা",
    label_fact: "তথ্য",
  },
  ne: {
    tap_reveal: "हेर्न ट्याप गर्नुहोस् →",
    tap_flip_back: "फिर्ता जान ट्याप गर्नुहोस् ←",
    start_over: "फेरि सुरु गर्नुहोस्",
    label_term: "शब्द",
    label_formula: "सूत्र",
    label_concept: "अवधारणा",
    label_fact: "तथ्य",
  },
  mai: {
    tap_reveal: "देखबाक लेल टैप करू →",
    tap_flip_back: "वापस लेल टैप करू ←",
    start_over: "पुनः शुरू करू",
    label_term: "शब्द",
    label_formula: "सूत्र",
    label_concept: "अवधारणा",
    label_fact: "तथ्य",
  },
  kok: {
    tap_reveal: "पळोवपाक टॅब करात →",
    tap_flip_back: "फाटी घालपाक टॅब करात ←",
    start_over: "परतून यत्न करात",
    label_term: "शब्द",
    label_formula: "सूत्र",
    label_concept: "संकल्पना",
    label_fact: "तथ्य",
  },
  doi: {
    tap_reveal: "देखन लेई टैप करो →",
    tap_flip_back: "परत कोशश लेई टैप करो ←",
    start_over: "परत शुरू करो",
    label_term: "शब्द",
    label_formula: "सूत्र",
    label_concept: "संकल्पना",
    label_fact: "तथ्य",
  },
  mni: {
    tap_reveal: "য়েংনবা thadok-u →",
    tap_flip_back: "হন্না লাক্নবা thadok-u ←",
    start_over: "অমুক হন্না হৌউ",
    label_term: "ৱাহৈ",
    label_formula: "ফোর্মুলা",
    label_concept: "ৱাখল্লোন",
    label_fact: "অচুম্বা ৱাফম",
  },
  san: {
    tap_reveal: "द्रष्टुं नुदन्तु →",
    tap_flip_back: "पुनः परिवर्तयितुं नुदन्तु ←",
    start_over: "पुनः आरभ्यताम्",
    label_term: "पारिभाषिकशब्दः",
    label_formula: "सूत्रम्",
    label_concept: "अवधारणा",
    label_fact: "तथ्यम्",
  }
};

const TYPE_COLORS = {
  term: { bg: 'rgba(99,102,241,0.15)', text: '#a5b4fc', labelKey: 'label_term' },
  formula: { bg: 'rgba(6,182,212,0.15)', text: '#67e8f9', labelKey: 'label_formula' },
  concept: { bg: 'rgba(139,92,246,0.15)', text: '#c4b5fd', labelKey: 'label_concept' },
  fact: { bg: 'rgba(16,185,129,0.15)', text: '#6ee7b7', labelKey: 'label_fact' },
}

export default function Flashcard({ cards = [], isLoading, language = 'en' }) {
  const tl = (key) => LOCAL_TRANSLATIONS[language]?.[key] || LOCAL_TRANSLATIONS['en']?.[key] || key
  const [current, setCurrent] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [direction, setDirection] = useState(0)

  if (cards?.[0]?.error) {
    return (
      <div style={{ padding: 24, borderRadius: 16, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', textAlign: 'center' }}>
        <p style={{ color: '#fca5a5', fontSize: 14, margin: 0 }}>⚠️ {cards[0].error}</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="shimmer rounded-2xl" style={{ height: 220 }} />
        <div className="flex justify-center gap-2">
          {[1,2,3,4].map(i => <div key={i} className="shimmer w-2 h-2 rounded-full" />)}
        </div>
      </div>
    )
  }

  if (!cards.length) return null

  const card = cards[current]
  const typeStyle = TYPE_COLORS[card.type] || TYPE_COLORS.concept

  const goNext = () => {
    if (current >= cards.length - 1) return
    setFlipped(false); setDirection(1)
    setTimeout(() => setCurrent(c => c + 1), 150)
  }

  const goPrev = () => {
    if (current <= 0) return
    setFlipped(false); setDirection(-1)
    setTimeout(() => setCurrent(c => c - 1), 150)
  }

  return (
    <div className="space-y-4">
      {/* Card count */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Layers size={14} className="text-indigo-400" />
          <span className="text-sm font-semibold text-gray-300">{current + 1} / {cards.length}</span>
        </div>
        <span className="badge" style={{ background: typeStyle.bg, color: typeStyle.text, border: `1px solid ${typeStyle.text}33` }}>
          {card.emoji} {tl(typeStyle.labelKey)}
        </span>
      </div>

      {/* 3D Flashcard */}
      <div className="flashcard-scene">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.15 }}
            className="w-full h-full"
          >
            <div
              className={`flashcard-card ${flipped ? 'flipped' : ''}`}
              onClick={() => setFlipped(f => !f)}
            >
              {/* Front */}
              <div className="flashcard-face flashcard-front">
                <div className="mb-3 text-3xl">{card.emoji}</div>
                <h3 className="text-base font-bold text-white mb-2 leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {card.front}
                </h3>
                <p className="text-xs text-indigo-400 mt-auto">{tl('tap_reveal')}</p>
              </div>
              {/* Back */}
              <div className="flashcard-face flashcard-back">
                <p className="text-sm text-gray-200 leading-relaxed">{card.back}</p>
                <p className="text-xs text-cyan-400 mt-auto">{tl('tap_flip_back')}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <motion.button whileTap={{ scale: 0.9 }} onClick={goPrev} disabled={current === 0}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 disabled:opacity-30 transition-all border-0 cursor-pointer hover:bg-white/10"
          style={{ background: 'rgba(255,255,255,0.05)' }}>
          <ChevronLeft size={20} />
        </motion.button>

        {/* Dots */}
        <div className="flex gap-1.5 flex-wrap justify-center max-w-xs">
          {cards.map((_, i) => (
            <motion.button key={i} onClick={() => { setFlipped(false); setCurrent(i) }}
              className="rounded-full transition-all border-0 cursor-pointer"
              animate={{ width: i === current ? 20 : 8, height: 8, background: i === current ? '#6366f1' : 'rgba(255,255,255,0.2)' }}
            />
          ))}
        </div>

        <motion.button whileTap={{ scale: 0.9 }} onClick={goNext} disabled={current === cards.length - 1}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 disabled:opacity-30 transition-all border-0 cursor-pointer hover:bg-white/10"
          style={{ background: 'rgba(255,255,255,0.05)' }}>
          <ChevronRight size={20} />
        </motion.button>
      </div>

      {/* Reset */}
      <div className="text-center">
        <button onClick={() => { setCurrent(0); setFlipped(false) }}
          className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1 mx-auto border-0 cursor-pointer transition-all"
          style={{ background: 'transparent' }}>
          <RotateCcw size={11} /> {tl('start_over')}
        </button>
      </div>
    </div>
  )
}
