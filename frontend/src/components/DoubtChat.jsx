import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Trash2, Sparkles, MessageSquare, Volume2, Mic, MicOff } from 'lucide-react'
import LanguageSelector from './LanguageSelector'
import { askDoubt, getDoubtHistory, clearDoubt, getChatSessions } from '../lib/api'
import { t } from '../lib/i18n'

const LOCAL_TRANSLATIONS = {
  en: {
    sug_simplest: "Explain this in the simplest way possible",
    sug_example: "Give me a real-life Indian example",
    sug_key_points: "What are the key points for my exam?",
    sug_importance: "Why is this concept important?",
    new_chat: "New Chat",
  },
  hi: {
    sug_simplest: "इसे यथासंभव सरल तरीके से समझाएं",
    sug_example: "मुझे एक वास्तविक भारतीय उदाहरण दें",
    sug_key_points: "मेरी परीक्षा के लिए मुख्य बिंदु क्या हैं?",
    sug_importance: "यह अवधारणा क्यों महत्वपूर्ण है?",
    new_chat: "नया चैट",
  },
  ta: {
    sug_simplest: "இதை முடிந்தவரை எளிய வழியில் விளக்குங்கள்",
    sug_example: "எனக்கு ஒரு நிஜ இந்திய உதாரணத்தைக் கொடுங்கள்",
    sug_key_points: "எனது தேர்விற்கான முக்கிய குறிப்புகள் யாவை?",
    sug_importance: "இந்த கருத்து ஏன் முக்கியமானது?",
    new_chat: "புதிய அரட்டை",
  },
  te: {
    sug_simplest: "దీనిని సాధ్యమైనంత సులభమైన పద్ధతిలో వివరించండి",
    sug_example: "నాకు నిజ జీవిత భారతీయ ఉదాహరణ ఇవ్వండి",
    sug_key_points: "నా పరీక్షకు ముఖ్యమైన పాయింట్లు ఏమిటి?",
    sug_importance: "ఈ భావన ఎందుకు ముఖ్యం?",
    new_chat: "కొత్త చాట్",
  },
  kn: {
    sug_simplest: "ಇದನ್ನು ಸಾಧ್ಯವಾದಷ್ಟು ಸರಳವಾಗಿ ವಿವರಿಸಿ",
    sug_example: "ನನಗೆ ಭಾರತೀಯ ದೈನಂದಿನ ಜೀವನದ ಉದಾಹರಣೆ ಕೊಡಿ",
    sug_key_points: "ನನ್ನ ಪರೀಕ್ಷೆಗೆ ಪ್ರಮುಖ ಅಂಶಗಳು ಯಾವುವು?",
    sug_importance: "ಈ ಪರಿಕಲ್ಪನೆಯು ಏಕೆ ಮುಖ್ಯವಾಗಿದೆ?",
    new_chat: "ಹೊಸ ಚಾಟ್",
  },
  ml: {
    sug_simplest: "ഇത് പരമാവധി ലളിതമായി വിശദീകരിക്കുക",
    sug_example: "എനിക്ക് ഒരു യഥാർത്ഥ ഇന്ത്യൻ ഉദാഹരണം നൽകുക",
    sug_key_points: "എന്റെ പരീക്ഷയ്ക്കുള്ള പ്രധാന പോയിന്റുകൾ എന്തൊക്കെയാണ്?",
    sug_importance: "ഈ ആശയം എന്തുകൊണ്ട് പ്രധാനമാണ്?",
    new_chat: "പുതിയ ചാറ്റ്",
  },
  mr: {
    sug_simplest: "हे शक्य तितक्या सोप्या पद्धतीने स्पष्ट करा",
    sug_example: "मला एक वास्तविक भारतीय उदाहरण द्या",
    sug_key_points: "माझ्या परीक्षेसाठी महत्त्वाचे मुद्दे कोणते आहेत?",
    sug_importance: "ही संकल्पना का महत्त्वाची आहे?",
    new_chat: "नवीन चॅट",
  },
  bn: {
    sug_simplest: "এটি যতটা সম্ভব সহজ উপায়ে ব্যাখ্যা করুন",
    sug_example: "আমাকে একটি বাস্তব ভারতীয় উদাহরণ দিন",
    sug_key_points: "আমার পরীক্ষার জন্য গুরুত্বপূর্ণ বিষয়গুলো কি কি?",
    sug_importance: "এই ধারণাটি কেন গুরুত্বপূর্ণ?",
    new_chat: "নতুন চ্যাট",
  },
  gu: {
    sug_simplest: "આને શક્ય તેટલી સરળ રીતે સમજાવો",
    sug_example: "મને એક વાસ્તવિક ભારતીય આપો",
    sug_key_points: "મારી પરીક્ષા માટેના મહત્વના મુદ્દાઓ કયા છે?",
    sug_importance: "આ ખ્યાલ શા માટે મહત્વપૂર્ણ છે?",
    new_chat: "નવો ચેટ",
  },
  pa: {
    sug_simplest: "ਇਸਨੂੰ ਜਿੰਨਾ ਹੋ ਸਕੇ ਸਰਲ ਤਰੀਕੇ ਨਾਲ ਸਮਝਾਓ",
    sug_example: "ਮੈਨੂੰ ਇੱਕ ਅਸਲੀ ਭਾਰਤੀ ਉਦਾਹਰਣ ਦਿਓ",
    sug_key_points: "ਮੇਰੀ ਪ੍ਰੀਖਿਆ ਲਈ ਮੁੱਖ ਨੁਕਤੇ ਕੀ ਹਨ?",
    sug_importance: "ਇਹ ਸੰਕਲਪ ਕਿਉਂ ਮਹੱਤਵਪੂਰਨ ਹੈ?",
    new_chat: "ਨਵੀਂ ਚੈਟ",
  },
  or: {
    sug_simplest: "ଏହାକୁ ଯଥାସମ୍ଭବ ସରଳ ଶବ୍ଦରେ ବୁଝାନ୍ତୁ",
    sug_example: "ମୋତେ ଏକ ବାସ୍ତବିକ ଭାରତୀୟ ଉଦାହରଣ ଦିଅନ୍ତୁ",
    sug_key_points: "ମୋର ପରୀକ୍ଷା ପାଇଁ ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ବିଷୟଗୁଡ଼ିକ କଣ?",
    sug_importance: "ଏହି ଧାରଣାଟି କାହିଁକି ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ?",
  },
  ur: {
    sug_simplest: "اسے جتنا ممکن ہو آسان طریقے سے سمجھائیں",
    sug_example: "مجھے ایک حقیقی ہندوستانی مثال دیں",
    sug_key_points: "میرے امتحان کے لیے اہم نکات کیا ہیں؟",
    sug_importance: "یہ تصور کیوں اہم ہے؟",
  },
  as: {
    sug_simplest: "এইটো যিমান পাৰি সহজকৈ বুজাই দিয়ক",
    sug_example: "মোক এটা বাস্তৱ ভাৰতীয় উদাহৰণ দিয়ক",
    sug_key_points: "মোৰ পৰীক্ষাৰ বাবে গুৰুত্বপূৰ্ণ বিষয়সমূহ কি কি?",
    sug_importance: "এই ধাৰণাটো কিয় গুৰুত্বপূৰ্ণ?",
  },
  ne: {
    sug_simplest: "यसलाई सकेसम्म सरल रूपमा व्याख्या गर्नुहोस्",
    sug_example: "मलाई एक वास्तविक भारतीय उदाहरण दिनुहोस्",
    sug_key_points: "मेरो परीक्षाको लागि मुख्य बुँदाहरू के हुन्?",
    sug_importance: "यो अवधारणा किन महत्त्वपूर्ण छ?",
  },
  mai: {
    sug_simplest: "एकरा यथासंभव सरल तरीका सँ समझाउ",
    sug_example: "हमरा एकटा वास्तविक भारतीय उदाहरण दिय",
    sug_key_points: "हमर परीक्षाक लेल मुख्य बिंदु की सब अछि?",
    sug_importance: "ई अवधारणा कीअक महत्वपूर्ण अछि?",
  },
  kok: {
    sug_simplest: "हें शक्य तितल्या सोंप्या पद्धतीन बुझयात",
    sug_example: "म्हाका एक खरें भारतीय देखीक दयात",
    sug_key_points: "म्हज्या परिक्षे खातीर महत्वाचे मुद्दे खंयचे?",
    sug_importance: "ही संकल्पना कित्याक म्हत्वाची?",
  },
  doi: {
    sug_simplest: "यसगी जिन्ना होई सकै आसान तरीकै कन्नै समझाओ",
    sug_example: "मीगी कोई असली भारतीय मिसाल देओ",
    sug_key_points: "मेरी परीक्षा लेई खास गल्लां केहड़ियाँ न?",
    sug_importance: "एह संकल्प केहड़े कारण कन्ने जरूरी ऐ?",
  },
  mni: {
    sug_simplest: "অসি খ্বাইদগী লাইনা শন্দোক্না তাকউ",
    sug_example: "ঐঙোন্দা ভারতকী অশেংবা খুদম অমা পীবিয়ু",
    sug_key_points: "ঐগী পরিক্ষাগীদমক মরুওইবা ৱাফমশিং করি করি নো?",
    sug_importance: "ৱাখল্লোন অসি করিগীদমক মরুওইবনো?",
  },
  san: {
    sug_simplest: "एतत् यथासम्भवं सरलतमा रीत्या बोधयन्तु",
    sug_example: "मह्यं वास्तविकं भारतीयमुदाहरणं यच्छन्तु",
    sug_key_points: "मम परीक्षायाः कृते मुख्याः बिन्दवः के सन्ति?",
    sug_importance: "इयमवधारणा किमर्थं महती वर्तते?",
  }
};

