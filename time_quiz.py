from openai import OpenAI
import os, time
from dotenv import load_dotenv

load_dotenv('backend/.env')
c = OpenAI(base_url='https://api.groq.com/openai/v1', api_key=os.getenv('GROQ_API_KEY'))

FAST_MODEL = 'llama-3.1-8b-instant'
QUIZ_SYSTEM = "You are an expert CBSE exam question setter. Generate quiz questions in valid JSON only. No markdown fences, no extra text — pure JSON object."

prompt = """Generate a quiz for Class 10 CBSE students based on the text below.
Respond ONLY in English.

Return a JSON object with this exact structure:
{"mcq":[{"question":"...","options":["A) ...","B) ...","C) ...","D) ..."],"answer":"A) ...","explanation":"..."}],"fill_blanks":[{"question":"The ___ is ...","answer":"...","explanation":"..."}],"one_liners":[{"question":"...","answer":"..."}]}

Generate 3 MCQs, 1 fill-in-the-blank, and 1 one-liner.

NCERT Content:
\"\"\"Plants prepare their own food through a process called photosynthesis. 
In this process, plants use sunlight, water and carbon dioxide to produce food (glucose) and oxygen.
The green pigment chlorophyll in leaves absorbs sunlight. 
This process takes place mainly in the leaves.
The oxygen produced is released into the atmosphere.
\"\"\"
"""

t = time.time()
response = c.chat.completions.create(
    model=FAST_MODEL,
    messages=[
        {"role": "system", "content": QUIZ_SYSTEM},
        {"role": "user", "content": prompt},
    ],
    temperature=0.1,
    max_tokens=1500,
)
elapsed = time.time() - t
content = response.choices[0].message.content
print(f"Time: {elapsed:.2f}s")
print(f"Tokens used: {response.usage.completion_tokens}")
print(content[:200])
