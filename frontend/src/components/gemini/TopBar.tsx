import { profile } from '../../data/site'

export default function TopBar() {
  const initials = profile.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <header className="flex items-center justify-between px-4 py-3 sm:px-6">
      <div className="flex items-center gap-1 text-lg font-medium text-slate-600">
        <span>Portfolio</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
        </svg>
      </div>

      <div
        className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white gemini-gradient-bg"
        title={profile.name}
      >
        {initials}
      </div>
    </header>
  )
}
