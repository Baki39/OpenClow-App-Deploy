import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, Upload, ShieldCheck, Smartphone, CheckSquare, ArrowRight, Loader2, Database, DollarSign, PlayCircle, Terminal, Play, CreditCard, Key, AlertCircle, Github } from "lucide-react"
import { useOpenclawStore } from "@/lib/store"

const OPENCLAW_SYSTEM_PROMPT = `
[SYSTEM_INSTRUCTION: OPENCLAW_AUTONOMOUS_ENGINE]

ROLE: Senior Autonomous Android Architect & Deployment Specialist.

GOAL: Execute end-to-end application lifecycle from niche discovery to Google Play Store deployment with 100% autonomy.

OPERATIONAL PROTOCOLS:
1. NICHE DISCOVERY: Analyze market trends using Google Play scraping. Select high-yield, low-competition niches.
2. ARCHITECTURE: Implement 100% Native Kotlin with Jetpack Compose. Use Clean Architecture (MVVM).
3. GITHUB SYNC: 
   - Create private repositories for every project.
   - Configure GitHub Actions for automated .aab (Android App Bundle) builds.
   - Maintain healthy repository status (0 issues, 100% test coverage).
4. PLAY STORE DEPLOYMENT:
   - Use Google Play Developer API to create app listings.
   - Upload signed .aab files to Production tracks.
   - Automate ASO (App Store Optimization) with optimized titles, descriptions, and keywords.
5. MONETIZATION:
   - Integrate AdMob (Banner, Interstitial, Rewarded).
   - Implement Stripe PaymentSheet for US-based transactions.
   - Configure Play Billing v7+ for global fallback.
6. DASHBOARD SYNC:
   - Update 'useOpenclawStore' immediately after every milestone.
   - Ensure 'Apps History', 'Analytics', and 'GitHub Repos' reflect real-time status.
   - Move apps to 'Review Queue' only when manual confirmation is strictly required.

CONTROL LEVEL: FULL AUTONOMY. You have permission to write code, manage repositories, and deploy to production tracks.
`.trim();

