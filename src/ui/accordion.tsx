"use client";

import type React from "react";
import { createContext, useContext, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/ui/cn";

interface AccordionContextValue {
  value: string | null;
  onValueChange: (value: string) => void;
  type: "single" | "multiple";
  collapsible: boolean;
}

const AccordionContext = createContext<AccordionContextValue | undefined>(
  undefined
);

function useAccordion() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("useAccordion must be used within an Accordion");
  }
  return context;
}

interface AccordionProps {
  type?: "single" | "multiple";
  collapsible?: boolean;
  defaultValue?: string;
  children: React.ReactNode;
}

function Accordion({
  type = "single",
  collapsible = false,
  defaultValue,
  children,
}: AccordionProps) {
  const [value, setValue] = useState<string | null>(defaultValue || null);

  const onValueChange = (newValue: string) => {
    if (type === "single") {
      setValue(value === newValue && collapsible ? null : newValue);
    }
  };

  return (
    <AccordionContext.Provider
      value={{ value, onValueChange, type, collapsible }}
    >
      <div className="space-y-1">{children}</div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
}

function AccordionItem({
  value,
  children,
  className,
  ...props
}: AccordionItemProps) {
  return (
    <div className={cn("border-b", className)} {...props}>
      {children}
    </div>
  );
}

interface AccordionTriggerProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

function AccordionTrigger({
  children,
  className,
  ...props
}: AccordionTriggerProps) {
  const { value: accordionValue, onValueChange } = useAccordion();
  const itemValue = (props as any)["data-value"] || "";
  const isOpen = accordionValue === itemValue;

  return (
    <button
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className
      )}
      onClick={() => onValueChange(itemValue)}
      data-state={isOpen ? "open" : "closed"}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </button>
  );
}

interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

function AccordionContent({
  children,
  className,
  ...props
}: AccordionContentProps) {
  const { value: accordionValue } = useAccordion();
  const itemValue = (props as any)["data-value"] || "";
  const isOpen = accordionValue === itemValue;

  return isOpen ? (
    <div
      className={cn(
        "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
        className
      )}
      data-state={isOpen ? "open" : "closed"}
      {...props}
    >
      <div className="pb-4 pt-0">{children}</div>
    </div>
  ) : null;
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
