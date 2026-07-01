import codecs
import re

path = r'c:\Users\hasna\.gemini\antigravity-ide\scratch\ncert-alive\frontend\src\lib\i18n.js'

with codecs.open(path, 'r', 'utf-8') as f:
    content = f.read()

# Add to hi
hi_addition = """    class_mismatch4: ' के स्तर पर समझाया जाएगा।',
    revisit_class1: 'यह कक्षा ',
    revisit_class2: ' की सामग्री है। आइए इसे बेहतर ढंग से समझने के लिए फिर से देखें।',"""
content = content.replace("    class_mismatch4: ' के स्तर पर समझाया जाएगा।',", hi_addition)

# Add to hinglish
hinglish_addition = """    class_mismatch4: ' ke level par samjhaya jayega.',
    revisit_class1: 'Yeh Class ',
    revisit_class2: ' ka content hai. Chaliye isse behtar samajhne ke liye revisit karein.',"""
content = content.replace("    class_mismatch4: ' ke level par samjhaya jayega.',", hinglish_addition)

with codecs.open(path, 'w', 'utf-8') as f:
    f.write(content)
print("Fix hi/hinglish applied successfully!")
