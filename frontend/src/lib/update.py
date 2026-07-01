import codecs
import re

path = r'c:\Users\hasna\.gemini\antigravity-ide\scratch\ncert-alive\frontend\src\lib\i18n.js'
with codecs.open(path, 'r', 'utf-8') as f:
    content = f.read()

en_addition = """    class_label: 'Class',
    hey_user: 'Hey,',
    clear_and_upload: 'Clear & Upload New',
    paste_ncert_below: 'Paste NCERT text below:',
    paste_placeholder: 'Paste chapter text, paragraphs, or any NCERT content here...',
    simplify_this: 'Simplify This →',
    cancel: 'Cancel',
    capture: 'Capture',
    drop_pdf: 'Drop your PDF here or ',
    drop_img: 'Drop your image here or ',
    click_browse: 'click to browse',
    supports_pdf: 'Supports PDF files up to 50MB',
    supports_img: 'Supports JPG, PNG, WEBP images',"""

hi_addition = """    upload_first_desc: 'पहले NCERT पेज अपलोड करें — AI इसे आपकी भाषा में सरल बनाता है',
    api_key_missing: 'Groq API कुंजी गायब या अमान्य है',
    api_key_desc1: 'AI सुविधाओं का उपयोग करने के लिए, अपनी',
    api_key_desc2: 'जोड़ें और बैकएंड सर्वर को फिर से शुरू करें।',
    api_key_get: 'console.groq.com पर मुफ़्त कुंजी प्राप्त करें →',
    class_mismatch1: 'यह कक्षा ',
    class_mismatch2: ' की किताब लगती है, लेकिन आप कक्षा ',
    class_mismatch3: ' के रूप में पंजीकृत हैं। सामग्री को आपकी कक्षा ',
    class_mismatch4: ' के स्तर पर समझाया जाएगा।',
    tip_pdf: 'NCERT PDF अपलोड करें — AI सेकंडों में प्रत्येक पृष्ठ को सरल बनाता है',
    tip_photo: 'तुरंत AI स्पष्टीकरण के लिए अपनी पाठ्यपुस्तक की फोटो लें',
    tip_lang: 'AI आपकी चुनी हुई भाषा में समझाता है — 15+ भारतीय भाषाओं में काम करता है',
    tip_xp: 'आपके द्वारा पूरे किए गए प्रत्येक क्विज़ के लिए XP अंक अर्जित करें',
    go_to_study_tab: 'अपलोड करने के लिए स्टडी टैब पर जाएं',
    ask_anything: 'अपनी पाठ्यपुस्तक के बारे में कुछ भी पूछें',
    for_smarter_answers: 'बेहतर और संदर्भ-आधारित उत्तरों के लिए',
    to_generate_mcqs: 'स्मार्ट MCQs बनाने के लिए',
    to_generate_flashcards: 'फ्लैशकार्ड स्वतः बनाने के लिए',
    to_enable_audio: 'और ऑडियो चालू करने के लिए',
    badge_text: 'बैज:',
    active_study_content: 'सक्रिय अध्ययन सामग्री',
    page_text: 'पृष्ठ',
    prev: 'पिछला',
    next: 'अगला',
    extracting_text: 'टेक्स्ट निकाला जा रहा है...',
    processing_ai: 'AI के साथ प्रोसेस किया जा रहा है...',
    almost_ready: 'लगभग तैयार...',
    captured_image: 'कैप्चर की गई छवि',
    pasted_text: 'पेस्ट किया गया टेक्स्ट',
    ask_me_anything: 'मुझसे कुछ भी पूछें! 😊',
    understand_context: 'मैं आपके अपलोड किए गए पृष्ठ के संदर्भ को समझता हूं और आपकी भाषा में प्रश्नों के उत्तर दे सकता हूं।',
    type_doubt: 'अपना संदेह यहां टाइप करें... (भेजने के लिए Enter दबाएं)',
    press_enter: 'भेजने के लिए Enter दबाएं · नई लाइन के लिए Shift+Enter दबाएं',
    class_label: 'कक्षा',
    hey_user: 'नमस्ते,',
    clear_and_upload: 'साफ़ करें और नया अपलोड करें',
    paste_ncert_below: 'नीचे NCERT टेक्स्ट पेस्ट करें:',
    paste_placeholder: 'अध्याय का पाठ, पैराग्राफ या कोई भी NCERT सामग्री यहां पेस्ट करें...',
    simplify_this: 'इसे सरल बनाएं →',
    cancel: 'रद्द करें',
    capture: 'फोटो लें',
    drop_pdf: 'अपना PDF यहां छोड़ें या ',
    drop_img: 'अपनी छवि यहां छोड़ें या ',
    click_browse: 'ब्राउज़ करने के लिए क्लिक करें',
    supports_pdf: '50MB तक की PDF फ़ाइलों का समर्थन करता है',
    supports_img: 'JPG, PNG, WEBP छवियों का समर्थन करता है',"""

content = content.replace("    press_enter: 'Press Enter to send · Shift+Enter for new line',", "    press_enter: 'Press Enter to send · Shift+Enter for new line',\n" + en_addition)

hi_part = re.search(r"(hi: \{.*?your_class: '[^']+',)", content, re.DOTALL)
if hi_part:
    content = content.replace(hi_part.group(1), hi_part.group(1) + "\n" + hi_addition)
else:
    print('hi: section not found')

with codecs.open(path, 'w', 'utf-8') as f:
    f.write(content)
print('Done!')
