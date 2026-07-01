import sys
import os

# Add backend directory to sys.path so we can import modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from modules.quiz_generator import generate_quiz

import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

text = "அறிவியல் (Science) என்பது இயற்கையைப் பற்றிய முறையான அறிவைப் பெறும் முயற்சியாகும். இது சோதனை, கவனிப்பு மற்றும் பகுப்பாய்வு ஆகியவற்றின் அடிப்படையில் அமைந்துள்ளது."

print("Running generate_quiz in Tamil...")
try:
    result = generate_quiz(text, class_level=10, language="ta")
    print("RESULT SUCCESS:")
    print(result)
except Exception as e:
    print(f"Error occurred: {e}")
