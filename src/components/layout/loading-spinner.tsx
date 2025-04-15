import type React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  color = "blue",
  fullScreen = false,
}) => {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  const colorClasses = {
    blue: "border-blue-500",
    indigo: "border-indigo-500",
    purple: "border-purple-500",
    green: "border-green-500",
    red: "border-red-500",
  };

  const spinnerClass = `animate-spin rounded-full border-t-2 border-b-2 ${
    colorClasses[color as keyof typeof colorClasses] || colorClasses.blue
  } ${sizeClasses[size]}`;

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-50">
        <div className={spinnerClass}></div>
      </div>
    );
  }

  return <div className={spinnerClass}></div>;
};

export default LoadingSpinner;
