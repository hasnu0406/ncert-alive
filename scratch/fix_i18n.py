import codecs

path = r'c:\Users\hasna\.gemini\antigravity-ide\scratch\ncert-alive\frontend\src\lib\i18n.js'

with codecs.open(path, 'r', 'utf-8') as f:
    content = f.read()

correct_block = """    tw_ai_tutor: 'with your AI tutor.',
    tw_multilingual: 'in 20+ Indian languages.',
    tw_score_higher: 'and score higher.',
    tw_smarter_way: 'the smarter way.',
    upload_first: 'Upload a NCERT page first',
    upload_first_desc: 'Upload a NCERT page first — AI simplifies it in your language',
    upload_pdf: 'Upload PDF',
    webcam: 'Webcam',
    welcome_back: 'Welcome back 👋',
    xp_points: 'XP Points',
    your_class: 'Your Class',
    api_key_missing: 'Groq API Key Missing or Invalid',
    api_key_desc1: 'To use AI features, add your',
    api_key_desc2: 'and restart the backend server.',
    api_key_get: 'Get a free key at console.groq.com →',
    class_mismatch1: 'This looks like a Class ',
    class_mismatch2: ' book, but you\\'re registered as Class ',
    class_mismatch3: '. The content will be explained at your Class ',
    class_mismatch4: ' level.',
    revisit_class1: 'This is Class ',
    revisit_class2: ' content. Let\\'s revisit it to understand better.',
    tip_pdf: 'Upload a NCERT PDF — AI simplifies each page in seconds',
    tip_photo: 'Take a photo of your textbook for instant AI explanation',
    tip_lang: 'AI explains in your chosen language — works in 15+ Indian languages',
    tip_xp: 'Earn XP points for every quiz you complete',
    go_to_study_tab: 'Go to Study tab to upload',
    ask_anything: 'Ask anything about your textbook',
    for_smarter_answers: 'for smarter, context-aware answers',
    to_generate_mcqs: 'to generate smart MCQs',
    to_generate_flashcards: 'to auto-generate flashcards',
    to_enable_audio: 'and simplify to enable audio',
    badge_text: 'Badge:',
    active_study_content: 'Active study content',
    page_text: 'Page',
    prev: 'Prev',
    next: 'Next',"""

target = "    tw_ai_tutor: 'with your AI tutor.',"
if target in content:
    content = content.replace(target, correct_block)
    with codecs.open(path, 'w', 'utf-8') as f:
        f.write(content)
    print("Fix applied successfully!")
else:
    print("Target string not found!")

# Now Hindi/Hinglish
# Hindi
hi_target = "    class_mismatch4: ' के स्तर पर समझाया जाएगा।',"
hi_addition = """    class_mismatch4: ' के स्तर पर समझाया जाएगा।',
    revisit_class1: 'यह कक्षा ',
    revisit_class2: ' की सामग्री है। आइए इसे बेहतर ढंग से समझने के लिए फिर से देखें।',"""
if hi_target in content:
    content = content.replace(hi_target, hi_addition)
    
# Hinglish
hinglish_target = "    class_mismatch4: ' ke level par samjhaya jayega.',"
hinglish_addition = """    class_mismatch4: ' ke level par samjhaya jayega.',
    revisit_class1: 'Yeh Class ',
    revisit_class2: ' ka content hai. Chaliye isse behtar samajhne ke liye revisit karein.',"""
if hinglish_target in content:
    content = content.replace(hinglish_target, hinglish_addition)

with codecs.open(path, 'w', 'utf-8') as f:
    f.write(content)
print("Hi/Hinglish checked.")
