package main

import (
	"log"

	"pulse/backend/internal/config"
	"pulse/backend/internal/temporal/activities"
	"pulse/backend/internal/temporal/workflows"

	"go.temporal.io/sdk/client"
	"go.temporal.io/sdk/worker"
)

func main() {
	cfg := config.LoadConfig()

	log.Printf("Initializing Temporal Worker on Task Queue: %s (Host: %s)", cfg.TemporalTaskQueue, cfg.TemporalHostPort)

	c, err := client.Dial(client.Options{
		HostPort: cfg.TemporalHostPort,
	})
	if err != nil {
		log.Printf("Warning: Failed to connect to Temporal server (%v). Worker running in retry state.", err)
		return
	}
	defer c.Close()

	w := worker.New(c, cfg.TemporalTaskQueue, worker.Options{})

	// Register Workflows & Activities
	w.RegisterWorkflow(workflows.APIHealthMonitorWorkflow)
	w.RegisterActivity(activities.NewPingActivities())

	log.Println("Pulse Temporal Worker started successfully. Listening for tasks...")
	err = w.Run(worker.InterruptCh())
	if err != nil {
		log.Fatalf("Unable to start Temporal worker: %v", err)
	}
}
