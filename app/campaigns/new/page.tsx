"use client"

import { useState } from "react"
import { CampaignSetupForm } from "@/components/campaign-wizard/campaign-setup-form"
import { CampaignProgress } from "@/components/campaign-wizard/campaign-progress"
import { CampaignPreview } from "@/components/campaign-wizard/campaign-preview"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewCampaignPage() {
  const [step, setStep] = useState(1)
  const [campaignData, setCampaignData] = useState({})
  const [isGenerating, setIsGenerating] = useState(false)

  const steps = [
    "Campaign Setup",
    "Generate Strategy",
    "Review & Export"
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Create New Campaign</h1>
          
          <CampaignProgress currentStep={step} steps={steps} />

          <div className="mt-8">
            {step === 1 && (
              <CampaignSetupForm
                onSubmit={(data) => {
                  setCampaignData(data)
                  setStep(2)
                  setIsGenerating(true)
                  // Simulate campaign generation
                  setTimeout(() => {
                    setIsGenerating(false)
                    setStep(3)
                  }, 3000)
                }}
              />
            )}

            {step === 2 && (
              <div className="text-center py-16">
                <div className="animate-pulse">
                  <h2 className="text-2xl font-semibold mb-4">Generating Your Campaign Strategy...</h2>
                  <p className="text-muted-foreground">This may take a few moments</p>
                </div>
              </div>
            )}

            {step === 3 && (
              <CampaignPreview
                campaignData={campaignData}
                onBack={() => setStep(1)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}