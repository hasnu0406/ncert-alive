import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv(os.path.join("backend", ".env"))
api_key = os.getenv("GROQ_API_KEY", "")

client = OpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key=api_key,
    max_retries=1
)

for model in ["llama-3.1-8b-instant", "llama3-8b-8192", "mixtral-8x7b-32768", "gemma2-9b-it"]:
    print(f"Testing {model}...")
    try:
        res = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": "Hi"}],
            max_tokens=5
        )
        print(f"{model} SUCCESS")
    except Exception as e:
        print(f"{model} FAILED: {e}")