const SUGGESTIONS = [
  { icon: '✨', key: 'sug_simplest' },
  { icon: '🇮🇳', key: 'sug_example' },
  { icon: '📝', key: 'sug_key_points' },
  { icon: '🔍', key: 'sug_importance' },
]

function formatChatMessage(text) {
  if (!text) return null
  const paragraphs = text.split(/\n\n+/)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {paragraphs.map((para, idx) => {
        const lines = para.split('\n')
        const isList = lines.length > 1 && lines.every(line =>
          line.trim().startsWith('-') || line.trim().startsWith('*') || /^\d+\./.test(line.trim())
        )

        if (isList) {
          return (
            <ul key={idx} style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {lines.map((line, lIdx) => {
                const cleanLine = line.replace(/^[-*\u2022]\s*|^\d+\.\s*/, '').trim()
                const boldParts = cleanLine.split(/(\*\*.*?\*\*)/g)
                return (
                  <li key={lIdx} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, lineHeight: 1.85, color: 'rgba(255,255,255,0.88)' }}>
                    <span style={{ color: '#818cf8', fontWeight: 900, fontSize: 18, lineHeight: 1.2, flexShrink: 0, marginTop: 1 }}>•</span>
                    <span>
                      {boldParts.map((part, pIdx) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return <strong key={pIdx} style={{ color: '#a5b4fc', fontWeight: 700 }}>{part.slice(2, -2)}</strong>
                        }
                        return part
                      })}
                    </span>
                  </li>
                )
              })}
            </ul>
          )
        }

        const boldParts = para.split(/(\*\*.*?\*\*)/g)
        return (
          <p key={idx} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, lineHeight: 1.9, color: 'rgba(255,255,255,0.88)', margin: 0 }}>
            {boldParts.map((part, pIdx) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={pIdx} style={{ color: '#a5b4fc', fontWeight: 700 }}>{part.slice(2, -2)}</strong>
              }
              return part
            })}
          </p>
        )
      })}
    </div>
  )
}

