import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { useOpenclawStore } from "@/lib/store"
import { Link } from "react-router-dom"
import { 
  Github, 
  ExternalLink, 
  GitBranch, 
  Wrench, 
  RefreshCw, 
  Terminal, 
  Cpu, 
  CheckCircle2, 
  AlertCircle,
  Search,
  Settings2,
  History
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

export function GitHubRepos() {
  const { repos: storeRepos, updateRepoStatus, isLoaded } = useOpenclawStore()
  const [fixingRepoId, setFixingRepoId] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const filteredRepos = storeRepos.filter(repo => 
    repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    repo.associatedApp.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleFix = (repoId: string) => {
    setFixingRepoId(repoId)
    setLogs(["[SYSTEM] Initializing Openclaw Autonomous Repair...", "[INFO] Analyzing repository structure...", "[INFO] Scanning for potential vulnerabilities..."])
    
    updateRepoStatus(repoId, "fixing")

    // Simulate repair process
    setTimeout(() => {
      setLogs(prev => [...prev, "[ANALYSIS] Found 3 outdated dependencies.", "[ANALYSIS] Detected missing environment variable validation."])
    }, 1500)

    setTimeout(() => {
      setLogs(prev => [...prev, "[FIX] Updating package.json...", "[FIX] Injecting security middleware...", "[FIX] Optimizing build pipeline..."])
    }, 3000)

    setTimeout(() => {
      setLogs(prev => [...prev, "[SUCCESS] Repository health restored.", "[SUCCESS] All tests passed.", "[SYSTEM] Deployment triggered."])
      updateRepoStatus(repoId, "healthy", 0)
      setFixingRepoId(null)
    }, 5000)
  }

  if (!isLoaded) return null

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">GitHub Repositories</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage and repair repositories created by Openclaw.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input 
              placeholder="Search repos..." 
              className="pl-10 h-10 rounded-xl border-zinc-200 dark:border-zinc-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="rounded-xl gap-2">
            <Settings2 className="h-4 w-4" />
            Rules
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Repos List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredRepos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl bg-zinc-50/50 dark:bg-zinc-900/20">
              <div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-4">
                <Github className="h-6 w-6 text-zinc-400" />
              </div>
              <h3 className="text-lg font-bold">No repositories found</h3>
              <p className="text-zinc-500 max-w-xs">Create an app using the Setup Agent to see your repositories here.</p>
              <Link 
                to="/setup-agent" 
                className={cn(buttonVariants({ variant: "outline" }), "mt-4 rounded-xl")}
              >
                Go to Setup Agent
              </Link>
            </div>
          ) : (
            filteredRepos.map((repo) => (
              <Card key={repo.id} className="group hover:border-blue-500/50 transition-all duration-300 overflow-hidden">
                <CardHeader className="p-6 pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                        <Github className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{repo.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <GitBranch className="h-3 w-3" />
                          {repo.branch}
                          <span className="text-zinc-300 dark:text-zinc-700">|</span>
                          App: {repo.associatedApp}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {repo.status === "healthy" ? (
                        <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Healthy</Badge>
                      ) : repo.status === "issues" ? (
                        <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Issues Detected</Badge>
                      ) : (
                        <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 animate-pulse">Fixing...</Badge>
                      )}
                      <span className="text-[10px] text-zinc-400 font-medium uppercase">Last Sync: {repo.lastSync}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <div>
                      <p className="text-[10px] uppercase text-zinc-400 font-bold">Open Issues</p>
                      <p className={cn("font-bold", repo.issuesCount > 0 ? "text-red-500" : "text-green-500")}>
                        {repo.issuesCount}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-zinc-400 font-bold">Uptime</p>
                      <p className="font-bold">99.9%</p>
                    </div>
                    <div className="col-span-2 flex items-center justify-end gap-2">
                      <a 
                        href={repo.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-lg gap-2")}
                      >
                        <ExternalLink className="h-3 w-3" />
                        GitHub
                      </a>
                      <Button 
                        size="sm" 
                        className="rounded-lg gap-2 bg-blue-600 hover:bg-blue-700"
                        disabled={repo.status === "fixing" || fixingRepoId !== null}
                        onClick={() => handleFix(repo.id)}
                      >
                        <Wrench className="h-3 w-3" />
                        Openclaw Fix
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Diagnostics / Terminal */}
        <div className="space-y-6">
          <Card className="bg-zinc-950 border-zinc-800 text-zinc-300 overflow-hidden h-[400px] flex flex-col">
            <CardHeader className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-blue-400" />
                <CardTitle className="text-sm font-mono">Openclaw Diagnostics</CardTitle>
              </div>
              <div className="flex gap-1.5">
                <div className="h-2 w-2 rounded-full bg-red-500/50" />
                <div className="h-2 w-2 rounded-full bg-amber-500/50" />
                <div className="h-2 w-2 rounded-full bg-green-500/50" />
              </div>
            </CardHeader>
            <CardContent className="p-4 font-mono text-xs flex-1 overflow-y-auto space-y-2">
              {logs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-600 italic">
                  <Cpu className="h-8 w-8 mb-2 opacity-20" />
                  <p>Waiting for diagnostic trigger...</p>
                </div>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className={cn(
                    "animate-in slide-in-from-left-2 duration-300",
                    log.includes("[SUCCESS]") ? "text-green-400" : 
                    log.includes("[FIX]") ? "text-blue-400" :
                    log.includes("[ANALYSIS]") ? "text-amber-400" : ""
                  )}>
                    <span className="text-zinc-600 mr-2">[{new Date().toLocaleTimeString()}]</span>
                    {log}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="border-blue-500/20 bg-blue-500/5 overflow-hidden">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Cpu className="h-4 w-4 text-blue-500" />
                Autonomous Maintenance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Openclaw is currently monitoring <b>{storeRepos.length}</b> repositories. Autonomous repair is enabled for all production branches.
              </p>
              <div className="mt-4 flex items-center justify-between p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="text-xs font-medium">Auto-Fix Status</span>
                <Badge className="bg-green-500 text-white border-none text-[10px]">Active</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
