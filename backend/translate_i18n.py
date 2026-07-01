import os
import re
import json
import ast
from openai import OpenAI

# Set up OpenRouter client
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY", "")
)

I18N_PATH = r"c:\Users\hasna\.gemini\antigravity-ide\scratch\ncert-alive\frontend\src\lib\i18n.js"

# 1. Read i18n.js
with open(I18N_PATH, "r", encoding="utf-8") as f:
    content = f.read()

# Extract the export const translations = { ... } object
match = re.search(r"export const translations = ({.*});\s*export", content, re.DOTALL)
if not match:
    # Try a looser match
    match = re.search(r"export const translations = ({.*});?\n\nexport function t\(", content, re.DOTALL)

if not match:
    print("Could not parse translations object!")
    exit(1)

dict_str = match.group(1)

# Hacky parser for the JS object to Python dict (requires replacing unquoted keys)
import pyjsparser
parsed = pyjsparser.parse(f"var x = {dict_str}")
properties = parsed['body'][0]['declarations'][0]['init']['properties']

translations = {}
for prop in properties:
    lang_code = prop['key']['name']
    lang_dict = {}
    for subprop in prop['value']['properties']:
        key_name = subprop['key']['name'] if 'name' in subprop['key'] else subprop['key']['value']
        key_val = subprop['value']['value']
        lang_dict[key_name] = key_val
    translations[lang_code] = lang_dict

en_keys = set(translations['en'].keys())

# Language names mapping for prompt context
lang_names = {
    'en': 'English', 'hi': 'Hindi', 'gu': 'Gujarati', 'bn': 'Bengali', 'mr': 'Marathi',
    'te': 'Telugu', 'ta': 'Tamil', 'ur': 'Urdu', 'kn': 'Kannada', 'or': 'Odia',
    'ml': 'Malayalam', 'pa': 'Punjabi', 'as': 'Assamese', 'mai': 'Maithili',
    'sat': 'Santali', 'ks': 'Kashmiri', 'ne': 'Nepali', 'sd': 'Sindhi',
    'kok': 'Konkani', 'doi': 'Dogri', 'brx': 'Bodo', 'mni': 'Manipuri'
}

updated_translations = translations.copy()

for lang_code, lang_dict in updated_translations.items():
    if lang_code == 'en':
        continue
    missing_keys = [k for k in en_keys if k not in lang_dict]
    if not missing_keys:
        continue
    
    print(f"Translating {len(missing_keys)} keys for {lang_names.get(lang_code, lang_code)}...")
    
    # Prepare English dictionary of missing items
    to_translate = {k: translations['en'][k] for k in missing_keys}
    
    prompt = f"""
Translate the following JSON string values from English to {lang_names.get(lang_code, lang_code)}.
Return ONLY valid JSON format, with the exact same keys. No markdown blocks or explanations.

{json.dumps(to_translate, indent=2, ensure_ascii=False)}
"""
    try:
        response = client.chat.completions.create(
            model="meta-llama/llama-3.3-70b-instruct",
            messages=[
                {"role": "system", "content": "You are an expert translator. Translate the JSON values. Keep the JSON keys exactly the same. Only return valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.1,
        )
        
        output = response.choices[0].message.content.strip()
        # Clean up any potential markdown
        if output.startswith("```json"):
            output = output[7:]
        if output.endswith("```"):
            output = output[:-3]
            
        translated_dict = json.loads(output)
        
        for k, v in translated_dict.items():
            lang_dict[k] = v
            
        print(f"Success for {lang_code}")
    except Exception as e:
        print(f"Failed for {lang_code}: {e}")

# Re-serialize back to JS format
def to_js_str(s):
    return "'" + s.replace("'", "\\'") + "'"

new_js = "export const translations = {\n"
for lang_code, lang_dict in updated_translations.items():
    new_js += f"  {lang_code}: {{\n"
    for k in sorted(lang_dict.keys()):
        val = str(lang_dict[k]).replace("'", "\\'").replace('\n', '\\n')
        new_js += f"    {k}: '{val}',\n"
    new_js += "  },\n"
new_js += "};\n"

new_content = content[:match.start(0)] + new_js + content[match.end(1)+1:]

with open(I18N_PATH, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Done updating i18n.js")
