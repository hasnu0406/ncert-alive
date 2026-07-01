import { motion } from 'framer-motion'
import { Trophy, Flame } from 'lucide-react'

const RANK_COLORS = ['#fbbf24', '#94a3b8', '#b45309']
const RANK_ICONS = ['🥇', '🥈', '🥉']

import { t } from '../lib/i18n'

const LOCAL_TRANSLATIONS = {
  en: {
    top_students: "Top Students",
    live_ranking: "Live Ranking",
    you: "YOU",
    no_rankings_yet: "No rankings yet",
    complete_quizzes_lb: "Complete quizzes to earn XP points and appear on the leaderboard! 🎯",
  },
  hi: {
    top_students: "शीर्ष छात्र",
    live_ranking: "लाइव रैंकिंग",
    you: "आप",
    no_rankings_yet: "अभी तक कोई रैंकिंग नहीं",
    complete_quizzes_lb: "लीडरबोर्ड पर आने और XP अंक अर्जित करने के लिए क्विज़ पूरा करें! 🎯",
  },
  ta: {
    top_students: "சிறந்த மாணவர்கள்",
    live_ranking: "நேரடி தரவரிசை",
    you: "நீங்கள்",
    no_rankings_yet: "இன்னும் தரவரிசைகள் இல்லை",
    complete_quizzes_lb: "லீடர்போர்டில் தோன்றவும், XP புள்ளிகளைப் பெறவும் வினாடி வினாக்களை முடிக்கவும்! 🎯",
  },
  te: {
    top_students: "టాప్ విద్యార్థులు",
    live_ranking: "లైవ్ ర్యాంకింగ్",
    you: "మీరు",
    no_rankings_yet: "ఇంకా ర్యాంకింగ్‌లు లేవు",
    complete_quizzes_lb: "లీడర్‌బోర్డ్‌లో కనిపించడానికి మరియు XP పాయింట్లను సంపాదించడానికి క్విజ్‌లను పూర్తి చేయండి! 🎯",
  },
  kn: {
    top_students: "ಉನ್ನತ ವಿದ್ಯಾರ್ಥಿಗಳು",
    live_ranking: "ಲೈವ್ ಶ್ರೇಯಾಂಕ",
    you: "ನೀವು",
    no_rankings_yet: "ಇನ್ನೂ ಯಾವುದೇ ಶ್ರೇಯಾಂಕಗಳಿಲ್ಲ",
    complete_quizzes_lb: "ಲೀಡರ್‌ಬೋರ್ಡ್‌ನಲ್ಲಿ ಕಾಣಿಸಿಕೊಳ್ಳಲು MS ಅಂಕಗಳನ್ನು ಗಳಿಸಲು ಕ್ವಿಜ್‌ಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ! 🎯",
  },
  ml: {
    top_students: "മികച്ച വിദ്യാർത്ഥികൾ",
    live_ranking: "തത്സമയ റാങ്കിംഗ്",
    you: "നിങ്ങൾ",
    no_rankings_yet: "റാങ്കിംഗുകൾ ലഭ്യമല്ല",
    complete_quizzes_lb: "ലീഡർബോർഡിൽ പ്രത്യക്ഷപ്പെടാനും XP പോയിന്റുകൾ നേടാനും ക്വിസ് പൂർത്തിയാക്കുക! 🎯",
  },
  mr: {
    top_students: "अव्वल विद्यार्थी",
    live_ranking: "थेट रँकिंग",
    you: "तुम्ही",
    no_rankings_yet: "अद्याप कोणतेही रँकिंग नाही",
    complete_quizzes_lb: "लीडरबोर्डवर येण्यासाठी आणि XP गुण मिळवण्यासाठी क्विझ पूर्ण करा! 🎯",
  },
  bn: {
    top_students: "শীর্ষ শিক্ষার্থী",
    live_ranking: "লাইভ র্যাঙ্কিং",
    you: "আপনি",
    no_rankings_yet: "এখনও কোনো র্যাঙ্কিং নেই",
    complete_quizzes_lb: "লিডারবোর্ডে উপস্থিত হতে এবং XP পয়েন্ট অর্জন করতে কুইজ সম্পূর্ণ করুন! 🎯",
  },
  gu: {
    top_students: "ટોચના વિદ્યાર્થીઓ",
    live_ranking: "લાઇવ રેન્કિંગ",
    you: "તમે",
    no_rankings_yet: "હજી સુધી કોઈ રેન્કિંગ નથી",
    complete_quizzes_lb: "લીડરબોર્ડ પર દેખાવા અને XP પોઇન્ટ મેળવવા માટે ક્વિઝ પૂર્ણ કરો! 🎯",
  },
  pa: {
    top_students: "ਚੋਟੀ ਦੇ ਵਿਦਿਆਰਥੀ",
    live_ranking: "ਲਾਈਵ ਰੈਂਕਿੰਗ",
    you: "ਤੁਸੀਂ",
    no_rankings_yet: "ਅਜੇ ਤੱਕ ਕੋਈ ਰੈਂਕਿੰਗ ਨਹੀਂ",
    complete_quizzes_lb: "ਲੀਡਰਬੋਰਡ ਤੇ ਆਉਣ ਅਤੇ XP ਅੰਕ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ ਕਵਿਜ਼ ਪੂਰੇ ਕਰੋ! 🎯",
  },
  or: {
    top_students: "ସର୍ବୋଚ୍ଚ ସ୍ଥାନରେ ଥିବା ଛାତ୍ରଛାତ୍ରୀ",
    live_ranking: "ଲାଇଭ୍ ମାନ୍ୟତା",
    you: "ଆପଣ",
    no_rankings_yet: "ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ମାନ୍ୟତା ମିଳିନାହିଁ",
    complete_quizzes_lb: "ଲିଡରବୋର୍ଡରେ ଦେଖାଯିବା ଏବଂ XP ପଏଣ୍ଟ୍ ଅର୍ଜନ କରିବାକୁ କ୍ୱିଜ୍ ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ! 🎯",
  },
  ur: {
    top_students: "ٹاپ طلباء",
    live_ranking: "لائیو درجہ بندی",
    you: "آپ",
    no_rankings_yet: "ابھی تک کوئی درجہ بندی نہیں",
    complete_quizzes_lb: "لیڈر بورڈ پر آنے اور XP پوائنٹس حاصل کرنے کے لیے کوئز مکمل کریں! 🎯",
  },
  as: {
    top_students: "শীৰ্ষ শিক্ষাৰ্থীসকল",
    live_ranking: "লাইভ ৰেংকিং",
    you: "আপুনি",
    no_rankings_yet: "এতিয়ালৈকে কোনো ৰেংকিং হোৱা নাই",
    complete_quizzes_lb: "লীডাৰবোৰ্ডত স্থান পাবলৈ আৰু XP পইণ্ট অৰ্জন কৰিবলৈ কুইজ সম্পূৰ্ণ কৰক! 🎯",
  },
  ne: {
    top_students: "शीर्ष विद्यार्थीहरू",
    live_ranking: "प्रत्यक्ष रैंकिंग",
    you: "तपाईं",
    no_rankings_yet: "अहिलेसम्म कुनै रैंकिंग छैन",
    complete_quizzes_lb: "लीडरबोर्डमा आउन र XP अंक प्राप्त गर्न क्विज पूरा गर्नुहोस्! 🎯",
  },
  mai: {
    top_students: "शीर्ष विद्यार्थी",
    live_ranking: "लाइव रैंकिंग",
    you: "तहाँ",
    no_rankings_yet: "एखन धरि कोनो रैंकिंग नै",
    complete_quizzes_lb: "लीडरबोर्ड पर आबय लेल आ XP अंक प्राप्त करय लेल क्विज पूरा करू! 🎯",
  },
  kok: {
    top_students: "उंचेल विद्यार्थी",
    live_ranking: "थेट रँकिंग",
    you: "तुमी",
    no_rankings_yet: "अजून कसलेंच रँकिंग ना",
    complete_quizzes_lb: "लीडरबोर्डाचेर येवपाक आनी XP मेळोवपाक क्विज पुराय करात! 🎯",
  },
  doi: {
    top_students: "उत्तम विद्यार्थी",
    live_ranking: "लाइव रैंकिंग",
    you: "तुस",
    no_rankings_yet: "हले तगर कोई रैंकिंग नहीं",
    complete_quizzes_lb: "लीडरबोर्ड पर औने ते XP अंक हासल करने लेई क्विज पूरा करो! 🎯",
  },
  mni: {
    top_students: "খ্বাইদগী ফবা মহৈরোইশিং",
    live_ranking: "লাইভ রেঙ্কিং",
    you: "নহাক",
    no_rankings_yet: "হौजিক ফাওবা অমত্তা লৈত্রি",
    complete_quizzes_lb: "লিডারবোর্দতা থাদোক্নবা অমসুং XP তানবা কুইজ লোইশিনৌ! 🎯",
  },
  san: {
    top_students: "श्रेष्ठाः छात्राः",
    live_ranking: "सद्यः श्रेणीनिर्धारणम्",
    you: "भवान्",
    no_rankings_yet: "अद्यापि श्रेणीनिर्धारणं नास्ति",
    complete_quizzes_lb: "श्रेणीसूच्यां प्रवेशार्थं XP अङ्कार्जनार्थं च प्रश्नोत्तरीं पूरयन्तु! 🎯",
  }
};

