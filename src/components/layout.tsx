import { Outlet, Link, useLocation } from "react-router-dom"
import { LayoutDashboard, History, BarChart3, CheckSquare, RefreshCw, Settings, Bell, ShieldCheck, Smartphone, Cpu, Moon, Sun, Github } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

const navItems = [
  { name: "Overview", path: "/", icon: LayoutDashboard },
  { name: "Openclaw Virtual Lab", path: "/apk-tester", icon: Smartphone },
  { name: "Apps History", path: "/history", icon: History },
  { name: "Review Queue", path: "/review", icon: CheckSquare },
  { name: "GitHub Repos", path: "/github-repos", icon: Github },
  { name: "Update Center", path: "/updates", icon: RefreshCw },
  { name: "Admin Pro Plan", path: "/admin-pro", icon: Cpu },
  { name: "Setup Agent", path: "/setup", icon: ShieldCheck },
  { name: "App Manager", path: "/app-manager", icon: Settings },
]

export function Layout() {
  const location = useLocation()
  const [isAutonomousActive, setIsAutonomousActive] = useState(false)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  })

  useEffect(() => {
    const checkStatus = () => {
      setIsAutonomousActive(localStorage.getItem("openclaw_autonomous_active") === "true")
    }
    checkStatus()
    window.addEventListener("storage", checkStatus)
    const interval = setInterval(checkStatus, 2000)
    return () => {
      window.removeEventListener("storage", checkStatus)
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    const root = window.document.documentElement
    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
    localStorage.setItem("theme", theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"))
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans transition-colors duration-300">
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden w-64 flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 md:flex">
          <div className="flex h-14 items-center border-b border-zinc-200 dark:border-zinc-800 px-4 lg:h-[60px] lg:px-6">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900">
                <span className="font-bold text-lg">O</span>
              </div>
              <span className="text-lg tracking-tight">Openclaw</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-4">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path))
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                      isActive
                        ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                        : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-50 dark:hover:bg-zinc-800"
                    )}
                  >
                    <item.icon className={cn("h-4 w-4", item.name === "Admin Pro Plan" && "text-blue-500")} />
                    {item.name}
                    {item.name === "Review Queue" && (
                      <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                        1
                      </span>
                    )}
                    {item.name === "Admin Pro Plan" && isAutonomousActive && (
                      <span className="ml-auto flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>
          <div className="mt-auto p-4 border-t border-zinc-200 dark:border-zinc-800">
            <Link to="/admin-pro" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <div className="relative">
                <div className="h-8 w-8 rounded-full bg-zinc-900 dark:bg-zinc-50 flex items-center justify-center text-white dark:text-zinc-900">
                  <span className="text-xs font-bold">OC</span>
                </div>
                {isAutonomousActive && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-zinc-900 dark:text-zinc-50">Admin Pro</span>
                <span className="text-[10px] uppercase tracking-wider text-blue-500 font-bold">
                  {isAutonomousActive ? "Autonomous Active" : "Manual Mode"}
                </span>
              </div>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex flex-1 flex-col">
          <header className="flex h-14 items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 lg:h-[60px] lg:px-6">
            <div className="w-full flex-1">
              <h1 className="text-lg font-semibold md:text-xl">
                {navItems.find((item) => item.path === location.pathname)?.name || "Dashboard"}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleTheme}
                className="rounded-full bg-zinc-100 dark:bg-zinc-800 p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors"
              >
                {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                <span className="sr-only">Toggle theme</span>
              </button>
              <button className="rounded-full bg-zinc-100 dark:bg-zinc-800 p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Toggle notifications</span>
              </button>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
