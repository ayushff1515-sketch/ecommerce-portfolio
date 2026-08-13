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

  const messages = Array.isArray(req.body?.messages) ? req.body.messages.slice(-12) : []
  const catalog = Array.isArray(req.body?.catalog) ? req.body.catalog.slice(0, 250) : []
  const conversation = messages
    .filter(({ role, text }) => (role === 'user' || role === 'assistant') && typeof text === 'string')
    .map(({ role, text }) => ({ role, text: text.trim().slice(0, MAX_MESSAGE_LENGTH) }))
    .filter(({ text }) => text)
  const latestMessage = conversation.at(-1)

  if (!latestMessage || latestMessage.role !== 'user') return res.status(400).json({ error: 'Please enter a question.' })
  if (latestMessage.text.length > MAX_MESSAGE_LENGTH) {
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
      contents: `You are the helpful shopping assistant for Shopverse. Answer only using the catalogue below. If an item is not present, say so. Do not invent prices, availability, policies, or discounts. When the customer asks to list, recommend, compare, or find products, return one product per Markdown bullet using exactly this format: - [Product title](product:ID) — $PRICE: brief reason. Replace ID and PRICE with the real catalogue values. For any product you mention, always use [Product title](product:ID) so it can be opened in the store. Keep answers concise.\n\nCatalogue:\n${JSON.stringify(products)}\n\nConversation so far:\n${conversation.map(({ role, text }) => `${role === 'user' ? 'Customer' : 'Assistant'}: ${text}`).join('\n')}`,
    })

    const answer = response.text?.trim()
    if (!answer) throw new Error('Gemini returned an empty response.')
    return res.status(200).json({ answer })
  } catch (error) {
    console.error('Gemini request failed:', error)
    return res.status(502).json({ error: 'The shopping assistant could not answer right now. Please try again.' })
  }
}
