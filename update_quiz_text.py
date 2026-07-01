import re

translations = {
    'en': "Generating quiz questions...",
    'hi': "क्विज़ प्रश्न उत्पन्न किए जा रहे हैं...",
    'ta': "வினாடி வினா கேள்விகள் உருவாக்கப்படுகின்றன...",
    'te': "క్విజ్ ప్రశ్నలు రూపొందించబడుతున్నాయి...",
    'kn': "ರಸಪ್ರಶ್ನೆ ಪ್ರಶ್ನೆಗಳನ್ನು ರಚಿಸಲಾಗುತ್ತಿದೆ...",
    'ml': "ക്വിസ് ചോദ്യങ്ങൾ സൃഷ്ടിക്കുന്നു...",
    'mr': "क्विझ प्रश्न तयार करत आहे...",
    'bn': "কুইজ প্রশ্ন তৈরি করা হচ্ছে...",
    'gu': "ક્વિઝ પ્રશ્નો બનાવવામાં આવી રહ્યા છે...",
    'pa': "ਕਵਿਜ਼ ਪ੍ਰਸ਼ਨ ਤਿਆਰ ਕੀਤੇ ਜਾ ਰਹੇ ਹਨ...",
    'or': "କ୍ୱିଜ୍ ପ୍ରଶ୍ନଗୁଡିକ ପ୍ରସ୍ତୁତ କରାଯାଉଛି...",
    'ur': "کوئز کے سوالات تیار ہو رہے ہیں...",
    'as': "কুইজৰ প্ৰশ্ন প্ৰস্তুত কৰা হৈছে...",
    'ne': "क्विज प्रश्नहरू सिर्जना गरिँदैछ...",
    'mai': "क्विज प्रश्नसभ उत्पन्न कएल जा रहल अछि...",
    'kok': "क्विझ प्रश्न तयार करत आसा...",
    'doi': "क्विज प्रश्न बनाए जा करदे न...",
    'mni': "কুইজ ৱাহংসিং শেমগৎলি...",
    'san': "प्रश्नोत्तरी-प्रश्नाः निर्मीयन्ते..."
}

def inject_key(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    for lang, trans in translations.items():
        pattern = r"(" + lang + r":\s*\{[^}]+)(})"
        # ensure we don't inject multiple times
        if f"generating_quiz: '{trans}'" not in content:
            replacement = r"\1  generating_quiz: '" + trans + r"',\n\2"
            content = re.sub(pattern, replacement, content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

inject_key('frontend/src/lib/i18n.js')
inject_key('frontend/src/lib/extra_i18n.js')

print("Translations injected.")

# Now update StudentView.jsx to pass language to QuizCard
with open('frontend/src/pages/StudentView.jsx', 'r', encoding='utf-8') as f:
    student_view = f.read()

student_view = student_view.replace(
    "<QuizCard quiz={quiz} pageId={pageMeta.pageId} userId={user.id} onPointsAwarded={handlePointsAwarded} isLoading={loadingQuiz} />",
    "<QuizCard quiz={quiz} pageId={pageMeta.pageId} userId={user.id} onPointsAwarded={handlePointsAwarded} isLoading={loadingQuiz} language={language} />"
)

with open('frontend/src/pages/StudentView.jsx', 'w', encoding='utf-8') as f:
    f.write(student_view)

# Now update QuizCard.jsx to use it
with open('frontend/src/components/QuizCard.jsx', 'r', encoding='utf-8') as f:
    quiz_card = f.read()

if "import { t }" not in quiz_card:
    quiz_card = "import { t } from '../lib/i18n'\n" + quiz_card

quiz_card = quiz_card.replace(
    "export default function QuizCard({ quiz, pageId, userId, onPointsAwarded, isLoading }) {",
    "export default function QuizCard({ quiz, pageId, userId, onPointsAwarded, isLoading, language = 'en' }) {"
)

quiz_card = quiz_card.replace(
    ">Generating quiz questions…</span>",
    ">{t('generating_quiz', language)}</span>"
)
quiz_card = quiz_card.replace(
    ">Generating quiz questions.</span>",
    ">{t('generating_quiz', language)}</span>"
)

with open('frontend/src/components/QuizCard.jsx', 'w', encoding='utf-8') as f:
    f.write(quiz_card)

print("Components updated.")
