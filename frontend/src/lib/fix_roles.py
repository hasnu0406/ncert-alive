import codecs
import re

path = r'c:\Users\hasna\.gemini\antigravity-ide\scratch\ncert-alive\frontend\src\lib\i18n.js'

with codecs.open(path, 'r', 'utf-8', errors='replace') as f:
    content = f.read()

translations = {
    'as': "ছাত্ৰ-ছাত্ৰী আৰু অভিভাৱক প্ৰত্যেকৰে বাবে সমৰ্পিত ডেশ্ববৰ্ড।",
    'bn': "শিক্ষার্থী এবং অভিভাবকদের প্রত্যেকের জন্য একটি ডেডিকেটেড ড্যাশবোর্ড রয়েছে।",
    'gu': "વિદ્યાર્થીઓ અને વાલીઓ દરેકને ડેશબોર્ડ મળે છે.",
    'hinglish': "Students aur parents dono ko ek dashboard milta hai.",
    'kn': "ವಿದ್ಯಾರ್ಥಿಗಳು ಮತ್ತು ಪೋಷಕರು ಪ್ರತಿಯೊಬ್ಬರಿಗೂ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಲಭ್ಯವಿದೆ.",
    'ml': "വിദ്യാർത്ഥികൾക്കും രക്ഷിതാക്കൾക്കും പ്രത്യേകം ഡാഷ്‌ബോർഡുകൾ ലഭിക്കുന്നു.",
    'mr': "विद्यार्थी आणि पालकांना प्रत्येकाला डॅशबोर्ड मिळतो.",
    'or': "ଛାତ୍ରଛାତ୍ରୀ ଏବଂ ଅଭିଭାବକମାନେ ପ୍ରତ୍ୟେକେ ଏକ ଡ୍ୟାସବୋର୍ଡ ପାଆନ୍ତି।",
    'pa': "ਵਿਦਿਆਰਥੀਆਂ ਅਤੇ ਮਾਪਿਆਂ ਨੂੰ ਹਰੇਕ ਨੂੰ ਡੈਸ਼ਬੋਰਡ ਮਿਲਦਾ ਹੈ।",
    'ta': "மாணவர்கள் மற்றும் பெற்றோர்கள் ஒவ்வொருவருக்கும் ஒரு டாஷ்போர்டு கிடைக்கிறது.",
    'te': "విద్యార్థులు మరియు తల్లిదండ్రులకు ఒక్కొక్కరికి డ్యాష్‌బోర్డ్ లభిస్తుంది.",
    'ur': "طلباء اور والدین ہر ایک کو ڈیش بورڈ ملتا ہے۔",
    'hi': "छात्रों और माता-पिता प्रत्येक को एक डैशबोर्ड मिलता है।"
}

for lang, trans in translations.items():
    pattern = r"([ \t]+" + lang + r": \{\r?\n)(.*?)(\r?\n[ \t]*\}(?:,))"
    match = re.search(pattern, content, flags=re.DOTALL)
    if match:
        prefix = match.group(1)
        body = match.group(2)
        suffix = match.group(3)
        
        new_body, count = re.subn(r"roles_sub:\s*'.*?',", f"roles_sub: '{trans}',", body)
        if count > 0:
            content = content[:match.start()] + prefix + new_body + suffix + content[match.end():]
            print(f"Updated {lang}")
        else:
            print(f"roles_sub key not found in {lang}")
    else:
        print(f"Could not find block for {lang}")

with codecs.open(path, 'w', 'utf-8') as f:
    f.write(content)

print("Done replacing.")
