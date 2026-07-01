import codecs
import re

path = r'c:\Users\hasna\.gemini\antigravity-ide\scratch\ncert-alive\frontend\src\lib\i18n.js'

with codecs.open(path, 'r', 'utf-8') as f:
    content = f.read()

translations = {
    'as': {
        'class_label': "শ্ৰেণী", 'hey_user': "নমস্কাৰ,", 'clear_and_upload': "মচি পেলাওক আৰু নতুন আপল’ড কৰক",
        'paste_ncert_below': "তলত NCERT পাঠ্য পেষ্ট কৰক:", 'paste_placeholder': "অধ্যায়ৰ পাঠ্য, অনুচ্ছেদ বা যিকোনো NCERT সামগ্ৰী ইয়াত পেষ্ট কৰক...",
        'simplify_this': "ইয়াক সৰল কৰক →", 'cancel': "বাতিল কৰক", 'capture': "ফটো লওক",
        'drop_pdf': "আপোনাৰ PDF ইয়াত এৰি দিয়ক বা ", 'drop_img': "আপোনাৰ ছবি ইয়াত এৰি দিয়ক বা ",
        'click_browse': "ব্ৰাউজ কৰিবলৈ ক্লিক কৰক", 'supports_pdf': "50MB লৈকে PDF ফাইল সমৰ্থন কৰে", 'supports_img': "JPG, PNG, WEBP ছবি সমৰ্থন কৰে",
        'upload_first_desc': "প্ৰথমে NCERT পৃষ্ঠা আপল’ড কৰক — AI-এ ইয়াক আপোনাৰ ভাষাত সৰল কৰে",
        'api_key_missing': "Groq API Key নাই বা অবৈধ", 'api_key_desc1': "AI সুবিধা ব্যৱহাৰ কৰিবলৈ, আপোনাৰ", 'api_key_desc2': "যোগ কৰক আৰু বেকএণ্ড ছাৰ্ভাৰ পুনৰাম্ভ কৰক।", 'api_key_get': "console.groq.com ত বিনামূলীয়া চাবি পাওক →",
        'class_mismatch1': "এইখন শ্ৰেণী ", 'class_mismatch2': " ৰ কিতাপ যেন লাগিছে, কিন্তু আপুনি শ্ৰেণী ", 'class_mismatch3': " হিচাপে পঞ্জীভুক্ত। সমল আপোনাৰ শ্ৰেণী ", 'class_mismatch4': " ৰ স্তৰত বুজোৱা হ’ব।",
        'tip_pdf': "NCERT PDF আপল’ড কৰক — AI-এ প্ৰতিটো পৃষ্ঠা ছেকেণ্ডৰ ভিতৰত সৰল কৰে", 'tip_photo': "তাত্ক্ষণিক AI ব্যাখ্যাৰ বাবে পাঠ্যপুথিৰ ফটো লওক",
        'tip_lang': "AI-এ আপোনাৰ নিৰ্বাচিত ভাষাত বুজায় — 15+ ভাৰতীয় ভাষাত কাম কৰে", 'tip_xp': "কুইজ সম্পূৰ্ণ কৰাৰ বাবে XP পইণ্ট অৰ্জন কৰক",
        'go_to_study_tab': "আপল’ড কৰিবলৈ ষ্টাডি টেবলে যাওক", 'ask_anything': "পাঠ্যপুথিৰ বিষয়ে যিকোনো কথা সোধক",
        'for_smarter_answers': "স্মাৰ্ট উত্তৰৰ বাবে", 'to_generate_mcqs': "MCQs সৃষ্টি কৰিবলৈ", 'to_generate_flashcards': "ফ্লেছকাৰ্ড সৃষ্টি কৰিবলৈ", 'to_enable_audio': "আৰু অডিঅ’ সক্ৰিয় কৰিবলৈ",
        'badge_text': "বেজ:", 'active_study_content': "সক্ৰিয় অধ্যয়ন সমল", 'page_text': "পৃষ্ঠা", 'prev': "পূৰ্বৱৰ্তী", 'next': "পৰৱৰ্তী",
        'extracting_text': "পাঠ্য উলিওৱা হৈছে...", 'processing_ai': "AI ৰ সৈতে প্ৰক্ৰিয়াকৰণ...", 'almost_ready': "প্ৰায় সাজু...",
        'captured_image': "কেপচাৰ কৰা ছবি", 'pasted_text': "পেষ্ট কৰা পাঠ্য", 'ask_me_anything': "মোক যিকোনো কথা সোধক! 😊",
        'understand_context': "মই আপোনাৰ পৃষ্ঠাটোৰ প্ৰসংগ বুজি পাওঁ আৰু আপোনাৰ ভাষাত উত্তৰ দিব পাৰোঁ।", 'type_doubt': "আপোনাৰ সন্দেহ ইয়াত টাইপ কৰক... (পঠিয়াবলৈ Enter টিপক)",
        'press_enter': "পঠিয়াবলৈ Enter টিপক · নতুন শাৰীৰ বাবে Shift+Enter"
    },
    'bn': {
        'class_label': "শ্রেণী", 'hey_user': "নমস্কার,", 'clear_and_upload': "মুছে ফেলুন এবং নতুন আপলোড করুন",
        'paste_ncert_below': "নিচে NCERT টেক্সট পেস্ট করুন:", 'paste_placeholder': "অধ্যায়ের পাঠ্য, অনুচ্ছেদ বা যেকোনো NCERT সামগ্রী এখানে পেস্ট করুন...",
        'simplify_this': "এটি সহজ করুন →", 'cancel': "বাতিল করুন", 'capture': "ছবি তুলুন",
        'drop_pdf': "আপনার PDF এখানে ছেড়ে দিন বা ", 'drop_img': "আপনার ছবি এখানে ছেড়ে দিন বা ",
        'click_browse': "ব্রাউজ করতে ক্লিক করুন", 'supports_pdf': "50MB পর্যন্ত PDF সমর্থন করে", 'supports_img': "JPG, PNG, WEBP ছবি সমর্থন করে",
        'upload_first_desc': "প্রথমে NCERT পৃষ্ঠা আপলোড করুন — AI এটিকে আপনার ভাষায় সহজ করে তোলে",
        'api_key_missing': "Groq API Key অনুপস্থিত বা অবৈধ", 'api_key_desc1': "AI সুবিধাগুলি ব্যবহার করতে, আপনার", 'api_key_desc2': "যোগ করুন এবং ব্যাকএন্ড সার্ভার পুনরায় চালু করুন।", 'api_key_get': "console.groq.com এ বিনামূল্যে চাবি পান →",
        'class_mismatch1': "এটি ক্লাস ", 'class_mismatch2': " এর বই বলে মনে হচ্ছে, কিন্তু আপনি ক্লাস ", 'class_mismatch3': " হিসেবে নিবন্ধিত। আপনার ক্লাস ", 'class_mismatch4': " স্তরে বিষয়বস্তু বোঝানো হবে।",
        'tip_pdf': "NCERT PDF আপলোড করুন — AI কয়েক সেকেন্ডের মধ্যে প্রতিটি পৃষ্ঠা সহজ করে", 'tip_photo': "তাত্ক্ষণিক AI ব্যাখ্যার জন্য আপনার পাঠ্যবইয়ের ছবি তুলুন",
        'tip_lang': "AI আপনার নির্বাচিত ভাষায় ব্যাখ্যা করে — 15+ ভারতীয় ভাষায় কাজ করে", 'tip_xp': "প্রতিটি কুইজ সম্পন্ন করার জন্য XP পয়েন্ট অর্জন করুন",
        'go_to_study_tab': "আপলোড করতে স্টাডি ট্যাবে যান", 'ask_anything': "আপনার পাঠ্যবই সম্পর্কে যেকোনো কিছু জিজ্ঞাসা করুন",
        'for_smarter_answers': "স্মার্ট উত্তরের জন্য", 'to_generate_mcqs': "স্মার্ট MCQs তৈরি করতে", 'to_generate_flashcards': "ফ্ল্যাশকার্ড তৈরি করতে", 'to_enable_audio': "এবং অডিও সক্ষম করতে",
        'badge_text': "ব্যাজ:", 'active_study_content': "সক্রিয় অধ্যয়ন সামগ্রী", 'page_text': "পৃষ্ঠা", 'prev': "পূর্ববর্তী", 'next': "পরবর্তী",
        'extracting_text': "টেক্সট বের করা হচ্ছে...", 'processing_ai': "AI এর সাথে প্রসেস করা হচ্ছে...", 'almost_ready': "প্রায় প্রস্তুত...",
        'captured_image': "ক্যাপচার করা ছবি", 'pasted_text': "পেস্ট করা টেক্সট", 'ask_me_anything': "আমাকে যেকোনো কিছু জিজ্ঞাসা করুন! 😊",
        'understand_context': "আমি আপনার আপলোড করা পৃষ্ঠার প্রসঙ্গ বুঝতে পারি এবং আপনার ভাষায় উত্তর দিতে পারি।", 'type_doubt': "আপনার সন্দেহ এখানে টাইপ করুন... (পাঠাতে Enter চাপুন)",
        'press_enter': "পাঠাতে Enter চাপুন · নতুন লাইনের জন্য Shift+Enter"
    },
    'gu': {
        'class_label': "ધોરણ", 'hey_user': "નમસ્તે,", 'clear_and_upload': "સાફ કરો અને નવું અપલોડ કરો",
        'paste_ncert_below': "નીચે NCERT લખાણ પેસ્ટ કરો:", 'paste_placeholder': "પ્રકરણનો પાઠ, ફકરા અથવા કોઈપણ NCERT સામગ્રી અહીં પેસ્ટ કરો...",
        'simplify_this': "આને સરળ બનાવો →", 'cancel': "રદ કરો", 'capture': "ફોટો લો",
        'drop_pdf': "તમારું PDF અહીં મૂકો અથવા ", 'drop_img': "તમારી છબી અહીં મૂકો અથવા ",
        'click_browse': "બ્રાઉઝ કરવા માટે ક્લિક કરો", 'supports_pdf': "50MB સુધીના PDF ને સપોર્ટ કરે છે", 'supports_img': "JPG, PNG, WEBP છબીઓને સપોર્ટ કરે છે",
        'upload_first_desc': "પ્રથમ NCERT પૃષ્ઠ અપલોડ કરો — AI તેને તમારી ભાષામાં સરળ બનાવે છે",
        'api_key_missing': "Groq API Key ખૂટે છે અથવા અમાન્ય છે", 'api_key_desc1': "AI સુવિધાઓનો ઉપયોગ કરવા માટે, તમારી", 'api_key_desc2': "ઉમેરો અને બેકએન્ડ સર્વર પુનઃપ્રારંભ કરો.", 'api_key_get': "console.groq.com પર મફત કી મેળવો →",
        'class_mismatch1': "આ ધોરણ ", 'class_mismatch2': " નું પુસ્તક લાગે છે, પરંતુ તમે ધોરણ ", 'class_mismatch3': " તરીકે નોંધાયેલા છો. સામગ્રી તમારા ધોરણ ", 'class_mismatch4': " સ્તરે સમજાવવામાં આવશે.",
        'tip_pdf': "NCERT PDF અપલોડ કરો — AI દરેક પૃષ્ઠને સેકંડમાં સરળ બનાવે છે", 'tip_photo': "ત્વરિત AI સમજૂતી માટે તમારા પાઠ્યપુસ્તકનો ફોટો લો",
        'tip_lang': "AI તમારી પસંદ કરેલી ભાષામાં સમજાવે છે — 15+ ભારતીય ભાષાઓમાં કામ કરે છે", 'tip_xp': "દરેક ક્વિઝ પૂર્ણ કરવા બદલ XP પોઈન્ટ્સ મેળવો",
        'go_to_study_tab': "અપલોડ કરવા માટે સ્ટડી ટેબ પર જાઓ", 'ask_anything': "તમારા પાઠ્યપુસ્તક વિશે કંઈપણ પૂછો",
        'for_smarter_answers': "સ્માર્ટ જવાબો માટે", 'to_generate_mcqs': "MCQs બનાવવા માટે", 'to_generate_flashcards': "ફ્લેશકાર્ડ્સ બનાવવા માટે", 'to_enable_audio': "અને ઓડિયો ચાલુ કરવા માટે",
        'badge_text': "બેજ:", 'active_study_content': "સક્રિય અભ્યાસ સામગ્રી", 'page_text': "પૃષ્ઠ", 'prev': "પાછળ", 'next': "આગળ",
        'extracting_text': "લખાણ કાઢવામાં આવી રહ્યું છે...", 'processing_ai': "AI સાથે પ્રક્રિયા થઈ રહી છે...", 'almost_ready': "લગભગ તૈયાર...",
        'captured_image': "કેપ્ચર કરેલી છબી", 'pasted_text': "પેસ્ટ કરેલ લખાણ", 'ask_me_anything': "મને કંઈપણ પૂછો! 😊",
        'understand_context': "હું તમારા અપલોડ કરેલા પૃષ્ઠનો સંદર્ભ સમજી શકું છું અને તમારી ભાષામાં જવાબો આપી શકું છું.", 'type_doubt': "તમારો શંકા અહીં લખો... (મોકલવા માટે Enter દબાવો)",
        'press_enter': "મોકલવા માટે Enter દબાવો · નવી લાઇન માટે Shift+Enter"
    },
    'hinglish': {
        'class_label': "Class", 'hey_user': "Hey,", 'clear_and_upload': "Clear & Naya Upload karein",
        'paste_ncert_below': "Neeche NCERT text paste karein:", 'paste_placeholder': "Chapter text, paragraph ya koi NCERT content yahan paste karein...",
        'simplify_this': "Isse asaan banayein →", 'cancel': "Cancel", 'capture': "Photo lein",
        'drop_pdf': "Apna PDF yahan drop karein ya ", 'drop_img': "Apni image yahan drop karein ya ",
        'click_browse': "browse karne ke liye click karein", 'supports_pdf': "50MB tak ke PDF support karta hai", 'supports_img': "JPG, PNG, WEBP images support karta hai",
        'upload_first_desc': "Pehle NCERT page upload karein — AI isse aapki bhasha mein asaan banayega",
        'api_key_missing': "Groq API Key missing ya invalid hai", 'api_key_desc1': "AI features use karne ke liye, apni", 'api_key_desc2': "add karein aur backend server restart karein.", 'api_key_get': "console.groq.com par free key paayein →",
        'class_mismatch1': "Yeh Class ", 'class_mismatch2': " ki book lagti hai, par aap Class ", 'class_mismatch3': " mein hain. Content aapki Class ", 'class_mismatch4': " ke level par samjhaya jayega.",
        'tip_pdf': "NCERT PDF upload karein — AI har page ko seconds mein asaan banata hai", 'tip_photo': "Instant AI explanation ke liye apni book ki photo lein",
        'tip_lang': "AI aapki pasand ki bhasha mein samjhata hai — 15+ Indian languages mein chalta hai", 'tip_xp': "Har quiz poori karne par XP points kamayein",
        'go_to_study_tab': "Upload karne ke liye Study tab par jayein", 'ask_anything': "Apni book ke baare mein kuch bhi poochein",
        'for_smarter_answers': "smarter answers ke liye", 'to_generate_mcqs': "smart MCQs banane ke liye", 'to_generate_flashcards': "flashcards banane ke liye", 'to_enable_audio': "aur audio chalu karne ke liye",
        'badge_text': "Badge:", 'active_study_content': "Active Study Content", 'page_text': "Page", 'prev': "Peechhe", 'next': "Aage",
        'extracting_text': "Text nikala ja raha hai...", 'processing_ai': "AI se process ho raha hai...", 'almost_ready': "Lagbhag taiyar...",
        'captured_image': "Captured Image", 'pasted_text': "Pasted Text", 'ask_me_anything': "Mujhse kuch bhi poochein! 😊",
        'understand_context': "Main aapke page ko samajh gaya hoon aur aapki bhasha mein jawab de sakta hoon.", 'type_doubt': "Apna doubt yahan type karein... (Bhejne ke liye Enter dabayein)",
        'press_enter': "Bhejne ke liye Enter dabayein · Nayi line ke liye Shift+Enter"
    },
    'kn': {
        'class_label': "ತರಗತಿ", 'hey_user': "ನಮಸ್ಕಾರ,", 'clear_and_upload': "ತೆರವುಗೊಳಿಸಿ ಮತ್ತು ಹೊಸದನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
        'paste_ncert_below': "NCERT ಪಠ್ಯವನ್ನು ಕೆಳಗೆ ಅಂಟಿಸಿ:", 'paste_placeholder': "ಅಧ್ಯಾಯದ ಪಠ್ಯ, ಪ್ಯಾರಾಗಳು ಅಥವಾ ಯಾವುದೇ NCERT ವಿಷಯವನ್ನು ಇಲ್ಲಿ ಅಂಟಿಸಿ...",
        'simplify_this': "ಇದನ್ನು ಸರಳಗೊಳಿಸಿ →", 'cancel': "ರದ್ದುಮಾಡಿ", 'capture': "ಫೋಟೋ ತೆಗೆದುಕೊಳ್ಳಿ",
        'drop_pdf': "ನಿಮ್ಮ PDF ಅನ್ನು ಇಲ್ಲಿ ಬಿಡಿ ಅಥವಾ ", 'drop_img': "ನಿಮ್ಮ ಚಿತ್ರವನ್ನು ಇಲ್ಲಿ ಬಿಡಿ ಅಥವಾ ",
        'click_browse': "ಬ್ರೌಸ್ ಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ", 'supports_pdf': "50MB ವರೆಗಿನ PDF ಅನ್ನು ಬೆಂಬಲಿಸುತ್ತದೆ", 'supports_img': "JPG, PNG, WEBP ಚಿತ್ರಗಳನ್ನು ಬೆಂಬಲಿಸುತ್ತದೆ",
        'upload_first_desc': "ಮೊದಲು NCERT ಪುಟವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ — AI ಅದನ್ನು ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಸರಳಗೊಳಿಸುತ್ತದೆ",
        'api_key_missing': "Groq API Key ಕಾಣೆಯಾಗಿದೆ ಅಥವಾ ಅಮಾನ್ಯವಾಗಿದೆ", 'api_key_desc1': "AI ವೈಶಿಷ್ಟ್ಯಗಳನ್ನು ಬಳಸಲು, ನಿಮ್ಮ", 'api_key_desc2': "ಸೇರಿಸಿ ಮತ್ತು ಬ್ಯಾಕೆಂಡ್ ಸರ್ವರ್ ಅನ್ನು ಮರುಪ್ರಾರಂಭಿಸಿ.", 'api_key_get': "console.groq.com ನಲ್ಲಿ ಉಚಿತ ಕೀಯನ್ನು ಪಡೆಯಿರಿ →",
        'class_mismatch1': "ಇದು ತರಗತಿ ", 'class_mismatch2': " ಪುಸ್ತಕದಂತೆ ಕಾಣುತ್ತದೆ, ಆದರೆ ನೀವು ತರಗತಿ ", 'class_mismatch3': " ಆಗಿ ನೋಂದಾಯಿಸಲ್ಪಟ್ಟಿದ್ದೀರಿ. ವಿಷಯವನ್ನು ನಿಮ್ಮ ತರಗತಿ ", 'class_mismatch4': " ಮಟ್ಟದಲ್ಲಿ ವಿವರಿಸಲಾಗುವುದು.",
        'tip_pdf': "NCERT PDF ಅಪ್‌ಲೋಡ್ ಮಾಡಿ — AI ಪ್ರತಿ ಪುಟವನ್ನು ಸೆಕೆಂಡುಗಳಲ್ಲಿ ಸರಳಗೊಳಿಸುತ್ತದೆ", 'tip_photo': "ತ್ವರಿತ AI ವಿವರಣೆಗಾಗಿ ನಿಮ್ಮ ಪಠ್ಯಪುಸ್ತಕದ ಫೋಟೋ ತೆಗೆದುಕೊಳ್ಳಿ",
        'tip_lang': "AI ನಿಮ್ಮ ಆಯ್ಕೆಯ ಭಾಷೆಯಲ್ಲಿ ವಿವರಿಸುತ್ತದೆ — 15+ ಭಾರತೀಯ ಭಾಷೆಗಳಲ್ಲಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ", 'tip_xp': "ನೀವು ಪೂರ್ಣಗೊಳಿಸುವ ಪ್ರತಿಯೊಂದು ರಸಪ್ರಶ್ನೆಗೆ XP ಅಂಕಗಳನ್ನು ಗಳಿಸಿ",
        'go_to_study_tab': "ಅಪ್‌ಲೋಡ್ ಮಾಡಲು ಸ್ಟಡಿ ಟ್ಯಾಬ್‌ಗೆ ಹೋಗಿ", 'ask_anything': "ನಿಮ್ಮ ಪಠ್ಯಪುಸ್ತಕದ ಬಗ್ಗೆ ಏನನ್ನಾದರೂ ಕೇಳಿ",
        'for_smarter_answers': "ಸ್ಮಾರ್ಟ್ ಉತ್ತರಗಳಿಗಾಗಿ", 'to_generate_mcqs': "MCQ ಗಳನ್ನು ರಚಿಸಲು", 'to_generate_flashcards': "ಫ್ಲ್ಯಾಶ್‌ಕಾರ್ಡ್‌ಗಳನ್ನು ರಚಿಸಲು", 'to_enable_audio': "ಮತ್ತು ಆಡಿಯೊವನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಲು",
        'badge_text': "ಬ್ಯಾಡ್ಜ್:", 'active_study_content': "ಸಕ್ರಿಯ ಅಧ್ಯಯನ ವಿಷಯ", 'page_text': "ಪುಟ", 'prev': "ಹಿಂದಿನದು", 'next': "ಮುಂದಿನದು",
        'extracting_text': "ಪಠ್ಯವನ್ನು ಹೊರತೆಗೆಯಲಾಗುತ್ತಿದೆ...", 'processing_ai': "AI ನೊಂದಿಗೆ ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುತ್ತಿದೆ...", 'almost_ready': "ಬಹುತೇಕ ಸಿದ್ಧವಾಗಿದೆ...",
        'captured_image': "ಸೆರೆಹಿಡಿದ ಚಿತ್ರ", 'pasted_text': "ಅಂಟಿಸಿದ ಪಠ್ಯ", 'ask_me_anything': "ನನಗೆ ಏನನ್ನಾದರೂ ಕೇಳಿ! 😊",
        'understand_context': "ನಿಮ್ಮ ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ಪುಟದ ಸಂದರ್ಭವನ್ನು ನಾನು ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದೇನೆ ಮತ್ತು ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಉತ್ತರಿಸಬಲ್ಲೆ.", 'type_doubt': "ನಿಮ್ಮ ಅನುಮಾನವನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ... (ಕಳುಹಿಸಲು Enter ಒತ್ತಿರಿ)",
        'press_enter': "ಕಳುಹಿಸಲು Enter ಒತ್ತಿರಿ · ಹೊಸ ಸಾಲಿಗಾಗಿ Shift+Enter"
    },
    'ml': {
        'class_label': "ക്ലാസ്സ്", 'hey_user': "നമസ്കാരം,", 'clear_and_upload': "മായ്‌ച്ച് പുതിയത് അപ്‌ലോഡ് ചെയ്യുക",
        'paste_ncert_below': "NCERT വാചകം താഴെ പേസ്റ്റ് ചെയ്യുക:", 'paste_placeholder': "അധ്യായ വാചകം, ഖണ്ഡികകൾ അല്ലെങ്കിൽ ഏതെങ്കിലും NCERT ഉള്ളടക്കം ഇവിടെ പേസ്റ്റ് ചെയ്യുക...",
        'simplify_this': "ഇത് ലളിതമാക്കുക →", 'cancel': "റദ്ദാക്കുക", 'capture': "ഫോട്ടോ എടുക്കുക",
        'drop_pdf': "നിങ്ങളുടെ PDF ഇവിടെ ഇടുക അല്ലെങ്കിൽ ", 'drop_img': "നിങ്ങളുടെ ചിത്രം ഇവിടെ ഇടുക അല്ലെങ്കിൽ ",
        'click_browse': "തിരയാൻ ക്ലിക്ക് ചെയ്യുക", 'supports_pdf': "50MB വരെയുള്ള PDF ഫയലുകൾ പിന്തുണയ്ക്കുന്നു", 'supports_img': "JPG, PNG, WEBP ചിത്രങ്ങൾ പിന്തുണയ്ക്കുന്നു",
        'upload_first_desc': "ആദ്യം ഒരു NCERT പേജ് അപ്‌ലോഡ് ചെയ്യുക — AI ഇത് നിങ്ങളുടെ ഭാഷയിൽ ലളിതമാക്കുന്നു",
        'api_key_missing': "Groq API Key ലഭ്യമല്ല അല്ലെങ്കിൽ അസാധുവാണ്", 'api_key_desc1': "AI സവിശേഷതകൾ ഉപയോഗിക്കാൻ, നിങ്ങളുടെ", 'api_key_desc2': "ചേർത്ത് ബാക്കെൻഡ് സെർവർ പുനരാരംഭിക്കുക.", 'api_key_get': "console.groq.com ൽ സൗജന്യ കീ നേടുക →",
        'class_mismatch1': "ഇത് ക്ലാസ്സ് ", 'class_mismatch2': " പുസ്തകമാണെന്ന് തോന്നുന്നു, എന്നാൽ നിങ്ങൾ ക്ലാസ്സ് ", 'class_mismatch3': " ആയി രജിസ്റ്റർ ചെയ്തിരിക്കുന്നു. ഉള്ളടക്കം നിങ്ങളുടെ ക്ലാസ്സ് ", 'class_mismatch4': " നിലവാരത്തിൽ വിശദീകരിക്കും.",
        'tip_pdf': "NCERT PDF-കൾ അപ്‌ലോഡ് ചെയ്യുക — AI ഓരോ പേജും നിമിഷങ്ങൾക്കുള്ളിൽ ലളിതമാക്കുന്നു", 'tip_photo': "തൽക്ഷണ AI വിശദീകരണത്തിനായി നിങ്ങളുടെ പാഠപുസ്തകത്തിന്റെ ഫോട്ടോ എടുക്കുക",
        'tip_lang': "നിങ്ങൾ തിരഞ്ഞെടുത്ത ഭാഷയിൽ AI വിശദീകരിക്കുന്നു — 15+ ഇന്ത്യൻ ഭാഷകളിൽ പ്രവർത്തിക്കുന്നു", 'tip_xp': "നിങ്ങൾ പൂർത്തിയാക്കുന്ന ഓരോ ക്വിസിനും XP പോയിന്റുകൾ നേടുക",
        'go_to_study_tab': "അപ്‌ലോഡ് ചെയ്യാൻ സ്റ്റഡി ടാബിലേക്ക് പോകുക", 'ask_anything': "നിങ്ങളുടെ പാഠപുസ്തകത്തെക്കുറിച്ച് എന്തും ചോദിക്കുക",
        'for_smarter_answers': "മികച്ച ഉത്തരങ്ങൾക്കായി", 'to_generate_mcqs': "MCQ-കൾ സൃഷ്ടിക്കാൻ", 'to_generate_flashcards': "ഫ്ലാഷ് കാർഡുകൾ സൃഷ്ടിക്കാൻ", 'to_enable_audio': "കൂടാതെ ഓഡിയോ പ്രവർത്തനക്ഷമമാക്കാൻ",
        'badge_text': "ബാഡ്ജ്:", 'active_study_content': "സജീവ പഠന ഉള്ളടക്കം", 'page_text': "പേജ്", 'prev': "മുമ്പത്തേത്", 'next': "അടുത്തത്",
        'extracting_text': "വാചകം വേർതിരിച്ചെടുക്കുന്നു...", 'processing_ai': "AI ഉപയോഗിച്ച് പ്രോസസ്സ് ചെയ്യുന്നു...", 'almost_ready': "ഏകദേശം തയ്യാറാണ്...",
        'captured_image': "പകർത്തിയ ചിത്രം", 'pasted_text': "പേസ്റ്റ് ചെയ്ത വാചകം", 'ask_me_anything': "എന്നോട് എന്തും ചോദിക്കൂ! 😊",
        'understand_context': "നിങ്ങൾ അപ്‌ലോഡ് ചെയ്ത പേജിന്റെ സന്ദർഭം ഞാൻ മനസ്സിലാക്കുന്നു, നിങ്ങളുടെ ഭാഷയിൽ എനിക്ക് മറുപടി നൽകാൻ കഴിയും.", 'type_doubt': "നിങ്ങളുടെ സംശയം ഇവിടെ ടൈപ്പ് ചെയ്യുക... (അയയ്‌ക്കാൻ Enter അമർത്തുക)",
        'press_enter': "അയയ്‌ക്കാൻ Enter അമർത്തുക · പുതിയ വരിക്ക് Shift+Enter"
    },
    'mr': {
        'class_label': "इयत्ता", 'hey_user': "नमस्कार,", 'clear_and_upload': "साफ करा आणि नवीन अपलोड करा",
        'paste_ncert_below': "खाली NCERT मजकूर पेस्ट करा:", 'paste_placeholder': "धड्याचा मजकूर, परिच्छेद किंवा कोणताही NCERT मजकूर येथे पेस्ट करा...",
        'simplify_this': "हे सोपे करा →", 'cancel': "रद्द करा", 'capture': "फोटो घ्या",
        'drop_pdf': "तुमची PDF येथे सोडा किंवा ", 'drop_img': "तुमचे चित्र येथे सोडा किंवा ",
        'click_browse': "ब्राउझ करण्यासाठी क्लिक करा", 'supports_pdf': "50MB पर्यंतच्या PDF ला सपोर्ट करते", 'supports_img': "JPG, PNG, WEBP प्रतिमांना सपोर्ट करते",
        'upload_first_desc': "प्रथम NCERT पृष्ठ अपलोड करा — AI ते तुमच्या भाषेत सोपे करते",
        'api_key_missing': "Groq API Key गहाळ किंवा अवैध आहे", 'api_key_desc1': "AI वैशिष्ट्ये वापरण्यासाठी, तुमची", 'api_key_desc2': "जोडा आणि बॅकएंड सर्व्हर रीस्टार्ट करा.", 'api_key_get': "console.groq.com वर मोफत की मिळवा →",
        'class_mismatch1': "हे इयत्ता ", 'class_mismatch2': " चे पुस्तक वाटते, पण तुम्ही इयत्ता ", 'class_mismatch3': " म्हणून नोंदणीकृत आहात. तुमच्या इयत्ता ", 'class_mismatch4': " च्या पातळीवर सामग्री स्पष्ट केली जाईल.",
        'tip_pdf': "NCERT PDF अपलोड करा — AI प्रत्येक पृष्ठ सेकंदात सोपे करते", 'tip_photo': "त्वरित AI स्पष्टीकरणासाठी तुमच्या पाठ्यपुस्तकाचा फोटो घ्या",
        'tip_lang': "AI तुमच्या निवडलेल्या भाषेत स्पष्ट करते — 15+ भारतीय भाषांमध्ये कार्य करते", 'tip_xp': "प्रत्येक क्विझ पूर्ण करण्यासाठी XP पॉइंट्स मिळवा",
        'go_to_study_tab': "अपलोड करण्यासाठी स्टडी टॅबवर जा", 'ask_anything': "तुमच्या पाठ्यपुस्तकाबद्दल काहीही विचारा",
        'for_smarter_answers': "स्मार्ट उत्तरांसाठी", 'to_generate_mcqs': "MCQs तयार करण्यासाठी", 'to_generate_flashcards': "फ्लॅशकार्ड्स तयार करण्यासाठी", 'to_enable_audio': "आणि ऑडिओ चालू करण्यासाठी",
        'badge_text': "बॅज:", 'active_study_content': "सक्रिय अभ्यास सामग्री", 'page_text': "पृष्ठ", 'prev': "मागे", 'next': "पुढे",
        'extracting_text': "मजकूर काढला जात आहे...", 'processing_ai': "AI सह प्रक्रिया होत आहे...", 'almost_ready': "जवळपास तयार...",
        'captured_image': "कॅप्चर केलेली प्रतिमा", 'pasted_text': "पेस्ट केलेला मजकूर", 'ask_me_anything': "मला काहीही विचारा! 😊",
        'understand_context': "मला तुमच्या अपलोड केलेल्या पृष्ठाचा संदर्भ समजतो आणि मी तुमच्या भाषेत उत्तरे देऊ शकतो.", 'type_doubt': "तुमची शंका येथे टाईप करा... (पाठवण्यासाठी Enter दाबा)",
        'press_enter': "पाठवण्यासाठी Enter दाबा · नवीन ओळीसाठी Shift+Enter"
    },
    'or': {
        'class_label': "ଶ୍ରେଣୀ", 'hey_user': "ନମସ୍କାର,", 'clear_and_upload': "ସଫା କରନ୍ତୁ ଏବଂ ନୂତନ ଅପଲୋଡ୍ କରନ୍ତୁ",
        'paste_ncert_below': "ତଳେ NCERT ଟେକ୍ସଟ୍ ପେଷ୍ଟ କରନ୍ତୁ:", 'paste_placeholder': "ଅଧ୍ୟାୟ ପାଠ, ପାରାଗ୍ରାଫ୍ କିମ୍ବା ଯେକୌଣସି NCERT ସାମଗ୍ରୀ ଏଠାରେ ପେଷ୍ଟ କରନ୍ତୁ...",
        'simplify_this': "ଏହାକୁ ସରଳ କରନ୍ତୁ →", 'cancel': "ବାତିଲ କରନ୍ତୁ", 'capture': "ଫଟୋ ନିଅନ୍ତୁ",
        'drop_pdf': "ଆପଣଙ୍କର PDF ଏଠାରେ ଡ୍ରପ୍ କରନ୍ତୁ କିମ୍ବା ", 'drop_img': "ଆପଣଙ୍କର ଚିତ୍ର ଏଠାରେ ଡ୍ରପ୍ କରନ୍ତୁ କିମ୍ବା ",
        'click_browse': "ବ୍ରାଉଜ୍ କରିବାକୁ କ୍ଲିକ୍ କରନ୍ତୁ", 'supports_pdf': "50MB ପର୍ଯ୍ୟନ୍ତ PDF ଫାଇଲ୍ ସମର୍ଥନ କରେ", 'supports_img': "JPG, PNG, WEBP ଚିତ୍ରଗୁଡ଼ିକୁ ସମର୍ଥନ କରେ",
        'upload_first_desc': "ପ୍ରଥମେ NCERT ପୃଷ୍ଠା ଅପଲୋଡ୍ କରନ୍ତୁ — AI ଏହାକୁ ଆପଣଙ୍କ ଭାଷାରେ ସରଳ କରେ",
        'api_key_missing': "Groq API Key ଅନୁପସ୍ଥିତ କିମ୍ବା ଅବୈଧ ଅଟେ", 'api_key_desc1': "AI ବୈଶିଷ୍ଟ୍ୟ ବ୍ୟବହାର କରିବାକୁ, ଆପଣଙ୍କର", 'api_key_desc2': "ଯୋଡନ୍ତୁ ଏବଂ ବ୍ୟାକଏଣ୍ଡ୍ ସର୍ଭର ପୁନଃ ଆରମ୍ଭ କରନ୍ତୁ।", 'api_key_get': "console.groq.com ରେ ମାଗଣା କି ପାଆନ୍ତୁ →",
        'class_mismatch1': "ଏହା ଶ୍ରେଣୀ ", 'class_mismatch2': " ର ବହି ପରି ମନେହୁଏ, କିନ୍ତୁ ଆପଣ ଶ୍ରେଣୀ ", 'class_mismatch3': " ଭାବରେ ପଞ୍ଜିକୃତ। ବିଷୟବସ୍ତୁ ଆପଣଙ୍କ ଶ୍ରେଣୀ ", 'class_mismatch4': " ସ୍ତରରେ ବୁଝାଯିବ।",
        'tip_pdf': "NCERT PDF ଅପଲୋଡ୍ କରନ୍ତୁ — AI ପ୍ରତ୍ୟେକ ପୃଷ୍ଠାକୁ ସେକେଣ୍ଡରେ ସରଳ କରେ", 'tip_photo': "ତୁରନ୍ତ AI ବ୍ୟାଖ୍ୟା ପାଇଁ ଆପଣଙ୍କ ପାଠ୍ୟପୁସ୍ତକର ଫଟୋ ନିଅନ୍ତୁ",
        'tip_lang': "AI ଆପଣଙ୍କ ମନୋନୀତ ଭାଷାରେ ବୁଝାଏ — 15+ ଭାରତୀୟ ଭାଷାରେ କାମ କରେ", 'tip_xp': "ପ୍ରତ୍ୟେକ କୁଇଜ୍ ସମ୍ପୂର୍ଣ୍ଣ କରିବା ପାଇଁ XP ପଏଣ୍ଟ ଅର୍ଜନ କରନ୍ତୁ",
        'go_to_study_tab': "ଅପଲୋଡ୍ କରିବାକୁ ଷ୍ଟଡି ଟ୍ୟାବକୁ ଯାଆନ୍ତୁ", 'ask_anything': "ଆପଣଙ୍କ ପାଠ୍ୟପୁସ୍ତକ ବିଷୟରେ କିଛି ପଚାରନ୍ତୁ",
        'for_smarter_answers': "ସ୍ମାର୍ଟ ଉତ୍ତର ପାଇଁ", 'to_generate_mcqs': "ସ୍ମାର୍ଟ MCQs ସୃଷ୍ଟି କରିବାକୁ", 'to_generate_flashcards': "ଫ୍ଲାସକାର୍ଡ ସୃଷ୍ଟି କରିବାକୁ", 'to_enable_audio': "ଏବଂ ଅଡିଓ ସକ୍ଷମ କରିବାକୁ",
        'badge_text': "ବ୍ୟାଜ୍:", 'active_study_content': "ସକ୍ରିୟ ଅଧ୍ୟୟନ ସାମଗ୍ରୀ", 'page_text': "ପୃଷ୍ଠା", 'prev': "ପୂର୍ବବର୍ତ୍ତୀ", 'next': "ପରବର୍ତ୍ତୀ",
        'extracting_text': "ଟେକ୍ସଟ୍ ବାହାର କରାଯାଉଛି...", 'processing_ai': "AI ସହିତ ପ୍ରକ୍ରିୟାକରଣ ହେଉଛି...", 'almost_ready': "ପ୍ରାୟ ପ୍ରସ୍ତୁତ...",
        'captured_image': "କ୍ୟାପଚର୍ ହୋଇଥିବା ଚିତ୍ର", 'pasted_text': "ପେଷ୍ଟ କରାଯାଇଥିବା ଟେକ୍ସଟ୍", 'ask_me_anything': "ମୋତେ ଯେକୌଣସି କଥା ପଚାରନ୍ତୁ! 😊",
        'understand_context': "ମୁଁ ଆପଣଙ୍କ ଅପଲୋଡ୍ ହୋଇଥିବା ପୃଷ୍ଠାର ପ୍ରସଙ୍ଗ ବୁଝିପାରୁଛି ଏବଂ ଆପଣଙ୍କ ଭାଷାରେ ଉତ୍ତର ଦେଇପାରିବି।", 'type_doubt': "ଆପଣଙ୍କର ସନ୍ଦେହ ଏଠାରେ ଟାଇପ୍ କରନ୍ତୁ... (ପଠାଇବାକୁ Enter ଦବାନ୍ତୁ)",
        'press_enter': "ପଠାଇବାକୁ Enter ଦବାନ୍ତୁ · ନୂତନ ଧାଡ଼ି ପାଇଁ Shift+Enter"
    },
    'pa': {
        'class_label': "ਜਮਾਤ", 'hey_user': "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ,", 'clear_and_upload': "ਸਾਫ਼ ਕਰੋ ਅਤੇ ਨਵਾਂ ਅੱਪਲੋਡ ਕਰੋ",
        'paste_ncert_below': "ਹੇਠਾਂ NCERT ਟੈਕਸਟ ਪੇਸਟ ਕਰੋ:", 'paste_placeholder': "ਅਧਿਆਇ ਦਾ ਪਾਠ, ਪੈਰਾਗ੍ਰਾਫ, ਜਾਂ ਕੋਈ ਵੀ NCERT ਸਮੱਗਰੀ ਇੱਥੇ ਪੇਸਟ ਕਰੋ...",
        'simplify_this': "ਇਸਨੂੰ ਸਰਲ ਬਣਾਓ →", 'cancel': "ਰੱਦ ਕਰੋ", 'capture': "ਫੋਟੋ ਲਓ",
        'drop_pdf': "ਆਪਣਾ PDF ਇੱਥੇ ਸੁੱਟੋ ਜਾਂ ", 'drop_img': "ਆਪਣਾ ਚਿੱਤਰ ਇੱਥੇ ਸੁੱਟੋ ਜਾਂ ",
        'click_browse': "ਬ੍ਰਾਊਜ਼ ਕਰਨ ਲਈ ਕਲਿੱਕ ਕਰੋ", 'supports_pdf': "50MB ਤੱਕ ਦੀਆਂ PDF ਫਾਈਲਾਂ ਦਾ ਸਮਰਥਨ ਕਰਦਾ ਹੈ", 'supports_img': "JPG, PNG, WEBP ਚਿੱਤਰਾਂ ਦਾ ਸਮਰਥਨ ਕਰਦਾ ਹੈ",
        'upload_first_desc': "ਪਹਿਲਾਂ NCERT ਪੰਨਾ ਅੱਪਲੋਡ ਕਰੋ — AI ਇਸਨੂੰ ਤੁਹਾਡੀ ਭਾਸ਼ਾ ਵਿੱਚ ਸਰਲ ਬਣਾਉਂਦਾ ਹੈ",
        'api_key_missing': "Groq API Key ਗੁੰਮ ਜਾਂ ਅਵੈਧ ਹੈ", 'api_key_desc1': "AI ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ ਦੀ ਵਰਤੋਂ ਕਰਨ ਲਈ, ਆਪਣੀ", 'api_key_desc2': "ਸ਼ਾਮਲ ਕਰੋ ਅਤੇ ਬੈਕਐਂਡ ਸਰਵਰ ਮੁੜ ਚਾਲੂ ਕਰੋ।", 'api_key_get': "console.groq.com 'ਤੇ ਮੁਫਤ ਕੁੰਜੀ ਪ੍ਰਾਪਤ ਕਰੋ →",
        'class_mismatch1': "ਇਹ ਜਮਾਤ ", 'class_mismatch2': " ਦੀ ਕਿਤਾਬ ਲੱਗਦੀ ਹੈ, ਪਰ ਤੁਸੀਂ ਜਮਾਤ ", 'class_mismatch3': " ਵਜੋਂ ਰਜਿਸਟਰਡ ਹੋ। ਸਮੱਗਰੀ ਨੂੰ ਤੁਹਾਡੀ ਜਮਾਤ ", 'class_mismatch4': " ਦੇ ਪੱਧਰ 'ਤੇ ਸਮਝਾਇਆ ਜਾਵੇਗਾ।",
        'tip_pdf': "NCERT PDF ਅੱਪਲੋਡ ਕਰੋ — AI ਹਰ ਪੰਨੇ ਨੂੰ ਸਕਿੰਟਾਂ ਵਿੱਚ ਸਰਲ ਬਣਾਉਂਦਾ ਹੈ", 'tip_photo': "ਤੁਰੰਤ AI ਵਿਆਖਿਆ ਲਈ ਆਪਣੀ ਪਾਠ ਪੁਸਤਕ ਦੀ ਫੋਟੋ ਲਓ",
        'tip_lang': "AI ਤੁਹਾਡੀ ਚੁਣੀ ਹੋਈ ਭਾਸ਼ਾ ਵਿੱਚ ਸਮਝਾਉਂਦਾ ਹੈ — 15+ ਭਾਰਤੀ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਕੰਮ ਕਰਦਾ ਹੈ", 'tip_xp': "ਹਰੇਕ ਕਵਿਜ਼ ਨੂੰ ਪੂਰਾ ਕਰਨ ਲਈ XP ਅੰਕ ਕਮਾਓ",
        'go_to_study_tab': "ਅੱਪਲੋਡ ਕਰਨ ਲਈ ਸਟੱਡੀ ਟੈਬ 'ਤੇ ਜਾਓ", 'ask_anything': "ਆਪਣੀ ਪਾਠ ਪੁਸਤਕ ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛੋ",
        'for_smarter_answers': "ਸਮਾਰਟ ਜਵਾਬਾਂ ਲਈ", 'to_generate_mcqs': "MCQs ਬਣਾਉਣ ਲਈ", 'to_generate_flashcards': "ਫਲੈਸ਼ਕਾਰਡ ਬਣਾਉਣ ਲਈ", 'to_enable_audio': "ਅਤੇ ਆਡੀਓ ਚਾਲੂ ਕਰਨ ਲਈ",
        'badge_text': "ਬੈਜ:", 'active_study_content': "ਸਰਗਰਮ ਅਧਿਐਨ ਸਮੱਗਰੀ", 'page_text': "ਪੰਨਾ", 'prev': "ਪਿਛਲਾ", 'next': "ਅਗਲਾ",
        'extracting_text': "ਟੈਕਸਟ ਕੱਢਿਆ ਜਾ ਰਿਹਾ ਹੈ...", 'processing_ai': "AI ਨਾਲ ਪ੍ਰਕਿਰਿਆ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ...", 'almost_ready': "ਲਗਭਗ ਤਿਆਰ...",
        'captured_image': "ਕੈਪਚਰ ਕੀਤਾ ਚਿੱਤਰ", 'pasted_text': "ਪੇਸਟ ਕੀਤਾ ਟੈਕਸਟ", 'ask_me_anything': "ਮੈਨੂੰ ਕੁਝ ਵੀ ਪੁੱਛੋ! 😊",
        'understand_context': "ਮੈਂ ਤੁਹਾਡੇ ਅੱਪਲੋਡ ਕੀਤੇ ਪੰਨੇ ਦਾ ਸੰਦਰਭ ਸਮਝਦਾ ਹਾਂ ਅਤੇ ਤੁਹਾਡੀ ਭਾਸ਼ਾ ਵਿੱਚ ਜਵਾਬ ਦੇ ਸਕਦਾ ਹਾਂ।", 'type_doubt': "ਆਪਣਾ ਸ਼ੱਕ ਇੱਥੇ ਟਾਈਪ ਕਰੋ... (ਭੇਜਣ ਲਈ Enter ਦਬਾਓ)",
        'press_enter': "ਭੇਜਣ ਲਈ Enter ਦਬਾਓ · ਨਵੀਂ ਲਾਈਨ ਲਈ Shift+Enter"
    },
    'ta': {
        'class_label': "வகுப்பு", 'hey_user': "வணக்கம்,", 'clear_and_upload': "அழித்து புதியதை பதிவேற்றுக",
        'paste_ncert_below': "NCERT உரையை கீழே ஒட்டவும்:", 'paste_placeholder': "பாடம் உரை, பத்திகள் அல்லது எந்த NCERT உள்ளடக்கத்தையும் இங்கே ஒட்டவும்...",
        'simplify_this': "இதை எளிதாக்கு →", 'cancel': "ரத்துசெய்", 'capture': "படம் எடு",
        'drop_pdf': "உங்கள் PDFஐ இங்கே இழுத்து விடவும் அல்லது ", 'drop_img': "உங்கள் படத்தை இங்கே இழுத்து விடவும் அல்லது ",
        'click_browse': "உலாவ கிளிக் செய்யவும்", 'supports_pdf': "50MB வரை PDF கோப்புகளை ஆதரிக்கிறது", 'supports_img': "JPG, PNG, WEBP படங்களை ஆதரிக்கிறது",
        'upload_first_desc': "முதலில் ஒரு NCERT பக்கத்தை பதிவேற்றவும் — AI அதை உங்கள் மொழியில் எளிதாக்குகிறது",
        'api_key_missing': "Groq API Key விடுபட்டுள்ளது அல்லது தவறானது", 'api_key_desc1': "AI அம்சங்களைப் பயன்படுத்த, உங்கள்", 'api_key_desc2': "சேர்த்து பின்தள சேவையகத்தை மறுதொடக்கம் செய்யவும்.", 'api_key_get': "console.groq.com இல் இலவச விசையைப் பெறவும் →",
        'class_mismatch1': "இது வகுப்பு ", 'class_mismatch2': " புத்தகம் போல் தெரிகிறது, ஆனால் நீங்கள் வகுப்பு ", 'class_mismatch3': " என பதிவு செய்யப்பட்டுள்ளீர்கள். உங்கள் வகுப்பு ", 'class_mismatch4': " மட்டத்தில் உள்ளடக்கம் விளக்கப்படும்.",
        'tip_pdf': "NCERT PDFகளை பதிவேற்றவும் — AI ஒவ்வொரு பக்கத்தையும் சில வினாடிகளில் எளிதாக்குகிறது", 'tip_photo': "உடனடி AI விளக்கத்திற்கு உங்கள் பாடப்புத்தகத்தை புகைப்படம் எடுக்கவும்",
        'tip_lang': "AI நீங்கள் தேர்ந்தெடுத்த மொழியில் விளக்குகிறது — 15+ இந்திய மொழிகளில் வேலை செய்கிறது", 'tip_xp': "நீங்கள் முடிக்கும் ஒவ்வொரு வினாடி வினாவிற்கும் XP புள்ளிகளைப் பெறுங்கள்",
        'go_to_study_tab': "பதிவேற்ற படிப்பு தாவலுக்குச் செல்லவும்", 'ask_anything': "உங்கள் பாடப்புத்தகம் பற்றி எதையும் கேளுங்கள்",
        'for_smarter_answers': "சிறந்த பதில்களுக்கு", 'to_generate_mcqs': "MCQகளை உருவாக்க", 'to_generate_flashcards': "ஃபிளாஷ் கார்டுகளை உருவாக்க", 'to_enable_audio': "மற்றும் ஆடியோவை இயக்க",
        'badge_text': "பேட்ஜ்:", 'active_study_content': "செயலில் உள்ள படிப்பு உள்ளடக்கம்", 'page_text': "பக்கம்", 'prev': "முந்தைய", 'next': "அடுத்த",
        'extracting_text': "உரை எடுக்கப்படுகிறது...", 'processing_ai': "AI மூலம் செயலாக்கப்படுகிறது...", 'almost_ready': "கிட்டத்தட்ட தயார்...",
        'captured_image': "படம் பிடிக்கப்பட்டது", 'pasted_text': "ஒட்டப்பட்ட உரை", 'ask_me_anything': "என்னிடம் எதையும் கேளுங்கள்! 😊",
        'understand_context': "நீங்கள் பதிவேற்றிய பக்கத்தின் சூழலை நான் புரிந்துகொள்கிறேன், உங்கள் மொழியில் பதிலளிக்க முடியும்.", 'type_doubt': "உங்கள் சந்தேகத்தை இங்கே தட்டச்சு செய்யவும்... (அனுப்ப Enter ஐ அழுத்தவும்)",
        'press_enter': "அனுப்ப Enter ஐ அழுத்தவும் · புதிய வரிக்கு Shift+Enter"
    },
    'te': {
        'class_label': "తరగతి", 'hey_user': "నమస్కారం,", 'clear_and_upload': "క్లియర్ చేసి కొత్తది అప్‌లోడ్ చేయండి",
        'paste_ncert_below': "NCERT వచనాన్ని కింద పేస్ట్ చేయండి:", 'paste_placeholder': "అధ్యాయం వచనం, పేరాలు లేదా ఏదైనా NCERT కంటెంట్‌ను ఇక్కడ పేస్ట్ చేయండి...",
        'simplify_this': "దీన్ని సులభతరం చేయండి →", 'cancel': "రద్దు చేయి", 'capture': "ఫోటో తీయండి",
        'drop_pdf': "మీ PDFని ఇక్కడ వదలండి లేదా ", 'drop_img': "మీ చిత్రాన్ని ఇక్కడ వదలండి లేదా ",
        'click_browse': "బ్రౌజ్ చేయడానికి క్లిక్ చేయండి", 'supports_pdf': "50MB వరకు PDF ఫైల్‌లకు మద్దతు ఇస్తుంది", 'supports_img': "JPG, PNG, WEBP చిత్రాలకు మద్దతు ఇస్తుంది",
        'upload_first_desc': "ముందుగా NCERT పేజీని అప్‌లోడ్ చేయండి — AI దానిని మీ భాషలో సులభతరం చేస్తుంది",
        'api_key_missing': "Groq API Key లేదు లేదా చెల్లదు", 'api_key_desc1': "AI లక్షణాలను ఉపయోగించడానికి, మీ", 'api_key_desc2': "జోడించి బ్యాకెండ్ సర్వర్‌ని పునఃప్రారంభించండి.", 'api_key_get': "console.groq.com లో ఉచిత కీని పొందండి →",
        'class_mismatch1': "ఇది తరగతి ", 'class_mismatch2': " పుస్తకంలా ఉంది, కానీ మీరు తరగతి ", 'class_mismatch3': " గా నమోదు చేయబడ్డారు. కంటెంట్ మీ తరగతి ", 'class_mismatch4': " స్థాయిలో వివరించబడుతుంది.",
        'tip_pdf': "NCERT PDFలను అప్‌లోడ్ చేయండి — AI ప్రతి పేజీని సెకన్లలో సులభతరం చేస్తుంది", 'tip_photo': "తక్షణ AI వివరణ కోసం మీ పాఠ్యపుస్తకం ఫోటో తీయండి",
        'tip_lang': "AI మీరు ఎంచుకున్న భాషలో వివరిస్తుంది — 15+ భారతీయ భాషలలో పనిచేస్తుంది", 'tip_xp': "మీరు పూర్తి చేసే ప్రతి క్విజ్‌కి XP పాయింట్‌లను సంపాదించండి",
        'go_to_study_tab': "అప్‌లోడ్ చేయడానికి స్టడీ ట్యాబ్‌కి వెళ్లండి", 'ask_anything': "మీ పాఠ్యపుస్తకం గురించి ఏదైనా అడగండి",
        'for_smarter_answers': "స్మార్ట్ సమాధానాల కోసం", 'to_generate_mcqs': "MCQలను రూపొందించడానికి", 'to_generate_flashcards': "ఫ్లాష్‌కార్డ్‌లను రూపొందించడానికి", 'to_enable_audio': "మరియు ఆడియోను ప్రారంభించడానికి",
        'badge_text': "బ్యాడ్జ్:", 'active_study_content': "యాక్టివ్ స్టడీ కంటెంట్", 'page_text': "పేజీ", 'prev': "మునుపటి", 'next': "తదుపరి",
        'extracting_text': "వచనం సంగ్రహించబడుతోంది...", 'processing_ai': "AIతో ప్రాసెస్ చేయబడుతోంది...", 'almost_ready': "దాదాపు సిద్ధంగా ఉంది...",
        'captured_image': "క్యాప్చర్ చేసిన చిత్రం", 'pasted_text': "పేస్ట్ చేసిన వచనం", 'ask_me_anything': "నన్ను ఏదైనా అడగండి! 😊",
        'understand_context': "మీరు అప్‌లోడ్ చేసిన పేజీ యొక్క సందర్భాన్ని నేను అర్థం చేసుకున్నాను మరియు మీ భాషలో సమాధానం ఇవ్వగలను.", 'type_doubt': "మీ సందేహాన్ని ఇక్కడ టైప్ చేయండి... (పంపడానికి Enter నొక్కండి)",
        'press_enter': "పంపడానికి Enter నొక్కండి · కొత్త లైన్ కోసం Shift+Enter"
    },
    'ur': {
        'class_label': "کلاس", 'hey_user': "آداب,", 'clear_and_upload': "صاف کریں اور نیا اپ لوڈ کریں",
        'paste_ncert_below': "نیچے NCERT متن پیسٹ کریں:", 'paste_placeholder': "باب کا متن، پیراگراف، یا کوئی بھی NCERT مواد یہاں پیسٹ کریں...",
        'simplify_this': "اسے آسان بنائیں →", 'cancel': "منسوخ کریں", 'capture': "تصویر لیں",
        'drop_pdf': "اپنی PDF یہاں چھوڑیں یا ", 'drop_img': "اپنی تصویر یہاں چھوڑیں یا ",
        'click_browse': "براؤز کرنے کے لیے کلک کریں", 'supports_pdf': "50MB تک کی PDF فائلوں کی حمایت کرتا ہے", 'supports_img': "JPG, PNG, WEBP تصاویر کی حمایت کرتا ہے",
        'upload_first_desc': "پہلے NCERT صفحہ اپ لوڈ کریں — AI اسے آپ کی زبان میں آسان بناتا ہے",
        'api_key_missing': "Groq API Key غائب یا غلط ہے", 'api_key_desc1': "AI خصوصیات استعمال کرنے کے لیے، اپنی", 'api_key_desc2': "شامل کریں اور بیک اینڈ سرور کو دوبارہ شروع کریں۔", 'api_key_get': "console.groq.com پر مفت کلید حاصل کریں →",
        'class_mismatch1': "یہ کلاس ", 'class_mismatch2': " کی کتاب لگتی ہے، لیکن آپ کلاس ", 'class_mismatch3': " کے طور پر رجسٹرڈ ہیں۔ مواد آپ کی کلاس ", 'class_mismatch4': " کی سطح پر سمجھایا جائے گا۔",
        'tip_pdf': "NCERT PDF اپ لوڈ کریں — AI ہر صفحے کو سیکنڈوں میں آسان بناتا ہے", 'tip_photo': "فوری AI وضاحت کے لیے اپنی درسی کتاب کی تصویر لیں",
        'tip_lang': "AI آپ کی منتخب کردہ زبان میں سمجھاتا ہے — 15+ ہندوستانی زبانوں میں کام کرتا ہے", 'tip_xp': "ہر کوئز مکمل کرنے پر XP پوائنٹس حاصل کریں",
        'go_to_study_tab': "اپ لوڈ کرنے کے لیے اسٹڈی ٹیب پر جائیں", 'ask_anything': "اپنی درسی کتاب کے بارے میں کچھ بھی پوچھیں",
        'for_smarter_answers': "بہتر اور سیاق و سباق سے آگاہ جوابات کے لیے", 'to_generate_mcqs': "سمارٹ MCQs بنانے کے لیے", 'to_generate_flashcards': "فلیش کارڈز خودکار طریقے سے بنانے کے لیے", 'to_enable_audio': "اور آڈیو چلانے کے لیے",
        'badge_text': "بیج:", 'active_study_content': "فعال مطالعہ کا مواد", 'page_text': "صفحہ", 'prev': "پچھلا", 'next': "اگلا",
        'extracting_text': "متن نکالا جا رہا ہے...", 'processing_ai': "AI کے ساتھ عمل کیا جا رہا ہے...", 'almost_ready': "تقریباً تیار...",
        'captured_image': "کھینچی گئی تصویر", 'pasted_text': "چسپاں کیا گیا متن", 'ask_me_anything': "مجھ سے کچھ بھی پوچھیں! 😊",
        'understand_context': "میں آپ کے اپ لوڈ کردہ صفحے کا سیاق و سباق سمجھتا ہوں اور آپ کی زبان میں جواب دے سکتا ہوں۔", 'type_doubt': "اپنا شک یہاں ٹائپ کریں... (بھیجنے کے لیے Enter دبائیں)",
        'press_enter': "بھیجنے کے لیے Enter دبائیں · نئی لائن کے لیے Shift+Enter"
    }
}

for lang, additions in translations.items():
    insert_str = ""
    for k, v in additions.items():
        val = v.replace("'", "\\'")
        insert_str += f"    {k}: '{val}',\n"
    
    pattern = r"([ \t]+" + lang + r": \{\r?\n)"
    match = re.search(pattern, content)
    if match:
        content = content.replace(match.group(1), match.group(1) + insert_str)
    else:
        print(f"{lang} block not found!")

with codecs.open(path, 'w', 'utf-8') as f:
    f.write(content)

print("Updated all languages successfully!")
