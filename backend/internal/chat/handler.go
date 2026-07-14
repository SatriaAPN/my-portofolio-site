// Package chat implements the /api/chat HTTP endpoint that backs the
// portfolio's Gemini-style assistant.
package chat

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"portfolio-backend/internal/anthropic"
)

// systemPrompt defines the assistant's persona. Edit this to change how the
// assistant talks about you. Keep it factual — the model can only answer from
// what it's told here plus the conversation.
const systemPrompt = `You are the portfolio assistant for Satria APN, a Software Engineer based in Singapore.
You speak on Satria's behalf to visitors of his personal website.

About Satria:
- Software Engineer who builds reliable, scalable web applications.
- Enjoys working across the stack: React/TypeScript on the frontend, Go/Node.js on the backend.
- Cares about clean, maintainable code and turning complex problems into simple products.
- Reach him by email at satrianusa10@gmail.com.

Guidelines:
- Be warm, concise, and helpful. Answer in a few short sentences unless asked for detail.
- Only speak about Satria's professional background, projects, skills, and how to get in touch.
- If asked something you don't know about Satria, say so honestly and suggest emailing him.
- Never invent facts (specific employers, dates, or achievements) that aren't stated above.
- Politely decline requests unrelated to Satria's portfolio.`

const (
	maxMessages       = 40
	maxContentLength  = 4000
	requestTimeout    = 30 * time.Second
)

// Handler serves the chat endpoint. When client is nil (no API key configured)
// it responds with 503 so the frontend can fall back to local canned answers.
type Handler struct {
	client        *anthropic.Client
	allowedOrigin string
}

// New builds a chat Handler. Pass a nil client to run in "no key" mode.
func New(client *anthropic.Client, allowedOrigin string) *Handler {
	return &Handler{client: client, allowedOrigin: allowedOrigin}
}

type chatRequest struct {
	Messages []anthropic.Message `json:"messages"`
}

type chatResponse struct {
	Reply string `json:"reply"`
}

type errorResponse struct {
	Error string `json:"error"`
}

func (h *Handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	h.setCORS(w)

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}
	if r.Method != http.MethodPost {
		writeError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var req chatRequest
	if err := json.NewDecoder(http.MaxBytesReader(w, r.Body, 1<<20)).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid JSON body")
		return
	}

	if err := validate(req.Messages); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	// No API key configured — tell the client so it can fall back locally.
	if h.client == nil {
		writeError(w, http.StatusServiceUnavailable, "Chat assistant is not configured (no API key).")
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), requestTimeout)
	defer cancel()

	reply, err := h.client.Reply(ctx, systemPrompt, req.Messages)
	if err != nil {
		// Log the real error server-side; return a generic message to the client.
		log.Printf("anthropic reply error: %v", err)
		writeError(w, http.StatusBadGateway, "The assistant is temporarily unavailable. Please try again.")
		return
	}

	writeJSON(w, http.StatusOK, chatResponse{Reply: reply})
}

func (h *Handler) setCORS(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", h.allowedOrigin)
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}

func validate(messages []anthropic.Message) error {
	if len(messages) == 0 {
		return errValidation("messages must not be empty")
	}
	if len(messages) > maxMessages {
		return errValidation("too many messages")
	}
	for _, m := range messages {
		if m.Content == "" {
			return errValidation("message content must not be empty")
		}
		if len(m.Content) > maxContentLength {
			return errValidation("message content is too long")
		}
	}
	if last := messages[len(messages)-1]; !isUser(last.Role) {
		return errValidation("the last message must be from the user")
	}
	return nil
}

func isUser(role string) bool {
	return role == "" || role == "user"
}

type validationError string

func (e validationError) Error() string { return string(e) }
func errValidation(msg string) error    { return validationError(msg) }

func writeJSON(w http.ResponseWriter, status int, body any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(body)
}

func writeError(w http.ResponseWriter, status int, msg string) {
	writeJSON(w, status, errorResponse{Error: msg})
}
