import type React from "react";
import { Suspense } from "react";
import LoadingSpinner from "./loading-spinner";

interface LazyComponentProps {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  color?: string;
  fullScreen?: boolean;
}

const LazyComponent: React.FC<LazyComponentProps> = ({
  children,
  size = "md",
  color = "blue",
  fullScreen = false,
}) => {
  return (
    <Suspense
      fallback={
        <div
          className={`flex items-center justify-center ${
            fullScreen ? "min-h-screen" : "min-h-[200px]"
          }`}
        >
          <LoadingSpinner size={size} color={color} />
        </div>
      }
    >
      {children}
    </Suspense>
  );
};

export default LazyComponent;
