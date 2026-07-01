import { createContext, useContext, useState } from 'react'

const Ctx = createContext()

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(
    () => localStorage.getItem('ncert_lang') || 'en'
  )
  const changeLanguage = (code) => {
    setLanguage(code)
    localStorage.setItem('ncert_lang', code)
  }
  return <Ctx.Provider value={{ language, changeLanguage }}>{children}</Ctx.Provider>
}

export function useLanguage() {
  return useContext(Ctx)
}
