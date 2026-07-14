// Package anthropic wraps the official Anthropic Go SDK for this project's
// portfolio chat assistant. It exposes a single Reply method that turns a
// conversation into a Claude completion.
package anthropic

import (
	"context"
	"strings"

	"github.com/anthropics/anthropic-sdk-go"
	"github.com/anthropics/anthropic-sdk-go/option"
)

// Message is a single conversation turn from the client.
type Message struct {
	Role    string `json:"role"`    // "user" or "assistant"
	Content string `json:"content"` // plain text
}

// Client is a thin wrapper around the Anthropic SDK client.
type Client struct {
	sdk   anthropic.Client
	model anthropic.Model
}

// New builds a Client. The API key is passed to the SDK explicitly; it is never
// stored beyond the SDK client and never logged.
func New(apiKey, model string) *Client {
	return &Client{
		sdk:   anthropic.NewClient(option.WithAPIKey(apiKey)),
		model: anthropic.Model(model),
	}
}

// Reply sends the system prompt and conversation history to Claude and returns
// the assistant's plain-text response.
func (c *Client) Reply(ctx context.Context, systemPrompt string, history []Message) (string, error) {
	messages := make([]anthropic.MessageParam, 0, len(history))
	for _, m := range history {
		text := anthropic.NewTextBlock(m.Content)
		if isAssistant(m.Role) {
			messages = append(messages, anthropic.NewAssistantMessage(text))
		} else {
			messages = append(messages, anthropic.NewUserMessage(text))
		}
	}

	resp, err := c.sdk.Messages.New(ctx, anthropic.MessageNewParams{
		Model:     c.model,
		MaxTokens: 1024,
		System: []anthropic.TextBlockParam{
			{Text: systemPrompt},
		},
		Messages: messages,
	})
	if err != nil {
		return "", err
	}

	var sb strings.Builder
	for _, block := range resp.Content {
		if text, ok := block.AsAny().(anthropic.TextBlock); ok {
			sb.WriteString(text.Text)
		}
	}
	return strings.TrimSpace(sb.String()), nil
}

func isAssistant(role string) bool {
	switch strings.ToLower(role) {
	case "assistant", "model":
		return true
	default:
		return false
	}
}
