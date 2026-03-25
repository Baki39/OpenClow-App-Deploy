import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useOpenclawStore, App } from "@/lib/store"
import { 
  Smartphone, 
  Trash2, 
  Pause, 
  Moon, 
  Play, 
  Terminal, 
  Github, 
  PlayCircle, 
  ShieldAlert,
  Search,
  MoreVertical,
  AlertTriangle,
  RefreshCw
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function AppManager() {
  const { apps, deleteApp, updateAppStatus, isLoaded } = useOpenclawStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [logs, setLogs] = useState<string[]>([])
  const [isDeleting, setIsDeleting] = useState(false)
  const [appToDelete, setAppToDelete] = useState<App | null>(null)

  const filteredApps = apps.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const addLog = (message: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev.slice(0, 50)])
  }

  const handleDelete = async () => {
    if (!appToDelete) return
    
    setIsDeleting(true)
    addLog(`[SYSTEM] Initiating permanent deletion for: ${appToDelete.name}`)
    
    // Simulate GitHub Deletion
    addLog(`[GITHUB] Connecting to API...`)
    await new Promise(r => setTimeout(r, 800))
    addLog(`[GITHUB] Repository found: ${appToDelete.name.toLowerCase().replace(/\s+/g, '-')}`)
    addLog(`[GITHUB] Deleting repository and all branches...`)
    await new Promise(r => setTimeout(r, 1000))
    addLog(`[GITHUB] SUCCESS: Repository removed.`)

    // Simulate Google Play Store Deletion
    addLog(`[PLAY STORE] Authenticating with Google Play Console...`)
    await new Promise(r => setTimeout(r, 800))
    addLog(`[PLAY STORE] App ID: com.openclaw.${appToDelete.name.toLowerCase().replace(/\s+/g, '.')}`)
    addLog(`[PLAY STORE] Unpublishing app from all tracks...`)
    await new Promise(r => setTimeout(r, 1000))
    addLog(`[PLAY STORE] Deleting app listing and metadata...`)
    await new Promise(r => setTimeout(r, 1200))
    addLog(`[PLAY STORE] SUCCESS: App removed from store and console.`)

    // Final Internal Deletion
    addLog(`[SYSTEM] Removing local data and associated resources...`)
    await new Promise(r => setTimeout(r, 500))
    
    deleteApp(appToDelete.id)
    addLog(`[SUCCESS] ${appToDelete.name} has been completely erased from all platforms.`)
    
    setIsDeleting(false)
    setAppToDelete(null)
  }

  const handleStatusChange = (appId: string, appName: string, newStatus: App["status"]) => {
    updateAppStatus(appId, newStatus)
    addLog(`[SYSTEM] Status updated for ${appName} -> ${newStatus}`)
    
    if (newStatus === "Paused") {
      addLog(`[PLAY STORE] App traffic paused.`)
      addLog(`[GITHUB] Webhooks disabled.`)
    } else if (newStatus === "Sleep") {
      addLog(`[SYSTEM] Resources put to sleep mode.`)
      addLog(`[PLAY STORE] App visibility set to private.`)
    } else if (newStatus === "Live") {
      addLog(`[SYSTEM] Resuming all services...`)
    }
  }

  if (!isLoaded) return null

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">App Manager</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Control, pause, or permanently erase your applications from all stores.
          </p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input 
            placeholder="Search apps by name or category..." 
            className="pl-10 h-10 rounded-xl border-zinc-200 dark:border-zinc-800"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Apps List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredApps.length === 0 ? (
            <Card className="border-dashed border-2 flex flex-col items-center justify-center py-20 text-center">
              <Smartphone className="h-12 w-12 text-zinc-200 mb-4" />
              <h3 className="text-lg font-medium">No apps found</h3>
              <p className="text-zinc-500 max-w-xs mt-1">
                {searchQuery ? "Try a different search term." : "You haven't created any apps yet."}
              </p>
            </Card>
          ) : (
            filteredApps.map((app) => (
              <Card key={app.id} className="overflow-hidden group hover:border-zinc-400 dark:hover:border-zinc-600 transition-all">
                <CardContent className="p-0">
                  <div className="flex items-center p-6 gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-3xl shadow-inner">
                      {app.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg truncate">{app.name}</h3>
                        <Badge className={cn(
                          "text-[10px] px-1.5 py-0",
                          app.status === "Live" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                          app.status === "Paused" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                          app.status === "Sleep" ? "bg-zinc-500/10 text-zinc-500 border-zinc-500/20" :
                          "bg-blue-500/10 text-blue-500 border-blue-500/20"
                        )}>
                          {app.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-zinc-500 truncate">{app.category} • {app.niche}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {app.status === "Live" ? (
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="rounded-xl h-10 w-10 text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                          onClick={() => handleStatusChange(app.id, app.name, "Paused")}
                          title="Pause App"
                        >
                          <Pause className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="rounded-xl h-10 w-10 text-green-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30"
                          onClick={() => handleStatusChange(app.id, app.name, "Live")}
                          title="Resume App"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl w-48">
                          <DropdownMenuItem 
                            className="gap-2 cursor-pointer"
                            onClick={() => handleStatusChange(app.id, app.name, "Sleep")}
                          >
                            <Moon className="h-4 w-4" />
                            Put to Sleep
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30"
                            onClick={() => setAppToDelete(app)}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete Permanently
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  <div className="px-6 py-3 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500">
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1"><Github className="h-3 w-3" /> GitHub: Connected</span>
                      <span className="flex items-center gap-1"><PlayCircle className="h-3 w-3" /> Play Store: Active</span>
                    </div>
                    <span>Last Update: {app.lastUpdated}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Action Logs */}
        <div className="space-y-6">
          <Card className="bg-zinc-950 border-zinc-800 text-zinc-300 overflow-hidden h-[500px] flex flex-col shadow-2xl">
            <CardHeader className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-red-400" />
                <CardTitle className="text-sm font-mono">Global Action Logs</CardTitle>
              </div>
              <Badge variant="outline" className="text-[10px] border-zinc-700 text-zinc-500">Real-time</Badge>
            </CardHeader>
            <CardContent className="p-4 font-mono text-[10px] flex-1 overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-zinc-800">
              {logs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-700 italic text-center px-4">
                  <ShieldAlert className="h-8 w-8 mb-2 opacity-20" />
                  <p>System ready. All actions performed here will be synced with external stores.</p>
                </div>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className={cn(
                    "animate-in slide-in-from-left-2 duration-300 border-l-2 pl-2 py-0.5",
                    log.includes("[SUCCESS]") ? "text-green-400 border-green-500/50" : 
                    log.includes("[GITHUB]") ? "text-blue-400 border-blue-500/50" :
                    log.includes("[PLAY STORE]") ? "text-amber-400 border-amber-500/50" :
                    log.includes("[SYSTEM]") ? "text-zinc-400 border-zinc-500/50" : "border-transparent"
                  )}>
                    {log}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="border-red-500/20 bg-red-500/5 overflow-hidden">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertTriangle className="h-4 w-4" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Permanent deletion is irreversible. Openclaw will automatically remove all associated assets from GitHub, Google Play Console, and internal servers.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!appToDelete} onOpenChange={(open) => !open && !isDeleting && setAppToDelete(null)}>
        <AlertDialogContent className="rounded-2xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Confirm Permanent Deletion
            </AlertDialogTitle>
            <AlertDialogDescription className="pt-2">
              Are you absolutely sure you want to erase <b>{appToDelete?.name}</b>?
              <br /><br />
              This will:
              <ul className="list-disc pl-5 mt-2 space-y-1 text-xs">
                <li>Delete GitHub repository permanently</li>
                <li>Remove app from Google Play Console</li>
                <li>Delete all user data and analytics</li>
                <li>Terminate all active deployments</li>
              </ul>
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400 text-xs font-medium">
                This action cannot be undone.
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel disabled={isDeleting} className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl gap-2"
            >
              {isDeleting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Erasing...
                </>
              ) : (
                "Yes, Erase Everything"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
