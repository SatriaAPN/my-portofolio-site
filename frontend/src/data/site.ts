// Central place to edit your portfolio content.
// Update these values and the whole site reflects the changes.

export const profile = {
  name: 'Satria APN',
  role: 'Software Engineer',
  tagline:
    'I build reliable, scalable web applications and enjoy turning complex problems into clean, maintainable products.',
  location: 'Singapore',
  email: 'satrianusa10@gmail.com',
  socials: {
    github: 'https://github.com/your-username',
    linkedin: 'https://linkedin.com/in/your-username',
  },
}

export type Project = {
  title: string
  description: string
  tags: string[]
  link?: string
  repo?: string
}

export const projects: Project[] = [
  {
    title: 'Portfolio Site',
    description:
      'This very website — a responsive portfolio built with React, TypeScript, Vite, and Tailwind CSS.',
    tags: ['React', 'TypeScript', 'Tailwind'],
    repo: 'https://github.com/your-username/my-portofolio-site',
  },
  {
    title: 'Project Two',
    description:
      'A short description of a project you are proud of. Explain the problem it solves and the impact it had.',
    tags: ['Node.js', 'PostgreSQL', 'REST'],
    link: '#',
    repo: '#',
  },
  {
    title: 'Project Three',
    description:
      'Another highlight. Mention the tech stack and any interesting engineering challenges you tackled.',
    tags: ['Go', 'gRPC', 'Kubernetes'],
    link: '#',
    repo: '#',
  },
]

export const skills: { category: string; items: string[] }[] = [
  { category: 'Languages', items: ['TypeScript', 'JavaScript', 'Go', 'Python', 'Java'] },
  { category: 'Frontend', items: ['React', 'Vite', 'Tailwind CSS', 'HTML', 'CSS'] },
  { category: 'Backend', items: ['Node.js', 'REST', 'gRPC', 'PostgreSQL', 'Redis'] },
  { category: 'Tooling', items: ['Git', 'Docker', 'Kubernetes', 'CI/CD'] },
]
