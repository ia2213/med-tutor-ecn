import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'

export interface BookChapter {
  id: string
  title: string
  content: string
  keywords: string[]
}

export interface BookMetadata {
  title: string
  author: string
  totalPages: number
  chapters: BookChapter[]
  summary: string
}

export async function extractBookContent(file: Buffer): Promise<{
  metadata: BookMetadata
  text: string
}> {
  // Load PDF document
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(file),
    useWorkerFetch: false,
    isEvalSupported: false,
    useSystemFonts: true
  })
  
  const pdfDoc = await loadingTask.promise
  const totalPages = pdfDoc.numPages
  
  // Extract text from all pages
  let fullText = ''
  const chapters: BookChapter[] = []
  
  for (let i = 1; i <= Math.min(totalPages, 50); i++) {
    const page = await pdfDoc.getPage(i)
    const textContent = await page.getTextContent()
    const pageText = textContent.items.map(item => 
      (item as any).str || ''
    ).join(' ')
    
    fullText += pageText + '\n\n'
  }
  
  // Extract basic metadata
  const lines = fullText.split('\n').filter(l => l.trim())
  let title = 'Document sans titre'
  let author = 'Auteur inconnu'
  
  for (const line of lines.slice(0, 50)) {
    if (line.length > 10 && line.length < 100 && !line.toLowerCase().includes('page')) {
      title = line.trim()
      break
    }
  }
  
  // Extract chapters
  const chapterRegex = /(?:chapter|chapitre|partie|unité|module)\s*[\d\ivxlc]+\s*[:.]?\s*(.+)/gi
  let match
  
  while ((match = chapterRegex.exec(fullText)) !== null) {
    const chapterTitle = match[1].trim().substring(0, 100)
    const startIdx = match.index + match[0].length
    
    // Find next chapter start
    const nextMatch = fullText.substring(startIdx).search(chapterRegex)
    const contentEnd = nextMatch > 0 ? startIdx + nextMatch : Math.min(startIdx + 5000, fullText.length)
    
    const content = fullText.substring(startIdx, contentEnd).trim()
    
    if (content.length > 100) {
      chapters.push({
        id: `ch${chapters.length + 1}`,
        title: chapterTitle,
        content,
        keywords: extractKeywords(content)
      })
    }
  }
  
  // If no chapters found, split by sections
  if (chapters.length === 0) {
    const sections = fullText.split(/(?=^[A-Z][a-z]{2,})/m)
    for (let i = 0; i < Math.min(sections.length, 20); i++) {
      const section = sections[i].trim()
      if (section.length > 500) {
        chapters.push({
          id: `ch${i + 1}`,
          title: `Section ${i + 1}`,
          content: section.substring(0, 3000),
          keywords: extractKeywords(section)
        })
      }
    }
  }
  
  // Generate summary
  const summary = fullText.substring(0, 2000).replace(/\s+/g, ' ').trim()
  
  return {
    metadata: {
      title,
      author,
      totalPages,
      chapters,
      summary
    },
    text: fullText
  }
}

function extractKeywords(text: string): string[] {
  const stopWords = new Set(['le', 'la', 'les', 'un', 'une', 'des', 'de', 'du', 'et', 'est', 'are', 'is', 'in', 'for', 'of', 'the', 'a', 'an'])
  const words = text.toLowerCase().split(/\s+/)
    .filter(w => w.length > 3 && !stopWords.has(w))
    .filter((w, i, arr) => arr.indexOf(w) === i)
  return words.slice(0, 10)
}
