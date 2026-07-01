import sys
from modules.simplifier import simplify_text_stream

text = """
Natural Resources
Resources that are drawn from Nature and used without much modification are called natural resources. The air we breathe, the water in our rivers and lakes, the soils, minerals are all natural resources. Many of these resources are free gifts of nature and can be used directly. In some cases tools and technology may be needed to use a natural resource in the best possible way.
Natural resources are classified into different groups depending upon their level of development and use; origin; stock and distribution.
"""

print("STREAMING:")
for chunk in simplify_text_stream(text, "en", 8, "geography", False):
    print(chunk, end="", flush=True)
print("\nDONE.")
