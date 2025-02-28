import React from "react"
import { SolutionData } from "../../App"

interface SolutionViewerProps {
  solution: SolutionData
}

const SolutionViewer: React.FC<SolutionViewerProps> = ({ solution }) => {
  return (
    <div className="bg-gray-700 rounded-lg overflow-hidden">
      {/* Problem Statement */}
      <div className="p-4 border-b border-gray-600">
        <h2 className="text-lg font-medium text-white mb-2">
          Problem Statement
        </h2>
        <p className="text-gray-300">{solution.problem_statement}</p>
      </div>

      {/* Approach */}
      <div className="p-4 border-b border-gray-600">
        <h2 className="text-lg font-medium text-white mb-2">Approach</h2>
        <ul className="space-y-2">
          {solution.thoughts.map((thought, index) => (
            <li key={index} className="flex items-start text-gray-300">
              <div className="flex-shrink-0 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-xs text-white mt-0.5 mr-3">
                {index + 1}
              </div>
              <p>{thought}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Solution Code */}
      <div className="p-4 border-b border-gray-600">
        <h2 className="text-lg font-medium text-white mb-2">Solution</h2>
        <pre className="bg-gray-800 p-4 rounded-md overflow-auto text-gray-300 font-mono text-sm">
          {solution.code}
        </pre>
      </div>

      {/* Complexity Analysis */}
      <div className="p-4">
        <h2 className="text-lg font-medium text-white mb-2">
          Complexity Analysis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800 p-3 rounded-md">
            <h3 className="text-sm font-medium text-gray-400 mb-1">
              Time Complexity
            </h3>
            <p className="text-gray-300">{solution.time_complexity}</p>
          </div>
          <div className="bg-gray-800 p-3 rounded-md">
            <h3 className="text-sm font-medium text-gray-400 mb-1">
              Space Complexity
            </h3>
            <p className="text-gray-300">{solution.space_complexity}</p>
          </div>
        </div>
      </div>

      {/* Export buttons could go here */}
      <div className="p-4 bg-gray-800 flex justify-end gap-2">
        <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded text-white text-sm transition-colors">
          Export Solution
        </button>
        <button className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm transition-colors">
          Copy Code
        </button>
      </div>
    </div>
  )
}

export default SolutionViewer
