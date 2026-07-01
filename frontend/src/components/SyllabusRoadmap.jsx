import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Target, Lock, CheckCircle2, Award, BookOpen } from 'lucide-react'
import { getSyllabusRoadmap, getClassSubjects } from '../lib/api'

export default function SyllabusRoadmap({ language }) {
  const [subjects, setSubjects] = useState([])
  const [subject, setSubject] = useState('')
  const [roadmap, setRoadmap] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getClassSubjects().then((list) => {
      setSubjects(list || [])
      if (list && list.length > 0) {
        setSubject(list[0])
      }
    }).catch(e => console.error("Error loading subjects:", e))
  }, [])

  const fetchRoadmap = () => {
    if (!subject) return
    setLoading(true)
    getSyllabusRoadmap(subject)
      .then((data) => {
        setRoadmap(data || [])
        setLoading(false)
      })
      .catch((e) => {
        console.error("Error fetching roadmap:", e)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchRoadmap()
  }, [subject])

  return (
    <div style={{ background: 'rgba(14,12,27,0.7)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: '28px 24px', color: '#fff' }}>
      
      {/* Header and Subject Selectors */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 20, margin: '0 0 4px 0' }}>NCERT Syllabus Roadmap</h3>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', margin: 0 }}>
            Complete quizzes with 70%+ score to master chapters on your roadmap!
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 4, flexWrap: 'wrap' }}>
          {subjects.map((sub) => (
            <button
              key={sub}
              onClick={() => setSubject(sub)}
              style={{
                padding: '8px 16px', borderRadius: 10, border: 'none',
                background: subject === sub ? 'rgba(99,102,241,0.15)' : 'transparent',
                color: subject === sub ? '#a5b4fc' : 'rgba(255,255,255,0.5)',
                fontWeight: 700, fontSize: 12.5, textTransform: 'capitalize',
                cursor: 'pointer', fontFamily: "'Outfit',sans-serif", transition: 'all 0.2s'
              }}
            >
              {sub.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ height: 72, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 16 }} />
          ))}
        </div>
      ) : (
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 20, paddingLeft: 10 }}>
          {/* Vertical Timeline Bar */}
          <div style={{ position: 'absolute', left: 29, top: 20, bottom: 20, width: 2, background: 'linear-gradient(180deg, rgba(99,102,241,0.3), rgba(255,255,255,0.05))', zIndex: 0 }} />

          {roadmap.map((node, index) => {
            const isCompleted = node.status === 'mastered'
            const isInProgress = node.status === 'in_progress'
            const isLocked = node.status === 'locked'

            return (
              <motion.div
                key={node.chapterNumber}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 20,
                  position: 'relative', zIndex: 1,
                  background: isLocked ? 'transparent' : 'rgba(255,255,255,0.015)',
                  border: isLocked ? '1px dashed rgba(255,255,255,0.05)' : '1px solid rgba(255,255,255,0.05)',
                  borderRadius: 18, padding: '16px 20px',
                  opacity: isLocked ? 0.5 : 1
                }}
              >
                {/* Node icon */}
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isCompleted ? 'rgba(52,211,153,0.12)' : isInProgress ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.05)',
                  border: `2px solid ${isCompleted ? '#34d399' : isInProgress ? '#818cf8' : 'rgba(255,255,255,0.1)'}`,
                  boxShadow: isInProgress ? '0 0 12px rgba(129,140,248,0.25)' : 'none',
                  flexShrink: 0
                }}>
                  {isCompleted ? (
                    <CheckCircle2 size={18} color="#34d399" />
                  ) : isInProgress ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}>
                      <Target size={18} color="#818cf8" />
                    </motion.div>
                  ) : (
                    <Lock size={16} color="rgba(255,255,255,0.3)" />
                  )}
                </div>

                {/* Node content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: isCompleted ? '#34d399' : isInProgress ? '#818cf8' : 'rgba(255,255,255,0.3)' }}>
                      Chapter {node.chapterNumber}
                    </span>
                    {isCompleted && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: '#fcd34d' }}>
                        <Award size={12} /> Mastered · {node.quizScore}% Quiz Score
                      </span>
                    )}
                  </div>
                  <h4 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 15, margin: '4px 0 2px 0', color: isLocked ? 'rgba(255,255,255,0.6)' : '#fff' }}>
                    {node.chapterName}
                  </h4>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: 0 }}>
                    {isCompleted ? 'All targets met' : isInProgress ? 'Upload pages matching this chapter topic to complete quizzes!' : 'Syllabus chapter locked'}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
