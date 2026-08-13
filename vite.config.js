import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import aiHandler from './api/ai.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  process.env.GEMINI_API_KEY = env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY

  return {
    plugins: [
      react(),
      {
        name: 'local-ai-endpoint',
        configureServer(server) {
          server.middlewares.use('/api/ai', async (req, res, next) => {
            if (req.method !== 'POST') return next()

            let body = ''
            for await (const chunk of req) body += chunk

            try {
              const parsedBody = JSON.parse(body || '{}')
              await aiHandler({ method: req.method, body: parsedBody }, {
                status(code) { res.statusCode = code; return this },
                json(payload) {
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify(payload))
                },
              })
            } catch {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Invalid request body.' }))
            }
          })
        },
      },
    ],
  }
})
