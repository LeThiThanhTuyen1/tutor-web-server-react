"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { ToastProps } from "@/types/toast-props";

export function Toast({
  id,
  title,
  description,
  variant = "default",
  onDismiss,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      onDismiss(id);
    }, 300);
  };

  return (
    <div
      className={`
        fixed bottom-4 right-4 p-4 rounded-md shadow-md transition-all duration-300 max-w-md
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
        ${
          variant === "destructive"
            ? "bg-red-600 text-white"
            : variant === "success"
            ? "bg-green-600 text-white"
            : "bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-100"
        }
      `}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{title}</h3>
          {description && (
            <p className="text-sm mt-1 opacity-90">{description}</p>
          )}
        </div>
        <button
          onClick={handleDismiss}
          className="ml-4 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function ToastContainer({
  toasts,
  dismiss,
}: {
  toasts: ToastProps[];
  dismiss: (id: string) => void;
}) {
  return (
    <div className="fixed bottom-0 right-0 p-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onDismiss={dismiss} />
      ))}
    </div>
  );
}
