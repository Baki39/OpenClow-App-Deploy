import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { revenueData } from "@/lib/data"
import { useOpenclawStore } from "@/lib/store"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { DollarSign, Download, Smartphone, Activity, ArrowRight, CloudUpload, PlusCircle } from "lucide-react"
import { Link } from "react-router-dom"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Overview() {
  const { apps: storeApps, isLoaded } = useOpenclawStore()
  
  const totalRevenue = storeApps.reduce((acc, app) => acc + app.revenue, 0)
  const totalDownloads = storeApps.reduce((acc, app) => acc + app.downloads, 0)
  const activeApps = storeApps.filter(a => a.status === "Live").length

  if (!isLoaded) return null

  return (
    <div className="flex flex-col gap-6">
      {/* APK Tester Banner */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-none shadow-lg overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <CloudUpload className="h-6 w-6" />
              APK Tester — Upload & Test any app
            </h2>
            <p className="text-blue-100 max-w-2xl">
              Upload any finished APK or AAB, test it live in our interactive phone mockup, edit it with AI prompts, and deploy automatically.
            </p>
          </div>
          <Link 
            to="/apk-tester" 
            className="shrink-0 bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-xl font-medium shadow-sm transition-colors flex items-center gap-2"
          >
            Open APK Tester <ArrowRight className="h-4 w-4" />
          </Link>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
            <Download className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalDownloads / 1000).toFixed(1)}k</div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">+15% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Apps</CardTitle>
            <Smartphone className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeApps}</div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{storeApps.length} total created</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Idle</div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Waiting for next command</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue across all apps.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={revenueData}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="revenue" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-zinc-900 dark:fill-zinc-50" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Apps</CardTitle>
            <CardDescription>Latest deployed and updating apps.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {storeApps.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <PlusCircle className="h-10 w-10 text-zinc-200 mb-2" />
                  <p className="text-sm text-zinc-500">No apps created yet.</p>
                  <Link 
                    to="/setup-agent" 
                    className={cn(buttonVariants({ variant: "link", size: "sm" }), "mt-2")}
                  >
                    Start Setup Agent
                  </Link>
                </div>
              ) : (
                storeApps.slice(0, 5).map((app) => (
                  <div key={app.id} className="flex items-center">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xl">
                      {app.icon}
                    </div>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">{app.name}</p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {app.status}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">
                      +${app.revenue.toFixed(2)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
