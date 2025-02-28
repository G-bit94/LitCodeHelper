// src/components/CommandBar.tsx
import React from "react"

interface CommandBarProps {
  onTakeScreenshot: () => void
  onProcessScreenshots: () => void
  isProcessing: boolean
  hasScreenshots: boolean
}

const CommandBar: React.FC<CommandBarProps> = ({
  onTakeScreenshot,
  onProcessScreenshots,
  isProcessing,
  hasScreenshots,
}) => {
  const platform = navigator.platform.toLowerCase()
  const isMac = platform.includes("mac")
  const cmdKey = isMac ? "⌘" : "Ctrl"

  return (
    <div className="flex items-center px-6 py-3 bg-gray-800 border-b border-gray-700">
      <div className="flex space-x-2">
        {/* Screenshot button */}
        <button
          onClick={onTakeScreenshot}
          disabled={isProcessing}
          className="flex items-center px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="mr-2"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          Take Screenshot
          <span className="ml-2 px-1.5 py-0.5 text-xs bg-gray-800 rounded">
            {cmdKey}+H
          </span>
        </button>

        {/* Process button */}
        <button
          onClick={onProcessScreenshots}
          disabled={isProcessing || !hasScreenshots}
          className="flex items-center px-3 py-2 text-sm bg-primary-600 hover:bg-primary-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Processing...
            </>
          ) : (
            <>
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
                className="mr-2"
              >
                <polyline points="9 10 4 15 9 20" />
                <path d="M20 4v7a4 4 0 0 1-4 4H4" />
              </svg>
              Process Screenshots
              <span className="ml-2 px-1.5 py-0.5 text-xs bg-primary-700 rounded">
                {cmdKey}+Enter
              </span>
            </>
          )}
        </button>
      </div>

      {/* Help text */}
      <div className="ml-auto text-xs text-gray-400">
        Tip: Use {cmdKey}+H to take screenshots and {cmdKey}+Enter to process
        them
      </div>
    </div>
  )
}

export default CommandBar
