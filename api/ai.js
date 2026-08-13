import { GoogleGenAI } from '@google/genai'

const MAX_MESSAGE_LENGTH = 600

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // VITE_GEMINI_API_KEY is supported temporarily for existing deployments.
  // Rename it to GEMINI_API_KEY so it cannot be exposed to client code.
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({
      error: 'The shopping assistant is not configured. Add GEMINI_API_KEY to the server environment.',
    })
  }

  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : ''
  const catalog = Array.isArray(req.body?.catalog) ? req.body.catalog.slice(0, 100) : []

  if (!message) return res.status(400).json({ error: 'Please enter a question.' })
  if (message.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({ error: `Questions must be ${MAX_MESSAGE_LENGTH} characters or fewer.` })
  }

  const products = catalog.map(({ id, title, description, category, price, rating, stock, brand }) => ({
    id,
    title,
    description,
    category,
    price,
    rating,
    stock,
    brand,
  }))

  try {
    const ai = new GoogleGenAI({ apiKey })
    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: `You are the helpful shopping assistant for Shopverse. Answer only using the catalogue below. If an item is not present, say so. Do not invent prices, availability, policies, or discounts. Keep answers concise and mention relevant product names and prices when useful.\n\nCatalogue:\n${JSON.stringify(products)}\n\nCustomer question:\n${message}`,
    })

    const answer = response.text?.trim()
    if (!answer) throw new Error('Gemini returned an empty response.')
    return res.status(200).json({ answer })
  } catch (error) {
    console.error('Gemini request failed:', error)
    return res.status(502).json({ error: 'The shopping assistant could not answer right now. Please try again.' })
  }
}
