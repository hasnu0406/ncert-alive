import urllib.request
import json
import os

langs = ['as', 'bn', 'doi', 'en', 'gu', 'hi', 'hinglish', 'kn', 'kok', 'mai', 'ml', 'mni', 'mr', 'ne', 'or', 'pa', 'san', 'ta', 'te', 'ur']

prompt = '''Translate these 3 phrases into the following languages: 
1. The French Revolution
2. Key Takeaway
3. Explain like I\\'m 10

Return a JSON object where keys are language codes and values are objects with keys \\'topic\\', \\'takeaway\\', \\'eli10\\'.
Languages to translate:
Asamiya (as), Bengali (bn), Dogri (doi), English (en), Gujarati (gu), Hindi (hi), Hinglish (hinglish), Kannada (kn), Konkani (kok), Maithili (mai), Malayalam (ml), Manipuri (mni), Marathi (mr), Nepali (ne), Odia (or), Punjabi (pa), Sanskrit (san), Tamil (ta), Telugu (te), Urdu (ur).

Example:
{
  "hi": { "topic": "फ़्रांसीसी क्रांति", "takeaway": "मुख्य बात", "eli10": "10 साल के बच्चे की तरह समझाएं" },
  "en": { "topic": "The French Revolution", "takeaway": "Key Takeaway", "eli10": "Explain like I\\'m 10" }
}
'''

data = {
    'model': 'google/gemini-2.0-flash-exp:free',
    'messages': [{'role': 'user', 'content': prompt}],
    'response_format': {'type': 'json_object'}
}

from dotenv import load_dotenv
load_dotenv()

req = urllib.request.Request(
    'https://openrouter.ai/api/v1/chat/completions',
    data=json.dumps(data).encode('utf-8'),
    headers={
        'Authorization': f'Bearer {os.environ.get("OPENROUTER_API_KEY")}',
        'Content-Type': 'application/json'
    }
)

try:
    with urllib.request.urlopen(req) as res:
        print(json.loads(res.read().decode())['choices'][0]['message']['content'])
except Exception as e:
    print(e)
