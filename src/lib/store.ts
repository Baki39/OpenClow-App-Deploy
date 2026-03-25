import { useState, useEffect } from "react"

export interface App {
  id: string
  name: string
  icon: string
  status: "Live" | "In Review" | "In Process" | "Draft" | "Updating" | "Paused" | "Sleep"
  lastUpdated: string
  revenue: number
  downloads: number
  rating: number
  reviews: number
  category: string
  niche: string
  projectedRevenue: number
  repoUrl?: string
}

export interface Repo {
  id: string
  name: string
  url: string
  status: "healthy" | "issues" | "fixing"
  lastSync: string
  associatedApp: string
  issuesCount: number
  branch: string
}

const STORAGE_KEY_APPS = "openclaw_apps"
const STORAGE_KEY_REPOS = "openclaw_repos"

export function useOpenclawStore() {
  const [apps, setApps] = useState<App[]>([])
  const [repos, setRepos] = useState<Repo[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const savedApps = localStorage.getItem(STORAGE_KEY_APPS)
    const savedRepos = localStorage.getItem(STORAGE_KEY_REPOS)
    
    if (savedApps) setApps(JSON.parse(savedApps))
    if (savedRepos) setRepos(JSON.parse(savedRepos))
    
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY_APPS, JSON.stringify(apps))
      localStorage.setItem(STORAGE_KEY_REPOS, JSON.stringify(repos))
    }
  }, [apps, repos, isLoaded])

  const addApp = (app: Omit<App, "id">) => {
    const newApp = { ...app, id: `app-${Date.now()}` }
    setApps(prev => [newApp, ...prev])
    return newApp
  }

  const addRepo = (repo: Omit<Repo, "id">) => {
    const newRepo = { ...repo, id: `repo-${Date.now()}` }
    setRepos(prev => [newRepo, ...prev])
    return newRepo
  }

  const updateRepoStatus = (repoId: string, status: Repo["status"], issuesCount?: number) => {
    setRepos(prev => prev.map(r => r.id === repoId ? { 
      ...r, 
      status, 
      issuesCount: issuesCount !== undefined ? issuesCount : r.issuesCount,
      lastSync: "Just now"
    } : r))
  }

  const deleteApp = (appId: string) => {
    const appToDelete = apps.find(a => a.id === appId)
    if (!appToDelete) return

    setApps(prev => prev.filter(a => a.id !== appId))
    // Also delete associated repo if it exists
    setRepos(prev => prev.filter(r => r.associatedApp !== appToDelete.name))
  }

  const updateAppStatus = (appId: string, status: App["status"]) => {
    setApps(prev => prev.map(a => a.id === appId ? { ...a, status } : a))
  }

  const clearAll = () => {
    setApps([])
    setRepos([])
    localStorage.removeItem(STORAGE_KEY_APPS)
    localStorage.removeItem(STORAGE_KEY_REPOS)
  }

  return {
    apps,
    repos,
    addApp,
    addRepo,
    updateRepoStatus,
    deleteApp,
    updateAppStatus,
    clearAll,
    isLoaded
  }
}
