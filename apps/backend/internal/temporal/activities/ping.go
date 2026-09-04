package activities

import (
	"context"
	"fmt"
	"net/http"
	"time"
)

type PingRequest struct {
	TargetURL string `json:"target_url"`
	TimeoutSec int   `json:"timeout_sec"`
}

type PingResult struct {
	StatusCode int    `json:"status_code"`
	LatencyMs  int64  `json:"latency_ms"`
	IsSuccess  bool   `json:"is_success"`
	Error      string `json:"error,omitempty"`
}

type PingActivities struct{}

func NewPingActivities() *PingActivities {
	return &PingActivities{}
}

func (a *PingActivities) ExecutePing(ctx context.Context, req PingRequest) (PingResult, error) {
	if req.TimeoutSec <= 0 {
		req.TimeoutSec = 10
	}

	client := http.Client{
		Timeout: time.Duration(req.TimeoutSec) * time.Second,
	}

	start := time.Now()
	resp, err := client.Get(req.TargetURL)
	latency := time.Since(start).Milliseconds()

	if err != nil {
		return PingResult{
			StatusCode: 0,
			LatencyMs:  latency,
			IsSuccess:  false,
			Error:      err.Error(),
		}, nil
	}
	defer resp.Body.Close()

	isSuccess := resp.StatusCode >= 200 && resp.StatusCode < 400
	var errStr string
	if !isSuccess {
		errStr = fmt.Sprintf("HTTP target returned failing status code: %d", resp.StatusCode)
	}

	return PingResult{
		StatusCode: resp.StatusCode,
		LatencyMs:  latency,
		IsSuccess:  isSuccess,
		Error:      errStr,
	}, nil
}
