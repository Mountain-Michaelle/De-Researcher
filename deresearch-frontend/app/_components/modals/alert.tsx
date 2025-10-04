import React from "react";
import { AlertCircleIcon } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

//
interface AlertUpProps {
  text: string;
  description?: string;
  variant?: string; // Customize based on your `Alert` component variants
}

//
// 💡 Functional Component
//
export const AlertUp: React.FC<AlertUpProps> = ({
  text,
  description,
  variant
}) => {
  return (
    <div className="grid w-full max-w-xl items-start p-5 gap-4">
      <Alert variant={variant} className="bg-white">
        <AlertCircleIcon className="text-red-500" />
        <AlertTitle>{text}</AlertTitle>
        {description && (
          <AlertDescription>{description}</AlertDescription>
        )}
      </Alert>
    </div>
  );
};
