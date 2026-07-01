from openai import OpenAI
import os, time
from dotenv import load_dotenv

load_dotenv('backend/.env')
c = OpenAI(base_url='https://api.groq.com/openai/v1', api_key=os.getenv('GROQ_API_KEY'))

t = time.time()
r = c.chat.completions.create(
    model='llama-3.1-8b-instant',
    messages=[{'role': 'user', 'content': 'Return valid JSON only: {"test": true}'}],
    max_tokens=20
)
print(f'llama-3.1-8b-instant: OK in {time.time()-t:.2f}s')
print(r.choices[0].message.content)
