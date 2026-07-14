import type { ComponentType, ReactNode, SVGProps } from 'react'
import { profile, projects, skills } from '../data/site'
import { CodeIcon, MailIcon, SparkleIcon, UserIcon } from '../components/gemini/icons'

type IconType = ComponentType<SVGProps<SVGSVGElement>>

export type Suggestion = {
  title: string
  prompt: string
  Icon: IconType
}

/** Cards shown on the empty/greeting state. Clicking one submits its prompt. */
export const suggestions: Suggestion[] = [
  { title: 'Who is Satria and what does he do?', prompt: 'Tell me about yourself', Icon: UserIcon },
  { title: 'Show me the projects you have built', prompt: 'What projects have you built?', Icon: CodeIcon },
  { title: 'What technologies do you work with?', prompt: 'What are your skills?', Icon: SparkleIcon },
  { title: 'How can I get in touch with you?', prompt: 'How can I reach you?', Icon: MailIcon },
]

/** Prompts surfaced as "recent chats" in the sidebar. */
export const recentPrompts: string[] = [
  'Tell me about yourself',
  'What projects have you built?',
  'What are your skills?',
  'How can I reach you?',
]

const Pill = ({ children }: { children: ReactNode }) => (
  <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
    {children}
  </span>
)

const AboutResponse = () => (
  <div className="space-y-3 leading-relaxed">
    <p>
      Hi! I'm <strong>{profile.name}</strong>, a {profile.role} based in {profile.location}.
    </p>
    <p>{profile.tagline}</p>
    <p className="text-slate-500">
      Ask me about my <em>projects</em>, my <em>skills</em>, or how to <em>get in touch</em>.
    </p>
  </div>
)

const ProjectsResponse = () => (
  <div className="space-y-3">
    <p className="leading-relaxed">Here are a few things I've built:</p>
    <div className="grid gap-3 sm:grid-cols-2">
      {projects.map((project) => (
        <div key={project.title} className="rounded-xl border border-slate-200 bg-white p-4">
          <h4 className="font-semibold text-slate-900">{project.title}</h4>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">{project.description}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <Pill key={tag}>{tag}</Pill>
            ))}
          </div>
          {(project.link || project.repo) && (
            <div className="mt-3 flex gap-4 text-sm font-medium">
              {project.link && (
                <a href={project.link} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">
                  Live demo →
                </a>
              )}
              {project.repo && (
                <a href={project.repo} target="_blank" rel="noreferrer" className="text-slate-600 hover:underline">
                  Source
                </a>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
)

const SkillsResponse = () => (
  <div className="space-y-3">
    <p className="leading-relaxed">These are the tools and technologies I work with:</p>
    <div className="grid gap-3 sm:grid-cols-2">
      {skills.map((group) => (
        <div key={group.category} className="rounded-xl border border-slate-200 bg-white p-4">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-brand-600">
            {group.category}
          </h4>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {group.items.map((item) => (
              <span
                key={item}
                className="rounded-lg bg-slate-100 px-2.5 py-1 text-sm font-medium text-slate-700"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
)

const ContactResponse = () => (
  <div className="space-y-3 leading-relaxed">
    <p>I'd love to hear from you. The fastest way to reach me is by email:</p>
    <div className="flex flex-wrap gap-3">
      <a href={`mailto:${profile.email}`} className="btn-primary">
        {profile.email}
      </a>
      <a href={profile.socials.github} target="_blank" rel="noreferrer" className="btn-secondary">
        GitHub
      </a>
      <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" className="btn-secondary">
        LinkedIn
      </a>
    </div>
  </div>
)

const DefaultResponse = ({ prompt }: { prompt: string }) => (
  <div className="space-y-3 leading-relaxed">
    <p>
      Thanks for asking about &ldquo;{prompt}&rdquo;! I'm a friendly stand-in for {profile.name}'s
      portfolio, so I'm best at a few specific topics.
    </p>
    <p className="text-slate-500">Try asking me about:</p>
    <ul className="list-inside list-disc space-y-1 text-slate-600">
      <li>Who Satria is and what he does</li>
      <li>The projects he has built</li>
      <li>His skills and tech stack</li>
      <li>How to get in touch</li>
    </ul>
  </div>
)

/** Very small keyword router — matches a prompt to the right response block. */
export function getResponse(prompt: string): ReactNode {
  const q = prompt.toLowerCase()
  const has = (...words: string[]) => words.some((w) => q.includes(w))

  if (has('project', 'work', 'built', 'build', 'portfolio', 'made')) return <ProjectsResponse />
  if (has('skill', 'tech', 'stack', 'language', 'tool', 'framework')) return <SkillsResponse />
  if (has('contact', 'reach', 'email', 'hire', 'touch', 'connect', 'message')) return <ContactResponse />
  if (has('about', 'yourself', 'who', 'you', 'satria', 'background', 'hi', 'hello', 'hey'))
    return <AboutResponse />

  return <DefaultResponse prompt={prompt} />
}
