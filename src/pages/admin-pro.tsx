import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, Zap, Loader2, PlayCircle, Terminal, Cpu, Globe, Lock, CheckCircle2, AlertCircle, Activity, Settings, Github, X, Save } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface AutonomousRule {
  id: string
  name: string
  description: string
  enabled: boolean
}

const DEFAULT_RULES: AutonomousRule[] = [
  { id: "auto_patch", name: "Auto-Patch Critical Bugs", description: "Automatically fix and deploy patches for high-severity crashes.", enabled: true },
  { id: "aso_optimize", name: "ASO Auto-Optimization", description: "Continuously update store metadata based on keyword performance.", enabled: true },
  { id: "daily_limit", name: "Daily Deployment Cap", description: "Limit autonomous deployments to 3 per day for safety.", enabled: true },
  { id: "weekend_pause", name: "Pause on Weekends", description: "Disable autonomous deployments during non-business hours.", enabled: false },
  { id: "repo_sync", name: "Auto-Repo Synchronization", description: "Keep GitHub and internal codebases in perfect sync.", enabled: true },
]

export function AdminPro() {
  const [isAutonomousActive, setIsAutonomousActive] = useState(() => {
    return localStorage.getItem("openclaw_autonomous_active") === "true"
  })
  const [isConnecting, setIsConnecting] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false)
  const [rules, setRules] = useState<AutonomousRule[]>(() => {
    const saved = localStorage.getItem("openclaw_autonomous_rules")
    return saved ? JSON.parse(saved) : DEFAULT_RULES
  })
  const [stats, setStats] = useState({
    tasksCompleted: 142,
    uptime: "99.99%",
    lastSync: "Just now",
    activeRepos: 8
  })

  useEffect(() => {
    localStorage.setItem("openclaw_autonomous_active", isAutonomousActive.toString())
  }, [isAutonomousActive])

  useEffect(() => {
    localStorage.setItem("openclaw_autonomous_rules", JSON.stringify(rules))
  }, [rules])

  const toggleRule = (id: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ))
  }

  const handleToggleAutonomous = () => {
    if (!isAutonomousActive) {
      setIsConnecting(true)
      setLogs(["> Initializing Openclaw Pro Link...", "> Authenticating Admin Credentials...", "> Establishing Secure Tunnel..."])
      
      setTimeout(() => setLogs(prev => [...prev, "> SUCCESS: Openclaw connected to local environment."]), 1000)
      setTimeout(() => setLogs(prev => [...prev, "> Granting 100% control permissions...", "> Synchronizing state with GitHub & Play Store..."]), 2000)
      
      setTimeout(() => {
        setIsConnecting(false)
        setIsAutonomousActive(true)
        setLogs(prev => [...prev, "> AUTONOMOUS MODE: ACTIVE. Openclaw is now controlling this application."])
      }, 3500)
    } else {
      setIsAutonomousActive(false)
      setLogs(["> Disconnecting Openclaw Autonomous Link...", "> Reverting to manual control mode.", "> Connection closed."])
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto animate-in fade-in duration-500 pb-20">
      
      {/* Pro Plan Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-blue-900 p-8 rounded-3xl border border-zinc-800 shadow-2xl text-white">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <ShieldCheck className="h-48 w-48 rotate-12" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Badge className="bg-blue-500 hover:bg-blue-600 text-white border-none px-4 py-1 text-sm font-bold">PRO PLAN ACTIVE</Badge>
            <Badge variant="outline" className="text-blue-300 border-blue-300/30">Enterprise Edition</Badge>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Admin Control Center</h1>
          <p className="text-blue-100/70 max-w-xl text-lg">
            You are running on the **Openclaw Pro Plan**. This grants the AI agent 100% autonomous control over your entire app ecosystem.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        
        {/* Left: Autonomous Toggle (7 cols) */}
        <div className="md:col-span-7 space-y-6">
          <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <CardHeader className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-blue-500" />
                  <CardTitle>Openclaw Intelligence Link</CardTitle>
                </div>
                <div className={`h-3 w-3 rounded-full ${isAutonomousActive ? "bg-green-500 animate-pulse" : "bg-zinc-300 dark:bg-zinc-700"}`}></div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className={`h-24 w-24 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isAutonomousActive ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 scale-110 shadow-xl shadow-blue-500/20" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                }`}>
                  {isConnecting ? <Loader2 className="h-12 w-12 animate-spin" /> : <ShieldCheck className="h-12 w-12" />}
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold mb-2">
                    {isAutonomousActive ? "Autonomous Mode Active" : "Manual Control Mode"}
                  </h3>
                  <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                    {isAutonomousActive 
                      ? "Openclaw is currently connected and monitoring all systems. It will automatically fix bugs and deploy updates."
                      : "Connect Openclaw to allow the AI to autonomously manage your repositories, deployments, and store listings."}
                  </p>
                </div>

                <Button 
                  onClick={handleToggleAutonomous}
                  disabled={isConnecting}
                  className={`h-14 px-10 rounded-2xl text-lg font-bold transition-all ${
                    isAutonomousActive 
                      ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-white" 
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
                  }`}
                >
                  {isConnecting ? "CONNECTING..." : isAutonomousActive ? "DISCONNECT OPENCLAW" : "CONNECT OPENCLAW"}
                </Button>
              </div>

              {/* Terminal Logs */}
              {(logs.length > 0 || isConnecting) && (
                <div className="mt-8 bg-zinc-950 rounded-xl p-4 border border-zinc-800 shadow-inner font-mono text-xs sm:text-sm text-green-400 max-h-48 overflow-y-auto">
                  <div className="flex items-center gap-2 mb-2 text-zinc-500">
                    <Terminal className="h-4 w-4" />
                    <span>System Logs</span>
                  </div>
                  {logs.map((log, i) => (
                    <div key={i} className={`mb-1 ${log.startsWith("> SUCCESS") ? "text-blue-400" : log.startsWith("> ERROR") ? "text-red-400" : ""}`}>
                      {log}
                    </div>
                  ))}
                  {isConnecting && <div className="animate-pulse text-zinc-500">{">"} _</div>}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Capabilities Card */}
          <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Autonomous Capabilities</CardTitle>
              <CardDescription>What Openclaw can do with 100% control</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Globe, label: "Global Deployments", desc: "Auto-push to Play Store" },
                  { icon: Github, label: "Repo Management", desc: "Auto-create & sync repos" },
                  { icon: Zap, label: "Real-time Fixes", desc: "AI-powered bug patching" },
                  { icon: Lock, label: "Security Audits", desc: "Continuous vulnerability scans" }
                ].map((cap, i) => (
                  <div key={i} className="flex gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                    <div className="h-10 w-10 rounded-lg bg-white dark:bg-zinc-800 flex items-center justify-center border border-zinc-100 dark:border-zinc-700 shrink-0">
                      <cap.icon className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{cap.label}</h4>
                      <p className="text-xs text-zinc-500">{cap.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Stats & Status (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          
          {/* Real-time Status */}
          <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-500" />
                Live Intelligence Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-500">Autonomous Tasks</span>
                  <span className="font-bold">{stats.tasksCompleted}</span>
                </div>
                <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[75%] rounded-full"></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                  <p className="text-xs text-zinc-500 mb-1">Uptime</p>
                  <p className="font-bold text-green-500">{stats.uptime}</p>
                </div>
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                  <p className="text-xs text-zinc-500 mb-1">Active Repos</p>
                  <p className="font-bold">{stats.activeRepos}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500">Last Sync</span>
                  <span className="font-medium">{stats.lastSync}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security & Access */}
          <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lock className="h-5 w-5 text-amber-500" />
                Access Permissions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                "Full Repository Write Access",
                "Google Play Console API Access",
                "Stripe Webhook Management",
                "Firebase Admin Privileges",
                "Autonomous Code Modification"
              ].map((perm, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                  <span>{perm}</span>
                </div>
              ))}
            </CardContent>
            <CardFooter className="bg-amber-50 dark:bg-amber-950/20 p-4 border-t border-amber-100 dark:border-amber-900/50">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
                <p className="text-xs text-amber-800 dark:text-amber-400">
                  Warning: Granting 100% control allows Openclaw to modify production code and deploy live updates autonomously.
                </p>
              </div>
            </CardFooter>
          </Card>

          {/* Settings Shortcut */}
          <Button 
            variant="outline" 
            className="w-full h-12 rounded-xl gap-2"
            onClick={() => setIsRulesModalOpen(true)}
          >
            <Settings className="h-4 w-4" />
            Configure Autonomous Rules
          </Button>
        </div>

      </div>

      {/* Rules Configuration Modal */}
      {isRulesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <Card className="w-full max-w-xl shadow-2xl border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-300">
            <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div>
                <CardTitle className="text-2xl">Autonomous Rules</CardTitle>
                <CardDescription>Define the boundaries for Openclaw's AI agent</CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsRulesModalOpen(false)} className="rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              {rules.map((rule) => (
                <div key={rule.id} className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                  <div className="space-y-1">
                    <Label htmlFor={rule.id} className="text-base font-bold cursor-pointer">
                      {rule.name}
                    </Label>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {rule.description}
                    </p>
                  </div>
                  <Switch 
                    id={rule.id} 
                    checked={rule.enabled} 
                    onCheckedChange={() => toggleRule(rule.id)}
                  />
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex justify-end gap-3 bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-b-xl border-t border-zinc-100 dark:border-zinc-800">
              <Button variant="outline" onClick={() => setIsRulesModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  setIsRulesModalOpen(false)
                  setLogs(prev => [...prev, "> System: Autonomous rules updated successfully."])
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
              >
                <Save className="h-4 w-4" />
                Save Configuration
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
