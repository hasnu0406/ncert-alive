import os

path = "i18n.js"
with open(path, "r", encoding="utf-8") as f:
    lines = f.readlines()

print(f"Original length: {len(lines)}")
print("First line to delete:", repr(lines[2511]))
print("Last line to delete:", repr(lines[2636]))
print("First line to KEEP:", repr(lines[2637]))

del lines[2511:2637]

with open(path, "w", encoding="utf-8") as f:
    f.writelines(lines)

print(f"New length: {len(lines)}")
