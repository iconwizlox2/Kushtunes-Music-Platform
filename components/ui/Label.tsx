import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Label({ className, ...props }: ComponentProps<"label">) {
  return (
    <label
      className={cn("text-sm font-medium text-slate-800 dark:text-slate-200", className)}
      {...props}
    />
  );
}