export default function Leaderboard({ entries = [], currentUserId, language = 'en' }) {
  const tl = (key) => LOCAL_TRANSLATIONS[language]?.[key] || LOCAL_TRANSLATIONS['en']?.[key] || key

  if (!entries.length) {
    return (
      <div style={{
        background: 'rgba(14,12,27,0.7)', backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24,
        padding: '64px 40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
      }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Trophy size={32} style={{ color: '#fbbf24', opacity: 0.5 }} />
        </div>
        <div>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 18, color: '#f8f7ff', marginBottom: 8 }}>{tl('no_rankings_yet')}</p>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: 'rgba(255,255,255,0.35)', maxWidth: 280, margin: '0 auto', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{tl('complete_quizzes_lb')}</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      background: 'rgba(14,12,27,0.7)', backdropFilter: 'blur(24px)',
      border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '22px 28px', borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: 'linear-gradient(135deg, rgba(251,191,36,0.08), rgba(99,102,241,0.08))',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <Trophy size={20} style={{ color: '#fbbf24' }} />
        <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 16, color: '#fff', margin: 0 }}>{tl('top_students')}</h3>
        <span style={{
          marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 12px', borderRadius: 100,
          background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)',
          fontSize: 11, fontWeight: 700, color: '#fcd34d', fontFamily: "'Outfit', sans-serif",
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fcd34d', display: 'inline-block', animation: 'flicker 1s infinite' }} />
          {tl('live_ranking')}
        </span>
      </div>

      {/* Entries */}
      <div>
        {entries.map((entry, i) => {
          const isCurrentUser = entry.id === currentUserId
          return (
            <motion.div key={entry._id || i}
              initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 18,
                padding: '20px 28px',
                borderBottom: i < entries.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                background: isCurrentUser ? 'rgba(99,102,241,0.07)' : 'transparent',
                transition: 'background 0.2s',
              }}
              whileHover={{ background: isCurrentUser ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.02)' }}
            >
              {/* Rank */}
              <div style={{ width: 36, textAlign: 'center', flexShrink: 0 }}>
                {i < 3
                  ? <span style={{ fontSize: 22 }}>{RANK_ICONS[i]}</span>
                  : <span style={{ fontSize: 15, fontWeight: 800, color: 'rgba(255,255,255,0.3)', fontFamily: "'Outfit', sans-serif" }}>#{i + 1}</span>
                }
              </div>

              {/* Avatar */}
              <div style={{
                width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, fontWeight: 800, color: '#fff',
                background: i < 3 ? `linear-gradient(135deg, ${RANK_COLORS[i]}, ${RANK_COLORS[i]}88)` : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                boxShadow: i < 3 ? `0 0 14px ${RANK_COLORS[i]}44` : '0 0 10px rgba(99,102,241,0.3)',
              }}>
                {entry.name?.[0]?.toUpperCase() || '?'}
              </div>

              {/* Name + class */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#fff', fontFamily: "'Plus Jakarta Sans', sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {entry.name}
                  </span>
                  {isCurrentUser && (
                    <span style={{
                      fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 100,
                      background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)', color: '#67e8f9',
                      fontFamily: "'Outfit', sans-serif", flexShrink: 0,
                    }}>{tl('you')}</span>
                  )}
                </div>
                {entry.class && (
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t(language, 'class_label') || 'Class'} {entry.class}</div>
                )}
              </div>

              {/* Streak + Points */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', fontFamily: "'Outfit', sans-serif", marginBottom: 4 }}>
                  {entry.points?.toLocaleString() || 0}
                  <span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.3)', marginLeft: 4 }}>XP</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', color: '#fb923c', fontSize: 12 }}>
                  <span className="flame">🔥</span>
                  <span style={{ fontWeight: 700 }}>{entry.streakCount || 0}d</span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
