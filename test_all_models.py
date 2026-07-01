from openai import OpenAI
import os, time
from dotenv import load_dotenv

load_dotenv('backend/.env')
c = OpenAI(base_url='https://api.groq.com/openai/v1', api_key=os.getenv('GROQ_API_KEY'))

prompt = 'Return only this exact JSON, no other text: {"mcq":[{"question":"What is photosynthesis?","options":["A) Making food","B) Breathing","C) Sleeping","D) Running"],"answer":"A) Making food","explanation":"Plants make food using sunlight"}],"fill_blanks":[{"question":"Plants use ___ to make food","answer":"sunlight"}],"one_liners":[{"question":"What gas do plants release?","answer":"Oxygen"}]}'

models = [
    'meta-llama/llama-4-scout-17b-16e-instruct',
    'qwen/qwen3.6-27b',
    'qwen/qwen3-32b',
    'allam-2-7b',
    'openai/gpt-oss-20b',
]

for model in models:
    t = time.time()
    try:
        r = c.chat.completions.create(
            model=model,
            messages=[{'role': 'user', 'content': prompt}],
            max_tokens=300
        )
        elapsed = time.time() - t
        print(f'OK {model}: {elapsed:.2f}s')
    except Exception as e:
        err = str(e)[:120].encode('ascii', errors='replace').decode()
        print(f'FAIL {model}: {err}')
