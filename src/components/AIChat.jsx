// src/components/AIChat.jsx

import { useMemo, useState } from 'react'
import { FaRobot, FaTimes } from 'react-icons/fa'
import productsData from '../data/products.json'
import './AIChat.css'

function AIChat() {
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const catalog = useMemo(() => productsData.products.map((product) => ({
    id: product.id,
    title: product.title,
    description: product.description,
    category: product.category,
    price: product.price,
    rating: product.rating,
    stock: product.stock,
    brand: product.brand,
  })), [])

  const handleAsk = async () => {
    const question = message.trim()
    if (!question || isLoading) return

    setIsLoading(true)
    setError('')
    setResponse('')

    try {
      const result = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question, catalog }),
      })
      const contentType = result.headers.get('content-type') || ''
      if (!contentType.includes('application/json')) {
        throw new Error('The AI service is unavailable on this deployment. Deploy the API function and try again.')
      }

      const data = await result.json()
      if (!result.ok) throw new Error(data.error || 'Unable to reach the shopping assistant.')
      setResponse(data.answer)
    } catch (requestError) {
      setError(requestError.message || 'Unable to reach the shopping assistant.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') handleAsk()
  }

  return (
    <div className="ai-chat-launcher">
      {isOpen && (
        <section className="ai-chat" aria-label="AI shopping assistant">
          <div className="ai-chat-heading">
            <h2>Shop with AI</h2>
            <button className="ai-chat-close" onClick={() => setIsOpen(false)} aria-label="Close AI assistant">
              <FaTimes />
            </button>
          </div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about products..."
            disabled={isLoading}
            autoFocus
          />

          <button className="ai-chat-submit" onClick={handleAsk} disabled={!message.trim() || isLoading}>
            {isLoading ? 'Thinking…' : 'Ask AI'}
          </button>

          {error && <p className="ai-chat-error" role="alert">{error}</p>}
          {response && <p className="ai-chat-response">{response}</p>}
        </section>
      )}
      <button
        className="ai-chat-toggle"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? 'Close AI assistant' : 'Open AI shopping assistant'}
        aria-expanded={isOpen}
      >
        {isOpen ? <FaTimes /> : <FaRobot />}
      </button>
    </div>
  )
}

export default AIChat;
