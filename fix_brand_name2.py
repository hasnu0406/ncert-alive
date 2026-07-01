import re

with open(r"frontend/src/lib/extra_i18n.js", "r", encoding="utf-8") as f:
    content = f.read()

# Replace Odia
content = re.sub(r"brand_name:\s*'ଏନସିଇଆରଟି ଆଲାଇଭ୍'", r"brand_name: 'NCERT ଆଲାଇଭ୍'", content)
# Nepali
content = re.sub(r"brand_name:\s*'एनसीईआरटी अलाइभ'", r"brand_name: 'NCERT अलाइभ'", content)
# Maithili (Maithili and Nepali have same translation in previous step so the Nepali replacement already did it, but wait: the above re.sub replaces globally, so both Nepali and Maithili are covered by the second one, but just in case, I'll do it).
# Wait, Nepali and Maithili both got translated to 'एनसीईआरटी अलाइभ'. The above regex will replace all occurrences of it globally because I didn't restrict it by language block.
# Konkani
content = re.sub(r"brand_name:\s*'एनसीईआरटी अलाइव्ह'", r"brand_name: 'NCERT अलाइव्ह'", content)
# Dogri
content = re.sub(r"brand_name:\s*'एनसीईआरटी अलाइव'", r"brand_name: 'NCERT अलाइव'", content)
# Manipuri
content = re.sub(r"brand_name:\s*'এন.সি.ই.আর.তি. এলাইভ'", r"brand_name: 'NCERT এলাইভ'", content)
# Sanskrit
content = re.sub(r"brand_name:\s*'एनसीईआरटी अलाइव्'", r"brand_name: 'NCERT अलाइव्'", content)

with open(r"frontend/src/lib/extra_i18n.js", "w", encoding="utf-8") as f:
    f.write(content)
