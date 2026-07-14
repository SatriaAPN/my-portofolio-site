# Portfolio — Backend

A small **Go** HTTP server that powers the portfolio's Gemini-style chat
assistant. It proxies conversations to the **Claude API** using the official
[`anthropic-sdk-go`](https://github.com/anthropics/anthropic-sdk-go) — the API
key stays server-side and is read from the environment (never hardcoded).

## Requirements

- Go 1.24+ (the Anthropic SDK requires it; Go's toolchain mechanism will
  auto-fetch 1.24 if you're on an older Go)

## Getting started

```bash
cd backend
cp .env.example .env      # then paste your ANTHROPIC_API_KEY into .env
go run .
```

The server listens on `http://localhost:8080`. The frontend dev server proxies
`/api/*` to it automatically (see `frontend/vite.config.ts`).

> **No API key?** The server still runs. `/api/chat` returns `503`, and the
> frontend falls back to its built-in canned answers — so the site works with
> or without a key.

## Endpoints

| Method | Path          | Description                                        |
| ------ | ------------- | -------------------------------------------------- |
| `POST` | `/api/chat`   | Send `{ "messages": [{ "role", "content" }] }`; returns `{ "reply": "..." }` |
| `GET`  | `/api/health` | Liveness + whether the chat assistant is configured |

Example:

```bash
curl -s localhost:8080/api/chat \
  -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"What projects has Satria built?"}]}'
```

## Configuration

All configuration comes from environment variables (or a local `.env`):

| Variable            | Default                  | Purpose                                      |
| ------------------- | ------------------------ | -------------------------------------------- |
| `ANTHROPIC_API_KEY` | *(none)*                 | Your Claude API key. Kept server-side only.  |
| `ANTHROPIC_MODEL`   | `claude-opus-4-8`        | Claude model. Use `claude-haiku-4-5` for a cheaper/faster assistant. |
| `PORT`              | `8080`                   | Listen port.                                 |
| `ALLOWED_ORIGIN`    | `http://localhost:5173`  | CORS origin for the frontend.                |

## Structure

```
backend/
├─ main.go                       # entry: config, routes, server
├─ internal/
│  ├─ config/config.go           # env + .env loading (no secrets in code)
│  ├─ anthropic/client.go        # Claude API wrapper (official SDK)
│  └─ chat/handler.go            # POST /api/chat — persona, validation, CORS
├─ .env.example                  # copy to .env; never commit .env
└─ go.mod
```

## Editing the assistant's persona

The system prompt that tells Claude who Satria is lives in
[`internal/chat/handler.go`](internal/chat/handler.go) (`systemPrompt`). Edit it
to change the assistant's tone or the facts it's allowed to state.

## Security notes

- The API key is only read from the environment and passed to the SDK — it is
  never written to disk, logged, or returned to the browser.
- `.env` is git-ignored; only `.env.example` (no real key) is committed.
- Request bodies are size-limited and validated; upstream errors are logged
  server-side but return a generic message to the client.
