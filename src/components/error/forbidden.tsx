import { ArrowBigLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Forbidden() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12">
      <div className="max-w-lg w-full text-center">
        {/* 403 Illustration */}
        <div className="relative mx-auto w-64 h-64 mb-8">
          <div className="absolute inset-0 text-blue-500 text-[180px] font-bold opacity-10 select-none flex items-center justify-center">
            403
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <svg
              className="w-40 h-40 text-blue-500 mb-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M8 15l8-8" />
              <path d="M16 15l-8-8" />
            </svg>
            <span className="text-4xl font-bold text-gray-800 dark:text-white">
              Oops!
            </span>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          No access
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          You do not have access to this resource. Please exit.
        </p>

        {/* Navigation Options */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <ArrowBigLeft size={18} />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
}
