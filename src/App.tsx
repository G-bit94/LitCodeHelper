// src/App.tsx
import React, { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import Toast from "./components/ui/Toast"
import ScreenshotQueue from "./components/home/ScreenshotQueue"
import CommandBar from "./components/home/CommandBar"
import SolutionViewer from "./components/home/SolutionViewer"

export interface Screenshot {
  path: string
  preview: string
}

export interface SolutionData {
  problem_statement: string
  thoughts: string[]
  code: string
  time_complexity: string
  space_complexity: string
}

const App: React.FC = () => {
  // State management
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [solution, setSolution] = useState<SolutionData | null>(null)
  const [toast, setToast] = useState<{
    message: string
    type: "success" | "error" | "info"
  } | null>(null)

  // Query for fetching screenshots
  const { data: screenshots = [], refetch: refetchScreenshots } = useQuery<
    Screenshot[]
  >({
    queryKey: ["screenshots"],
    queryFn: async () => {
      console.log("Fetching screenshots...")
      try {
        const result = await window.electronAPI.getScreenshots()
        console.log("Screenshots result:", result)
        return result || []
      } catch (error) {
        console.error("Error fetching screenshots:", error)
        return []
      }
    },
    refetchOnWindowFocus: false,
  })

  // Handle taking a screenshot
  const handleTakeScreenshot = async () => {
    try {
      console.log("Taking screenshot...")
      const result = await window.electronAPI.takeScreenshot()
      console.log("Screenshot result:", result)

      if (result.success) {
        setToast({ message: "Screenshot taken", type: "success" })
        refetchScreenshots()
      } else {
        setToast({
          message: result.error || "Failed to take screenshot",
          type: "error",
        })
      }
    } catch (error) {
      console.error("Error taking screenshot:", error)
      setToast({ message: "Failed to take screenshot", type: "error" })
    }
  }

  // Handle deleting a screenshot
  const handleDeleteScreenshot = async (path: string) => {
    try {
      console.log("Deleting screenshot:", path)
      const result = await window.electronAPI.deleteScreenshot(path)

      if (result.success) {
        refetchScreenshots()
      } else {
        setToast({ message: "Failed to delete screenshot", type: "error" })
      }
    } catch (error) {
      console.error("Error deleting screenshot:", error)
      setToast({ message: "Failed to delete screenshot", type: "error" })
    }
  }

  // Handle processing screenshots
  const handleProcessScreenshots = async () => {
    try {
      const apiKey = "sk-ant-your-mock-key" // We'll replace this with real key management later

      console.log("Processing screenshots with API key...")
      setIsProcessing(true)

      // Mock a successful response for now
      setTimeout(() => {
        const mockSolution: SolutionData = {
          problem_statement:
            "Given an array of integers, find the two numbers that add up to a specific target.",
          thoughts: [
            "We can use a hash map to store numbers we've seen so far",
            "For each number, check if (target - number) exists in the hash map",
            "If it does, we've found our pair",
            "If not, add the current number to the hash map",
          ],
          code: "function twoSum(nums, target) {\n  const seen = {};\n  \n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    \n    if (complement in seen) {\n      return [seen[complement], i];\n    }\n    \n    seen[nums[i]] = i;\n  }\n  \n  return [];\n}",
          time_complexity: "O(n) where n is the length of the array",
          space_complexity: "O(n) for storing the hash map",
        }

        setSolution(mockSolution)
        setIsProcessing(false)
        setToast({
          message: "Solution generated successfully",
          type: "success",
        })
      }, 2000)
    } catch (error) {
      console.error("Error processing screenshots:", error)
      setToast({ message: "Error processing screenshots", type: "error" })
      setIsProcessing(false)
    }
  }

  // Set up keyboard shortcuts
  useEffect(() => {
    console.log("Setting up keyboard shortcuts")

    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if Ctrl (or Command on Mac) is pressed
      const cmdOrCtrl = e.ctrlKey || e.metaKey

      if (cmdOrCtrl && e.key === "h") {
        console.log("Ctrl+H pressed, taking screenshot")
        e.preventDefault()
        handleTakeScreenshot()
      } else if (cmdOrCtrl && e.key === "Enter") {
        console.log("Ctrl+Enter pressed, processing screenshots")
        e.preventDefault()
        handleProcessScreenshots()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-800 text-white">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold">CodeHelper</h1>

        {/* Command bar */}
        <CommandBar
          onTakeScreenshot={handleTakeScreenshot}
          onProcessScreenshots={handleProcessScreenshots}
          isProcessing={isProcessing}
          hasScreenshots={screenshots.length > 0}
        />

        {/* Screenshot queue */}
        <div className="mb-6">
          <ScreenshotQueue
            screenshots={screenshots}
            onDelete={handleDeleteScreenshot}
            isLoading={isProcessing}
          />
        </div>

        {/* Solution or empty state */}
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center h-64 bg-gray-700 rounded-lg p-6">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-300">
              Processing screenshots with Claude AI...
            </p>
          </div>
        ) : solution ? (
          <SolutionViewer solution={solution} />
        ) : screenshots.length > 0 ? (
          <div className="bg-gray-700 rounded-lg p-8 text-center">
            <p className="text-lg text-gray-300 mb-4">
              Ready to process your screenshots
            </p>
            <button
              onClick={handleProcessScreenshots}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md text-white"
            >
              Process Screenshots
            </button>
          </div>
        ) : (
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
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-white mb-2">
              No screenshots yet
            </h3>
            <p className="text-gray-400 mb-4">
              Take a screenshot of your coding problem to get started
            </p>
            <button
              onClick={handleTakeScreenshot}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md text-white"
            >
              Take Screenshot
            </button>
          </div>
        )}

        {/* Toast notifications */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  )
}

export default App
