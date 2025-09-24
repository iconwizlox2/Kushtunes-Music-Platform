import { cn } from "@/lib/utils";
import type { ComponentProps, ReactNode } from "react";

type ButtonProps = ComponentProps<"button"> & {
  intent?: "solid" | "inverted" | "ghost";
  size?: "sm" | "md" | "lg";
  asChild?: boolean; // allows wrapping links
  children?: ReactNode;
};

function intentClasses(intent: NonNullable<ButtonProps["intent"]>) {
  switch (intent) {
    case "inverted":
      return "bg-white text-slate-900 hover:bg-slate-100 border border-white/30";
    case "ghost":
      return "border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800";
    default:
      return "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200";
  }
}

function sizeClasses(size: NonNullable<ButtonProps["size"]>) {
  switch (size) {
    case "sm": return "h-8 px-3";
    case "lg": return "h-12 px-6";
    default: return "h-10 px-4";
  }
}

export function Button({
  className,
  intent = "solid",
  size = "md",
  asChild,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none dark:focus:ring-offset-slate-950",
    intentClasses(intent),
    sizeClasses(size),
    className
  );
  if (asChild) {
    return <span className={classes} {...(props as any)}>{children}</span>;
  }
  return <button className={classes} {...props}>{children}</button>;
}
