import sys
import os
import json
import asyncio
import time

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), ".")))
from modules.ai_engine import _client

def extract_en_dict(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    en_lines = lines[384:562]
    en_dict = {}
    for line in en_lines:
        line = line.strip()
        if not line:
            continue
        parts = line.split(":", 1)
        if len(parts) == 2:
            key = parts[0].strip()
            val = parts[1].strip()
            if val.endswith(","): val = val[:-1]
            if val.startswith("'") and val.endswith("'"): val = val[1:-1]
            elif val.startswith('"') and val.endswith('"'): val = val[1:-1]
            val = val.replace("\\'", "'")
            en_dict[key] = val
            
    return en_dict

def ask_ai_json_custom(prompt):
    response = _client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": "You are a professional software localizer. Respond ONLY with valid JSON. Do not include markdown code blocks. The output MUST start with { and end with }."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.1,
        response_format={"type": "json_object"}
    )
    res_text = response.choices[0].message.content
    try:
        return json.loads(res_text)
    except:
        return json.loads(res_text.strip("```json\n").strip("```"))

def main():
    frontend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../frontend/src/lib/i18n.js"))
    en_dict = extract_en_dict(frontend_path)
    
    print(f"Extracted {len(en_dict)} keys from en.")
    
    targets = [
        ("or", "Odia (Oriya script)"),
        ("ne", "Nepali (Devanagari script)"),
        ("mai", "Maithili (Devanagari script)"),
        ("kok", "Konkani (Devanagari script)"),
        ("doi", "Dogri (Devanagari script)"),
        ("mni", "Manipuri / Meiteilon (Meitei Mayek or Bengali script)"),
        ("san", "Sanskrit (Devanagari script)")
    ]
    
    results = {}
    
    for code, lang in targets:
        print(f"Translating for {lang}...")
        prompt = f"Translate the following UI text dictionary to {lang}. Keep the exact same JSON keys. ONLY return a valid JSON object mapping keys to the translated strings.\n\n"
        prompt += json.dumps(en_dict, ensure_ascii=False)
        
        try:
            res = ask_ai_json_custom(prompt)
            results[code] = res
            print(f"Successfully translated {lang}")
            time.sleep(2) # Prevent rate limit burst
        except Exception as e:
            print(f"Failed to translate {lang}: {e}")
            results[code] = en_dict # fallback
            
    out = ""
    for code, _ in targets:
        out += f"  {code}: {{\n"
        for k, v in results[code].items():
            # escape single quotes
            v_esc = str(v).replace("'", "\\'")
            out += f"    {k}: '{v_esc}',\n"
        out += "  },\n"
        
    with open("translations_output.txt", "w", encoding="utf-8") as f:
        f.write(out)
        
    print("Done! Saved to translations_output.txt")

if __name__ == "__main__":
    main()
