import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useOpenclawStore, App } from "@/lib/store"
import { CheckCircle2, XCircle, Smartphone, Code, FileText, Image as ImageIcon, Inbox } from "lucide-react"
import { cn } from "@/lib/utils"

export function ReviewQueue() {
  const { apps, updateAppStatus, isLoaded } = useOpenclawStore()
  const [confirmedAppIds, setConfirmedAppIds] = useState<string[]>([])
  
  const appsInReview = apps.filter(app => app.status === "In Review" && !confirmedAppIds.includes(app.id))

  const handleConfirm = (appId: string) => {
    setConfirmedAppIds(prev => [...prev, appId])
    // In a real app, this would trigger the next step in the backend
    // For now we just update the status to "In Process" or similar
    updateAppStatus(appId, "In Process")
  }

  if (!isLoaded) return null

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Review Queue</h2>
          <p className="text-zinc-500 dark:text-zinc-400">Apps waiting for your manual confirmation before proceeding.</p>
        </div>
        <Badge variant={appsInReview.length > 0 ? "destructive" : "secondary"} className="px-3 py-1 text-sm">
          {appsInReview.length} Action{appsInReview.length !== 1 ? "s" : ""} Required
        </Badge>
      </div>

      {appsInReview.length === 0 ? (
        <Card className="border-dashed border-2 flex flex-col items-center justify-center py-20 text-center">
          <Inbox className="h-12 w-12 text-zinc-200 mb-4" />
          <h3 className="text-lg font-medium">Queue is empty</h3>
          <p className="text-zinc-500 max-w-xs mt-1">
            No apps currently require manual review. They will appear here when they reach a review gate.
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {appsInReview.map((app) => (
            <Card key={app.id} className="border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
              <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/20 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white dark:bg-zinc-800 text-2xl shadow-sm border border-zinc-200 dark:border-zinc-700">
                      {app.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{app.name}</CardTitle>
                      <CardDescription className="text-blue-600 dark:text-blue-400 font-medium mt-1">
                        Waiting for ASO Store Listing Approval
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-zinc-500">Projected Revenue</div>
                    <div className="text-xl font-bold text-green-600 dark:text-green-500">${app.projectedRevenue}/mo</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4" /> App Details
                    </h4>
                    <div className="text-sm text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-md border border-zinc-100 dark:border-zinc-800 space-y-2">
                      <p><span className="font-medium">Category:</span> {app.category}</p>
                      <p><span className="font-medium">Niche:</span> {app.niche}</p>
                      <p><span className="font-medium">Status:</span> {app.status}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Code className="h-4 w-4" /> Target Keywords
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{app.niche.toLowerCase()}</Badge>
                      <Badge variant="secondary">{app.category.toLowerCase()}</Badge>
                      <Badge variant="secondary">mobile app</Badge>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" /> Generated Assets
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                          <ImageIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Store Assets</p>
                          <p className="text-xs text-zinc-500">Icon, Screenshots, Feature Graphic</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-none">
                        Ready
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                          <Smartphone className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">App Build</p>
                          <p className="text-xs text-zinc-500">release-v1.0.0.aab</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-none">
                        Ready
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-zinc-50 dark:bg-zinc-900/30 border-t border-zinc-100 dark:border-zinc-800 p-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="w-full sm:w-auto">
                  <h4 className="text-sm font-semibold mb-2">Feedback / Rubrics</h4>
                  <textarea 
                    className="w-full sm:w-80 text-sm p-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                    placeholder="e.g. Change the UI color to blue and add feature Y..."
                    rows={2}
                  />
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto">
                    <XCircle className="mr-2 h-4 w-4" /> Reject & Revise
                  </Button>
                  <Button 
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleConfirm(app.id)}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Confirmed
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
