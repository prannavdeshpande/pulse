package workflows

import (
	"time"

	"pulse/backend/internal/temporal/activities"

	"go.temporal.io/sdk/workflow"
)

type APIHealthMonitorParams struct {
	TargetURL  string `json:"target_url"`
	IntervalSec int   `json:"interval_sec"`
}

func APIHealthMonitorWorkflow(ctx workflow.Context, params APIHealthMonitorParams) error {
	ao := workflow.ActivityOptions{
		StartToCloseTimeout: 15 * time.Second,
	}
	ctx = workflow.WithActivityOptions(ctx, ao)

	var act *activities.PingActivities

	pingReq := activities.PingRequest{
		TargetURL:  params.TargetURL,
		TimeoutSec: 10,
	}

	var result activities.PingResult
	err := workflow.ExecuteActivity(ctx, act.ExecutePing, pingReq).Get(ctx, &result)
	if err != nil {
		workflow.GetLogger(ctx).Error("Failed to execute synthetic ping activity", "error", err)
		return err
	}

	workflow.GetLogger(ctx).Info("Synthetic ping completed", "status", result.StatusCode, "latency", result.LatencyMs)
	return nil
}
