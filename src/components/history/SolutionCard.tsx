import React from "react"
import { ISolution } from "../../database/models"

interface SolutionCardProps {
  solution: ISolution
  onSelect: () => void
  onDelete: () => void
  onExport: () => void
}

const SolutionCard: React.FC<SolutionCardProps> = ({
  solution,
  onSelect,
  onDelete,
  onExport,
}) => {
  // Generate language badge color
  const getLanguageColor = (language: string): string => {
    const colors: { [key: string]: string } = {
      javascript: "bg-yellow-600 text-yellow-100",
      typescript: "bg-blue-600 text-blue-100",
      python: "bg-green-600 text-green-100",
      java: "bg-red-600 text-red-100",
      cpp: "bg-purple-600 text-purple-100",
      csharp: "bg-indigo-600 text-indigo-100",
      go: "bg-cyan-600 text-cyan-100",
      ruby: "bg-pink-600 text-pink-100",
      rust: "bg-orange-600 text-orange-100",
      swift: "bg-rose-600 text-rose-100",
      kotlin: "bg-amber-600 text-amber-100",
    }

    return colors[language.toLowerCase()] || "bg-gray-600 text-gray-100"
  }

  // Format the date
  const formattedDate = new Date(solution.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  )

  // Truncate problem statement
  const truncatedProblem =
    solution.problemStatement.length > 120
      ? solution.problemStatement.substring(0, 120) + "..."
      : solution.problemStatement

  return (
    <div className="bg-gray-700 rounded-lg overflow-hidden flex flex-col">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium">{truncatedProblem}</h3>
          <div
            className={`px-2 py-1 rounded-md text-xs font-medium ${getLanguageColor(
              solution.language
            )}`}
          >
            {solution.language}
          </div>
        </div>

        <div className="mt-3 text-sm text-gray-300">
          <div className="flex justify-between">
            <div>
              <span className="font-medium">Time:</span>{" "}
              {solution.timeComplexity}
            </div>
            <div>
              <span className="font-medium">Space:</span>{" "}
              {solution.spaceComplexity}
            </div>
          </div>
        </div>
      </div>

      {/* Code preview */}
      <div className="bg-gray-800 p-3 overflow-x-auto text-sm">
        <pre className="font-mono text-gray-300">
          {solution.code.split("\n").slice(0, 3).join("\n")}
          {solution.code.split("\n").length > 3 ? "\n..." : ""}
        </pre>
      </div>

      <div className="p-3 bg-gray-700 mt-auto flex items-center justify-between">
        <span className="text-xs text-gray-400">{formattedDate}</span>

        <div className="flex space-x-2">
          <button
            onClick={onDelete}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title="Delete"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <button
            onClick={onExport}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title="Export"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <button
            onClick={onSelect}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title="View Details"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fillRule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default SolutionCard
