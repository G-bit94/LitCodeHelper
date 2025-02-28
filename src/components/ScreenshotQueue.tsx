// src/components/ScreenshotQueue.tsx
import React from "react"
import { Screenshot } from "../App"

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
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Screenshots</h2>
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
                  <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            {/* Delete button */}
            {!isLoading && (
              <button
                onClick={() => onDelete(screenshot.path)}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black bg-opacity-70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Delete screenshot"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
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
