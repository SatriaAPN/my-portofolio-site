import { useState } from 'react'
import { MicIcon, PlusIcon, SendIcon } from './icons'

type PromptInputProps = {
  onSubmit: (prompt: string) => void
  disabled?: boolean
}

export default function PromptInput({ onSubmit, disabled }: PromptInputProps) {
  const [value, setValue] = useState('')

  const canSend = value.trim().length > 0 && !disabled

  const submit = () => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSubmit(trimmed)
    setValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4">
      <div className="prompt-bar">
        <button
          type="button"
          aria-label="Add"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 hover:bg-white/70"
        >
          <PlusIcon width={20} height={20} />
        </button>

        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about Satria…"
          aria-label="Ask about Satria"
          className="min-w-0 flex-1 bg-transparent py-1.5 text-[15px] text-slate-800 placeholder:text-slate-500 focus:outline-none"
        />

        <button
          type="button"
          aria-label="Voice"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 hover:bg-white/70"
        >
          <MicIcon width={20} height={20} />
        </button>

        <button
          type="button"
          onClick={submit}
          disabled={!canSend}
          aria-label="Send"
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition ${
            canSend
              ? 'text-white gemini-gradient-bg hover:opacity-90'
              : 'cursor-not-allowed bg-slate-300 text-white'
          }`}
        >
          <SendIcon width={18} height={18} />
        </button>
      </div>

      <p className="mt-3 text-center text-xs text-slate-400">
        This is a portfolio reimagined as a chat. Responses come from Satria's own content.
      </p>
    </div>
  )
}
