'use client';

import { ThemeToggle } from '@/components/theme-toggle';

export default function TestPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-foreground">Dark Mode Test</h1>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-background border border-border rounded">
            <p className="text-foreground">Background / Foreground</p>
          </div>
          <div className="p-4 bg-card border border-border rounded">
            <p className="text-card-foreground">Card / Card Foreground</p>
          </div>
          <div className="p-4 bg-muted border border-border rounded">
            <p className="text-muted-foreground">Muted / Muted Foreground</p>
          </div>
          <div className="p-4 bg-primary border border-border rounded">
            <p className="text-primary-foreground">Primary / Primary Foreground</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-chartreuse-400">Chartreuse 400</p>
          <p className="text-chartreuse-500">Chartreuse 500</p>
          <p className="text-chartreuse-600">Chartreuse 600</p>
        </div>
      </div>
    </div>
  );
}