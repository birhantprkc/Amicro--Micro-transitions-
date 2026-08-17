"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface SampleComponentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
}

export function SampleComponent({
  title = "Sample Component",
  description = "A clean template component.",
  className,
  ...props
}: SampleComponentProps) {
  return (
    <div
      data-slot="root"
      className={cn(
        "flex flex-col gap-2 rounded-2xl border border-black/10 bg-white/70 p-6 shadow-xs backdrop-blur-md dark:border-white/15 dark:bg-white/10 motion-reduce:transition-none",
        className
      )}
      {...props}
    >
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
        {title}
      </h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {description}
      </p>
    </div>
  );
}
