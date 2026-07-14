import { profile } from '../../data/site'
import { suggestions } from '../../lib/responses'

type GreetingProps = {
  onSelectPrompt: (prompt: string) => void
}

export default function Greeting({ onSelectPrompt }: GreetingProps) {
  const firstName = profile.name.split(' ')[0]

  return (
    <div className="mx-auto w-full max-w-3xl px-4">
      <div className="mb-10">
        <h1 className="text-4xl font-semibold sm:text-5xl">
          <span className="gemini-gradient-text">Hello there, I am {firstName}</span>
        </h1>
        <p className="mt-2 text-3xl font-medium text-slate-400 sm:text-4xl">
          How can I help you explore my work?
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {suggestions.map(({ title, prompt, Icon }) => (
          <button
            key={title}
            type="button"
            onClick={() => onSelectPrompt(prompt)}
            className="suggestion-card"
          >
            <p className="text-sm text-slate-700">{title}</p>
            <span className="flex h-8 w-8 items-center justify-center self-end rounded-full bg-white text-slate-600">
              <Icon width={18} height={18} />
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
