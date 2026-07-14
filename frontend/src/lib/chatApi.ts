// Client for the backend /api/chat endpoint.
//
// In development, Vite proxies /api to the Go backend on :8080
// (see vite.config.ts). If the backend is down or has no API key configured,
// callers should catch the error and fall back to local responses.

export type ApiMessage = {
  role: 'user' | 'assistant'
  content: string
}

/**
 * Send the conversation to the backend and return the assistant's reply text.
 * Throws if the request fails (network error, 503 no-key, upstream error, etc.).
 */
export async function fetchChatReply(messages: ApiMessage[]): Promise<string> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  })

  if (!res.ok) {
    throw new Error(`chat request failed with status ${res.status}`)
  }

  const data = (await res.json()) as { reply?: string }
  const reply = data.reply?.trim()
  if (!reply) {
    throw new Error('chat response was empty')
  }
  return reply
}
