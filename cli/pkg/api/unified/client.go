package unified

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

type Client struct {
	apiKey     string
	apiBaseURL string
	httpClient *http.Client
	command    string
}

func NewClient(command string) *Client {
	return &Client{
		apiKey:     GetAPIKey(command),
		apiBaseURL: GetAPIBaseURL(command),
		httpClient: &http.Client{
			Timeout: 30 * time.Second,
		},
		command: command,
	}
}

func (c *Client) Request(method, path string, body interface{}, result interface{}) error {
	url := fmt.Sprintf("%s%s", c.apiBaseURL, path)

	var reqBody io.Reader
	if body != nil {
		jsonData, err := json.Marshal(body)
		if err != nil {
			return fmt.Errorf("failed to marshal request body: %w", err)
		}
		reqBody = bytes.NewBuffer(jsonData)
	}

	req, err := http.NewRequest(method, url, reqBody)
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")
	if c.apiKey != "" {
		req.Header.Set("Authorization", "Bearer "+c.apiKey)
	}
	req.Header.Set("User-Agent", fmt.Sprintf("%s-cli/0.1.0", c.command))

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("request failed: %w", err)
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("failed to read response body: %w", err)
	}

	if resp.StatusCode >= 400 {
		var errResp struct {
			Error string `json:"error"`
		}
		if err := json.Unmarshal(respBody, &errResp); err == nil && errResp.Error != "" {
			return fmt.Errorf("API error: %s", errResp.Error)
		}
		return fmt.Errorf("API error: %s", resp.Status)
	}

	if result != nil && len(respBody) > 0 {
		if err := json.Unmarshal(respBody, result); err != nil {
			return fmt.Errorf("failed to unmarshal response: %w", err)
		}
	}

	return nil
}

func (c *Client) Get(path string, result interface{}) error {
	return c.Request(http.MethodGet, path, nil, result)
}

func (c *Client) Post(path string, body interface{}, result interface{}) error {
	return c.Request(http.MethodPost, path, body, result)
}

func (c *Client) Put(path string, body interface{}, result interface{}) error {
	return c.Request(http.MethodPut, path, body, result)
}

func (c *Client) Delete(path string, result interface{}) error {
	return c.Request(http.MethodDelete, path, nil, result)
}
