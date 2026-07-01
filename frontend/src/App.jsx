import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { LanguageProvider } from './lib/LanguageContext'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import StudentView from './pages/StudentView'
import ParentDashboard from './pages/ParentDashboard'

function ProtectedRoute({ children, roles }) {
  const user = JSON.parse(localStorage.getItem('ncert_user') || 'null')
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/student" element={
              <ProtectedRoute roles={['student']}><StudentView /></ProtectedRoute>
            } />
            <Route path="/parent" element={
              <ProtectedRoute roles={['parent']}><ParentDashboard /></ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </LanguageProvider>
  )
}
