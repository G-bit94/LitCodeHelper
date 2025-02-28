import React from "react"
import { Screenshot } from "../../App"

interface ScreenshotQueueProps {
  screenshots: Screenshot[]
  onDelete: (path: string) => void
  isLoading: boolean
}

const ScreenshotQueue: React.FC<ScreenshotQueueProps> = ({
  screenshots,
  onDelete,
  isLoading,
}) => {
  if (screenshots.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-medium text-white">Screenshots</h2>
      <div className="flex flex-wrap gap-4">
        {screenshots.map((screenshot) => (
          <div key={screenshot.path} className="relative group">
            <div className="w-64 h-36 border border-gray-700 rounded-md overflow-hidden">
              <img
                src={screenshot.preview}
                alt="Screenshot"
                className="w-full h-full object-cover"
              />

              {/* Loading overlay */}
              {isLoading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            {/* Delete button */}
            {!isLoading && (
              <button
                onClick={() => onDelete(screenshot.path)}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black bg-opacity-70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Delete screenshot"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ScreenshotQueue
