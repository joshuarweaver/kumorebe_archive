'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  LayoutDashboard,
  BarChart3,
  Megaphone,
  Users,
  Settings,
  HelpCircle,
  Menu,
  X,
  Plus,
  ChevronDown,
  LogOut,
  User,
  FileText,
  Sparkles,
  TrendingUp,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { cn } from '@/lib/utils'

interface AppSidebarProps {
  currentPage?: string
}

const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Overview & insights'
  },
  {
    label: 'Campaigns',
    href: '/campaigns',
    icon: Megaphone,
    description: 'Manage campaigns'
  },
  {
    label: 'Analytics',
    href: '/analytics',
    icon: TrendingUp,
    description: 'Performance metrics'
  },
  {
    label: 'Audience',
    href: '/audience',
    icon: Users,
    description: 'Persona insights'
  },
  {
    label: 'Content',
    href: '/content',
    icon: FileText,
    description: 'Creative assets'
  }
]

const bottomNavItems = [
  {
    label: 'Showcase',
    href: '/showcase',
    icon: Sparkles
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings
  },
  {
    label: 'Help & Support',
    href: '/help',
    icon: HelpCircle
  }
]

// Mock user data - replace with real user data
const mockUser = {
  name: 'Sarah Chen',
  email: 'sarah@company.com',
  avatar: null, // Will use initials
  plan: 'Pro'
}

export function AppSidebar({ currentPage }: AppSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  // Set CSS variable for content offset
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--sidebar-width',
      isCollapsed ? '5rem' : '18rem'
    )
  }, [isCollapsed])

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-card/80 backdrop-blur-sm border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen bg-card/95 backdrop-blur-md border-r border-border transition-all duration-300 ease-in-out",
          isCollapsed ? "w-20" : "w-72",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header with Logo */}
          <div className={cn("border-b border-border", isCollapsed ? "p-4" : "p-6")}>
            <div className={cn(
              "flex items-center",
              isCollapsed ? "justify-center" : "justify-between"
            )}>
              {!isCollapsed && (
                <Link 
                  href="/" 
                  className="text-xl font-chillax font-medium text-foreground hover:text-primary transition-colors"
                >
                  kumorebe
                </Link>
              )}
              <div className={cn(
                "flex items-center gap-2",
                isCollapsed && "flex-col"
              )}>
                {isCollapsed && (
                  <Link 
                    href="/" 
                    className="text-lg font-chillax font-medium text-foreground hover:text-primary transition-colors mb-2"
                  >
                    k
                  </Link>
                )}
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="hidden lg:flex p-1.5 rounded hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="lg:hidden p-1 rounded hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* User Profile Widget */}
          <div className="p-4 border-b border-border">
            <div 
              className="relative cursor-pointer"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <div className={cn(
                "flex items-center gap-3 rounded-lg hover:bg-accent/50 transition-colors",
                isCollapsed ? "p-2 justify-center" : "p-3"
              )}>
                <div className="w-10 h-10 rounded-full bg-chartreuse-500 flex items-center justify-center text-chartreuse-950 font-medium flex-shrink-0">
                  {mockUser.avatar ? (
                    <img src={mockUser.avatar} alt={mockUser.name} className="w-full h-full rounded-full" />
                  ) : (
                    getInitials(mockUser.name)
                  )}
                </div>
                {!isCollapsed && (
                  <>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{mockUser.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{mockUser.email}</p>
                    </div>
                    <ChevronDown className={cn(
                      "w-4 h-4 text-muted-foreground transition-transform",
                      isUserMenuOpen && "rotate-180"
                    )} />
                  </>
                )}
              </div>
              
              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
                  <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors">
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  <Link href="/billing" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors">
                    <Sparkles className="w-4 h-4" />
                    {mockUser.plan} Plan
                  </Link>
                  <hr className="border-border" />
                  <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Create Button */}
          <div className="p-4">
            <Link
              href="/create"
              className={cn(
                "flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium",
                isCollapsed ? "p-3" : "px-4 py-3"
              )}
              title={isCollapsed ? "Create" : undefined}
            >
              <Plus className="w-5 h-5" />
              {!isCollapsed && "Create"}
            </Link>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = currentPage === item.label.toLowerCase()
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-start gap-3 rounded-lg transition-colors group",
                    isCollapsed ? "px-3 py-3 justify-center" : "px-3 py-3",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon className={cn(
                    "w-5 h-5",
                    !isCollapsed && "mt-0.5",
                    isActive 
                      ? "text-chartreuse-500" 
                      : "text-muted-foreground group-hover:text-chartreuse-500"
                  )} />
                  {!isCollapsed && (
                    <div className="flex-1">
                      <div className="font-medium text-sm">{item.label}</div>
                      <div className={cn(
                        "text-xs",
                        isActive
                          ? "text-accent-foreground/70"
                          : "text-muted-foreground group-hover:text-accent-foreground/70"
                      )}>
                        {item.description}
                      </div>
                    </div>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Bottom Navigation */}
          <div className="p-4 space-y-1 border-t border-border">
            {bottomNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors",
                  isCollapsed ? "px-3 py-2 justify-center" : "px-3 py-2"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <item.icon className="w-4 h-4" />
                {!isCollapsed && <span className="text-sm">{item.label}</span>}
              </Link>
            ))}
            
            <div className="mt-4 pt-4 border-t border-border">
              <div className={cn(
                "flex items-center px-3",
                isCollapsed ? "justify-center" : "justify-between"
              )}>
                {!isCollapsed && <span className="text-sm text-muted-foreground">Theme</span>}
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}