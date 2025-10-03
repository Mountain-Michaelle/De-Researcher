import { AlertCircleIcon, CheckCircle2Icon, PopcornIcon } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export function AlertUp({text, variant, description}) {
  return (
    <div className="grid w-full max-w-xl items-start p-5 gap-4">
      <Alert variant={variant} className="bg-white">
        <AlertCircleIcon />
        <AlertTitle >{text}</AlertTitle>
        <AlertDescription>
          {description}
        </AlertDescription>
      </Alert>
    </div>
  )
}
