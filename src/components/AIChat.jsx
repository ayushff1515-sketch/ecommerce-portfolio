// src/components/AIChat.jsx

import { useMemo, useState } from 'react'
import { FaRobot, FaTimes } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import api from '../services/api'
import './AIChat.css'

function AIChat() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const [catalog, setCatalog] = useState([])
  const [catalogError, setCatalogError] = useState('')

  const formatCatalog = useMemo(() => (products) => products.map((product) => ({
    id: product.id,
    title: product.title,
    description: product.description,
    category: product.category,
    price: product.price,
    rating: product.rating,
    stock: product.stock,
    brand: product.brand,
  })), [])

  const loadCatalog = async () => {
    if (catalog.length) return catalog
    try {
      // Use the complete live catalogue; the first API page does not include every product.
      const data = await api.getAllProducts(0)
      const liveCatalog = formatCatalog(data.products)
      setCatalog(liveCatalog)
      setCatalogError('')
      return liveCatalog
    } catch {
      const message = 'Live products could not be loaded. Please try again.'
      setCatalogError(message)
      throw new Error(message)
    }
  }

  const handleAsk = async () => {
    const question = message.trim()
    if (!question || isLoading) return

    setIsLoading(true)
    setError('')
    setMessage('')
    const updatedMessages = [...messages, { role: 'user', text: question }]
    setMessages(updatedMessages)

    try {
      const liveCatalog = await loadCatalog()
      const result = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages, catalog: liveCatalog }),
      })
      const contentType = result.headers.get('content-type') || ''
      if (!contentType.includes('application/json')) {
        throw new Error('The AI service is unavailable on this deployment. Deploy the API function and try again.')
      }

      const data = await result.json()
      if (!result.ok) throw new Error(data.error || 'Unable to reach the shopping assistant.')
      setMessages((currentMessages) => [...currentMessages, { role: 'assistant', text: data.answer }])
    } catch (requestError) {
      setError(requestError.message || 'Unable to reach the shopping assistant.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleAsk()
    }
  }

  const renderMessage = (text) => {
    const productLinkPattern = /\[([^\]]+)\]\(product:(\d+)\)/g
    const lines = text.split('\n')

    return lines.map((line, lineIndex) => {
      const isBullet = /^\s*[-*]\s+/.test(line)
      const content = line.replace(/^\s*[-*]\s+/, '')
      const parts = []
      let cursor = 0

      for (const match of content.matchAll(productLinkPattern)) {
        const [fullMatch, title, productId] = match
        const start = match.index ?? 0
        if (start > cursor) parts.push(content.slice(cursor, start))
        parts.push(<Link key={`${productId}-${start}`} to={`/product/${productId}`} className="ai-product-link">{title}</Link>)
        cursor = start + fullMatch.length
      }
      if (cursor < content.length) parts.push(content.slice(cursor))

      const messageContent = parts.length ? parts : content
      return isBullet
        ? <li key={lineIndex}>{messageContent}</li>
        : <span key={lineIndex}>{messageContent}{lineIndex < lines.length - 1 && <br />}</span>
    })
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
          <div className="ai-chat-messages" aria-live="polite">
            {messages.length === 0 && (
              <p className="ai-chat-welcome">Hi! Ask me to find products, compare prices, or suggest something from the store.</p>
            )}
            {messages.map((chatMessage, index) => (
              <div key={`${chatMessage.role}-${index}`} className={`ai-chat-message ai-chat-message-${chatMessage.role}`}>
                {chatMessage.text.split('\n').some((line) => /^\s*[-*]\s+/.test(line))
                  ? <ul className="ai-chat-list">{renderMessage(chatMessage.text)}</ul>
                  : renderMessage(chatMessage.text)}
              </div>
            ))}
            {isLoading && <p className="ai-chat-message ai-chat-message-assistant">Thinking…</p>}
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about products…"
            disabled={isLoading}
            autoFocus
            rows="2"
          />

          <button className="ai-chat-submit" onClick={handleAsk} disabled={!message.trim() || isLoading}>
            {isLoading ? 'Thinking…' : 'Ask AI'}
          </button>

          {(error || catalogError) && <p className="ai-chat-error" role="alert">{error || catalogError}</p>}
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
