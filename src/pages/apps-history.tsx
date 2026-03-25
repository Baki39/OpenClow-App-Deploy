import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useOpenclawStore } from "@/lib/store"
import { Link } from "react-router-dom"
import { ChevronRight, Search, Filter, LayoutGrid, List, Activity, Clock, CheckCircle2, FileEdit, Trash2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function AppsHistory() {
  const { apps: storeApps, clearAll, isLoaded } = useOpenclawStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")

  const filteredApps = storeApps.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Live":
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20">Live</Badge>
      case "In Review":
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20">In Review</Badge>
      case "Draft":
        return <Badge className="bg-zinc-500/10 text-zinc-500 border-zinc-500/20 hover:bg-zinc-500/20">Draft</Badge>
      case "In Process":
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20">In Process</Badge>
      case "Updating":
        return <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20 hover:bg-purple-500/20">Updating</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const AppCard = ({ app }: { app: any }) => (
    <Link to={`/analytics/${app.id}`}>
      <Card className="group hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-300 cursor-pointer overflow-hidden">
        <CardContent className={cn(
          "p-0",
          viewMode === "list" ? "flex items-center p-4" : "flex flex-col"
        )}>
          {/* Icon Section */}
          <div className={cn(
            "flex items-center justify-center bg-zinc-50 dark:bg-zinc-900/50 transition-colors group-hover:bg-blue-50 dark:group-hover:bg-blue-900/10",
            viewMode === "list" ? "h-14 w-14 rounded-xl text-2xl" : "h-32 w-full text-4xl"
          )}>
            {app.icon}
          </div>

          {/* Info Section */}
          <div className={cn(
            "flex-1",
            viewMode === "list" ? "ml-4 space-y-1" : "p-4 space-y-2"
          )}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="font-bold tracking-tight">{app.name}</p>
                {getStatusBadge(app.status)}
              </div>
              {viewMode === "grid" && <ChevronRight className="h-4 w-4 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />}
            </div>
            
            <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
              <span>{app.category}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {app.lastUpdated}
              </span>
            </div>

            {viewMode === "grid" && (
              <div className="pt-4 grid grid-cols-2 gap-2 border-t border-zinc-100 dark:border-zinc-800 mt-2">
                <div>
                  <p className="text-[10px] uppercase text-zinc-400 font-bold">Revenue</p>
                  <p className="font-bold text-sm">${app.revenue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-zinc-400 font-bold">Downloads</p>
                  <p className="font-bold text-sm">{app.downloads.toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>

          {/* Stats Section (List View Only) */}
          {viewMode === "list" && (
            <div className="flex items-center gap-8 text-sm px-4">
              <div className="hidden md:block text-right">
                <p className="font-bold">${app.revenue.toLocaleString()}</p>
                <p className="text-[10px] uppercase text-zinc-400 font-bold">Revenue</p>
              </div>
              <div className="hidden md:block text-right">
                <p className="font-bold">{app.downloads.toLocaleString()}</p>
                <p className="text-[10px] uppercase text-zinc-400 font-bold">Downloads</p>
              </div>
              <ChevronRight className="h-5 w-5 text-zinc-400 group-hover:text-blue-500 transition-colors" />
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )

  const renderAppList = (status?: string) => {
    const apps = status 
      ? filteredApps.filter(app => app.status === status)
      : filteredApps

    if (apps.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
          <div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-4">
            <Search className="h-6 w-6 text-zinc-400" />
          </div>
          <h3 className="text-lg font-bold">No apps found</h3>
          <p className="text-zinc-500 max-w-xs">We couldn't find any apps matching your criteria in this category.</p>
        </div>
      )
    }

    return (
      <div className={cn(
        "grid gap-4",
        viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
      )}>
        {apps.map(app => (
          <div key={app.id}>
            <AppCard app={app} />
          </div>
        ))}
      </div>
    )
  }

  if (!isLoaded) return null

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Apps Tracking Center</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Monitor all your live, draft, and pending applications.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input 
              placeholder="Search apps..." 
              className="pl-10 h-10 rounded-xl border-zinc-200 dark:border-zinc-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn("h-8 w-8 rounded-lg", viewMode === "list" && "bg-white dark:bg-zinc-800 shadow-sm")}
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn("h-8 w-8 rounded-lg", viewMode === "grid" && "bg-white dark:bg-zinc-800 shadow-sm")}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-10 w-10 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
            onClick={() => {
              if (confirm("Are you sure you want to clear all apps and repositories?")) {
                clearAll()
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-zinc-100 dark:bg-zinc-900 p-1 rounded-2xl h-auto flex-wrap justify-start gap-1 border border-zinc-200 dark:border-zinc-800 mb-6">
          <TabsTrigger value="all" className="rounded-xl px-4 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm">
            All Apps
          </TabsTrigger>
          <TabsTrigger value="Live" className="rounded-xl px-4 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm gap-2">
            <Activity className="h-3 w-3 text-green-500" />
            Live
          </TabsTrigger>
          <TabsTrigger value="In Review" className="rounded-xl px-4 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm gap-2">
            <Clock className="h-3 w-3 text-amber-500" />
            In Review
          </TabsTrigger>
          <TabsTrigger value="In Process" className="rounded-xl px-4 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm gap-2">
            <Clock className="h-3 w-3 text-blue-500" />
            In Process
          </TabsTrigger>
          <TabsTrigger value="Draft" className="rounded-xl px-4 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm gap-2">
            <FileEdit className="h-3 w-3 text-zinc-500" />
            Draft
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          {renderAppList()}
        </TabsContent>
        <TabsContent value="Live" className="mt-0">
          {renderAppList("Live")}
        </TabsContent>
        <TabsContent value="In Review" className="mt-0">
          {renderAppList("In Review")}
        </TabsContent>
        <TabsContent value="In Process" className="mt-0">
          {renderAppList("In Process")}
        </TabsContent>
        <TabsContent value="Draft" className="mt-0">
          {renderAppList("Draft")}
        </TabsContent>
      </Tabs>
    </div>
  )
}
