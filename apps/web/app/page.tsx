'use client';

import React, { useState } from 'react';
import { 
  Activity, 
  ShieldCheck, 
  Cpu, 
  Database, 
  Mail, 
  Terminal, 
  Server, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  Key, 
  Layers, 
  ExternalLink,
  RefreshCw,
  Lock
} from 'lucide-react';

export default function Home() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [tokenOutput, setTokenOutput] = useState<string | null>(null);

  const handleFetchDevToken = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/v1/auth/dev-token');
      if (res.ok) {
        const data = await res.json();
        setTokenOutput(data.token);
      } else {
        setTokenOutput('API offline or endpoint unreachable (Start backend API with `make backend-api`)');
      }
    } catch {
      setTokenOutput('Backend API Server running at http://localhost:8080 (Start with `make backend-api`)');
    }
  };

  const handleTriggerHealth = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div id="pulse-app-container" className="relative min-h-screen flex flex-col justify-between p-4 md:p-8 max-w-7xl mx-auto z-10">
      {/* Header Navigation */}
      <header className="flex flex-col sm:flex-row items-center justify-between py-4 border-b border-white/10 mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="h-full w-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
              <Zap className="h-5 w-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-gray-200 to-indigo-300 bg-clip-text text-transparent">
              Pulse
            </h1>
            <p className="text-xs text-gray-400 font-mono">v1.0.0 • Open-Source Reliability Platform</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            Local Stack Ready
          </span>
          <button 
            onClick={handleTriggerHealth}
            id="refresh-health-btn"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-gray-300 transition-all border border-white/10"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Sync Infra Status
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="space-y-8">
        {/* Metric Cards Banner */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel glass-panel-hover p-5 rounded-2xl">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">System Uptime</span>
              <Activity className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">99.98%</div>
            <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> All core services nominal
            </p>
          </div>

          <div className="glass-panel glass-panel-hover p-5 rounded-2xl">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">P95 Latency</span>
              <Clock className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">42 ms</div>
            <p className="text-xs text-cyan-400 mt-1">Synthetic monitoring active</p>
          </div>

          <div className="glass-panel glass-panel-hover p-5 rounded-2xl">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Temporal Workflows</span>
              <Layers className="h-4 w-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">14 Active</div>
            <p className="text-xs text-indigo-400 mt-1">Task Queue: pulse-monitoring-queue</p>
          </div>

          <div className="glass-panel glass-panel-hover p-5 rounded-2xl">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Team Auth Scoping</span>
              <ShieldCheck className="h-4 w-4 text-violet-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">JWT Multi-Tenant</div>
            <p className="text-xs text-violet-400 mt-1 flex items-center gap-1">
              <Lock className="h-3 w-3" /> Header & Token Scoped
            </p>
          </div>
        </section>

        {/* Infrastructure Dependencies Grid */}
        <section className="glass-panel p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Server className="h-5 w-5 text-indigo-400" />
                Local Infrastructure Services
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Spin up dependencies using Docker Compose (`docker compose up -d`)</p>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              docker-compose.yml
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* MongoDB */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-emerald-400" />
                  <span className="font-semibold text-sm text-gray-200">MongoDB 7.0</span>
                </div>
                <p className="text-xs text-gray-400">Document Store & Incident Logs</p>
                <code className="text-[11px] font-mono text-indigo-300 block bg-black/30 px-2 py-0.5 rounded">localhost:27017</code>
              </div>
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" title="Ready" />
            </div>

            {/* Redis */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-rose-400" />
                  <span className="font-semibold text-sm text-gray-200">Redis 7.0</span>
                </div>
                <p className="text-xs text-gray-400">Key-Value Cache & Pub/Sub</p>
                <code className="text-[11px] font-mono text-indigo-300 block bg-black/30 px-2 py-0.5 rounded">localhost:6379</code>
              </div>
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" title="Ready" />
            </div>

            {/* Temporal */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-indigo-400" />
                  <span className="font-semibold text-sm text-gray-200">Temporal Workflow</span>
                </div>
                <p className="text-xs text-gray-400">Stateful Execution Engine</p>
                <a 
                  href="http://localhost:8233" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-[11px] font-mono text-cyan-400 hover:underline flex items-center gap-1 bg-black/30 px-2 py-0.5 rounded w-fit"
                >
                  Web UI (Port 8233) <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </div>
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" title="Ready" />
            </div>

            {/* Ollama AI */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-cyan-400" />
                  <span className="font-semibold text-sm text-gray-200">Ollama AI Server</span>
                </div>
                <p className="text-xs text-gray-400">Local LLM Incident Analysis</p>
                <code className="text-[11px] font-mono text-indigo-300 block bg-black/30 px-2 py-0.5 rounded">localhost:11434</code>
              </div>
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" title="Ready" />
            </div>

            {/* Mailpit */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-amber-400" />
                  <span className="font-semibold text-sm text-gray-200">Mailpit SMTP</span>
                </div>
                <p className="text-xs text-gray-400">Local Email Alert Testing</p>
                <a 
                  href="http://localhost:8025" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-[11px] font-mono text-cyan-400 hover:underline flex items-center gap-1 bg-black/30 px-2 py-0.5 rounded w-fit"
                >
                  Dashboard (Port 8025) <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </div>
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" title="Ready" />
            </div>

            {/* Go REST API */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-violet-400" />
                  <span className="font-semibold text-sm text-gray-200">Go Backend API</span>
                </div>
                <p className="text-xs text-gray-400">Gin Framework + Auth Middleware</p>
                <a 
                  href="http://localhost:8080/health" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-[11px] font-mono text-cyan-400 hover:underline flex items-center gap-1 bg-black/30 px-2 py-0.5 rounded w-fit"
                >
                  /health (Port 8080) <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </div>
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" title="Ready" />
            </div>
          </div>
        </section>

        {/* Live Synthetic API Targets Panel */}
        <section className="glass-panel p-6 rounded-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-cyan-400" />
                Monitored API Targets
              </h2>
              <p className="text-xs text-gray-400">Temporal Workflow Synthetic Ping Execution</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleFetchDevToken}
                id="generate-jwt-btn"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/30"
              >
                <Key className="h-3.5 w-3.5" />
                Test Auth Middleware JWT
              </button>
            </div>
          </div>

          {tokenOutput && (
            <div className="mb-6 p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 font-mono text-xs text-indigo-200 space-y-1">
              <div className="flex items-center justify-between text-indigo-400 font-sans text-xs font-semibold">
                <span>Dev Token Generator Result (`/api/v1/auth/dev-token`)</span>
                <span className="text-[10px] bg-indigo-500/20 px-2 py-0.5 rounded">HMAC SHA256</span>
              </div>
              <p className="break-all text-gray-300 select-all bg-black/40 p-2 rounded">{tokenOutput}</p>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="text-[11px] uppercase tracking-wider text-gray-400 border-b border-white/10 bg-white/[0.02]">
                <tr>
                  <th className="py-3 px-4">Endpoint Name</th>
                  <th className="py-3 px-4">URL</th>
                  <th className="py-3 px-4">Team Scope</th>
                  <th className="py-3 px-4">Frequency</th>
                  <th className="py-3 px-4">Latency</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 font-sans font-medium text-white flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Auth Service Health
                  </td>
                  <td className="py-3 px-4 text-indigo-300">https://auth.internal.pulse/health</td>
                  <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px]">team-alpha</span></td>
                  <td className="py-3 px-4 text-gray-400">10s</td>
                  <td className="py-3 px-4 text-emerald-400">18 ms</td>
                  <td className="py-3 px-4"><span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-sans">200 OK</span></td>
                </tr>

                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 font-sans font-medium text-white flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Payment Gateway Charge
                  </td>
                  <td className="py-3 px-4 text-indigo-300">https://payments.internal.pulse/charge</td>
                  <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px]">team-billing</span></td>
                  <td className="py-3 px-4 text-gray-400">30s</td>
                  <td className="py-3 px-4 text-emerald-400">64 ms</td>
                  <td className="py-3 px-4"><span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-sans">200 OK</span></td>
                </tr>

                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 font-sans font-medium text-white flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    User Profile Microservice
                  </td>
                  <td className="py-3 px-4 text-indigo-300">https://users.internal.pulse/profile</td>
                  <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px]">team-alpha</span></td>
                  <td className="py-3 px-4 text-gray-400">15s</td>
                  <td className="py-3 px-4 text-emerald-400">29 ms</td>
                  <td className="py-3 px-4"><span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-sans">200 OK</span></td>
                </tr>

                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 font-sans font-medium text-white flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                    Stripe Webhook Listener
                  </td>
                  <td className="py-3 px-4 text-indigo-300">https://webhooks.internal.pulse/stripe</td>
                  <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px]">team-infra</span></td>
                  <td className="py-3 px-4 text-gray-400">60s</td>
                  <td className="py-3 px-4 text-amber-400">140 ms</td>
                  <td className="py-3 px-4"><span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-sans">Degraded</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
        <div className="flex items-center gap-2">
          <span>Pulse Platform • 100% Open Source under MIT License</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="http://localhost:8080/health" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Backend /health</a>
          <a href="http://localhost:8233" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Temporal Dashboard</a>
          <a href="http://localhost:8025" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Mailpit Inbox</a>
        </div>
      </footer>
    </div>
  );
}
