import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Camera, FileText, X, CheckCircle, Loader2, Image } from 'lucide-react'
import { uploadPDF, uploadImage } from '../lib/api'
import { t } from '../lib/i18n'

export default function PageUploader({ onTextExtracted, triggerAction, onTriggerConsumed, isMinimized, onClear, language = 'en', classLevel = 10, pageMeta }) {
  const [mode, setMode] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [pageNum, setPageNum] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [pdfFile, setPdfFile] = useState(null)
  const [pdfBytes, setPdfBytes] = useState(null)
  const [pages, setPages] = useState([])
  const fileRef = useRef()
  const videoRef = useRef()
  const canvasRef = useRef()
  const [webcamStream, setWebcamStream] = useState(null)
  const [webcamReady, setWebcamReady] = useState(false)
  const [textInput, setTextInput] = useState('')
  const [showTextInput, setShowTextInput] = useState(false)

  const handleReset = () => {
    setPdfFile(null)
    setPdfBytes(null)
    setPageNum(1)
    setTotalPages(0)
    setPages([])
    setMode(null)
    setShowTextInput(false)
    setTextInput('')
    setError('')
    onClear?.()
  }

  useEffect(() => {
    if (!triggerAction) return
    if (triggerAction === 'webcam') { setMode('webcam'); startWebcam() }
    else if (triggerAction === 'text') { setShowTextInput(true); setMode(null) }
    else { setMode(triggerAction); setShowTextInput(false); setTimeout(() => fileRef.current?.click(), 100) }
    onTriggerConsumed?.()
  }, [triggerAction])

  useEffect(() => {
    if (pageMeta && pageMeta.pageId) {
      if (pageMeta.pageId.includes('-p')) {
        const parts = pageMeta.pageId.split('-p')
        const pNum = parseInt(parts[parts.length - 1], 10) || 1
        setPageNum(pNum)
      } else {
        setPageNum(1)
      }
      if (pageMeta.totalPages) {
        setTotalPages(pageMeta.totalPages)
      }
      if (pageMeta.pages) {
        setPages(pageMeta.pages)
      }
    }
  }, [pageMeta])

  const simulateProgress = () => {
    setProgress(0)
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 90) { clearInterval(interval); return 90 }
        return p + Math.random() * 15
      })
    }, 200)
    return () => clearInterval(interval)
  }

  const handlePDFFile = async (file) => {
    if (file.size > 4.2 * 1024 * 1024) {
      setError('PDF file is too large (Vercel limit is 4.5MB). Please split your PDF, upload fewer pages, or copy-paste the text directly using the "Paste Text" tab!');
      return;
    }
    setLoading(true); setError(''); setPdfFile(file)
    const stopProgress = simulateProgress()
    try {
      const bytes = await file.arrayBuffer()
      setPdfBytes(bytes)
      const res = await uploadPDF(file, language, classLevel)
      setTotalPages(res.total_pages || 1)
      const extractedPages = res.pages || []
      setPages(extractedPages)
      setProgress(100)
      setTimeout(() => {
        const firstPage = extractedPages[0]
        if (firstPage) {
          onTextExtracted(firstPage.text, { 
            pageId: firstPage.page_id, 
            fileName: file.name, 
            docId: res.doc_id,
            totalPages: res.total_pages || 1,
            pages: extractedPages
          })
        }
        setLoading(false); setProgress(0)
      }, 500)
    } catch (e) {
      setError(e.message); setLoading(false); setProgress(0)
    }
  }

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return
    setPageNum(newPage)
    const targetPage = pages[newPage - 1]
    if (targetPage) {
      const pid = targetPage.page_id || targetPage.pageId
      const docId = pid.split('-p')[0]
      onTextExtracted(targetPage.text, { 
        pageId: pid, 
        fileName: pdfFile?.name || pageMeta?.fileName || pageMeta?.topic, 
        docId,
        totalPages,
        pages
      })
    }
  }

  const handleImageFile = async (file) => {
    setLoading(true); setError('')
    const stopProgress = simulateProgress()
    try {
      const res = await uploadImage(file)
      setProgress(100)
      setTimeout(() => {
        const id = Date.now()
        onTextExtracted(res.text, { pageId: `img-${id}`, docId: `doc-img-${id}` })
        setLoading(false); setProgress(0)
      }, 400)
    } catch (e) { setError(e.message); setLoading(false); setProgress(0) }
  }

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      setWebcamStream(stream)
      setWebcamReady(false)
      setTimeout(() => {
        if (videoRef.current) { videoRef.current.srcObject = stream; setWebcamReady(true) }
      }, 100)
    } catch { setError('Camera permission denied') }
  }

  const captureWebcam = async () => {
    if (!videoRef.current || !canvasRef.current) return
    const canvas = canvasRef.current
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0)
    canvas.toBlob(async (blob) => {
      const file = new File([blob], 'webcam.jpg', { type: 'image/jpeg' })
      webcamStream?.getTracks().forEach(t => t.stop())
      setWebcamStream(null); setWebcamReady(false); setMode(null)
      await handleImageFile(file)
    }, 'image/jpeg', 0.95)
  }

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false)
    const file = e.dataTransfer.files[0]
    if (!file) return
    if (file.type === 'application/pdf') handlePDFFile(file)
    else if (file.type.startsWith('image/')) handleImageFile(file)
  }

  const handleTextSubmit = () => {
    if (!textInput.trim()) return
    const id = Date.now()
    onTextExtracted(textInput.trim(), { pageId: `text-${id}`, docId: `doc-text-${id}` })
    setTextInput(''); setShowTextInput(false)
  }

  // ─── MINIMIZED BAR ────────────────────────────────────────────────────────
  if (isMinimized) {
    const isPDF = !!(pdfFile || pageMeta?.fileName)
    const isImg = mode === 'webcam' || (!isPDF && mode === 'image') || pageMeta?.pageId?.startsWith('img-')
    const displayName = (pdfFile?.name || pageMeta?.fileName) 
      ? (pdfFile?.name || pageMeta?.fileName) 
      : (pageMeta?.topic && pageMeta.topic !== 'Unknown')
        ? pageMeta.topic
        : isImg 
          ? t(language, 'captured_image') 
          : t(language, 'pasted_text')
    const DisplayIcon = isPDF ? FileText : isImg ? Image : FileText

    return (
      <div className="w-full">
        {loading ? (
          <div
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16,
              padding: '20px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Loader2 size={18} style={{ color: '#818cf8', flexShrink: 0 }} className="animate-spin" />
              <span style={{ fontSize: 14, color: '#d1d5db' }}>
                {progress < 30 ? t(language, 'extracting_text') : progress < 70 ? t(language, 'processing_ai') : t(language, 'almost_ready')}
              </span>
            </div>
            <div style={{ width: '100%', background: 'rgba(255,255,255,0.08)', borderRadius: 99, height: 6, overflow: 'hidden' }}>
              <motion.div
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
                style={{
                  height: 6,
                  borderRadius: 99,
                  background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)',
                }}
              />
            </div>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textAlign: 'right', margin: 0 }}>
              {Math.round(progress)}%
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16,
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            {/* Left: file icon + name + page info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0, flex: 1 }}>
              <div
                style={{
                  width: 42, height: 42, flexShrink: 0,
                  borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(99,102,241,0.14)',
                }}
              >
                <DisplayIcon size={18} style={{ color: '#818cf8' }} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 14, fontWeight: 600, color: '#f9fafb',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    maxWidth: 260, marginBottom: 3,
                  }}
                >
                  {displayName}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.4 }}>
                  {t(language, 'active_study_content')}
                  {isPDF && (
                    <span style={{ marginLeft: 6 }}>
                      · {t(language, 'page_text')} {pageNum} / {totalPages}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Prev/Next + Clear */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, flexWrap: 'wrap' }}>
              {isPDF && totalPages > 1 && (
                <div
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 12, padding: '4px 6px',
                  }}
                >
                  <button
                    disabled={pageNum <= 1}
                    onClick={() => handlePageChange(pageNum - 1)}
                    style={{
                      padding: '7px 16px', fontSize: 13, fontWeight: 700,
                      color: pageNum <= 1 ? 'rgba(255,255,255,0.2)' : '#e5e7eb',
                      background: 'transparent', border: 'none', borderRadius: 9,
                      cursor: pageNum <= 1 ? 'not-allowed' : 'pointer',
                      transition: 'background 0.15s', whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={e => { if (pageNum > 1) e.target.style.background = 'rgba(255,255,255,0.08)' }}
                    onMouseLeave={e => e.target.style.background = 'transparent'}
                  >
                    {t(language, 'prev')}
                  </button>
                  <span
                    style={{
                      fontSize: 12, fontWeight: 600, color: '#a5b4fc',
                      background: 'rgba(99,102,241,0.12)', borderRadius: 8,
                      padding: '5px 12px', whiteSpace: 'nowrap',
                    }}
                  >
                    {t(language, 'page_text')} {pageNum} / {totalPages}
                  </span>
                  <button
                    disabled={pageNum >= totalPages}
                    onClick={() => handlePageChange(pageNum + 1)}
                    style={{
                      padding: '7px 16px', fontSize: 13, fontWeight: 700,
                      color: pageNum >= totalPages ? 'rgba(255,255,255,0.2)' : '#e5e7eb',
                      background: 'transparent', border: 'none', borderRadius: 9,
                      cursor: pageNum >= totalPages ? 'not-allowed' : 'pointer',
                      transition: 'background 0.15s', whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={e => { if (pageNum < totalPages) e.target.style.background = 'rgba(255,255,255,0.08)' }}
                    onMouseLeave={e => e.target.style.background = 'transparent'}
                  >
                    {t(language, 'next')}
                  </button>
                </div>
              )}

              <button
                onClick={handleReset}
                style={{
                  fontSize: 13, fontWeight: 700, color: '#f87171',
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                  padding: '9px 20px', borderRadius: 12, cursor: 'pointer',
                  whiteSpace: 'nowrap', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.target.style.background = 'rgba(239,68,68,0.18)' }}
                onMouseLeave={e => { e.target.style.background = 'rgba(239,68,68,0.1)' }}
              >
                {t(language, 'clear_and_upload')}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    )
  }

  // ─── FULL UPLOADER ────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

      {/* Mode selector */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {[
          { id: 'pdf', icon: FileText, label: t(language, 'upload_pdf'), color: '#6366f1' },
          { id: 'image', icon: Image, label: t(language, 'photo'), color: '#8b5cf6' },
          { id: 'webcam', icon: Camera, label: t(language, 'webcam'), color: '#06b6d4' },
          { id: 'text', icon: Upload, label: t(language, 'paste_text'), color: '#10b981' },
        ].map(({ id, icon: Icon, label, color }) => (
          <motion.button
            key={id}
            whileHover={{ scale: 1.04, y: -2, boxShadow: `0 8px 24px ${color}22` }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              if (id === 'webcam') { setMode('webcam'); startWebcam() }
              else if (id === 'text') { setShowTextInput(!showTextInput); setMode(null) }
              else { setMode(id); setShowTextInput(false); setTimeout(() => fileRef.current?.click(), 100) }
            }}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
              padding: '18px 16px', borderRadius: 16,
              border: `1px solid ${mode === id ? color + '60' : 'rgba(255,255,255,0.07)'}`,
              background: mode === id ? `${color}12` : 'rgba(255,255,255,0.025)',
              cursor: 'pointer', minWidth: 120, flex: '1 1 130px', transition: 'all 0.2s',
            }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg, ${color}25, ${color}45)` }}>
              <Icon size={22} style={{ color }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)', fontFamily: "'Plus Jakarta Sans', sans-serif", textAlign: 'center', lineHeight: 1.4 }}>{label}</span>
          </motion.button>
        ))}
      </div>

      {/* Hidden file input */}
      <input ref={fileRef} type="file" className="hidden"
        accept={mode === 'pdf' ? '.pdf' : 'image/*'}
        onChange={e => {
          const f = e.target.files[0]; if (!f) return
          mode === 'pdf' ? handlePDFFile(f) : handleImageFile(f)
          e.target.value = ''
        }} />

      {/* Text input */}
      <AnimatePresence>
        {showTextInput && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <div style={{ background: 'rgba(18,16,35,0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: '20px 22px' }}>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 14, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{t(language, 'paste_ncert_below')}</p>
              <textarea
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
                  borderRadius: 12, color: '#f8f7ff', padding: '14px 16px',
                  fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14.5, lineHeight: 1.8,
                  outline: 'none', resize: 'none', boxSizing: 'border-box',
                }}
                rows={6}
                placeholder={t(language, 'paste_placeholder')}
                value={textInput}
                onChange={e => setTextInput(e.target.value)}
              />
              <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                <button onClick={handleTextSubmit}
                  style={{
                    padding: '12px 22px', borderRadius: 12, border: 'none', cursor: 'pointer',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: '#fff', fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 14,
                  }}>{t(language, 'simplify_this')}</button>
                <button onClick={() => setShowTextInput(false)}
                  style={{
                    padding: '12px 22px', borderRadius: 12, cursor: 'pointer',
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.6)', fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 14,
                  }}>{t(language, 'cancel')}</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drag and drop zone */}
      <AnimatePresence>
        {(mode === 'pdf' || mode === 'image') && !loading && !pdfFile && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            style={{
              border: `2px dashed ${dragging ? 'rgba(99,102,241,0.7)' : 'rgba(255,255,255,0.12)'}`,
              borderRadius: 20, padding: '48px 32px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
              cursor: 'pointer', transition: 'all 0.3s',
              background: dragging ? 'rgba(99,102,241,0.06)' : 'rgba(255,255,255,0.015)',
            }}
            whileHover={{ borderColor: 'rgba(99,102,241,0.5)', background: 'rgba(99,102,241,0.04)' }}
          >
            <Upload size={36} style={{ color: dragging ? '#818cf8' : 'rgba(255,255,255,0.25)' }} />
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', margin: '0 0 4px', fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.6 }}>
                {mode === 'pdf' ? t(language, 'drop_pdf') || 'Drop your PDF here or ' : t(language, 'drop_img') || 'Drop your image here or '}
                <span style={{ color: '#818cf8', fontWeight: 700 }}>{t(language, 'click_browse') || 'click to browse'}</span>
              </p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {mode === 'pdf' ? t(language, 'supports_pdf') || 'Supports PDF files up to 50MB' : t(language, 'supports_img') || 'Supports JPG, PNG, WEBP images'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Webcam */}
      <AnimatePresence>
        {mode === 'webcam' && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="glass rounded-xl overflow-hidden">
            <video ref={videoRef} autoPlay playsInline className="w-full rounded-xl" style={{ maxHeight: 300 }} />
            <canvas ref={canvasRef} className="hidden" />
            <div className="p-3 flex gap-2 justify-center">
              <motion.button whileTap={{ scale: 0.9 }} onClick={captureWebcam} className="btn-primary flex items-center gap-2">
                <Camera size={16} /> {t(language, 'capture')}
              </motion.button>
              <button onClick={() => { webcamStream?.getTracks().forEach(t => t.stop()); setMode(null); setWebcamStream(null) }}
                className="btn-secondary">{t(language, 'cancel')}</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading bar — fixed: flex column so text, bar, % are stacked */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background: 'rgba(18,16,35,0.65)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 16,
              padding: '20px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Loader2 size={18} style={{ color: '#818cf8', flexShrink: 0 }} className="animate-spin" />
              <span style={{ fontSize: 14, color: '#d1d5db' }}>
                {progress < 30 ? t(language, 'extracting_text') : progress < 70 ? t(language, 'processing_ai') : t(language, 'almost_ready')}
              </span>
            </div>
            <div style={{ width: '100%', background: 'rgba(255,255,255,0.08)', borderRadius: 99, height: 6, overflow: 'hidden' }}>
              <motion.div
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
                style={{
                  height: 6,
                  borderRadius: 99,
                  background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)',
                }}
              />
            </div>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textAlign: 'right', margin: 0 }}>
              {Math.round(progress)}%
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PDF page navigator */}
      <AnimatePresence>
        {pdfFile && totalPages > 1 && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="glass-light p-3 rounded-xl flex items-center gap-3 justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <FileText size={14} />
              <span className="truncate max-w-32">{pdfFile.name}</span>
              <span className="badge badge-purple">PDF</span>
            </div>
            <div className="flex items-center gap-2">
              <button disabled={pageNum <= 1} onClick={() => handlePageChange(pageNum - 1)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-all border-0 cursor-pointer" style={{ background: 'transparent' }}>
                ‹
              </button>
              <span className="text-xs text-gray-400 w-16 text-center">{t(language, 'page_text')} {pageNum}/{totalPages}</span>
              <button disabled={pageNum >= totalPages} onClick={() => handlePageChange(pageNum + 1)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-all border-0 cursor-pointer" style={{ background: 'transparent' }}>
                ›
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2 p-3 rounded-xl text-sm text-red-300"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <X size={14} className="text-red-400 flex-shrink-0" />
            {error}
            <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-300 border-0 cursor-pointer" style={{ background: 'transparent' }}>✕</button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}