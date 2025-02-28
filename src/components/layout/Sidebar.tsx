import React from "react"
import { apiKeyService } from "../../services/api-key-service"
import { dbService } from "../../database/database"

interface SidebarProps {
  activePage: "home" | "history" | "settings"
  onNavigate: (page: "home" | "history" | "settings") => void
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => {
  const [isApiConnected, setIsApiConnected] = React.useState<boolean>(false)
  const [isDbConnected, setIsDbConnected] = React.useState<boolean>(false)

  React.useEffect(() => {
    const checkConnections = async () => {
      // Check API key connection
      const apiKey = await apiKeyService.getApiKey()
      setIsApiConnected(!!apiKey)

      // Check database connection
      setIsDbConnected(dbService.isConnectedToDatabase())
    }

    checkConnections()

    // Set up interval to check connections periodically
    const interval = setInterval(checkConnections, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="h-full w-52 bg-gray-900 flex flex-col">
      {/* App Title */}
      <div className="h-14 border-b border-gray-700 flex items-center px-4">
        <h1 className="text-xl font-semibold text-blue-500">CodeHelper</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        <button
          onClick={() => onNavigate("home")}
          className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            activePage === "home"
              ? "bg-blue-600 text-white"
              : "text-gray-300 hover:bg-gray-800 hover:text-white"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          Home
        </button>

        <button
          onClick={() => onNavigate("history")}
          className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            activePage === "history"
              ? "bg-blue-600 text-white"
              : "text-gray-300 hover:bg-gray-800 hover:text-white"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          History
        </button>

        <button
          onClick={() => onNavigate("settings")}
          className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            activePage === "settings"
              ? "bg-blue-600 text-white"
              : "text-gray-300 hover:bg-gray-800 hover:text-white"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Settings
        </button>
      </nav>

      {/* Status Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center space-y-2 flex-col">
          <div className="flex items-center">
            <div
              className={`h-2 w-2 rounded-full mr-2 ${
                isApiConnected ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span className="text-xs text-gray-400">
              API {isApiConnected ? "Connected" : "Disconnected"}
            </span>
          </div>

          <div className="flex items-center">
            <div
              className={`h-2 w-2 rounded-full mr-2 ${
                isDbConnected ? "bg-green-500" : "bg-yellow-500"
              }`}
            ></div>
            <span className="text-xs text-gray-400">
              Database {isDbConnected ? "Connected" : "Local Only"}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