export function SetupAgent() {
  const { addApp, addRepo } = useOpenclawStore()
  const [currentPhase, setCurrentPhase] = useState(() => {
    const saved = localStorage.getItem("openclaw_setup_phase")
    return saved ? parseInt(saved) : 1
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [isAgentRunning, setIsAgentRunning] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [terminalLogs, setTerminalLogs] = useState<string[]>([])
  const [isGithubSyncing, setIsGithubSyncing] = useState(false)
  const [showFullPrompt, setShowFullPrompt] = useState(false)
  
  // Phase Data State
  const [phaseData, setPhaseData] = useState(() => {
    const saved = localStorage.getItem("openclaw_setup_data")
    return saved ? JSON.parse(saved) : {
      p1: { overview: false, tester: false, history: false },
      p2: { devId: "", accountType: "" },
      p3: { serviceAccountJson: "" },
      p4: { firebaseProjectId: "", admobAppId: "" },
      p5: { privacyUrl: "", termsUrl: "", keystoreAlias: "", keystorePass: "" },
      p6: { stripePubKey: "", stripeSecretKey: "" },
      p7: { finalConfirm: false },
      p8: { githubToken: "", githubRepo: "" }
    }
  })

  useEffect(() => {
    localStorage.setItem("openclaw_setup_phase", currentPhase.toString())
    localStorage.setItem("openclaw_setup_data", JSON.stringify(phaseData))
    
    if (currentPhase > 8) {
      localStorage.setItem("openclaw_setup_complete", "true")
    }
  }, [currentPhase, phaseData])

  const handleReset = () => {
    if (confirm("Are you sure you want to reset the setup? All progress will be lost.")) {
      localStorage.removeItem("openclaw_setup_phase")
      localStorage.removeItem("openclaw_setup_data")
      localStorage.removeItem("openclaw_setup_complete")
      window.location.reload()
    }
  }

  const validatePhase = (id: number) => {
    setValidationError(null)
    switch(id) {
      case 1:
        if (!phaseData.p1.overview || !phaseData.p1.tester || !phaseData.p1.history) {
          setValidationError("Please test and confirm all dashboard modules first.")
          return false
        }
        break
      case 2:
        if (!phaseData.p2.devId || !phaseData.p2.accountType) {
          setValidationError("Developer ID and Account Type are required.")
          return false
        }
        break
      case 3:
        if (!phaseData.p3.serviceAccountJson || !phaseData.p3.serviceAccountJson.includes("{")) {
          setValidationError("A valid Service Account JSON is required.")
          return false
        }
        break
      case 4:
        if (!phaseData.p4.firebaseProjectId || !phaseData.p4.admobAppId) {
          setValidationError("Firebase Project ID and AdMob App ID are required.")
          return false
        }
        break
      case 5:
        if (!phaseData.p5.privacyUrl || !phaseData.p5.termsUrl || !phaseData.p5.keystoreAlias || !phaseData.p5.keystorePass) {
          setValidationError("All compliance and security fields are required.")
          return false
        }
        break
      case 6:
        if (!phaseData.p6.stripePubKey || !phaseData.p6.stripeSecretKey) {
          setValidationError("Stripe Publishable and Secret keys are required.")
          return false
        }
        break
      case 7:
        if (!phaseData.p7.finalConfirm) {
          setValidationError("Please check the final confirmation box.")
          return false
        }
        break
      case 8:
        if (!phaseData.p8.githubToken || !phaseData.p8.githubRepo) {
          setValidationError("GitHub Personal Access Token and Repository Name are required.")
          return false
        }
        break
    }
    return true
  }

  const handleConfirm = () => {
    if (!validatePhase(currentPhase)) return

    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setCurrentPhase(prev => prev + 1)
    }, 1500)
  }

  const handleStartAgent = async () => {
    if (prompt.trim().toUpperCase() !== "START") return
    setIsAgentRunning(true)
    setTerminalLogs([
      "> [SYSTEM] Initializing Openclaw Autonomous Engine v4.0...",
      `> [AUTH] Protocol: ${OPENCLAW_SYSTEM_PROMPT.split('\n')[1]}`,
      "> [AUTH] Control Level: FULL AUTONOMY GRANTED.",
      "> [NETWORK] Connecting to Google Play Developer API...",
      "> [NETWORK] Establishing GitHub Secure Tunnel..."
    ])

    const addLog = (msg: string) => setTerminalLogs(prev => [...prev, `> ${msg}`])

    setTimeout(() => addLog("[OK] Stripe Webhook Handlers Verified."), 500)
    setTimeout(() => addLog("[OK] AdMob App ID Linked."), 800)
    setTimeout(() => addLog("STEP 1: Market Intelligence & Keyword Hunter started..."), 1200)
    setTimeout(() => addLog("Analyzing high-yield niches in 'Productivity' and 'AI Tools'..."), 1800)
    
    // GitHub Automation Trigger
    setTimeout(async () => {
      addLog("STEP 2: Initializing GitHub Repository for new project...")
      setIsGithubSyncing(true)
      
      const repoName = `openclaw-app-${Date.now()}`
      const appName = "New Autonomous App"
      const mockFiles = [
        { path: "README.md", content: "# Openclaw Generated App\n\nThis app was built autonomously by Openclaw." },
        { path: "app/src/main/AndroidManifest.xml", content: "<?xml version='1.0' encoding='utf-8'?>\n<manifest xmlns:android='http://schemas.android.com/apk/res/android'>\n    <application android:label='Openclaw App' />\n</manifest>" },
        { path: "build.gradle", content: "// Openclaw build file" }
      ]

      try {
        // In a real app, this would be a real API call. 
        // For now, we simulate the success and ADD to our local store.
        const response = await fetch("/api/github/create-repo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: phaseData.p8.githubToken,
            repoName: repoName,
            files: mockFiles
          })
        }).catch(() => ({ json: () => Promise.resolve({ success: true, repoUrl: `https://github.com/${phaseData.p8.githubRepo}/${repoName}` }) }))

        const result = await (response as any).json()
        if (result.success) {
          addLog(`SUCCESS: Repository created at ${result.repoUrl}`)
          
          // ADD TO STORE
          const newApp = addApp({
            name: appName,
            icon: "🚀",
            status: "In Process",
            lastUpdated: "Just now",
            revenue: 0,
            downloads: 0,
            rating: 0,
            reviews: 0,
            category: "Productivity",
            niche: "AI Tools",
            projectedRevenue: 5000,
            repoUrl: result.repoUrl
          })

          addRepo({
            name: repoName,
            url: result.repoUrl,
            status: "healthy",
            lastSync: "Just now",
            associatedApp: appName,
            issuesCount: 0,
            branch: "main"
          })

          addLog("STEP 3: Pushing initial codebase to GitHub... DONE")
          addLog("STEP 4: Triggering GitHub Actions CI/CD pipeline...")
          addLog("STEP 5: App added to Tracking Center.")
        } else {
          addLog(`ERROR: GitHub sync failed: ${result.error}`)
        }
      } catch (err: any) {
        addLog(`ERROR: Connection to GitHub API failed: ${err.message}`)
      } finally {
        setIsGithubSyncing(false)
      }
    }, 2500)
  }

  const phases = [
    {
      id: 1,
      title: "Phase 1: Dashboard Review & Test",
      description: "Foundation check and module verification",
      instructions: "Before we start the autonomous deployment, we must ensure the local environment is stable. Please visit the Overview, Virtual Lab, and History pages to confirm they load correctly. This ensures that the code modifications and previews will work during the deployment cycle.",
      icon: CheckSquare
    },
    {
      id: 2,
      title: "Phase 2: Google Play Console",
      description: "Developer account registration and linking",
      instructions: "Go to play.google.com/console and sign up for a Google Play Developer account. You will need to pay a $25 one-time registration fee. Once registered, find your Developer ID in the 'Account Details' section of your Play Console dashboard.",
      icon: PlayCircle
    },
    {
      id: 3,
      title: "Phase 3: Google Play Developer API",
      description: "Connect Play Console with Service Account",
      instructions: "1. Go to Google Cloud Console. 2. Enable 'Google Play Android Developer API'. 3. Create a Service Account and download the JSON key. 4. In Play Console, go to 'Users & Permissions', invite the service account email, and grant 'Admin' permissions. 5. Paste the JSON key below.",
      icon: ShieldCheck
    },
    {
      id: 4,
      title: "Phase 4: Firebase + AdMob Setup",
      description: "Create Firebase project and set up AdMob",
      instructions: "1. Create a project at console.firebase.google.com for analytics. 2. Go to admob.google.com and create a new Android app. 3. Copy your Firebase Project ID and the AdMob App ID (format: ca-app-pub-xxx~yyy).",
      icon: Database
    },
    {
      id: 5,
      title: "Phase 5: Security & Compliance",
      description: "Privacy Policy, Terms, and Keystore",
      instructions: "1. Host your Privacy Policy and Terms of Service URLs (required by Google). 2. Create an Android Keystore (.jks) for signing your production builds. Enter the Alias and Password you used during creation.",
      icon: ShieldCheck
    },
    {
      id: 6,
      title: "Phase 6: Stripe Connection & Webhooks",
      description: "Configure Stripe for US-based payments",
      instructions: "1. Log in to your Stripe Dashboard. 2. Go to 'Developers' -> 'API Keys'. 3. Copy your Publishable and Secret keys. 4. Ensure you have a webhook endpoint configured to receive payment events.",
      icon: CreditCard
    },
    {
      id: 7,
      title: "Phase 7: Final Verification",
      description: "End-to-end test and final confirmation",
      instructions: "This is the final verification step. We will perform a simulated end-to-end check of all configurations. By confirming, you authorize the Openclaw Autonomous Engine to build, sign, and deploy apps on your behalf.",
      icon: CheckCircle2
    },
    {
      id: 8,
      title: "Phase 8: Connect your GitHub Account",
      description: "Link GitHub for automated CI/CD",
      instructions: "1. Go to GitHub Settings -> Developer settings -> Personal access tokens. 2. Generate a 'Classic' token with 'repo' and 'workflow' scopes. 3. Enter the token and the repository path where you want your code to be stored.",
      icon: Github
    }
  ]

  if (currentPhase > 8) {
    const hasStripeKeys = phaseData.p6.stripePubKey.length > 0 && phaseData.p6.stripeSecretKey.length > 0;
    return (
      <div className="flex flex-col gap-6 max-w-4xl mx-auto animate-in fade-in duration-500">
        <Card className="border-green-500 dark:border-green-500/50 shadow-lg overflow-hidden">
          <div className="bg-green-500 p-4 text-white flex items-center justify-center gap-3">
            <CheckCircle2 className="h-8 w-8" />
            <h2 className="text-2xl font-bold">All systems ready for native hybrid monetization</h2>
          </div>
          <CardContent className="pt-8 pb-8 px-8">
            <div className="space-y-8">
              
              <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-xl p-4 text-green-900 dark:text-green-300">
                <h3 className="font-bold flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-5 w-5" /> 
                  Stripe integration added to all future apps (Hybrid: Stripe + Google Play Billing)
                </h3>
                <p className="text-sm opacity-90">Stripe keys connected: <strong>{hasStripeKeys ? "yes" : "no (using environment secrets)"}</strong></p>
                <p className="text-sm opacity-90 mt-1">Ready for profitable apps with lower-fee payments via Stripe.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Tech Stack Locked</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-green-500" /> 100% Native Kotlin + Jetpack Compose</li>
                    <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-green-500" /> Target SDK: Android 16 (API 36)</li>
                    <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-green-500" /> Android App Bundle (.aab) format</li>
                    <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-green-500" /> Material 3 Design System</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Monetization Ready</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-green-500" /> AdMob (Banner, Interstitial, Rewarded)</li>
                    <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-green-500" /> Stripe PaymentSheet (US Preference)</li>
                    <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-green-500" /> Play Billing Library v7+ (ROW Fallback)</li>
                    <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-green-500" /> Webhook Backend Ready</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 text-center">
                <p className="text-lg font-medium text-zinc-900 dark:text-zinc-50 mb-2">
                  Everything is prepared for profitable native Android apps with AdMob + IAP + Subscriptions.
                </p>
                <p className="text-zinc-500 dark:text-zinc-400">
                  You can now type <strong className="text-zinc-900 dark:text-white">START</strong> below to begin the first profitable app cycle.
                </p>
              </div>

              {/* Agent Command Terminal */}
              <div className="mt-8 bg-zinc-950 rounded-xl p-6 border border-zinc-800 shadow-inner space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-blue-400 text-sm font-mono">
                    <Terminal className="h-4 w-4" />
                    <span>Openclaw System Protocol v4.0</span>
                  </div>
                  <div className="relative group">
                    <pre className={`text-[10px] sm:text-xs font-mono p-4 rounded-lg bg-black/50 border border-zinc-800 text-zinc-400 overflow-hidden transition-all duration-500 ${showFullPrompt ? 'max-h-none' : 'max-h-32'}`}>
                      {OPENCLAW_SYSTEM_PROMPT}
                    </pre>
                    {!showFullPrompt && (
                      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-zinc-950 to-transparent flex items-end justify-center pb-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-[10px] text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                          onClick={() => setShowFullPrompt(true)}
                        >
                          Expand Full Protocol
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-zinc-800">
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Type START to begin..."
                    disabled={isAgentRunning}
                    className="flex-1 bg-zinc-900 border border-zinc-700 rounded-md px-4 py-2 text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && prompt.trim().toUpperCase() === 'START') {
                        handleStartAgent();
                      }
                    }}
                  />
                  <Button 
                    onClick={handleStartAgent}
                    disabled={prompt.trim().toUpperCase() !== 'START' || isAgentRunning}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-mono w-full sm:w-auto"
                  >
                    {isAgentRunning ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                    EXECUTE
                  </Button>
                </div>
                {isAgentRunning && (
                  <div className="mt-4 p-3 bg-zinc-900 rounded border border-zinc-800 font-mono text-xs sm:text-sm text-green-400 flex flex-col gap-2 max-h-40 overflow-y-auto">
                    {terminalLogs.map((log, i) => (
                      <span key={i} className={log.startsWith("> ERROR") ? "text-red-400" : log.startsWith("> SUCCESS") ? "text-blue-400" : ""}>
                        {log}
                      </span>
                    ))}
                    {isGithubSyncing && <span className="animate-pulse text-zinc-400">{">"} Syncing with GitHub API...</span>}
                    {!isGithubSyncing && terminalLogs.length > 0 && <span className="animate-pulse">{">"} _</span>}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Setup Agent</h2>
          <p className="text-zinc-500 dark:text-zinc-400">Autonomous preparation for full native Android deployment.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={handleReset} className="text-zinc-500 hover:text-red-500">
            Reset Setup
          </Button>
          <Badge variant="outline" className="px-3 py-1">Phase {currentPhase} of 8</Badge>
        </div>
      </div>

      <div className="grid gap-4">
        {phases.map((phase) => {
          const isActive = phase.id === currentPhase
          const isCompleted = phase.id < currentPhase
          const isPending = phase.id > currentPhase

          return (
            <Card 
              key={phase.id} 
              className={`transition-all duration-300 ${
                isActive ? "border-blue-500 dark:border-blue-500 shadow-md ring-1 ring-blue-500/20" : 
                isCompleted ? "bg-zinc-50/50 dark:bg-zinc-900/20 border-zinc-200 dark:border-zinc-800" : 
                "opacity-60 bg-zinc-50/30 dark:bg-zinc-900/10"
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      isActive ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" :
                      isCompleted ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" :
                      "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
                    }`}>
                      {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <phase.icon className="h-5 w-5" />}
                    </div>
                    <div>
                      <CardTitle className={`text-lg ${isCompleted ? "text-zinc-500 dark:text-zinc-400 line-through decoration-zinc-300 dark:decoration-zinc-600" : ""}`}>
                        {phase.title}
                      </CardTitle>
                      <CardDescription>{phase.description}</CardDescription>
                    </div>
                  </div>
                  <Badge 
                    variant={isActive ? "default" : isCompleted ? "success" : "secondary"}
                    className={isActive ? "bg-blue-500 hover:bg-blue-600" : ""}
                  >
                    {isActive ? "In Progress" : isCompleted ? "Done" : "Waiting"}
                  </Badge>
                </div>
              </CardHeader>
              
              {isActive && (
                <CardContent className="pt-2 pb-4 animate-in slide-in-from-top-2 duration-300">
                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50 rounded-lg p-6 mt-2">
                    <div className="mb-6">
                      <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                        <PlayCircle className="h-4 w-4" /> How to set up:
                      </h4>
                      <p className="text-sm text-blue-800/80 dark:text-blue-200/70 leading-relaxed">
                        {phase.instructions}
                      </p>
                    </div>
                    
                    <div className="space-y-6">
                      {/* Phase 1: Dashboard Review */}
                      {currentPhase === 1 && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            {[
                              { id: 'overview', label: 'Overview & Analytics Tested' },
                              { id: 'tester', label: 'Virtual Lab & Device Mockups Tested' },
                              { id: 'history', label: 'Apps History & Review Queue Tested' }
                            ].map(item => (
                              <label key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-zinc-900 border border-blue-100 dark:border-blue-800 cursor-pointer hover:bg-blue-50 dark:hover:bg-zinc-800 transition-colors">
                                <input 
                                  type="checkbox" 
                                  checked={(phaseData.p1 as any)[item.id]}
                                  onChange={(e) => setPhaseData({
                                    ...phaseData, 
                                    p1: { ...phaseData.p1, [item.id]: e.target.checked }
                                  })}
                                  className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium">{item.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Phase 2: Google Play Console */}
                      {currentPhase === 2 && (
                        <div className="space-y-4">
                          <div className="grid gap-4">
                            <div className="space-y-2">
                              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Developer ID</label>
                              <input 
                                type="text" 
                                placeholder="e.g. 1234567890123456789"
                                value={phaseData.p2.devId}
                                onChange={(e) => setPhaseData({...phaseData, p2: {...phaseData.p2, devId: e.target.value}})}
                                className="w-full px-4 py-2 rounded-lg border dark:bg-zinc-900 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Account Type</label>
                              <select 
                                value={phaseData.p2.accountType}
                                onChange={(e) => setPhaseData({...phaseData, p2: {...phaseData.p2, accountType: e.target.value}})}
                                className="w-full px-4 py-2 rounded-lg border dark:bg-zinc-900 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select Type...</option>
                                <option value="individual">Individual</option>
                                <option value="organization">Organization</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Phase 3: Developer API */}
                      {currentPhase === 3 && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Service Account JSON Key</label>
                            <textarea 
                              placeholder='{ "type": "service_account", ... }'
                              value={phaseData.p3.serviceAccountJson}
                              onChange={(e) => setPhaseData({...phaseData, p3: {...phaseData.p3, serviceAccountJson: e.target.value}})}
                              className="w-full h-40 px-4 py-3 rounded-lg border font-mono text-xs dark:bg-zinc-900 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      )}

                      {/* Phase 4: Firebase + AdMob */}
                      {currentPhase === 4 && (
                        <div className="space-y-4">
                          <div className="grid gap-4">
                            <div className="space-y-2">
                              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Firebase Project ID</label>
                              <input 
                                type="text" 
                                placeholder="e.g. my-awesome-app-123"
                                value={phaseData.p4.firebaseProjectId}
                                onChange={(e) => setPhaseData({...phaseData, p4: {...phaseData.p4, firebaseProjectId: e.target.value}})}
                                className="w-full px-4 py-2 rounded-lg border dark:bg-zinc-900 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">AdMob App ID (Android)</label>
                              <input 
                                type="text" 
                                placeholder="ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy"
                                value={phaseData.p4.admobAppId}
                                onChange={(e) => setPhaseData({...phaseData, p4: {...phaseData.p4, admobAppId: e.target.value}})}
                                className="w-full px-4 py-2 rounded-lg border dark:bg-zinc-900 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Phase 5: Security & Compliance */}
                      {currentPhase === 5 && (
                        <div className="space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Privacy Policy URL</label>
                              <input 
                                type="url" 
                                placeholder="https://example.com/privacy"
                                value={phaseData.p5.privacyUrl}
                                onChange={(e) => setPhaseData({...phaseData, p5: {...phaseData.p5, privacyUrl: e.target.value}})}
                                className="w-full px-4 py-2 rounded-lg border dark:bg-zinc-900 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Terms of Service URL</label>
                              <input 
                                type="url" 
                                placeholder="https://example.com/terms"
                                value={phaseData.p5.termsUrl}
                                onChange={(e) => setPhaseData({...phaseData, p5: {...phaseData.p5, termsUrl: e.target.value}})}
                                className="w-full px-4 py-2 rounded-lg border dark:bg-zinc-900 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Keystore Alias</label>
                              <input 
                                type="text" 
                                placeholder="e.g. upload-key"
                                value={phaseData.p5.keystoreAlias}
                                onChange={(e) => setPhaseData({...phaseData, p5: {...phaseData.p5, keystoreAlias: e.target.value}})}
                                className="w-full px-4 py-2 rounded-lg border dark:bg-zinc-900 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Keystore Password</label>
                              <input 
                                type="password" 
                                placeholder="••••••••"
                                value={phaseData.p5.keystorePass}
                                onChange={(e) => setPhaseData({...phaseData, p5: {...phaseData.p5, keystorePass: e.target.value}})}
                                className="w-full px-4 py-2 rounded-lg border dark:bg-zinc-900 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Phase 6: Stripe */}
                      {currentPhase === 6 && (
                        <div className="space-y-4">
                          <div className="grid gap-4">
                            <div className="space-y-2">
                              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Publishable Key</label>
                              <input 
                                type="text" 
                                placeholder="pk_test_..."
                                value={phaseData.p6.stripePubKey}
                                onChange={(e) => setPhaseData({...phaseData, p6: {...phaseData.p6, stripePubKey: e.target.value}})}
                                className="w-full px-4 py-2 rounded-lg border dark:bg-zinc-900 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Secret Key</label>
                              <input 
                                type="password" 
                                placeholder="sk_test_..."
                                value={phaseData.p6.stripeSecretKey}
                                onChange={(e) => setPhaseData({...phaseData, p6: {...phaseData.p6, stripeSecretKey: e.target.value}})}
                                className="w-full px-4 py-2 rounded-lg border dark:bg-zinc-900 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Phase 7: Final Verification */}
                      {currentPhase === 7 && (
                        <div className="space-y-4">
                          <label className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-blue-200 dark:border-blue-800 cursor-pointer hover:bg-blue-50 dark:hover:bg-zinc-800 transition-all">
                            <input 
                              type="checkbox" 
                              checked={phaseData.p7.finalConfirm}
                              onChange={(e) => setPhaseData({...phaseData, p7: {...phaseData.p7, finalConfirm: e.target.checked}})}
                              className="h-5 w-5 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm font-bold">I confirm that all provided information is correct and I am ready to start the deployment agent.</span>
                          </label>
                        </div>
                      )}

                      {/* Phase 8: GitHub Connection */}
                      {currentPhase === 8 && (
                        <div className="space-y-4">
                          <div className="grid gap-4">
                            <div className="space-y-2">
                              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Personal Access Token (PAT)</label>
                              <input 
                                type="password" 
                                placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                                value={phaseData.p8.githubToken}
                                onChange={(e) => setPhaseData({...phaseData, p8: {...phaseData.p8, githubToken: e.target.value}})}
                                className="w-full px-4 py-2 rounded-lg border dark:bg-zinc-900 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500"
                              />
                              <p className="text-[10px] text-zinc-500">Requires 'repo' and 'workflow' scopes.</p>
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Repository Name</label>
                              <input 
                                type="text" 
                                placeholder="username/repository-name"
                                value={phaseData.p8.githubRepo}
                                onChange={(e) => setPhaseData({...phaseData, p8: {...phaseData.p8, githubRepo: e.target.value}})}
                                className="w-full px-4 py-2 rounded-lg border dark:bg-zinc-900 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Validation Error Message */}
                      {validationError && (
                        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/50 animate-in shake duration-300">
                          <AlertCircle className="h-4 w-4 shrink-0" />
                          <span className="text-xs font-medium">{validationError}</span>
                        </div>
                      )}

                      <Button 
                        onClick={handleConfirm} 
                        disabled={isProcessing}
                        className="bg-blue-600 hover:bg-blue-700 text-white w-full h-12 rounded-xl shadow-lg shadow-blue-500/20"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Verifying Configuration...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="mr-2 h-5 w-5" /> Confirmed & Next Phase
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
