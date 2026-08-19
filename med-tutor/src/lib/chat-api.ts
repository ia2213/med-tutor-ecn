import OpenAI from 'openai'

let openai: any = null

export async function chatWithBook(
  message: string,
  bookContext: string,
  presetPrompt?: string
): Promise<ReadableStream<Uint8Array>> {
  // Initialize OpenAI client lazily
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_BASE_URL,
    })
  }

  if (!openai) {
    throw new Error('OPENAI_API_KEY not configured')
  }

  const systemPrompt = presetPrompt || `Tu es un tuteur médical spécialiste pour la préparation à l'ECN français (Épreuves Classantes Nationales).
Tu aides les étudiants en médecine à comprendre et retenir les connaissances médicales essentielles.
Réponds de façon pédagogique, structurée, avec des points clés pour l'ECN.
Utilise le français. Structure tes réponses avec des tableaux, algorithmes, et mnémotechniques quand pertinent.`

  const fullContext = `
## Source Book Content
${bookContext.substring(0, 8000)}

## Student Question
${message}

## Instructions
Answer the student's question based on the book content above. Provide a thorough, educational explanation suitable for ECN preparation. Include key points, differential diagnoses, and clinical pearls. Respond in French.`

  const stream = await openai.chat.completions.create({
    model: process.env.MODEL || 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: fullContext }
    ],
    stream: true,
    max_tokens: 2000,
    temperature: 0.7,
  })

  return createStreamFromOpenAI(stream)
}

async function createStreamFromOpenAI(
  stream: AsyncIterable<any>
): Promise<ReadableStream<Uint8Array>> {
  const encoder = new TextEncoder()
  return new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const content = chunk.choices?.[0]?.delta?.content
        if (content) {
          controller.enqueue(encoder.encode(content))
        }
      }
      controller.close()
    }
  })
}
