import { cn } from "@/ui/cn";
import { Separator } from "./separator";

interface CustomSeparatorProps {
  label?: string;
  orientation?: "horizontal" | "vertical";
  variant?: "default" | "dashed" | "dotted" | "gradient";
  labelPosition?: "start" | "center" | "end";
  className?: string;
  decorative?: boolean;
}

export function CustomSeparator({
  label,
  orientation = "horizontal",
  variant = "default",
  labelPosition = "center",
  className,
  decorative = true,
  ...props
}: CustomSeparatorProps) {
  // Vertical separators don't support labels
  if (orientation === "vertical" && label) {
    console.warn("Labels are not supported for vertical separators");
  }

  // If it's a vertical separator or no label, just render a basic separator
  if (orientation === "vertical" || !label) {
    return (
      <Separator
        orientation={orientation}
        decorative={decorative}
        className={cn(
          variant === "dashed" && "border border-dashed bg-transparent",
          variant === "dotted" && "border border-dotted bg-transparent",
          variant === "gradient" &&
            "bg-gradient-to-r from-transparent via-foreground to-transparent",
          className
        )}
        {...props}
      />
    );
  }

  // For horizontal separators with labels
  return (
    <div className="flex items-center w-full">
      {labelPosition === "start" && (
        <div className="shrink-0 mr-2">
          <span className="text-sm text-muted-foreground">{label}</span>
        </div>
      )}

      <Separator
        orientation="horizontal"
        decorative={decorative}
        className={cn(
          "flex-grow",
          variant === "dashed" && "border border-dashed bg-transparent",
          variant === "dotted" && "border border-dotted bg-transparent",
          variant === "gradient" &&
            "bg-gradient-to-r from-transparent via-foreground to-transparent",
          labelPosition === "center" && "flex-1",
          className
        )}
        {...props}
      />

      {labelPosition === "center" && (
        <div className="shrink-0 mx-2">
          <span className="text-sm text-muted-foreground">{label}</span>
        </div>
      )}

      {labelPosition === "center" && (
        <Separator
          orientation="horizontal"
          decorative={decorative}
          className={cn(
            "flex-1",
            variant === "dashed" && "border border-dashed bg-transparent",
            variant === "dotted" && "border border-dotted bg-transparent",
            variant === "gradient" &&
              "bg-gradient-to-r from-foreground via-transparent to-transparent",
            className
          )}
          {...props}
        />
      )}

      {labelPosition === "end" && (
        <div className="shrink-0 ml-2">
          <span className="text-sm text-muted-foreground">{label}</span>
        </div>
      )}
    </div>
  );
}