export default function DoubtChat({ context = '', language, onLanguageChange, pageId, userId }) {
  const tl = (key) => {
    if (key === 'new_chat') {
      const chatTrans = {
        en: "New Chat", hi: "नया चैट", ta: "புதிய அரட்டை", te: "కొత్త చాట్",
        kn: "ಹೊಸ ಚಾಟ್", ml: "പുതിയ ചാറ്റ്", mr: "नवीन चॅट", bn: "নতুন চ্যাট",
        gu: "નવો ચેટ", pa: "ਨਵਾਂ ਚੈਟ", or: "ନୂତନ ଚାଟ୍", ur: "نیا چیٹ",
        as: "নতুন চ্যাট", ne: "नयाँ च्याट", mai: "नया चैट", kok: "नवे चॅट",
        doi: "नवा चैट", mni: "অনৌবা চ্যাট", san: "नूतन सम्भाषणम्"
      }
      return chatTrans[language] || chatTrans['en']
    }
    if (key === 'is_writing') {
      const writingTrans = {
        en: "is writing...",
        hi: "लिख रहा है...",
        ta: "எழுதுகிறது...",
        te: "రాస్తోంది...",
        kn: "ಬರೆಯುತ್ತಿದೆ...",
        ml: "എഴുതുന്നു...",
        mr: "लिहीत आहे...",
        bn: "লিখছে...",
        gu: "લખી રહ્યું છે...",
        pa: "ਲਿਖ ਰਿਹਾ ਹੈ...",
        or: "ଲେଖୁଛି...",
        ur: "لکھ رہا ہے...",
        as: "লিখি আছে...",
        ne: "लेख्दैछ...",
        mai: "लिखि रहल अछि...",
        kok: "बरयता...",
        doi: "लिखा करदा ऐ...",
        mni: "ইরি...",
        san: "लिखति..."
      }
      return writingTrans[language] || writingTrans['en']
    }
    return LOCAL_TRANSLATIONS[language]?.[key] || LOCAL_TRANSLATIONS['en']?.[key] || key
  }
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const [activeSessionId, setActiveSessionId] = useState(null)
  const [chatSessions, setChatSessions] = useState([])
  const [isListening, setIsListening] = useState(false)
  const [playingMessageId, setPlayingMessageId] = useState(null)
  const recognitionRef = useRef(null)
  const audioRef = useRef(null)
  const bottomRef = useRef()

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      const rec = new SpeechRecognition()
      rec.continuous = true
      rec.interimResults = true
      rec.lang = language === 'hi' ? 'hi-IN' : language === 'ta' ? 'ta-IN' : language === 'te' ? 'te-IN' : 'en-IN'
      
      rec.onresult = (event) => {
        let transcript = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript
        }
        setInput(transcript)
      }
      
      rec.onend = () => {
        setIsListening(false)
      }
      
      recognitionRef.current = rec
    }
  }, [language])

  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause()
      if (recognitionRef.current) recognitionRef.current.stop()
    }
  }, [])

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please try Google Chrome or Microsoft Edge.")
      return
    }
    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  const handlePlaySpeech = async (msg) => {
    if (playingMessageId === msg.id) {
      if (audioRef.current) {
        audioRef.current.pause()
      }
      setPlayingMessageId(null)
      return
    }
    
    setPlayingMessageId(msg.id)
    try {
      const token = localStorage.getItem('ncert_token')
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8082'}/audio/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          text: msg.content,
          language: language
        })
      })
      if (!response.ok) throw new Error("Audio generation failed")
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      
      if (audioRef.current) {
        audioRef.current.pause()
      }
      
      const audio = new Audio(url)
      audio.onended = () => {
        setPlayingMessageId(null)
      }
      audio.onerror = () => {
        setPlayingMessageId(null)
      }
      audioRef.current = audio
      audio.play()
    } catch (e) {
      console.error("Failed to play audio:", e)
      setPlayingMessageId(null)
    }
  }

  const currentSessionId = activeSessionId || (pageId ? `${userId}_${pageId}` : null) || sessionId || 'default_session'

  const fetchSessions = async () => {
    try {
      const res = await getChatSessions(userId)
      if (res && res.sessions) {
        setChatSessions(res.sessions)
      }
    } catch (e) {
      console.error('Failed to fetch chat sessions:', e)
    }
  }

  useEffect(() => {
    if (userId) {
      fetchSessions()
    }
  }, [userId, messages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (!currentSessionId) {
      setMessages([])
      return
    }
    const loadHistory = async () => {
      try {
        const historyRes = await getDoubtHistory(currentSessionId, context, userId, pageId)
        if (historyRes && historyRes.history) {
          setMessages(historyRes.history)
        } else {
          setMessages([])
        }
      } catch (err) {
        console.error('Failed to load chat history:', err)
        setMessages([])
      }
    }
    loadHistory()
  }, [currentSessionId])

  const sendMessage = async (question) => {
    const q = question || input.trim()
    if (!q || loading) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: q, id: Date.now() }])
    setLoading(true)
    try {
      const res = await askDoubt(q, context, language, currentSessionId, userId, pageId)
      if (!pageId && !activeSessionId) {
        setSessionId(res.session_id)
        setActiveSessionId(res.session_id)
      }
      setMessages(prev => [...prev, { role: 'assistant', content: res.answer, id: Date.now() + 1 }])
      setTimeout(fetchSessions, 1000)
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Could not get a response. Please check your connection.', id: Date.now() + 1, error: true }])
    }
    setLoading(false)
  }

  const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }
  
  const handleStartNewChat = () => {
    const newId = 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
    setMessages([])
    setSessionId(newId)
    setActiveSessionId(newId)
  }

  const handleDeleteSession = async (sId) => {
    if (!window.confirm("Are you sure you want to delete this chat session?")) return
    try {
      await clearDoubt(sId)
      if (currentSessionId === sId) {
        setMessages([])
        setSessionId(null)
        setActiveSessionId(null)
      }
      fetchSessions()
    } catch (e) {
      console.error('Failed to delete chat session:', e)
    }
  }

  const clearChat = async () => {
    setMessages([])
    try {
      await clearDoubt(currentSessionId)
      fetchSessions()
    } catch (e) {
      console.error('Failed to clear doubt session:', e)
    }
    if (!pageId) {
      setSessionId(null)
      setActiveSessionId(null)
    }
  }

  return (
    <div style={{
      background: 'rgba(12,10,24,0.72)',
      backdropFilter: 'blur(28px)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 24,
      display: 'flex',
      height: 'calc(100vh - 180px)',
      minHeight: 480,
      overflow: 'hidden',
    }}>

      {/* ── CHATGPT-STYLE SIDEBAR ── */}
      <div style={{
        width: 240,
        background: 'rgba(10, 8, 20, 0.45)',
        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        padding: '16px 12px',
        gap: 16
      }}>
        {/* New Chat Button */}
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={handleStartNewChat}
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: 12,
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            color: '#c4b5fd',
            fontSize: 13.5,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            fontFamily: "'Outfit', sans-serif"
          }}>
          <span>➕</span> {tl('new_chat')}
        </motion.button>

        {/* Sessions list */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {chatSessions.map(session => {
            const isActive = currentSessionId === session.sessionId
            return (
              <div key={session.sessionId}
                onClick={() => {
                  setActiveSessionId(session.sessionId)
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: 10,
                  cursor: 'pointer',
                  background: isActive ? 'rgba(99, 102, 241, 0.14)' : 'transparent',
                  border: isActive ? '1px solid rgba(99, 102, 241, 0.25)' : '1px solid transparent',
                  transition: 'all 0.2s',
                  color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.6)',
                }}>
                <div style={{
                  fontSize: 12.5,
                  fontWeight: isActive ? 700 : 500,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: 160,
                  fontFamily: "'Plus Jakarta Sans', sans-serif"
                }}>
                  💬 {session.title && session.title !== 'New Chat' ? session.title : (session.pageId ? `Page: ${session.pageId.split('-p').slice(-1)[0] || '1'}` : 'Chat Session')}
                </div>
                
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteSession(session.sessionId)
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(239, 68, 68, 0.5)',
                    cursor: 'pointer',
                    padding: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                  <Trash2 size={13} />
                </motion.button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Right chat panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', minWidth: 0 }}>

        {/* ── HEADER ── */}
      <div style={{
        padding: '18px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
        background: 'rgba(255,255,255,0.015)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 14, flexShrink: 0,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
            animation: 'pulse 3s ease-in-out infinite',
          }}>
            <Bot size={20} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 16, color: '#f0eeff', marginBottom: 3 }}>NCERT AI</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: '#4ade80', fontWeight: 600 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', display: 'inline-block', animation: 'ping 1.5s cubic-bezier(0,0,0.2,1) infinite' }} />
              Online
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <LanguageSelector value={language} onChange={onLanguageChange} compact />
          {messages.length > 0 && (
            <motion.button whileTap={{ scale: 0.9 }} onClick={clearChat}
              style={{
                width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)',
                color: 'rgba(239,68,68,0.6)', cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#f87171' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.06)'; e.currentTarget.style.color = 'rgba(239,68,68,0.6)' }}>
              <Trash2 size={15} />
            </motion.button>
          )}
        </div>
      </div>

      {/* ── MESSAGES ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 32px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>

          {/* Empty state */}
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 32, paddingBottom: 16, gap: 28 }}
            >
              {/* Bot avatar */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  width: 88, height: 88, borderRadius: 26,
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.18), rgba(139,92,246,0.18))',
                  border: '1px solid rgba(99,102,241,0.35)',
                  boxShadow: '0 0 40px rgba(99,102,241,0.18)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                <Bot size={38} color="#818cf8" />
              </motion.div>

              {/* Greeting text */}
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 22, color: '#f0eeff', margin: '0 0 10px' }}>
                  {t(language, 'ask_me_anything')}
                </p>
                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14.5, lineHeight: 1.75, color: 'rgba(255,255,255,0.38)', margin: 0, maxWidth: 340 }}>
                  {t(language, 'understand_context')}
                </p>
              </div>

              {/* Suggestion chips — single column for readability */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 480 }}>
                {SUGGESTIONS.map((s, i) => {
                  const translatedText = tl(s.key)
                  return (
                    <motion.button key={s.key}
                      initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                      whileHover={{ x: 4, borderColor: 'rgba(99,102,241,0.4)', background: 'rgba(99,102,241,0.07)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => sendMessage(translatedText)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 14,
                        padding: '14px 20px', borderRadius: 16, textAlign: 'left',
                        background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)',
                        cursor: 'pointer', transition: 'all 0.2s',
                      }}>
                      <span style={{ fontSize: 18, flexShrink: 0 }}>{s.icon}</span>
                      <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14.5, color: 'rgba(255,255,255,0.65)', fontWeight: 500, lineHeight: 1.5 }}>{translatedText}</span>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Messages */}
          <AnimatePresence>
            {messages.map(msg => (
              <motion.div key={msg.id}
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                style={{ display: 'flex', gap: 14, flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-start' }}
              >
                {/* Avatar */}
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', flexShrink: 0, marginTop: 2,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: msg.role === 'user' ? '#6366f1' : 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                  boxShadow: msg.role === 'user' ? '0 0 14px rgba(99,102,241,0.3)' : '0 0 14px rgba(124,58,237,0.3)',
                }}>
                  {msg.role === 'user' ? <User size={15} color="#fff" /> : <Bot size={15} color="#fff" />}
                </div>

                {/* Bubble */}
                <div style={{
                  maxWidth: '78%',
                  padding: msg.role === 'user' ? '14px 20px' : '18px 24px',
                  borderRadius: msg.role === 'user' ? '20px 4px 20px 20px' : '4px 20px 20px 20px',
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                    : msg.error ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.03)',
                  border: msg.role !== 'user' ? `1px solid ${msg.error ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.08)'}` : undefined,
                  boxShadow: msg.role === 'user' ? '0 6px 24px rgba(99,102,241,0.25)' : undefined,
                }}>
                  {msg.role === 'user' ? (
                    <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, lineHeight: 1.85, margin: 0, color: '#fff' }}>{msg.content}</p>
                  ) : (
                    <div>
                      {formatChatMessage(msg.content)}
                      {!msg.error && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handlePlaySpeech(msg)}
                            style={{
                              background: 'transparent', border: 'none',
                              color: playingMessageId === msg.id ? '#67e8f9' : 'rgba(255,255,255,0.4)',
                              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12,
                            }}
                          >
                            <Volume2 size={14} />
                            {playingMessageId === msg.id ? 'Playing...' : 'Read Aloud'}
                          </motion.button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing mascot */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
                style={{ display: 'flex', alignItems: 'flex-end', gap: 14 }}
              >
                <div style={{ position: 'relative', width: 70, height: 85 }}>
                  <div style={{ position: 'absolute', bottom: -5, left: '50%', transform: 'translateX(-50%)', width: 45, height: 12, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(99,102,241,0.4), transparent 70%)', filter: 'blur(3px)' }} />
                  <svg width="70" height="85" viewBox="0 0 70 85" style={{ display: 'block' }}>
                    <line x1="35" y1="6" x2="35" y2="15" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="35" cy="5" r="3" fill="#c4b5fd" className="animate-pulse" />
                    <rect x="15" y="15" width="40" height="30" rx="10" fill="url(#miniHeadGrad2)" stroke="rgba(99,102,241,0.5)" strokeWidth="1" />
                    <circle cx="27" cy="28" r="6" fill="#0d0b1e" />
                    <circle cx="27" cy="28" r="2.5" fill="#818cf8" />
                    <circle cx="43" cy="28" r="6" fill="#0d0b1e" />
                    <circle cx="43" cy="28" r="2.5" fill="#818cf8" />
                    <rect x="27" y="38" width="16" height="2" rx="1" fill="rgba(99,102,241,0.6)" />
                    <rect x="31" y="45" width="8" height="6" rx="2" fill="url(#miniBodyGrad2)" />
                    <rect x="12" y="51" width="46" height="26" rx="11" fill="url(#miniBodyGrad2)" stroke="rgba(99,102,241,0.4)" strokeWidth="1" />
                    <rect x="23" y="57" width="24" height="12" rx="4" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.3)" strokeWidth="0.8" />
                    <circle cx="35" cy="63" r="3.5" fill="#818cf8" />
                    <rect x="4" y="53" width="7" height="18" rx="3.5" fill="url(#miniBodyGrad2)" />
                    <g style={{ transformOrigin: '59px 56px', animation: 'miniWave 1.2s ease-in-out infinite alternate' }}>
                      <rect x="59" y="47" width="7" height="18" rx="3.5" fill="url(#miniBodyGrad2)" />
                    </g>
                    <defs>
                      <linearGradient id="miniHeadGrad2" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#3730a3" />
                        <stop offset="100%" stopColor="#1e1b4b" />
                      </linearGradient>
                      <linearGradient id="miniBodyGrad2" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#312e81" />
                        <stop offset="100%" stopColor="#1e1b4b" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <style>{`@keyframes miniWave { 0% { transform: rotate(0deg); } 100% { transform: rotate(-35deg); } }`}</style>
                </div>

                <div style={{ position: 'relative', marginBottom: 24 }}>
                  <div style={{ position: 'absolute', bottom: -5, left: 16, width: 10, height: 10, background: 'rgba(18,16,35,0.95)', borderLeft: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)', transform: 'rotate(45deg)', zIndex: 1 }} />
                  <div style={{ background: 'rgba(18,16,35,0.95)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '16px 16px 16px 4px', padding: '14px 20px', minWidth: 170, position: 'relative', zIndex: 2 }}>
                    <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 10, letterSpacing: '0.12em', color: '#818cf8', marginBottom: 8, textTransform: 'uppercase' }}>NCERT AI</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{tl('is_writing')}</span>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <span className="typing-dot" style={{ background: '#818cf8', width: 6, height: 6, borderRadius: '50%' }} />
                        <span className="typing-dot" style={{ background: '#818cf8', width: 6, height: 6, borderRadius: '50%' }} />
                        <span className="typing-dot" style={{ background: '#818cf8', width: 6, height: 6, borderRadius: '50%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={bottomRef} />
        </div>
      </div>

      {/* ── INPUT ── */}
      <div style={{ padding: '16px 24px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <div style={{
            display: 'flex', gap: 12, alignItems: 'flex-end',
            background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: 18, padding: '10px 10px 10px 20px',
            transition: 'all 0.3s',
          }}
            onFocus={() => {}}
          >
            <textarea
              rows={1}
              placeholder={t(language, 'type_doubt')}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              style={{
                background: 'transparent', border: 'none', outline: 'none',
                color: '#f0eeff', flex: 1, resize: 'none',
                fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, lineHeight: 1.7,
                minHeight: 42, maxHeight: 140, paddingTop: 8, paddingBottom: 8,
              }}
            />
            <motion.button
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.93 }}
              onClick={toggleListening}
              style={{
                width: 44, height: 44, borderRadius: 14, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isListening ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${isListening ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
                color: isListening ? '#ef4444' : '#a5b4fc',
                cursor: 'pointer',
              }}
            >
              {isListening ? <MicOff size={17} /> : <Mic size={17} />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.07, boxShadow: '0 6px 24px rgba(99,102,241,0.45)' }}
              whileTap={{ scale: 0.93 }}
              disabled={!input.trim() || loading}
              onClick={() => sendMessage()}
              style={{
                width: 44, height: 44, borderRadius: 14, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 18px rgba(99,102,241,0.3)',
                opacity: !input.trim() || loading ? 0.4 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              <Send size={17} color="#fff" />
            </motion.button>
          </div>
          <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.2)', marginTop: 8, textAlign: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {t(language, 'press_enter')}
          </p>
        </div>
      </div>
      </div>
    </div>
  )
}
