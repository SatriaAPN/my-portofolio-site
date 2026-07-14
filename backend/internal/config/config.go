// Package config loads server configuration from the environment.
//
// The Anthropic API key is read from the ANTHROPIC_API_KEY environment
// variable and is never hardcoded or logged. For local development you can
// place it in a .env file (git-ignored) — see .env.example.
package config

import (
	"bufio"
	"os"
	"strings"
)

// Config holds all runtime configuration for the server.
type Config struct {
	Port           string // Port to listen on (default 8080)
	AnthropicKey   string // Anthropic API key (from ANTHROPIC_API_KEY)
	Model          string // Claude model ID (default claude-opus-4-8)
	AllowedOrigin  string // CORS allowed origin (default http://localhost:5173)
}

// Load reads configuration from the environment, loading a .env file first if
// one is present in the working directory. Real environment variables always
// take precedence over .env values.
func Load() Config {
	loadDotEnv(".env")

	return Config{
		Port:          getenv("PORT", "8080"),
		AnthropicKey:  os.Getenv("ANTHROPIC_API_KEY"),
		Model:         getenv("ANTHROPIC_MODEL", "claude-opus-4-8"),
		AllowedOrigin: getenv("ALLOWED_ORIGIN", "http://localhost:5173"),
	}
}

// HasAPIKey reports whether an Anthropic API key is configured.
func (c Config) HasAPIKey() bool {
	return strings.TrimSpace(c.AnthropicKey) != ""
}

func getenv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

// loadDotEnv parses a simple KEY=VALUE file and sets any variables that are not
// already present in the environment. Lines beginning with # and blank lines
// are ignored. Missing files are silently skipped.
func loadDotEnv(path string) {
	f, err := os.Open(path)
	if err != nil {
		return
	}
	defer f.Close()

	scanner := bufio.NewScanner(f)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		key, value, found := strings.Cut(line, "=")
		if !found {
			continue
		}
		key = strings.TrimSpace(key)
		value = strings.Trim(strings.TrimSpace(value), `"'`)
		if _, exists := os.LookupEnv(key); !exists {
			os.Setenv(key, value)
		}
	}
}
