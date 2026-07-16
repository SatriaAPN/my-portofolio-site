import { useEffect, useRef, useState } from 'react'
import Sidebar from './components/gemini/Sidebar'
import TopBar from './components/gemini/TopBar'
import Greeting from './components/gemini/Greeting'
import PromptInput from './components/gemini/PromptInput'
import { MessageRow, TypingRow, type ChatMessage } from './components/gemini/Message'
import Markdown from './components/gemini/Markdown'
import { getResponse } from './lib/responses'
import { fetchChatReply, type ApiMessage } from './lib/chatApi'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)

  const idRef = useRef(0)
  // Plain-text history sent to the backend (display messages can be rich JSX).
  const apiHistoryRef = useRef<ApiMessage[]>([])
  // Bumped on "new chat" so late in-flight replies from a cleared chat are ignored.
  const epochRef = useRef(0)
  const scrollEndRef = useRef<HTMLDivElement>(null)

  const nextId = () => ++idRef.current

  // Keep the latest message in view.
  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSubmit = async (prompt: string) => {
    const epoch = epochRef.current

    setMessages((prev) => [...prev, { id: nextId(), role: 'user', content: prompt }])
    apiHistoryRef.current = [...apiHistoryRef.current, { role: 'user', content: prompt }]
    setIsTyping(true)

    try {
      const reply = await fetchChatReply(apiHistoryRef.current)
      if (epoch !== epochRef.current) return // conversation was reset mid-flight
      apiHistoryRef.current = [...apiHistoryRef.current, { role: 'assistant', content: reply }]
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: 'model',
          content: <Markdown>{reply}</Markdown>,
        },
      ])
    } catch {
      // Backend unavailable or no API key — fall back to local canned answers.
      if (epoch !== epochRef.current) return
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: 'model', content: getResponse(prompt) },
      ])
    } finally {
      if (epoch === epochRef.current) setIsTyping(false)
    }
  }

  const handleNewChat = () => {
    epochRef.current += 1
    apiHistoryRef.current = []
    setMessages([])
    setIsTyping(false)
  }

  const isEmpty = messages.length === 0 && !isTyping

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((v) => !v)}
        onNewChat={handleNewChat}
        onSelectPrompt={handleSubmit}
      />

      <div className="flex h-full flex-1 flex-col">
        <TopBar />

        {/* Conversation / greeting area */}
        <div className="flex-1 overflow-y-auto gemini-scroll">
          {isEmpty ? (
            <div className="flex min-h-full items-center py-10">
              <Greeting onSelectPrompt={handleSubmit} />
            </div>
          ) : (
            <div className="mx-auto w-full max-w-3xl px-4 py-6">
              {messages.map((message) => (
                <MessageRow key={message.id} message={message} />
              ))}
              {isTyping && <TypingRow />}
              <div ref={scrollEndRef} />
            </div>
          )}
        </div>

        {/* Prompt bar */}
        <div className="pb-4 pt-2">
          <PromptInput onSubmit={handleSubmit} disabled={isTyping} />
        </div>
      </div>
    </div>
  )
}
