package domain

import "time"

type HealthStatus string

const (
	StatusHealthy   HealthStatus = "HEALTHY"
	StatusDegraded  HealthStatus = "DEGRADED"
	StatusUnhealthy HealthStatus = "UNHEALTHY"
)

type IncidentSeverity string

const (
	SeverityLow      IncidentSeverity = "LOW"
	SeverityMedium   IncidentSeverity = "MEDIUM"
	SeverityHigh     IncidentSeverity = "HIGH"
	SeverityCritical IncidentSeverity = "CRITICAL"
)

type Incident struct {
	ID           string           `json:"id" bson:"_id,omitempty"`
	TeamID       string           `json:"team_id" bson:"team_id"`
	TargetURL    string           `json:"target_url" bson:"target_url"`
	StatusCode   int              `json:"status_code" bson:"status_code"`
	LatencyMs    int64            `json:"latency_ms" bson:"latency_ms"`
	Severity     IncidentSeverity `json:"severity" bson:"severity"`
	ErrorMessage string           `json:"error_message" bson:"error_message"`
	AIAnalysis   string           `json:"ai_analysis,omitempty" bson:"ai_analysis,omitempty"`
	CreatedAt    time.Time        `json:"created_at" bson:"created_at"`
	ResolvedAt   *time.Time       `json:"resolved_at,omitempty" bson:"resolved_at,omitempty"`
}

type EndpointTarget struct {
	ID        string            `json:"id" bson:"_id,omitempty"`
	TeamID    string            `json:"team_id" bson:"team_id"`
	Name      string            `json:"name" bson:"name"`
	URL       string            `json:"url" bson:"url"`
	Method    string            `json:"method" bson:"method"`
	Headers   map[string]string `json:"headers,omitempty" bson:"headers,omitempty"`
	Interval  int               `json:"interval_seconds" bson:"interval_seconds"`
	IsActive  bool              `json:"is_active" bson:"is_active"`
	CreatedAt time.Time         `json:"created_at" bson:"created_at"`
}
