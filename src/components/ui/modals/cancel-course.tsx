import { AlertTriangle } from "lucide-react";

interface CancelCourseModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  isCancelling: boolean;
}

const CancelCourseModal = ({
  isOpen,
  onCancel,
  onConfirm,
  isCancelling,
}: CancelCourseModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full animate-in fade-in-50 zoom-in-95">
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-2 flex items-center text-red-600">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Cancel Course
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to cancel this course? This action cannot be
            undone and will notify all enrolled students.
          </p>
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onCancel}
            disabled={isCancelling}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isCancelling}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center"
          >
            {isCancelling ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Cancelling...
              </>
            ) : (
              "Yes, cancel course"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export { CancelCourseModal };
