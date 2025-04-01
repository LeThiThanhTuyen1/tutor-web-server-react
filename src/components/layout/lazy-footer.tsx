"use client";

import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

// Lazy load the footer component
const FooterComponent = lazy(() => import("./footer"));

export default function LazyFooter() {
  return (
    <div className="w-full mt-auto">
      <Suspense
        fallback={
          <div className="w-full py-8 bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-900">
            <div className="container mx-auto flex justify-center items-center">
              <Loader2 className="h-6 w-6 text-white animate-spin" />
              <span className="ml-2 text-white text-sm">Loading footer...</span>
            </div>
          </div>
        }
      >
        <FooterComponent />
      </Suspense>
    </div>
  );
}
