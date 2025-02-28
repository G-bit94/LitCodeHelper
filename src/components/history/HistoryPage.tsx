import React, { useState, useEffect } from "react"
import { ISolution } from "../../database/models"
import { historyService } from "../../services/history-service"
import SolutionCard from "./SolutionCard"

const HistoryPage: React.FC = () => {
  const [solutions, setSolutions] = useState<ISolution[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [exportFormat, setExportFormat] = useState<
    "code" | "markdown" | "html" | "pdf"
  >("code")
  const [selectedSolution, setSelectedSolution] = useState<ISolution | null>(
    null
  )

  useEffect(() => {
    loadSolutions()
  }, [])

  const loadSolutions = async () => {
    setIsLoading(true)
    try {
      const data = await historyService.getSolutionHistory()
      setSolutions(data)
    } catch (error) {
      console.error("Error loading solution history:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadSolutions()
      return
    }

    setIsLoading(true)
    try {
      const results = await historyService.searchSolutions(searchQuery)
      setSolutions(results)
    } catch (error) {
      console.error("Error searching solutions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (solutionId: string) => {
    try {
      const success = await historyService.deleteSolution(solutionId)
      if (success) {
        setSolutions(solutions.filter((s) => s._id.toString() !== solutionId))
      }
    } catch (error) {
      console.error("Error deleting solution:", error)
    }
  }

  const handleExport = async (solution: ISolution) => {
    try {
      const filePath = await historyService.exportToFile(solution, exportFormat)
      if (filePath) {
        alert(`Solution exported successfully to: ${filePath}`)
      }
    } catch (error) {
      console.error("Error exporting solution:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Solution History</h1>
        <div className="flex space-x-2">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search solutions..."
              className="w-64 px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : solutions.length === 0 ? (
        <div className="bg-gray-700 rounded-lg p-8 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <h3 className="text-lg font-medium text-white mb-2">
            No solutions found
          </h3>
          <p className="text-gray-400">
            {searchQuery
              ? "Try a different search query"
              : "Start solving problems to build your history"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {solutions.map((solution) => (
            <SolutionCard
              key={solution._id.toString()}
              solution={solution}
              onSelect={() => setSelectedSolution(solution)}
              onDelete={() => handleDelete(solution._id.toString())}
              onExport={() => handleExport(solution)}
            />
          ))}
        </div>
      )}

      {/* Export Format Selection */}
      {selectedSolution && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Export Solution</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Export Format
                </label>
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value as any)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="code">Code File</option>
                  <option value="markdown">Markdown</option>
                  <option value="html">HTML</option>
                  <option value="pdf">PDF</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedSolution(null)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleExport(selectedSolution)
                    setSelectedSolution(null)
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md"
                >
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HistoryPage
