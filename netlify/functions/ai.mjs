import aiHandler from '../../api/ai.js'

export async function handler(event) {
  let body
  try {
    body = JSON.parse(event.body || '{}')
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body.' }) }
  }

  const result = {}
  await aiHandler({ method: event.httpMethod, body }, {
    status(code) { result.statusCode = code; return this },
    json(payload) { result.body = payload },
  })

  return {
    statusCode: result.statusCode || 500,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(result.body || { error: 'Unable to process the request.' }),
  }
}
