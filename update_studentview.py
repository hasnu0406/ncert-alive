import re
import os

filepath = r"frontend/src/pages/StudentView.jsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Add triggerParallelGenerations before handleTextExtracted
parallel_fn = """
  const triggerParallelGenerations = (text, lang, meta) => {
    setLoadingQuiz(true);
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

    setLoadingCards(true);
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
  }

  const handleTextExtracted = async (text, meta = {}) => {
"""
content = content.replace("  const handleTextExtracted = async (text, meta = {}) => {", parallel_fn)

# In handleTextExtracted, add triggerParallelGenerations
old_extracted = """    setApiKeyError(false); setTab('upload')
    await fetchExplanation(text, language, meta, false)"""
new_extracted = """    setApiKeyError(false); setTab('upload')
    triggerParallelGenerations(text, language, meta)
    await fetchExplanation(text, language, meta, false)"""
content = content.replace(old_extracted, new_extracted)

# In useEffect for language change, add triggerParallelGenerations
old_use_effect = """        setExplanation(''); setQuiz(null); setFlashcards([])
        fetchExplanation(rawText, language, pageMeta, false)
      }"""
new_use_effect = """        setExplanation(''); setQuiz(null); setFlashcards([])
        triggerParallelGenerations(rawText, language, pageMeta)
        fetchExplanation(rawText, language, pageMeta, false)
      }"""
content = content.replace(old_use_effect, new_use_effect)

# Update handleTabChange to prevent double-fetching if already loading
content = content.replace("if (newTab === 'quiz' && !quiz && rawText) {", "if (newTab === 'quiz' && !quiz && !loadingQuiz && rawText) {")
content = content.replace("if (newTab === 'flashcards' && !flashcards.length && rawText) {", "if (newTab === 'flashcards' && !flashcards.length && !loadingCards && rawText) {")

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
