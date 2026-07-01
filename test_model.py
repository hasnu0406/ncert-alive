import sys
import os
from dotenv import load_dotenv
from openai import OpenAI

# Load env to get the API key
load_dotenv(os.path.join("backend", ".env"))
api_key = os.getenv("GROQ_API_KEY", "")

# Initialize the exact client used in ai_engine.py
client = OpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key=api_key,
    max_retries=1
)

model_to_test = "groq/compound-mini"

print(f"Testing model: {model_to_test} on api.groq.com...")
try:
    response = client.chat.completions.create(
        model=model_to_test,
        messages=[
            {"role": "user", "content": "Hello! Reply with OK if you hear me."}
        ],
        max_tokens=10
    )
    print("SUCCESS!")
    print(f"Response: {response.choices[0].message.content}")
except Exception as e:
    print(f"FAILED with api.groq.com base URL.\nError: {e}")

print("-" * 50)

# Try without prefix just in case
model_to_test_no_prefix = "compound-mini"
print(f"Testing model: {model_to_test_no_prefix} on api.groq.com...")
try:
    response = client.chat.completions.create(
        model=model_to_test_no_prefix,
        messages=[
            {"role": "user", "content": "Hello! Reply with OK if you hear me."}
        ],
        max_tokens=10
    )
    print("SUCCESS!")
    print(f"Response: {response.choices[0].message.content}")
except Exception as e:
    print(f"FAILED with api.groq.com base URL.\nError: {e}")
