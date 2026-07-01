import os
import re

# 1. frontend/src/lib/i18n.js
fpath = r"frontend/src/lib/i18n.js"
if os.path.exists(fpath):
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()
    # Remove the array element
    content = re.sub(r"\s*\{\s*code:\s*'hinglish'.*?\},", "", content)
    # Remove the hinglish translation dictionary block
    # It looks like hinglish: { ... },
    content = re.sub(r"\s*hinglish:\s*\{[^}]*\},", "", content)
    with open(fpath, "w", encoding="utf-8") as f:
        f.write(content)

# 2. frontend/src/components/LanguageDropdown.jsx
fpath = r"frontend/src/components/LanguageDropdown.jsx"
if os.path.exists(fpath):
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()
    # const shortLabel = current.code === 'hinglish' ? 'HIN' : current.code.toUpperCase()
    content = content.replace("current.code === 'hinglish' ? 'HIN' : current.code.toUpperCase()", "current.code.toUpperCase()")
    with open(fpath, "w", encoding="utf-8") as f:
        f.write(content)

# 3. frontend/src/components/ExplanationCard.jsx
fpath = r"frontend/src/components/ExplanationCard.jsx"
if os.path.exists(fpath):
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()
    content = re.sub(r"\s*hinglish:\s*\{.*?\},", "", content)
    with open(fpath, "w", encoding="utf-8") as f:
        f.write(content)

# 4. backend/modules/languages.py
fpath = r"backend/modules/languages.py"
if os.path.exists(fpath):
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()
    content = re.sub(r'\s*"hinglish"\s*:\s*"[^"]*",', "", content)
    content = re.sub(r'\s*elif language == "hinglish":\s*return[\s\S]*?(?=\s*elif|\s*else:)', "", content)
    with open(fpath, "w", encoding="utf-8") as f:
        f.write(content)

# 5. backend/modules/audio.py
fpath = r"backend/modules/audio.py"
if os.path.exists(fpath):
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()
    content = re.sub(r'\s*"hinglish"\s*:\s*"hi".*?,', "", content)
    with open(fpath, "w", encoding="utf-8") as f:
        f.write(content)

# 6. backend/modules/translator.py
fpath = r"backend/modules/translator.py"
if os.path.exists(fpath):
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()
    content = re.sub(r'\s*"hinglish"\s*:\s*"[^"]*",', "", content)
    with open(fpath, "w", encoding="utf-8") as f:
        f.write(content)
