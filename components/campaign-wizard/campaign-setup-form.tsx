"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CampaignSetupSchema, type CampaignSetup } from "@/lib/types/campaign"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, DollarSign } from "lucide-react"

interface CampaignSetupFormProps {
  onSubmit: (data: CampaignSetup) => void
}

export function CampaignSetupForm({ onSubmit }: CampaignSetupFormProps) {
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([])
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CampaignSetup>({
    resolver: zodResolver(CampaignSetupSchema),
    defaultValues: {
      objectives: [],
      launchDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      budgetMin: 5000,
      budgetMax: 50000,
    }
  })

  const objectives = [
    { value: "awareness", label: "Brand Awareness", description: "Increase visibility and recognition" },
    { value: "conversion", label: "Conversion", description: "Drive sales and sign-ups" },
    { value: "retention", label: "Customer Retention", description: "Keep existing customers engaged" },
    { value: "advocacy", label: "Brand Advocacy", description: "Turn customers into promoters" },
  ]

  const industries = [
    { value: "technology", label: "Technology" },
    { value: "healthcare", label: "Healthcare" },
    { value: "finance", label: "Finance" },
    { value: "retail", label: "Retail" },
    { value: "education", label: "Education" },
    { value: "entertainment", label: "Entertainment" },
    { value: "nonprofit", label: "Non-profit" },
    { value: "other", label: "Other" },
  ]

  const handleObjectiveChange = (value: string, checked: boolean) => {
    const newObjectives = checked
      ? [...selectedObjectives, value]
      : selectedObjectives.filter(obj => obj !== value)
    
    setSelectedObjectives(newObjectives)
    setValue("objectives", newObjectives as any)
  }

  const onFormSubmit = (data: CampaignSetup) => {
    onSubmit({
      ...data,
      objectives: selectedObjectives as any,
    })
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Let's start with the fundamentals of your campaign</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="campaignName">Campaign Name</Label>
            <Input
              id="campaignName"
              placeholder="e.g., Summer Product Launch 2024"
              {...register("campaignName")}
            />
            {errors.campaignName && (
              <p className="text-sm text-destructive">{errors.campaignName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="brandName">Brand/Organization Name</Label>
            <Input
              id="brandName"
              placeholder="e.g., Acme Corporation"
              {...register("brandName")}
            />
            {errors.brandName && (
              <p className="text-sm text-destructive">{errors.brandName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Industry/Vertical</Label>
            <Select onValueChange={(value) => setValue("industry", value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry.value} value={industry.value}>
                    {industry.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.industry && (
              <p className="text-sm text-destructive">{errors.industry.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Objectives</CardTitle>
          <CardDescription>Select one or more objectives for your campaign</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {objectives.map((objective) => (
              <div key={objective.value} className="flex items-start space-x-3">
                <Checkbox
                  id={objective.value}
                  checked={selectedObjectives.includes(objective.value)}
                  onCheckedChange={(checked) => 
                    handleObjectiveChange(objective.value, checked as boolean)
                  }
                />
                <div className="space-y-1">
                  <Label
                    htmlFor={objective.value}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {objective.label}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {objective.description}
                  </p>
                </div>
              </div>
            ))}
            {errors.objectives && (
              <p className="text-sm text-destructive">{errors.objectives.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Timeline & Budget</CardTitle>
          <CardDescription>Set your campaign duration and budget range</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="launchDate">Launch Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="launchDate"
                  type="date"
                  className="pl-10"
                  {...register("launchDate", { valueAsDate: true })}
                />
              </div>
              {errors.launchDate && (
                <p className="text-sm text-destructive">{errors.launchDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="endDate"
                  type="date"
                  className="pl-10"
                  {...register("endDate", { valueAsDate: true })}
                />
              </div>
              {errors.endDate && (
                <p className="text-sm text-destructive">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budgetMin">Minimum Budget</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="budgetMin"
                  type="number"
                  className="pl-10"
                  placeholder="5000"
                  {...register("budgetMin", { valueAsNumber: true })}
                />
              </div>
              {errors.budgetMin && (
                <p className="text-sm text-destructive">{errors.budgetMin.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="budgetMax">Maximum Budget</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="budgetMax"
                  type="number"
                  className="pl-10"
                  placeholder="50000"
                  {...register("budgetMax", { valueAsNumber: true })}
                />
              </div>
              {errors.budgetMax && (
                <p className="text-sm text-destructive">{errors.budgetMax.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg">
          Generate Campaign Strategy
        </Button>
      </div>
    </form>
  )
}