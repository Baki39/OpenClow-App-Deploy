import React, { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CloudUpload, FileType, Smartphone, PlayCircle, Edit3, CheckCircle2, ShieldCheck, Database, DollarSign, Loader2, AlertCircle, Send, ChevronRight, ChevronLeft, CreditCard } from "lucide-react"

export function ApkTester() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [deviceType, setDeviceType] = useState<"android" | "ios" | "tablet">("android")
  const [appMetadata, setAppMetadata] = useState({
    name: "App",
    packageName: "com.example.app",
    version: "1.0.0",
    color: "bg-blue-600",
    icon: "App"
  })
  const [logs, setLogs] = useState<string[]>([])
  
  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editPrompt, setEditPrompt] = useState("")
  const [isApplyingEdits, setIsApplyingEdits] = useState(false)
  
  // Workflow State
  const [isDeploying, setIsDeploying] = useState(false)
  const [workflowStep, setWorkflowStep] = useState(0)

  // Carousel State
  const [currentScreen, setCurrentScreen] = useState(0)
  const screens = [
    { id: 0, name: "Launch", bg: "bg-blue-600", content: "App Logo" },
    { id: 1, name: "Home", bg: "bg-zinc-50", content: "Main Dashboard" },
    { id: 2, name: "Premium", bg: "bg-zinc-900", content: "Stripe Checkout" },
    { id: 3, name: "Settings", bg: "bg-zinc-100", content: "User Settings" },
  ]

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0])
    }
  }

  const handleFileUpload = (file: File) => {
    if (!file.name.endsWith('.apk') && !file.name.endsWith('.aab')) {
      alert("Please upload a valid .apk or .aab file")
      return
    }
    
    setIsUploading(true)
    setUploadedFile(file)
    setLogs(["[INFO] Uploading binary...", "[INFO] Buffer initialized."])
    
    // Extract mock metadata from filename
    const cleanName = file.name.replace(/\.(apk|aab)$/i, '').replace(/[_-]/g, ' ')
    const appName = cleanName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    const pkgName = `com.${cleanName.toLowerCase().replace(/\s+/g, '.')}.android`
    
    const colors = ["bg-blue-600", "bg-indigo-600", "bg-purple-600", "bg-emerald-600", "bg-rose-600", "bg-amber-600"]
    const randomColor = colors[Math.floor(Math.random() * colors.length)]

    // Simulate upload and analysis
    setTimeout(() => {
      setIsUploading(false)
      setIsAnalyzing(true)
      
      const analysisLogs = [
        "[SYSTEM] Starting decompiler engine...",
        "[DECOMPILE] Extracting AndroidManifest.xml...",
        "[DECOMPILE] Parsing resources.arsc...",
        "[DECOMPILE] Decompiling classes.dex (1.2MB)...",
        "[ANALYSIS] Identifying UI components...",
        "[ANALYSIS] Mapping navigation graph...",
        "[ANALYSIS] Detecting API integrations (Stripe, AdMob)...",
        "[SUCCESS] Virtual sandbox environment ready."
      ]

      analysisLogs.forEach((log, index) => {
        setTimeout(() => {
          setLogs(prev => [...prev, log])
        }, index * 400)
      })
      
      setTimeout(() => {
        setIsAnalyzing(false)
        setAnalysisComplete(true)
        setAppMetadata({
          name: appName,
          packageName: pkgName,
          version: "1.0.4 (Build 12)",
          color: randomColor,
          icon: appName.charAt(0)
        })
      }, 3500)
    }, 1500)
  }

  const handleEditSubmit = () => {
    if (!editPrompt.trim()) return
    setIsApplyingEdits(true)
    setLogs(prev => [...prev, "[AI] Analyzing prompt...", "[AI] Locating target files..."])
    
    // Simulate applying edits
    setTimeout(() => {
      setIsApplyingEdits(false)
      setIsEditModalOpen(false)
      setEditPrompt("")
      // Reset to analysis to show it's "rebuilding"
      setIsAnalyzing(true)
      setAnalysisComplete(false)
      setLogs(["[SYSTEM] Rebuilding APK with new changes...", "[BUILD] Compiling modified smali files...", "[BUILD] Merging resources...", "[BUILD] Signing APK with debug key...", "[SUCCESS] Build complete."])
      
      setTimeout(() => {
        setIsAnalyzing(false)
        setAnalysisComplete(true)
      }, 2500)
    }, 3000)
  }

  const handleStartDeployment = () => {
    const isSetupComplete = localStorage.getItem("openclaw_setup_complete") === "true"
    
    if (!isSetupComplete) {
      alert("Please complete the Setup Agent first to connect your Google Play and GitHub accounts.")
      return
    }

    setIsDeploying(true)
    setWorkflowStep(1)
    
    // Simulate workflow progression
    setTimeout(() => setWorkflowStep(2), 2000) // Auto Test + Build
    setTimeout(() => setWorkflowStep(3), 4000) // ASO
    setTimeout(() => setWorkflowStep(4), 6000) // Deploy
  }

  const getDeviceFrameClass = () => {
    switch(deviceType) {
      case "android": return "w-[300px] h-[600px] rounded-[3rem] border-[8px]"
      case "ios": return "w-[300px] h-[600px] rounded-[3.5rem] border-[12px]"
      case "tablet": return "w-[500px] h-[350px] rounded-[2rem] border-[10px]"
      default: return "w-[300px] h-[600px] rounded-[3rem] border-[8px]"
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto animate-in fade-in duration-500 pb-10">
      
      {/* Header / Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
            Openclaw Virtual Lab
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            The ultimate environment for app testing, AI-powered fixing, and automated Play Store deployment.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setIsEditModalOpen(true)}
            disabled={!analysisComplete || isDeploying}
            className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-6 rounded-xl shadow-lg shadow-blue-500/20 transition-all"
          >
            <Edit3 className="mr-2 h-5 w-5" />
            Edit App with AI
          </Button>
          <Button 
            onClick={handleStartDeployment}
            disabled={!analysisComplete || isDeploying}
            className="bg-green-600 hover:bg-green-700 text-white h-12 px-8 rounded-xl shadow-lg shadow-green-500/20 transition-all font-bold text-lg"
          >
            {isDeploying ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : <PlayCircle className="mr-2 h-6 w-6" />}
            {isDeploying ? "DEPLOYING..." : "START DEPLOYMENT"}
          </Button>
        </div>
      </div>

      {/* Device Selector */}
      {analysisComplete && (
        <div className="flex justify-center gap-4 bg-zinc-100 dark:bg-zinc-800/50 p-2 rounded-2xl w-fit mx-auto border border-zinc-200 dark:border-zinc-800">
          <Button 
            variant={deviceType === "android" ? "default" : "ghost"} 
            onClick={() => setDeviceType("android")}
            className="rounded-xl gap-2"
          >
            <Smartphone className="h-4 w-4" /> Android
          </Button>
          <Button 
            variant={deviceType === "ios" ? "default" : "ghost"} 
            onClick={() => setDeviceType("ios")}
            className="rounded-xl gap-2"
          >
            <Smartphone className="h-4 w-4" /> iOS (Latest)
          </Button>
          <Button 
            variant={deviceType === "tablet" ? "default" : "ghost"} 
            onClick={() => setDeviceType("tablet")}
            className="rounded-xl gap-2"
          >
            <Smartphone className="h-4 w-4 rotate-90" /> Tablet
          </Button>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left side: Upload & Status (40%) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Upload Zone */}
          {!uploadedFile ? (
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all group h-[400px]"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                accept=".apk,.aab" 
                className="hidden" 
              />
              <div className="h-20 w-20 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CloudUpload className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload APK/AAB Fail</h3>
              <p className="text-zinc-500 dark:text-zinc-400 max-w-[250px]">
                Openclaw will automatically decompile, analyze, and prepare your app for the Play Store.
              </p>
              <Badge variant="outline" className="mt-6">Max 100 MB</Badge>
            </div>
          ) : (
            <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm h-[400px] flex flex-col">
              <CardHeader className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileType className="h-5 w-5 text-blue-500" />
                  Binary Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-center p-6">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                    <Smartphone className="h-8 w-8" />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="font-semibold text-lg truncate" title={uploadedFile.name}>{uploadedFile.name}</h4>
                    <p className="text-sm text-zinc-500">{(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>

                {isUploading && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Uploading...</span>
                      <span className="font-medium">68%</span>
                    </div>
                    <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-[68%] rounded-full animate-pulse"></div>
                    </div>
                  </div>
                )}

                {isAnalyzing && (
                  <div className="flex flex-col items-center justify-center py-4 text-zinc-500 dark:text-zinc-400">
                    <Loader2 className="h-10 w-10 animate-spin mb-4 text-blue-500" />
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">Decompiling & Analyzing...</p>
                    <div className="w-full mt-4 bg-black rounded-lg p-3 font-mono text-[10px] text-green-500 h-32 overflow-y-auto border border-zinc-800">
                      {logs.map((log, i) => (
                        <div key={i} className="mb-1">{log}</div>
                      ))}
                    </div>
                  </div>
                )}

                {analysisComplete && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-zinc-50 dark:bg-zinc-900 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800">
                        <p className="text-xs text-zinc-500 mb-1">Package Name</p>
                        <p className="font-mono text-xs font-medium truncate" title={appMetadata.packageName}>{appMetadata.packageName}</p>
                      </div>
                      <div className="bg-zinc-50 dark:bg-zinc-900 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800">
                        <p className="text-xs text-zinc-500 mb-1">Version</p>
                        <p className="font-mono text-xs font-medium">{appMetadata.version}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-100 dark:border-green-900/50">
                      <CheckCircle2 className="h-5 w-5 shrink-0" />
                      <span className="text-sm font-medium">Virtual Environment Ready. Test all functions live.</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Workflow Status (Shows when START DEPLOYMENT is clicked) */}
          {isDeploying && (
            <Card className="border-blue-200 dark:border-blue-900 shadow-md bg-blue-50/50 dark:bg-blue-950/20 animate-in slide-in-from-left-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  Autonomous Deployment Active
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-200 dark:before:via-zinc-800 before:to-transparent">
                  {[
                    { step: 1, name: "Rebuilding Optimized AAB" },
                    { step: 2, name: "Automated Function Testing" },
                    { step: 3, name: "ASO & Store Metadata Sync" },
                    { step: 4, name: "Pushing to Google Play Console" }
                  ].map((s) => (
                    <div key={s.step} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 bg-white dark:bg-zinc-900 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm ${
                        workflowStep > s.step ? "border-green-500 text-green-500" :
                        workflowStep === s.step ? "border-blue-500 text-blue-500" :
                        "border-zinc-300 dark:border-zinc-700 text-zinc-300 dark:text-zinc-700"
                      }`}>
                        {workflowStep > s.step ? <CheckCircle2 className="h-5 w-5" /> : 
                         workflowStep === s.step ? <Loader2 className="h-5 w-5 animate-spin" /> : 
                         <span>{s.step}</span>}
                      </div>
                      <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-3 rounded-xl border shadow-sm ${
                        workflowStep === s.step ? "bg-white dark:bg-zinc-900 border-blue-200 dark:border-blue-800" :
                        "bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-100 dark:border-zinc-800"
                      }`}>
                        <h4 className={`font-medium text-sm ${workflowStep === s.step ? "text-blue-700 dark:text-blue-400" : ""}`}>{s.name}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right side: Phone Mockup (60%) */}
        <div className="lg:col-span-7 flex justify-center">
          <Card className="w-full border-zinc-200 dark:border-zinc-800 shadow-xl bg-zinc-50/50 dark:bg-zinc-900/20 overflow-hidden relative min-h-[700px]">
            {/* Background decorative blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
            </div>

            <CardContent className="p-8 flex flex-col items-center justify-center h-full relative z-10">
              
              {!analysisComplete ? (
                <div className="text-center space-y-4 opacity-50">
                  <Smartphone className="h-24 w-24 mx-auto text-zinc-300 dark:text-zinc-700" />
                  <p className="text-lg font-medium">Upload an APK to start the Virtual Lab</p>
                </div>
              ) : (
                <div className="flex flex-col items-center w-full animate-in zoom-in-95 duration-500">
                  
                  {/* Phone Frame */}
                  <div className={`relative bg-zinc-900 border-zinc-800 shadow-2xl overflow-hidden flex flex-col transition-all duration-500 ${getDeviceFrameClass()}`}>
                    {/* Notch / Dynamic Island */}
                    <div className="absolute top-0 inset-x-0 h-8 flex justify-center z-50">
                      <div className={`${deviceType === "ios" ? "w-24 h-6 mt-2 rounded-full" : "w-32 h-6 rounded-b-xl"} bg-zinc-800`}></div>
                    </div>
                    
                    {/* Screen Content */}
                    <div className={`flex-1 w-full flex flex-col transition-colors duration-500 ${currentScreen === 0 ? appMetadata.color : "bg-zinc-50"}`}>
                      {currentScreen === 0 && (
                        <div className="flex-1 flex flex-col items-center justify-center text-white">
                          <div className="h-20 w-20 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-4">
                            <span className={`${appMetadata.color.replace('bg-', 'text-')} font-bold text-3xl`}>{appMetadata.icon}</span>
                          </div>
                          <h2 className="text-xl font-bold mt-2">{appMetadata.name}</h2>
                          <Loader2 className="h-6 w-6 animate-spin mt-8 opacity-50" />
                        </div>
                      )}
                      {currentScreen === 1 && (
                        <div className="flex-1 flex flex-col bg-zinc-50">
                          <div className={`${appMetadata.color} h-20 pt-8 px-4 text-white font-medium shadow-sm`}>
                            {appMetadata.name}
                          </div>
                          <div className="p-4 space-y-3">
                            <div className="h-24 bg-white rounded-xl shadow-sm border border-zinc-100 p-3">
                              <div className="h-4 w-1/3 bg-zinc-200 rounded mb-2"></div>
                              <div className="h-8 w-1/2 bg-zinc-100 rounded"></div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="h-24 bg-white rounded-xl shadow-sm border border-zinc-100"></div>
                              <div className="h-24 bg-white rounded-xl shadow-sm border border-zinc-100"></div>
                            </div>
                            <div className="h-32 bg-white rounded-xl shadow-sm border border-zinc-100 p-3">
                              <div className="h-4 w-full bg-zinc-100 rounded mb-2"></div>
                              <div className="h-4 w-2/3 bg-zinc-100 rounded"></div>
                            </div>
                          </div>
                        </div>
                      )}
                      {currentScreen === 2 && (
                        <div className="flex-1 flex flex-col bg-zinc-50">
                          <div className="h-20 bg-zinc-900 pt-8 px-4 text-white font-medium shadow-sm flex items-center justify-between">
                            <span>Premium</span>
                            <CheckCircle2 className="h-5 w-5 text-green-400" />
                          </div>
                          <div className="p-4 flex flex-col items-center justify-center h-full gap-4">
                            <div className="w-full bg-white p-4 rounded-xl shadow-sm border border-zinc-200">
                              <div className="flex items-center gap-2 mb-4">
                                <CreditCard className="h-5 w-5 text-blue-600" />
                                <span className="font-medium">Stripe Checkout</span>
                              </div>
                              <div className="h-10 w-full bg-zinc-100 rounded border border-zinc-200 mb-3"></div>
                              <div className="h-10 w-full bg-blue-600 rounded text-white flex items-center justify-center text-sm font-medium">
                                Pay $4.99
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {currentScreen === 3 && (
                        <div className="flex-1 flex flex-col bg-zinc-50">
                          <div className="h-20 bg-zinc-200 pt-8 px-4 text-zinc-800 font-medium shadow-sm">
                            Settings
                          </div>
                          <div className="p-4 space-y-4">
                            {[1, 2, 3, 4].map(i => (
                              <div key={i} className="flex items-center justify-between p-3 bg-white rounded-lg border border-zinc-100">
                                <div className="h-4 w-1/3 bg-zinc-100 rounded"></div>
                                <div className="h-6 w-10 bg-zinc-200 rounded-full"></div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Navigation Bar (Simulated) */}
                    <div className="h-12 bg-zinc-900 w-full flex items-center justify-around px-6 z-50">
                      <div className="w-4 h-4 rounded-sm bg-zinc-500"></div>
                      <div className="w-4 h-4 rounded-full bg-zinc-500"></div>
                      <div className="w-4 h-4 border-2 border-zinc-500 rounded-sm"></div>
                    </div>
                  </div>

                  {/* Carousel Controls */}
                  <div className="flex items-center gap-4 mt-6">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="rounded-full"
                      onClick={() => setCurrentScreen(prev => Math.max(0, prev - 1))}
                      disabled={currentScreen === 0}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex gap-2">
                      {screens.map((s, i) => (
                        <div 
                          key={s.id} 
                          className={`h-2 rounded-full transition-all ${currentScreen === i ? "w-6 bg-blue-600" : "w-2 bg-zinc-300 dark:bg-zinc-700"}`}
                        />
                      ))}
                    </div>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="rounded-full"
                      onClick={() => setCurrentScreen(prev => Math.min(screens.length - 1, prev + 1))}
                      disabled={currentScreen === screens.length - 1}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Status Indicator */}
                  <div className="mt-6 bg-white dark:bg-zinc-900 px-4 py-2 rounded-full shadow-sm border border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm font-medium">Virtual Environment Active — Interactive Preview</span>
                  </div>

                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Section: Analysis Report Card */}
      {analysisComplete && (
        <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm animate-in slide-in-from-bottom-8">
          <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/20 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-blue-500" />
                Openclaw Lab Report
              </CardTitle>
              <Badge className="bg-green-500 hover:bg-green-600">Verified for Deployment</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              
              {/* Tech Specs */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-zinc-500 uppercase tracking-wider">Technical Specs</h4>
                <ul className="space-y-3">
                  <li className="flex justify-between items-center text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400">Target SDK</span>
                    <span className="font-mono font-medium">API 36 (Android 16)</span>
                  </li>
                  <li className="flex justify-between items-center text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400">Min SDK</span>
                    <span className="font-mono font-medium">API 24</span>
                  </li>
                  <li className="flex justify-between items-center text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400">Architecture</span>
                    <span className="font-mono font-medium">arm64-v8a</span>
                  </li>
                  <li className="flex justify-between items-center text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400">App Size</span>
                    <span className="font-mono font-medium">{((uploadedFile?.size || 0) / (1024 * 1024)).toFixed(2)} MB</span>
                  </li>
                </ul>
              </div>

              {/* Monetization */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-zinc-500 uppercase tracking-wider">Monetization (Hybrid)</h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>AdMob SDK Detected</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Stripe PaymentSheet Ready</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Google Play Billing v7+</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Firebase Analytics Linked</span>
                  </li>
                </ul>
              </div>

              {/* Security & Compliance */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-zinc-500 uppercase tracking-wider">Security & Compliance</h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>V2/V3 Signature Valid</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>No Malicious Permissions</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Privacy Policy URL Found</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <span className="text-amber-700 dark:text-amber-400">Cleartext Traffic Enabled</span>
                  </li>
                </ul>
              </div>

              {/* Permissions */}
              <div className="md:col-span-3 space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <h4 className="font-semibold text-sm text-zinc-500 uppercase tracking-wider">Requested Permissions</h4>
                <div className="flex flex-wrap gap-2">
                  {["INTERNET", "ACCESS_NETWORK_STATE", "WAKE_LOCK", "RECEIVE_BOOT_COMPLETED", "BILLING", "AD_ID", "POST_NOTIFICATIONS"].map(p => (
                    <Badge key={p} variant="secondary" className="font-mono text-[10px]">android.permission.{p}</Badge>
                  ))}
                </div>
              </div>

            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Modal Overlay */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <Card className="w-full max-w-2xl shadow-2xl border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95">
            <CardHeader>
              <CardTitle className="text-2xl">Refine App with Openclaw AI</CardTitle>
              <CardDescription>
                Tell Openclaw exactly what to fix or change. Our AI will carefully modify the code without breaking existing features.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                placeholder="Example: 'Fix the layout on the settings screen', 'Change the primary color to emerald green', 'Update the Stripe checkout flow to include a discount field'..."
                className="w-full h-40 p-4 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </CardContent>
            <CardFooter className="flex justify-end gap-3 bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-b-xl border-t border-zinc-100 dark:border-zinc-800">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)} disabled={isApplyingEdits}>
                Cancel
              </Button>
              <Button 
                onClick={handleEditSubmit} 
                disabled={!editPrompt.trim() || isApplyingEdits}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isApplyingEdits ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Applying Changes...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" /> Apply Fixes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

    </div>
  )
}
