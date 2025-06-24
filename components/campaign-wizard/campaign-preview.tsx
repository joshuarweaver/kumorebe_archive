"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, FileJson, FileText } from "lucide-react"
import { generateCampaign } from "@/lib/campaign-generator"
import type { CampaignSetup } from "@/lib/types/campaign"

interface CampaignPreviewProps {
  campaignData: CampaignSetup
  onBack: () => void
}

export function CampaignPreview({ campaignData, onBack }: CampaignPreviewProps) {
  const campaign = generateCampaign(campaignData)

  const handleExportPDF = () => {
    // TODO: Implement PDF export
    console.log("Exporting as PDF...")
  }

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(campaign, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `${campaign.campaignName.replace(/\s+/g, '-').toLowerCase()}-campaign.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Campaign Strategy Overview</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportJSON}>
            <FileJson className="h-4 w-4 mr-2" />
            Export JSON
          </Button>
          <Button onClick={handleExportPDF}>
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="font-semibold text-sm text-muted-foreground">Campaign Name</dt>
              <dd className="mt-1">{campaign.campaignName}</dd>
            </div>
            <div>
              <dt className="font-semibold text-sm text-muted-foreground">Brand</dt>
              <dd className="mt-1">{campaign.brandName}</dd>
            </div>
            <div>
              <dt className="font-semibold text-sm text-muted-foreground">Industry</dt>
              <dd className="mt-1 capitalize">{campaign.industry}</dd>
            </div>
            <div>
              <dt className="font-semibold text-sm text-muted-foreground">Budget Range</dt>
              <dd className="mt-1">${campaign.budgetMin.toLocaleString()} - ${campaign.budgetMax.toLocaleString()}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Target Audience</CardTitle>
          <CardDescription>Primary audience segments and personas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {campaign.audienceStrategy.primarySegments.map((segment, index) => (
              <div key={index} className="border-l-4 border-primary pl-4">
                <h4 className="font-semibold">{segment.name}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Size: {segment.sizeEstimate}
                </p>
                <div className="mt-2">
                  <p className="text-sm font-medium">Key Insights:</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {segment.keyInsights.slice(0, 2).map((insight, i) => (
                      <li key={i}>{insight}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Performance Indicators</CardTitle>
          <CardDescription>Primary metrics to track campaign success</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {campaign.kpis.primary.map((kpi, index) => (
              <div key={index} className="space-y-1">
                <h4 className="font-semibold text-sm">{kpi.name}</h4>
                <p className="text-sm text-muted-foreground">Target: {kpi.target}</p>
                <p className="text-sm text-muted-foreground">Measured: {kpi.frequency}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Core Messaging</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm mb-2">Core Message</h4>
              <p className="text-muted-foreground">{campaign.messaging.coreMessage}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-2">Key Differentiators</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                {campaign.messaging.differentiators.map((diff, index) => (
                  <li key={index}>{diff}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Media Mix & Budget Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <h4 className="font-semibold text-sm">Paid Media</h4>
                <p className="text-2xl font-bold">{campaign.mediaMix.paid.percentage}%</p>
                <p className="text-sm text-muted-foreground">
                  ${campaign.mediaMix.paid.budget.toLocaleString()}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-sm">Owned Media</h4>
                <p className="text-2xl font-bold">{campaign.mediaMix.owned.percentage}%</p>
                <p className="text-sm text-muted-foreground">
                  ${campaign.mediaMix.owned.budget.toLocaleString()}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-sm">Earned Media</h4>
                <p className="text-2xl font-bold">{campaign.mediaMix.earned.percentage}%</p>
                <p className="text-sm text-muted-foreground">
                  ${campaign.mediaMix.earned.budget.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Setup
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportJSON}>
            <FileJson className="h-4 w-4 mr-2" />
            Export JSON
          </Button>
          <Button onClick={handleExportPDF}>
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>
    </div>
  )
}