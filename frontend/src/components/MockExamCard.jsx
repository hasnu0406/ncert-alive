import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, ShieldAlert, Award, FileText, CheckCircle2, ChevronRight } from 'lucide-react'
import { generateMockExam, evaluateMockExam } from '../lib/api'

export default function MockExamCard({ pageId, language, onPointsAwarded }) {
  const [exam, setExam] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [answers, setAnswers] = useState({})
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(0)
  const [examActive, setExamActive] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [evalResult, setEvalResult] = useState(null)
  const [evaluating, setEvaluating] = useState(false)
  
  const timerRef = useRef(null)

  const handleStartExam = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await generateMockExam(pageId, language)
      if (data.detail) {
        setError(data.detail)
      } else {
        setExam(data)
        // Initialize blank answers
        const initialAnswers = {}
        data.sections.forEach(sec => {
          sec.questions.forEach(q => {
            initialAnswers[q.questionId] = ''
          })
        })
        setAnswers(initialAnswers)
        setTimeLeft(data.timeLimitMinutes * 60)
        setExamActive(true)
        setSubmitted(false)
        setEvalResult(null)
      }
    } catch (err) {
      setError(err.message || 'Failed to generate mock exam')
    } finally {
      setLoading(false)
    }
  }

  // Timer countdown hook
  useEffect(() => {
    if (examActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timerRef.current)
            handleSubmitExam() // Auto submit on timer end!
            return 0
          }
          return t - 1
        })
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [examActive, timeLeft])

  const handleAnswerChange = (qId, value) => {
    setAnswers(prev => ({
      ...prev,
      [qId]: value
    }))
  }

  const handleSubmitExam = async () => {
    clearInterval(timerRef.current)
    setExamActive(false)
    setEvaluating(true)
    setError('')
    try {
      const res = await evaluateMockExam(exam._id, answers)
      setEvalResult(res)
      setSubmitted(true)
      if (onPointsAwarded) {
        onPointsAwarded(res.marksObtained >= res.totalMarks ? 20 : 5)
      }
    } catch (err) {
      setError(err.message || 'Failed to evaluate exam paper')
      setExamActive(true) // let them try submitting again
    } finally {
      setEvaluating(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  return (
    <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 24, color: '#fff' }}>
      {!exam && !loading && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(99,102,241,0.12)', border: '2px solid rgba(99,102,241,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <FileText size={28} color="#818cf8" />
          </div>
          <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 18, marginBottom: 8 }}>CBSE Mock Exam Generator</h3>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', maxWidth: 420, margin: '0 auto 20px', lineHeight: 1.6 }}>
            Generate a custom, structured CBSE exam paper directly from this NCERT chapter page. Complete it under a timer and get evaluated by our AI CBSE evaluator!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartExam}
            style={{
              padding: '12px 28px', borderRadius: 14,
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              border: 'none', color: '#fff', fontSize: 13.5, fontWeight: 700,
              cursor: 'pointer', fontFamily: "'Outfit',sans-serif",
              boxShadow: '0 4px 20px rgba(99,102,241,0.3)'
            }}
          >
            Start Mock Exam
          </motion.button>
          {error && <div style={{ fontSize: 13, color: '#f87171', fontWeight: 600, marginTop: 14 }}>⚠️ {error}</div>}
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div className="spinner" style={{ width: 40, height: 40, border: '4px solid rgba(255,255,255,0.1)', borderTopColor: '#818cf8', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', margin: 0 }}>Generating CBSE mock exam questions from your chapter...</p>
        </div>
      )}

      {examActive && exam && (
        <div>
          {/* Active Exam Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 16, marginBottom: 20 }}>
            <div>
              <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 18, margin: '0 0 4px 0' }}>{exam.title}</h3>
              <span style={{ fontSize: 12, color: '#818cf8', fontWeight: 600 }}>CBSE Format</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: timeLeft < 60 ? 'rgba(239,68,68,0.12)' : 'rgba(99,102,241,0.1)', border: `1px solid ${timeLeft < 60 ? '#ef4444' : 'rgba(99,102,241,0.2)'}`, padding: '6px 14px', borderRadius: 100 }}>
              <Clock size={15} color={timeLeft < 60 ? '#ef4444' : '#818cf8'} />
              <span style={{ fontSize: 13, fontWeight: 700, color: timeLeft < 60 ? '#ef4444' : '#fff', minWidth: 40, fontFamily: 'monospace' }}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          {/* Exam Questions Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {exam.sections.map((sec, sIdx) => (
              <div key={sIdx} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 18, padding: 20 }}>
                <h4 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 14, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: 8, marginBottom: 16 }}>
                  {sec.sectionName}
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {sec.questions.map((q) => (
                    <div key={q.questionId}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
                        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>
                          {q.questionText}
                        </span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#fcd34d', background: 'rgba(252,211,77,0.08)', border: '1px solid rgba(252,211,77,0.18)', padding: '2px 8px', borderRadius: 6, flexShrink: 0 }}>
                          [{q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}]
                        </span>
                      </div>

                      {/* Render options for MCQs, otherwise text area for SAQs */}
                      {q.options ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
                          {q.options.map((opt) => {
                            const optChar = opt[0] // e.g. 'A'
                            const isSelected = answers[q.questionId] === optChar
                            return (
                              <button
                                key={opt}
                                onClick={() => handleAnswerChange(q.questionId, optChar)}
                                style={{
                                  padding: '12px 16px', borderRadius: 12, textAlign: 'left',
                                  background: isSelected ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.02)',
                                  border: `1px solid ${isSelected ? '#818cf8' : 'rgba(255,255,255,0.08)'}`,
                                  color: isSelected ? '#a5b4fc' : 'rgba(255,255,255,0.7)',
                                  fontSize: 13, cursor: 'pointer', outline: 'none', transition: 'all 0.15s'
                                }}
                              >
                                {opt}
                              </button>
                            )
                          })}
                        </div>
                      ) : (
                        <textarea
                          rows={3}
                          value={answers[q.questionId]}
                          onChange={(e) => handleAnswerChange(q.questionId, e.target.value)}
                          placeholder="Type your structured answer here..."
                          style={{
                            width: '100%', padding: '12px 16px', borderRadius: 12,
                            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                            color: '#fff', fontSize: 13.5, outline: 'none', resize: 'vertical',
                            fontFamily: "'Plus Jakarta Sans',sans-serif"
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
            <button
              onClick={() => {
                if (window.confirm("Abandon exam? Your progress will be lost.")) {
                  setExam(null)
                  setExamActive(false)
                }
              }}
              style={{ padding: '12px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitExam}
              style={{ padding: '12px 28px', borderRadius: 12, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: '0 4px 14px rgba(99,102,241,0.25)' }}
            >
              Submit Exam Paper
            </button>
          </div>
        </div>
      )}

      {evaluating && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div className="spinner" style={{ width: 40, height: 40, border: '4px solid rgba(255,255,255,0.1)', borderTopColor: '#34d399', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', margin: 0 }}>Evaluating your answer sheets against CBSE marking criteria...</p>
        </div>
      )}

      {submitted && evalResult && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Result Banner */}
          <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.22)', borderRadius: 20, padding: 24, display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
            <div style={{ width: 54, height: 54, borderRadius: '50%', background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={28} color="#34d399" />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#34d399', marginBottom: 4 }}>Exam Result</div>
              <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 24, margin: 0 }}>
                {evalResult.marksObtained} / {evalResult.totalMarks} Marks
              </h3>
            </div>
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.45)' }}>
                Grade {(() => {
                  const tot = evalResult.totalMarks || 1
                  const pct = (evalResult.marksObtained / tot) * 100
                  if (pct >= 90) return 'A+'
                  if (pct >= 80) return 'A'
                  if (pct >= 70) return 'B'
                  if (pct >= 60) return 'C'
                  if (pct >= 40) return 'D'
                  return 'E'
                })()}
              </span>
            </div>
          </div>

          {/* AI Feedback */}
          <div style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 20, padding: 20, marginBottom: 24 }}>
            <h4 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 14, color: '#a5b4fc', margin: '0 0 10px 0' }}>Examiner's Feedback</h4>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, margin: 0 }}>{evalResult.feedback}</p>
          </div>

          {/* Question breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {exam.sections.map((sec) => (
              <div key={sec.sectionName}>
                <h4 style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>{sec.sectionName}</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {sec.questions.map((q) => {
                    const qEval = evalResult.evaluations[q.questionId] || {}
                    return (
                      <div key={q.questionId} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 16, padding: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                          <span style={{ fontSize: 13.5, color: '#fff', fontWeight: 600 }}>{q.questionText}</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#34d399' }}>
                            {qEval.marksAwarded} / {q.marks} Marks
                          </span>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12.5, lineHeight: 1.5 }}>
                          <div>
                            <strong style={{ color: 'rgba(255,255,255,0.4)' }}>Your Answer: </strong>
                            <span style={{ color: 'rgba(255,255,255,0.7)' }}>{answers[q.questionId] || '(Blank)'}</span>
                          </div>
                          <div>
                            <strong style={{ color: '#34d399' }}>Model Answer / Rubric: </strong>
                            <span style={{ color: 'rgba(52,211,153,0.85)' }}>{qEval.correctAnswer || q.correctOption}</span>
                          </div>
                          <div style={{ background: 'rgba(255,255,255,0.01)', borderRadius: 8, padding: 10, marginTop: 4 }}>
                            <strong style={{ color: '#a5b4fc', fontSize: 11.5, display: 'block', marginBottom: 2 }}>Evaluation Rationale:</strong>
                            <span style={{ color: 'rgba(255,255,255,0.5)' }}>{qEval.modelExplanation || 'Graded successfully.'}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setExam(null)
                setSubmitted(false)
              }}
              style={{ padding: '12px 28px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
            >
              Take Another Exam
            </motion.button>
          </div>
        </motion.div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
