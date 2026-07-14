// Command portfolio-backend serves the API for the portfolio site, including
// the Claude-powered /api/chat assistant.
package main

import (
	"encoding/json"
	"log"
	"net/http"

	"portfolio-backend/internal/anthropic"
	"portfolio-backend/internal/chat"
	"portfolio-backend/internal/config"
)

func main() {
	cfg := config.Load()

	// Build the Anthropic client only when a key is present. Without one, the
	// chat handler runs in "no key" mode and returns 503 so the frontend can
	// fall back to its local canned answers.
	var client *anthropic.Client
	if cfg.HasAPIKey() {
		client = anthropic.New(cfg.AnthropicKey, cfg.Model)
		log.Printf("Anthropic chat enabled (model: %s)", cfg.Model)
	} else {
		log.Print("ANTHROPIC_API_KEY not set — /api/chat will return 503 (frontend falls back to local answers)")
	}

	mux := http.NewServeMux()
	mux.Handle("/api/chat", chat.New(client, cfg.AllowedOrigin))
	mux.HandleFunc("/api/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(map[string]any{
			"status":     "ok",
			"chatReady":  cfg.HasAPIKey(),
		})
	})

	addr := ":" + cfg.Port
	log.Printf("Listening on %s", addr)
	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatalf("server error: %v", err)
	}
}
