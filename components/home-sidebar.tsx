'use client'

import { useState } from 'react'
import { 
  Menu,
  X,
  Sparkles,
  Info,
  DollarSign,
  LogIn,
  UserPlus
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { cn } from '@/lib/utils'

interface HomeSidebarProps {
  onShowInfo?: () => void
}

export function HomeSidebar({ onShowInfo }: HomeSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    {
      label: 'What is this?',
      icon: Info,
      action: () => {
        onShowInfo?.()
        setIsOpen(false)
      }
    },
    {
      label: 'Pricing',
      icon: DollarSign,
      action: () => {
        // TODO: Add pricing modal or navigation
        setIsOpen(false)
      }
    },
    {
      label: 'Log in',
      icon: LogIn,
      action: () => {
        // TODO: Add login functionality
        setIsOpen(false)
      }
    },
    {
      label: 'Sign up',
      icon: UserPlus,
      isPrimary: true,
      action: () => {
        // TODO: Add signup functionality
        setIsOpen(false)
      }
    }
  ]

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
              <div>
                <h1 className="text-2xl font-chillax font-medium text-foreground">kumorebe</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  AI campaign strategist
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="lg:hidden p-1 rounded hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left",
                  item.isPrimary
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Features */}
          <div className="p-4 border-t border-border">
            <div className="mb-4 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-chartreuse-500" />
                <span className="text-xs font-medium">Features</span>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Strategy-first approach</li>
                <li>• Cultural insight engine</li>
                <li>• Participation frameworks</li>
                <li>• Real-time adaptation</li>
              </ul>
            </div>
          </div>

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