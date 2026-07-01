import codecs
import re

path = r'c:\Users\hasna\.gemini\antigravity-ide\scratch\ncert-alive\frontend\src\lib\i18n.js'

with codecs.open(path, 'r', 'utf-8', errors='replace') as f:
    content = f.read()

translations = {
    'as': {
        'revisit_class1': "এইটো শ্ৰেণী ", 'revisit_class2': " ৰ সমল। ভালদৰে বুজিবলৈ ইয়াক পুনৰাবৃত্তি কৰোঁ আহক।"
    },
    'bn': {
        'revisit_class1': "এটি ক্লাস ", 'revisit_class2': " এর বিষয়বস্তু। আরও ভালোভাবে বোঝার জন্য আসুন এটি আবার পড়ি।"
    },
    'gu': {
        'revisit_class1': "આ ધોરણ ", 'revisit_class2': " ની સામગ્રી છે. વધુ સારી રીતે સમજવા માટે ચાલો તેનું પુનરાવર્તન કરીએ."
    },
    'hinglish': {
        'revisit_class1': "Yeh Class ", 'revisit_class2': " ka content hai. Chalo isse achhe se samajhne ke liye revisit karein."
    },
    'kn': {
        'revisit_class1': "ಇದು ತರಗತಿ ", 'revisit_class2': " ರ ವಿಷಯ. ಉತ್ತಮವಾಗಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಇದನ್ನು ಪುನರಾವರ್ತಿಸೋಣ."
    },
    'ml': {
        'revisit_class1': "ഇത് ക്ലാസ്സ് ", 'revisit_class2': " ലെ ഉള്ളടക്കമാണ്. നന്നായി മനസ്സിലാക്കാൻ നമുക്കിത് വീണ്ടും വായിക്കാം."
    },
    'mr': {
        'revisit_class1': "हे इयत्ता ", 'revisit_class2': " चे सामग्री आहे. अधिक चांगल्या प्रकारे समजून घेण्यासाठी आपण याची उजळणी करूया."
    },
    'or': {
        'revisit_class1': "ଏହା ଶ୍ରେଣୀ ", 'revisit_class2': " ର ବିଷୟବସ୍ତୁ। ଭଲ ଭାବରେ ବୁଝିବା ପାଇଁ ଆସନ୍ତୁ ଏହାକୁ ପୁନରାବୃତ୍ତି କରିବା।"
    },
    'pa': {
        'revisit_class1': "ਇਹ ਜਮਾਤ ", 'revisit_class2': " ਦੀ ਸਮੱਗਰੀ ਹੈ। ਬਿਹਤਰ ਸਮਝਣ ਲਈ ਆਓ ਇਸਨੂੰ ਦੁਹਰਾਈਏ।"
    },
    'ta': {
        'revisit_class1': "இது வகுப்பு ", 'revisit_class2': " உள்ளடக்கம். நன்றாகப் புரிந்துகொள்ள இதை மீண்டும் படிப்போம்."
    },
    'te': {
        'revisit_class1': "ఇది తరగతి ", 'revisit_class2': " కంటెంట్. మరింత బాగా అర్థం చేసుకోవడానికి దీన్ని పునశ్చరణ చేద్దాం."
    },
    'ur': {
        'revisit_class1': "یہ کلاس ", 'revisit_class2': " کا مواد ہے۔ بہتر طور پر سمجھنے کے لیے آئیے اس کا اعادہ کریں۔"
    },
    'hi': {
        'revisit_class1': "यह कक्षा ", 'revisit_class2': " की सामग्री है। बेहतर ढंग से समझने के लिए आइए इसे दोहराएं।"
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
