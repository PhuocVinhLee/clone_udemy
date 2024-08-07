import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, CheckCircleIcon } from "lucide-react";
import { Interface } from "readline";

const bannerVariants = cva(
  "border text-center p-4 text-sm flex item-center w-full",
  {
    variants: {
      variant: {
        warning: " bg-yellow-200/80 border-yellow-30 text-primary",
        success: " bg-green-700 border-green-800 ",
      },
    },
    defaultVariants: {
      variant: "warning",
    },
  }
);

interface BannerProps extends VariantProps<typeof bannerVariants> {
  label: string;
}
const iconMap = {
  warning: AlertTriangle,
  success: CheckCircleIcon,
};

export const Banner = ({ label, variant }: BannerProps) => {
  const Icon = iconMap[variant || "warning"];

  return (
    <div className={cn(bannerVariants({ variant }), )}>
      <Icon className="h-4 w-4 mr-2"></Icon> {label}
    </div>
  );
};
