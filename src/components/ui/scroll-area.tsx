"use client";

import type React from "react";
import { useRef } from "react";

interface ScrollAreaProps {
  className?: string;
  children: React.ReactNode;
  maxHeight?: string;
}

export function ScrollArea({
  className = "",
  children,
  maxHeight = "max-h-[400px]",
}: ScrollAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollRef}
      className={`overflow-auto ${maxHeight} ${className}`}
      style={{ scrollbarWidth: "thin" }}
    >
      <div className="px-1">{children}</div>
    </div>
  );
}
