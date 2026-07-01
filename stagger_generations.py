import re
import os

filepath = r"frontend/src/pages/StudentView.jsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Add useRef imports if missing (it should be there, but let's check)
if 'useRef' not in content:
    content = content.replace("import { useState, useEffect }", "import { useState, useEffect, useRef }")

# Add refs inside StudentView component
if "const quizTimeoutRef =" not in content:
    # Find start of component
    match = re.search(r"export default function StudentView\(\) \{.*?(const \[)", content, re.DOTALL)
    if match:
        insert_idx = match.end(1) - 7 # before const [
        refs = "\  const quizTimeoutRef = useRef(null)\n  const cardsTimeoutRef = useRef(null)\n"
        content = content[:insert_idx] + refs + content[insert_idx:]

# Replace triggerParallelGenerations
old_func_pattern = r"const triggerParallelGenerations = \(text, lang, meta\) => \{.*?\n  \}"
old_func_match = re.search(old_func_pattern, content, re.DOTALL)

new_func = """const triggerParallelGenerations = (text, lang, meta) => {
    // Clear previous timeouts if user changes language rapidly
    if (quizTimeoutRef.current) clearTimeout(quizTimeoutRef.current);
    if (cardsTimeoutRef.current) clearTimeout(cardsTimeoutRef.current);

    setLoadingQuiz(true);
    quizTimeoutRef.current = setTimeout(() => {
      const fetchQuiz = async () => {
        try { 
          const r = await generateQuiz(text, userClass, lang, meta?.pageId, meta?.docId);
          if (r.status === 'processing') setTimeout(fetchQuiz, 3000);
          else { setQuiz(r.quiz); setLoadingQuiz(false); }
        } catch (err) { 
          setQuiz({ error: err.message || 'Failed to generate quiz' }); setLoadingQuiz(false); 
        }
      }
      fetchQuiz();
    }, 5000);

    setLoadingCards(true);
    cardsTimeoutRef.current = setTimeout(() => {
      const fetchCards = async () => {
        try { 
          const r = await generateFlashcards(text, userClass, lang, meta?.pageId, meta?.docId);
          if (r.status === 'processing') setTimeout(fetchCards, 3000);
          else { setFlashcards(r.flashcards); setLoadingCards(false); }
        } catch (err) { 
          setFlashcards([{ error: err.message || 'Failed to generate flashcards' }]); setLoadingCards(false); 
        }
      }
      fetchCards();
    }, 10000);
  }"""

if old_func_match:
    content = content[:old_func_match.start()] + new_func + content[old_func_match.end():]

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated StudentView.jsx for staggered generation")
