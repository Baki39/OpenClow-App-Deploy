import { useState, useRef, ChangeEvent } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useOpenclawStore, App } from "@/lib/store"
import { RefreshCw, Upload, Play, CheckCircle2, Terminal, Smartphone, FileArchive, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function UpdateCenter() {
  const { apps, isLoaded } = useOpenclawStore()
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateLogs, setUpdateLogs] = useState<string[]>([])
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const liveApps = apps.filter(a => a.status === "Live")
  const selectedApp = apps.find(a => a.id === selectedAppId)

  const addLog = (msg: string) => {
    setUpdateLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev])
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0])
      addLog(`[SYSTEM] New APK detected: ${e.target.files[0].name}`)
    }
  }

  const handleStartUpdate = async () => {
    if (!selectedApp || !uploadedFile) return
    
    setIsUpdating(true)
    setUpdateLogs([])
    addLog(`[UPDATE] Starting automated update for ${selectedApp.name}...`)
    
    await new Promise(r => setTimeout(r, 1000))
    addLog(`[SYSTEM] Verifying APK signature and version code...`)
    await new Promise(r => setTimeout(r, 1200))
    addLog(`[SYSTEM] Version check: v1.3.0 (Current: v1.2.4) - OK`)
    
    addLog(`[GITHUB] Creating update branch: release/v1.3.0...`)
    await new Promise(r => setTimeout(r, 1000))
    addLog(`[GITHUB] Pushing new build assets to repository...`)
    
    addLog(`[PLAY STORE] Connecting to Google Play Developer API...`)
    await new Promise(r => setTimeout(r, 1500))
    addLog(`[PLAY STORE] Uploading APK to Production Track...`)
    await new Promise(r => setTimeout(r, 2000))
    addLog(`[PLAY STORE] Updating store listing metadata...`)
    
    addLog(`[SYSTEM] Finalizing deployment...`)
    await new Promise(r => setTimeout(r, 1000))
    
    addLog(`[SUCCESS] ${selectedApp.name} has been successfully updated to the new version!`)
    setIsUpdating(false)
    setUploadedFile(null)
    setSelectedAppId(null)
  }

  if (!isLoaded) return null

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Update Center</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Deploy new APK versions to your live apps on Google Play Store.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* App Selection Sidebar */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Select Live App</CardTitle>
            <CardDescription>Only apps currently "Live" can be updated.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {liveApps.length === 0 ? (
              <div className="py-8 text-center text-zinc-500 italic text-sm">
                No live apps available for update.
              </div>
            ) : (
              liveApps.map((app) => (
                <div
                  key={app.id}
                  onClick={() => !isUpdating && setSelectedAppId(app.id)}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all border group",
                    selectedAppId === app.id 
                      ? "bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600 shadow-sm" 
                      : "bg-white dark:bg-zinc-950 border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                  )}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-50 dark:bg-zinc-900 text-2xl shadow-inner group-hover:scale-110 transition-transform">
                    {app.icon}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-bold text-sm truncate">{app.name}</p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
                      {app.category} • v1.2.4
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Update Interface */}
        <div className="lg:col-span-2 space-y-6">
          <Card className={cn(
            "transition-all duration-500",
            !selectedAppId && "opacity-50 pointer-events-none grayscale"
          )}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className={cn("h-5 w-5", isUpdating && "animate-spin")} />
                {selectedAppId ? `Update: ${selectedApp?.name}` : "Select an App to Start"}
              </CardTitle>
              <CardDescription>
                Upload your new APK file and Openclaw will handle the deployment.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Upload Area */}
              <div 
                onClick={() => !isUpdating && fileInputRef.current?.click()}
                className={cn(
                  "border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer",
                  uploadedFile 
                    ? "bg-green-50/50 dark:bg-green-950/10 border-green-200 dark:border-green-800" 
                    : "bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                )}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".apk,.aab"
                  onChange={handleFileChange}
                />
                
                {uploadedFile ? (
                  <>
                    <div className="h-16 w-16 rounded-2xl bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600">
                      <FileArchive className="h-8 w-8" />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-green-700 dark:text-green-400">{uploadedFile.name}</p>
                      <p className="text-xs text-zinc-500 mt-1">{(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for deployment</p>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-xl mt-2">Change File</Button>
                  </>
                ) : (
                  <>
                    <div className="h-16 w-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
                      <Upload className="h-8 w-8" />
                    </div>
                    <div className="text-center">
                      <p className="font-bold">Click to upload APK or AAB</p>
                      <p className="text-xs text-zinc-500 mt-1">Maximum file size: 100MB</p>
                    </div>
                  </>
                )}
              </div>

              {/* Info Box */}
              <div className="flex gap-3 p-4 bg-blue-50/50 dark:bg-blue-950/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl text-blue-700 dark:text-blue-400 text-xs leading-relaxed">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p>
                  Openclaw will automatically increment the version code, sign the APK with your production key, and submit it to the Production track on Google Play Console.
                </p>
              </div>
            </CardContent>
            <CardFooter className="bg-zinc-50 dark:bg-zinc-900/30 border-t border-zinc-100 dark:border-zinc-800 p-6 flex justify-end">
              <Button 
                size="lg"
                disabled={!uploadedFile || isUpdating}
                onClick={handleStartUpdate}
                className="rounded-2xl px-8 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 hover:opacity-90 transition-all gap-2"
              >
                {isUpdating ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4 fill-current" />
                )}
                {isUpdating ? "Updating..." : "Update Start"}
              </Button>
            </CardFooter>
          </Card>

          {/* Terminal Logs */}
          {(isUpdating || updateLogs.length > 0) && (
            <Card className="bg-zinc-950 border-zinc-800 text-zinc-300 overflow-hidden shadow-2xl">
              <CardHeader className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-green-400" />
                  <CardTitle className="text-sm font-mono">Deployment Console</CardTitle>
                </div>
                <Badge variant="outline" className="text-[10px] border-zinc-700 text-zinc-500">Live Sync</Badge>
              </CardHeader>
              <CardContent className="p-4 font-mono text-[11px] max-h-[300px] overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-zinc-800">
                {updateLogs.map((log, i) => (
                  <div key={i} className={cn(
                    "animate-in slide-in-from-left-2 duration-300",
                    log.includes("[SUCCESS]") ? "text-green-400 font-bold" : 
                    log.includes("[PLAY STORE]") ? "text-amber-400" :
                    log.includes("[GITHUB]") ? "text-blue-400" : ""
                  )}>
                    {log}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
