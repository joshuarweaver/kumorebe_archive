import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Rocket, Target, TrendingUp, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Kumorebe
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create data-driven marketing campaigns with AI-powered insights and strategic guidance
          </p>
        </header>

        <div className="flex justify-center mb-16">
          <Link href="/campaigns/new">
            <Button size="lg" className="gap-2">
              Create New Campaign
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader>
              <Target className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Strategic Planning</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Define objectives, KPIs, and success metrics aligned with your business goals
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Audience Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Generate detailed personas and customer journey maps for targeted engagement
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Rocket className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Campaign Tactics</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get channel recommendations and budget allocation strategies for maximum impact
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Performance Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Monitor campaign performance with automated measurement and optimization plans
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <div className="max-w-3xl mx-auto">
            <ol className="space-y-4 text-left">
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                  1
                </span>
                <div>
                  <h3 className="font-semibold mb-1">Set Campaign Objectives</h3>
                  <p className="text-muted-foreground">Define your campaign goals, timeline, and budget parameters</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                  2
                </span>
                <div>
                  <h3 className="font-semibold mb-1">Generate Strategy</h3>
                  <p className="text-muted-foreground">AI creates comprehensive campaign strategies tailored to your needs</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                  3
                </span>
                <div>
                  <h3 className="font-semibold mb-1">Review & Customize</h3>
                  <p className="text-muted-foreground">Fine-tune the generated campaign to match your brand voice</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                  4
                </span>
                <div>
                  <h3 className="font-semibold mb-1">Export & Execute</h3>
                  <p className="text-muted-foreground">Download your campaign plan in PDF or JSON format</p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}