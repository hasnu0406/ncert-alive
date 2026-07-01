import re

# We will read the extra_i18n.js and replace "brand_name: 'NCERT Alive'" with the translated ones.
with open(r"frontend/src/lib/extra_i18n.js", "r", encoding="utf-8") as f:
    content = f.read()

# Replace for Odia (if not already replaced)
content = re.sub(r"(or:\s*\{[^}]*?)brand_name:\s*'NCERT Alive'", r"\1brand_name: 'ଏନସିଇଆରଟି ଆଲାଇଭ୍'", content)
# Nepali
content = re.sub(r"(ne:\s*\{[^}]*?)brand_name:\s*'NCERT Alive'", r"\1brand_name: 'एनसीईआरटी अलाइभ'", content)
# Maithili
content = re.sub(r"(mai:\s*\{[^}]*?)brand_name:\s*'NCERT Alive'", r"\1brand_name: 'एनसीईआरटी अलाइभ'", content)
# Konkani
content = re.sub(r"(kok:\s*\{[^}]*?)brand_name:\s*'NCERT Alive'", r"\1brand_name: 'एनसीईआरटी अलाइव्ह'", content)
# Dogri
content = re.sub(r"(doi:\s*\{[^}]*?)brand_name:\s*'NCERT Alive'", r"\1brand_name: 'एनसीईआरटी अलाइव'", content)
# Manipuri
content = re.sub(r"(mni:\s*\{[^}]*?)brand_name:\s*'NCERT Alive'", r"\1brand_name: 'এন.সি.ই.আর.তি. এলাইভ'", content)
# Sanskrit
content = re.sub(r"(san:\s*\{[^}]*?)brand_name:\s*'NCERT Alive'", r"\1brand_name: 'एनसीईआरटी अलाइव्'", content)

with open(r"frontend/src/lib/extra_i18n.js", "w", encoding="utf-8") as f:
    f.write(content)
