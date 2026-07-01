import sys
import os
from modules.simplifier import simplify_text

# Text to simplify (Class 10 History topic)
text = """
The Rise of Nationalism in Europe.
In 1848, Frédéric Sorrieu, a French artist, prepared a series of four prints visualising his dream of a world made up of 'democratic and social Republics', as he called them. The first print of the series, shows the peoples of Europe and America - men and women of all ages and social classes - marching in a long train, and offering homage to the statue of Liberty as they pass by it.
"""

print("Running AI Simplifier...")
try:
    simplified = simplify_text(text, language="en", class_level=10, subject="history", eli10=False)
    print("\n[OK] AI Simplifier pipeline completed successfully!")
    print(f"Original Text Length: {len(text)} characters")
    print(f"Simplified Text Length: {len(simplified)} characters")
    print("\n--- Simplified Sample Output ---")
    print(simplified[:400].encode('ascii', errors='ignore').decode('ascii') + "...")
except Exception as e:
    print(f"[FAILED] AI Simplifier test: {e}")
    sys.exit(1)
