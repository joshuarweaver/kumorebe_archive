import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface CampaignProgressProps {
  currentStep: number
  steps: string[]
}

export function CampaignProgress({ currentStep, steps }: CampaignProgressProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep

          return (
            <div key={step} className="flex-1">
              <div className="relative flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors",
                    isCompleted && "bg-primary text-primary-foreground",
                    isCurrent && "bg-primary text-primary-foreground",
                    !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    stepNumber
                  )}
                </div>
                <div className="mt-2 text-sm font-medium text-center">
                  {step}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "absolute top-5 left-[50%] w-full h-[2px] transition-colors",
                      stepNumber < currentStep ? "bg-primary" : "bg-muted"
                    )}
                    style={{ width: "calc(100% + 2rem)", left: "calc(50% + 1.25rem)" }}
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}