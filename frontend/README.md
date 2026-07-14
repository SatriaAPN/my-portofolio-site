# Portfolio — Frontend

A personal portfolio built with **React + TypeScript + Vite** and styled with **Tailwind CSS**,
reimagined as a **Gemini-style chat interface**: visitors "ask about Satria" and get answers
generated from the portfolio content (collapsible sidebar, gradient greeting, suggestion cards,
and a rounded prompt bar).

## Requirements

- Node.js 18+ (this project is pinned to versions compatible with Node 18)

## Getting started

```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:5173.

## Scripts

| Command           | Description                                  |
| ----------------- | -------------------------------------------- |
| `npm run dev`     | Start the Vite dev server with HMR           |
| `npm run build`   | Type-check and build for production (`dist/`)|
| `npm run preview` | Preview the production build locally         |

## Editing content

- **Your info, projects, and skills** live in [`src/data/site.ts`](src/data/site.ts).
- **Chat behavior** lives in [`src/lib/responses.tsx`](src/lib/responses.tsx): the suggestion
  cards, the "Recent" prompts, and the keyword router that maps a visitor's question to a
  response (about / projects / skills / contact / fallback). Add topics by extending
  `getResponse()` and `suggestions`.

Update those two files and the whole experience reflects the changes.

## Structure

```
frontend/
├─ index.html                 # HTML entry, fonts, meta tags
├─ src/
│  ├─ main.tsx                # React entry point
│  ├─ App.tsx                 # Chat state + layout (sidebar / conversation / prompt bar)
│  ├─ index.css               # Tailwind + Gemini gradient / card / input styles
│  ├─ data/site.ts            # ← Your content (name, tagline, projects, skills)
│  ├─ lib/responses.tsx       # ← Prompt → response routing + suggestion cards
│  └─ components/gemini/      # Sidebar, TopBar, Greeting, PromptInput, Message, icons
├─ tailwind.config.js
└─ vite.config.ts             # Dev server + /api proxy to the backend
```

## Backend integration

`vite.config.ts` proxies `/api/*` to `http://localhost:8080` during
development. Adjust the target once the backend is up.
