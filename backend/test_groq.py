import os
# pyrefly: ignore [missing-import]
from openai import OpenAI

# pyrefly: ignore [missing-import]
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key=os.getenv("GROQ_API_KEY")
)

response = client.chat.completions.create(
    model="qwen/qwen3.6-27b",
    messages=[
        {"role": "system", "content": "You are a helpful AI assistant."},
        {"role": "user", "content": "Explain natural resources in a single short paragraph."}
    ],
    temperature=0.5,
    top_p=0.9,
    stream=True,
)

print("STREAMING RESULT:")
for chunk in response:
    if chunk.choices and chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)
print("\nDONE.")
