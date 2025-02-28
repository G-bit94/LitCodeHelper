// src/components/SolutionViewer.tsx
import React from "react"
import { SolutionData } from "../App"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

interface SolutionViewerProps {
  solution: SolutionData
}

const SolutionViewer: React.FC<SolutionViewerProps> = ({ solution }) => {
  return (
    <div className="space-y-6">
      {/* Problem statement */}
      <div className="space-y-2">
        <h2 className="text-lg font-medium">Problem Statement</h2>
        <div className="p-4 bg-gray-800 rounded-md">
          <p className="text-gray-200">{solution.problem_statement}</p>
        </div>
      </div>

      {/* Thought process */}
      <div className="space-y-2">
        <h2 className="text-lg font-medium">Approach</h2>
        <div className="p-4 bg-gray-800 rounded-md">
          <ul className="space-y-2">
            {solution.thoughts.map((thought, index) => (
              <li key={index} className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center text-xs mt-0.5 mr-3">
                  {index + 1}
                </div>
                <p className="text-gray-200">{thought}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Solution code */}
      <div className="space-y-2">
        <h2 className="text-lg font-medium">Solution</h2>
        <div className="rounded-md overflow-hidden">
          <SyntaxHighlighter
            language="javascript" // This will be auto-detected based on the code
            style={vscDarkPlus}
            customStyle={{ margin: 0, borderRadius: "0.375rem" }}
            showLineNumbers
          >
            {solution.code}
          </SyntaxHighlighter>
        </div>
      </div>

      {/* Complexity analysis */}
      <div className="space-y-2">
        <h2 className="text-lg font-medium">Complexity Analysis</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-800 rounded-md">
            <h3 className="text-sm font-medium text-gray-400 mb-2">
              Time Complexity
            </h3>
            <p className="text-gray-200">{solution.time_complexity}</p>
          </div>
          <div className="p-4 bg-gray-800 rounded-md">
            <h3 className="text-sm font-medium text-gray-400 mb-2">
              Space Complexity
            </h3>
            <p className="text-gray-200">{solution.space_complexity}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SolutionViewer
