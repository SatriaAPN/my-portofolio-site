import { recentPrompts } from '../../lib/responses'
import { HelpIcon, HistoryIcon, MenuIcon, PlusIcon, SettingsIcon } from './icons'

type SidebarProps = {
  open: boolean
  onToggle: () => void
  onNewChat: () => void
  onSelectPrompt: (prompt: string) => void
}

export default function Sidebar({ open, onToggle, onNewChat, onSelectPrompt }: SidebarProps) {
  return (
    <aside
      className={`flex h-full flex-col bg-[#f0f4f9] py-4 transition-[width] duration-300 ease-in-out ${
        open ? 'w-72' : 'w-[72px]'
      }`}
    >
      {/* Toggle */}
      <div className="px-3">
        <button
          type="button"
          onClick={onToggle}
          aria-label="Toggle sidebar"
          className="flex h-10 w-10 items-center justify-center rounded-full text-slate-700 hover:bg-[#dde3ea]"
        >
          <MenuIcon width={22} height={22} />
        </button>
      </div>

      {/* New chat */}
      <div className="mt-4 px-3">
        <button
          type="button"
          onClick={onNewChat}
          className={`flex h-11 items-center gap-3 rounded-full bg-[#dde3ea] text-sm font-medium text-slate-700 transition hover:bg-[#d0d7e0] ${
            open ? 'w-full px-4' : 'w-11 justify-center'
          }`}
        >
          <PlusIcon width={20} height={20} className="shrink-0" />
          {open && <span>New chat</span>}
        </button>
      </div>

      {/* Recent */}
      {open && (
        <nav className="mt-6 flex-1 overflow-y-auto gemini-scroll px-3">
          <p className="px-2 pb-2 text-sm font-medium text-slate-600">Recent</p>
          <ul className="space-y-0.5">
            {recentPrompts.map((prompt) => (
              <li key={prompt}>
                <button
                  type="button"
                  onClick={() => onSelectPrompt(prompt)}
                  className="flex w-full items-center gap-3 truncate rounded-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-[#dde3ea]"
                >
                  <HistoryIcon width={18} height={18} className="shrink-0 text-slate-500" />
                  <span className="truncate">{prompt}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {!open && <div className="flex-1" />}

      {/* Footer actions */}
      <div className="space-y-0.5 px-3">
        {[
          { label: 'Help', Icon: HelpIcon },
          { label: 'Settings', Icon: SettingsIcon },
        ].map(({ label, Icon }) => (
          <button
            key={label}
            type="button"
            className={`flex h-10 items-center gap-3 rounded-full text-sm text-slate-700 hover:bg-[#dde3ea] ${
              open ? 'w-full px-3' : 'w-10 justify-center'
            }`}
          >
            <Icon width={20} height={20} className="shrink-0 text-slate-500" />
            {open && <span>{label}</span>}
          </button>
        ))}
      </div>
    </aside>
  )
}
