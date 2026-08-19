'use client'

import { useState, useRef, useEffect } from 'react'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'
import { ECN_PRESETS } from '@/lib/ecn-presets'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [bookData, setBookData] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isChatting, setIsChatting] = useState(false)
  const [bookContext, setBookContext] = useState('')
  const [inputText, setInputText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile?.type === 'application/pdf') {
      handleFileSelect(droppedFile)
    }
  }

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
    processPDF(selectedFile)
  }

  const processPDF = async (pdfFile: File) => {
    setIsProcessing(true)
    setError(null)
    setBookData(null)
    setMessages([])

    try {
      const arrayBuffer = await pdfFile.arrayBuffer()
      const uint8Array = new Uint8Array(arrayBuffer)
      
      const loadingTask = pdfjsLib.getDocument({
        data: uint8Array,
        useWorkerFetch: false,
        isEvalSupported: false,
        useSystemFonts: true
      })
      
      const pdfDoc = await loadingTask.promise
      const totalPages = pdfDoc.numPages
      
      let fullText = ''
      const chapters: any[] = []
      
      // Extract text from first 30 pages for context
      const pagesToExtract = Math.min(totalPages, 30)
      
      for (let i = 1; i <= pagesToExtract; i++) {
        const page = await pdfDoc.getPage(i)
        const textContent = await page.getTextContent()
        const pageText = textContent.items.map((item: any) => item.str || '').join(' ')
        fullText += pageText + '\n\n'
      }
      
      // Extract title
      const lines = fullText.split('\n').filter(l => l.trim())
      let title = pdfFile.name.replace('.pdf', '')
      for (const line of lines.slice(0, 30)) {
        if (line.length > 10 && line.length < 100 && !line.toLowerCase().includes('page')) {
          title = line.trim()
          break
        }
      }
      
      // Try to extract chapters
      const chapterRegex = /(?:chapter|chapitre|partie|unité|module)\s*[\d\ivxlc]+\s*[:.]?\s*(.+)/gi
      let match
      
      while ((match = chapterRegex.exec(fullText)) !== null) {
        const chapterTitle = match[1].trim().substring(0, 80)
        const startIdx = match.index + match[0].length
        const nextMatch = fullText.substring(startIdx).search(chapterRegex)
        const contentEnd = nextMatch > 0 ? startIdx + nextMatch : Math.min(startIdx + 3000, fullText.length)
        const content = fullText.substring(startIdx, contentEnd).trim()
        
        if (content.length > 100) {
          chapters.push({
            id: `ch${chapters.length + 1}`,
            title: chapterTitle,
            preview: content.substring(0, 300) + '...'
          })
        }
      }
      
      const summary = fullText.substring(0, 3000).replace(/\s+/g, ' ').trim()
      
      setBookData({
        title,
        author: 'Auteur inconnu',
        totalPages,
        chapterCount: chapters.length,
        chapters: chapters.slice(0, 10)
      })
      setBookContext(summary)
      
      setMessages([{
        role: 'system',
        content: `📚 Livre "${title}" chargé avec succès !\n\n📄 ${totalPages} pages analysées\n📑 ${chapters.length} chapitres identifiés\n\nPosez-moi vos questions sur le contenu.`
      }])
      
    } catch (err) {
      setError(`Erreur lors de l'analyse du PDF: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const sendMessage = async (text: string) => {
    if (!text.trim() || isChatting) return

    setIsChatting(true)
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setInputText('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          bookContext,
          presetId: selectedPreset
        })
      })

      if (!response.ok) {
        throw new Error('API not available')
      }

      const reader = response.body?.getReader()
      if (!reader) return

      let accumulated = ''
      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = new TextDecoder().decode(value)
        accumulated += chunk

        setMessages(prev => {
          const newMessages = [...prev]
          const lastMsg = newMessages[newMessages.length - 1]
          if (lastMsg.role === 'assistant') {
            lastMsg.content = accumulated
          }
          return newMessages
        })
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'system',
        content: `⚠️ Pour utiliser le tutorat IA complet, déployez sur Vercel avec la variable d'environnement OPENAI_API_KEY configurée.\n\nEn attendant, vous pouvez:\n- Continuer à explorer votre livre\n- Sélectionner une spécialité ECN\n- Préparer vos questions pour le tutorat`
      }])
    } finally {
      setIsChatting(false)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <span className="logo-icon">📚</span>
          <span>MedTutor ECN</span>
        </div>
        <nav className="nav">
          <a href="#upload">Uploader</a>
          <a href="#presets">Spécialités</a>
          <a href="https://github.com/HKUDS/DeepTutor" target="_blank">DeepTutor</a>
        </nav>
      </header>

      <main className="main">
        <section className="hero">
          <h1>Tuteur Médical IA pour l'ECN</h1>
          <p>
            Uploadez vos livres de médecine et posez vos questions. 
            Notre IA utilise DeepTutor + book-to-skill pour vous tutorer.
          </p>
        </section>

        <section className="upload-section" id="upload">
          <div 
            className={`upload-area ${isProcessing ? 'processing' : ''}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            <div className="upload-icon">📄</div>
            <div className="upload-text">
              <h3>{file ? file.name : 'Glissez votre PDF ici'}</h3>
              <p>ou cliquez pour sélectionner un fichier PDF</p>
            </div>
            {isProcessing && (
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '100%' }} />
              </div>
            )}
          </div>
          <input
            type="file"
            id="fileInput"
            className="file-input"
            accept=".pdf"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          />
        </section>

        {error && (
          <div className="book-info" style={{ background: '#fef2f2', borderColor: '#fecaca' }}>
            <p style={{ color: '#dc2626' }}>{error}</p>
          </div>
        )}

        {bookData && (
          <div className="book-info">
            <h3>📖 {bookData.title}</h3>
            <p className="book-meta">
              {bookData.author} • {bookData.totalPages} pages • {bookData.chapterCount} chapitres
            </p>
            <div className="chapters-list">
              {bookData.chapters?.map((ch: any) => (
                <span key={ch.id} className="chapter-tag">{ch.title}</span>
              ))}
            </div>
          </div>
        )}

        <section className="presets-section" id="presets">
          <h2>🎯 Spécialités ECN R2C</h2>
          <div className="presets-grid">
            {ECN_PRESETS.map((preset) => (
              <div
                key={preset.id}
                className={`preset-card ${selectedPreset === preset.id ? 'selected' : ''}`}
                onClick={() => setSelectedPreset(preset.id === selectedPreset ? null : preset.id)}
              >
                <div className="preset-icon">{preset.icon}</div>
                <div className="preset-name">{preset.name}</div>
                <div className="preset-desc">{preset.description}</div>
              </div>
            ))}
          </div>
        </section>

        <section className={`chat-section ${bookData ? 'active' : ''}`}>
          <div className="chat-header">
            <h3>💬 Chat avec votre livre</h3>
            {selectedPreset && (
              <span className="chapter-tag">
                {ECN_PRESETS.find(p => p.id === selectedPreset)?.icon}{' '}
                {ECN_PRESETS.find(p => p.id === selectedPreset)?.name}
              </span>
            )}
          </div>
          
          <div className="chat-messages">
            {messages.length === 0 && (
              <div className="message system">
                🎉 Livre chargé ! Posez-moi vos questions sur le contenu. 
                Je vais vous expliquer les concepts, vous aider à réviser, 
                et vous préparer pour l'ECN.
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.role}`}>
                {msg.content}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-area">
            <textarea
              className="chat-input"
              placeholder="Posez votre question médicale..."
              rows={2}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  if (inputText.trim()) {
                    sendMessage(inputText)
                  }
                }
              }}
              disabled={isChatting}
            />
            <button
              className="send-btn"
              onClick={() => sendMessage(inputText)}
              disabled={isChatting || !inputText.trim()}
            >
              {isChatting ? '...' : 'Envoyer'}
            </button>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>
          Propulsé par <a href="https://github.com/HKUDS/DeepTutor" target="_blank">DeepTutor</a> +{' '}
          <a href="https://github.com/virgiliojr94/book-to-skill" target="_blank">book-to-skill</a> •
          ECN R2C France
        </p>
      </footer>
    </div>
  )
}
