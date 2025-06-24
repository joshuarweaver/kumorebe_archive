'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Users, 
  Route, 
  BarChart3, 
  Lightbulb,
  Menu,
  X,
  Home,
  ChevronLeft
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { cn } from '@/lib/utils'

interface CampaignSidebarProps {
  campaignName?: string
}

const navItems = [
  {
    label: 'Audience',
    href: '#audience',
    icon: Users,
    description: 'Target personas & insights'
  },
  {
    label: 'Journey',
    href: '#journey',
    icon: Route,
    description: 'Consumer touchpoints'
  },
  {
    label: 'KPIs',
    href: '#kpis',
    icon: BarChart3,
    description: 'Success metrics'
  },
  {
    label: 'Creative',
    href: '#creative',
    icon: Lightbulb,
    description: 'Execution strategy'
  }
]

export function CampaignSidebar({ campaignName = 'Campaign' }: CampaignSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

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
          "fixed top-0 left-0 z-40 h-screen w-72 bg-card/95 backdrop-blur-md border-r border-border transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <Link href="/" className="text-2xl font-chillax font-medium text-foreground hover:text-primary transition-colors">
                kumorebe
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="lg:hidden p-1 rounded hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground truncate">{campaignName}</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors group"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm">Back to Home</span>
            </Link>
            
            <div className="my-4 h-px bg-border" />
            
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-start gap-3 px-3 py-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors group"
              >
                <item.icon className="w-5 h-5 mt-0.5 text-chartreuse-500 group-hover:text-chartreuse-400" />
                <div className="flex-1">
                  <div className="font-medium text-sm">{item.label}</div>
                  <div className="text-xs text-muted-foreground group-hover:text-accent-foreground/70">
                    {item.description}
                  </div>
                </div>
              </a>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Theme</span>
              <ThemeToggle />
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