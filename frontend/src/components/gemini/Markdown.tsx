import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// Renders an assistant reply written in Markdown (bold, lists, links, etc.)
// with Tailwind styling that matches the chat aesthetic. Raw HTML is NOT
// enabled, so model output can't inject markup — safe by default.
export default function Markdown({ children }: { children: string }) {
  return (
    <div className="text-[15px] leading-relaxed text-slate-800">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
          strong: ({ children }) => (
            <strong className="font-semibold text-slate-900">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          ul: ({ children }) => (
            <ul className="mb-3 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-3 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>
          ),
          li: ({ children }) => <li className="pl-0.5">{children}</li>,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-brand-600 hover:underline"
            >
              {children}
            </a>
          ),
          h1: ({ children }) => (
            <h3 className="mb-2 mt-1 text-base font-semibold text-slate-900">{children}</h3>
          ),
          h2: ({ children }) => (
            <h3 className="mb-2 mt-1 text-base font-semibold text-slate-900">{children}</h3>
          ),
          h3: ({ children }) => (
            <h3 className="mb-2 mt-1 text-base font-semibold text-slate-900">{children}</h3>
          ),
          blockquote: ({ children }) => (
            <blockquote className="mb-3 border-l-2 border-slate-300 pl-3 text-slate-600 last:mb-0">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[13px] text-slate-800">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="mb-3 overflow-x-auto rounded-lg bg-slate-100 p-3 font-mono text-[13px] text-slate-800 last:mb-0">
              {children}
            </pre>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
