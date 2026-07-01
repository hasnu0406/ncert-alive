from openai import OpenAI
import os, time
from dotenv import load_dotenv

load_dotenv('backend/.env')
c = OpenAI(base_url='https://api.groq.com/openai/v1', api_key=os.getenv('GROQ_API_KEY'))

for model in ['llama-3.1-8b-instant', 'meta-llama/llama-4-scout-17b-16e-instruct']:
    t = time.time()
    try:
        r = c.chat.completions.create(
            model=model,
            messages=[{'role': 'user', 'content': 'Return this exact JSON: {"test": true, "answer": "hello"}'}],
            max_tokens=30
        )
        print(f'{model}: OK in {time.time()-t:.2f}s')
    except Exception as e:
        print(f'{model}: FAILED - {e}')
