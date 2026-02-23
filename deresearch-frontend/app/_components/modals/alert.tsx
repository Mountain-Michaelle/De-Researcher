import * as React from "react";
import { AlertCircleIcon } from "lucide-react";
import { VariantProps } from "class-variance-authority";

import {
  Alert,
  AlertDescription,
  AlertTitle,
  alertVariants, 
} from "@/components/ui/alert";

type AlertVariant = VariantProps<typeof alertVariants>["variant"];

interface AlertUpProps {
  text: string;
  description?: string;
  variant?: AlertVariant;
  className?: string;
}

export function AlertUp({
  text,
  description,
  variant = "default",
  className,
}: AlertUpProps) {
  return (
    <div className="grid w-full max-w-xl items-start p-5 gap-4">
      <Alert variant={variant} className={className}>
        <AlertCircleIcon className="h-4 w-4 text-red-500" />
        <AlertTitle>{text}</AlertTitle>
        {description && (
          <AlertDescription>{description}</AlertDescription>
        )}
      </Alert>
    </div>
  );
}