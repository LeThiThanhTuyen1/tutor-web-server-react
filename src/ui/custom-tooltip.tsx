"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/ui/cn";

interface CustomTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  className?: string;
}

export function CustomTooltip({
  content,
  children,
  side = "right",
  align = "center",
  className,
}: CustomTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close tooltip
  useEffect(() => {
    if (!isVisible) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible]);

  // Calculate position based on side and alignment
  const getPosition = () => {
    const positions = {
      top: {
        start: "bottom-full left-0 mb-2",
        center: "bottom-full left-1/2 -translate-x-1/2 mb-2",
        end: "bottom-full right-0 mb-2",
      },
      right: {
        start: "left-full top-0 ml-2",
        center: "left-full top-1/2 -translate-y-1/2 ml-2",
        end: "left-full bottom-0 ml-2",
      },
      bottom: {
        start: "top-full left-0 mt-2",
        center: "top-full left-1/2 -translate-x-1/2 mt-2",
        end: "top-full right-0 mt-2",
      },
      left: {
        start: "right-full top-0 mr-2",
        center: "right-full top-1/2 -translate-y-1/2 mr-2",
        end: "right-full bottom-0 mr-2",
      },
    };

    return positions[side][align];
  };

  return (
    <div className="relative inline-block w-full h-full" ref={triggerRef}>
      <div
        className="w-full h-full"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
      >
        {children}
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            className={cn("absolute z-50", getPosition(), className)}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            <div className="bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 p-3 rounded-lg shadow-lg border border-indigo-200 dark:border-indigo-800 min-w-[200px] max-w-[300px]">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
