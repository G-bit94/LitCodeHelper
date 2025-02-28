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
    <div className="bg-gray-700 rounded-lg p-4 flex flex-wrap gap-4 items-center">
      {/* Screenshot button */}
      <button
        onClick={onTakeScreenshot}
        disabled={isProcessing}
        className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md text-white transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        Take Screenshot
        <span className="ml-2 px-1.5 py-0.5 text-xs bg-blue-700 rounded">
          {cmdKey}+H
        </span>
      </button>

      {/* Process button */}
      <button
        onClick={onProcessScreenshots}
        disabled={isProcessing || !hasScreenshots}
        className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-500 disabled:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md text-white transition-colors"
      >
        {isProcessing ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Processing...
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Generate Solution
            <span className="ml-2 px-1.5 py-0.5 text-xs bg-green-700 rounded">
              {cmdKey}+Enter
            </span>
          </>
        )}
      </button>

      {/* Help text */}
      <div className="ml-auto text-sm text-gray-300 hidden md:block">
        Use {cmdKey}+H to capture screenshots and {cmdKey}+Enter to process them
      </div>
    </div>
  )
}

export default CommandBar
