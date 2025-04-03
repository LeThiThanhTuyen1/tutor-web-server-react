"use client";

import * as React from "react";
import * as RadioGroupPrimitives from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";
import { cn } from "@/ui/cn";

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitives.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitives.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitives.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitives.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitives.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitives.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-indigo-600 text-indigo-600 ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitives.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitives.Indicator>
    </RadioGroupPrimitives.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitives.Item.displayName;

export { RadioGroup, RadioGroupItem };
