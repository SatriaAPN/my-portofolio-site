import type { ReactNode } from 'react'
import { profile } from '../../data/site'
import { SparkleIcon } from './icons'

export type ChatMessage = {
  id: number
  role: 'user' | 'model'
  content: ReactNode
}

const initials = profile.name
  .split(' ')
  .map((part) => part[0])
  .join('')
  .slice(0, 2)
  .toUpperCase()

function ModelAvatar() {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white gemini-gradient-bg">
      <SparkleIcon width={18} height={18} />
    </span>
  )
}

function UserAvatar() {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
      {initials}
    </span>
  )
}

export function MessageRow({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'
  return (
    <div className="flex gap-4 py-5">
      {isUser ? <UserAvatar /> : <ModelAvatar />}
      <div className="min-w-0 flex-1 pt-0.5 text-[15px] text-slate-800">{message.content}</div>
    </div>
  )
}

export function TypingRow() {
  return (
    <div className="flex gap-4 py-5">
      <ModelAvatar />
      <div className="flex items-center gap-1 pt-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="typing-dot h-2 w-2 rounded-full bg-slate-400"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  )
}
