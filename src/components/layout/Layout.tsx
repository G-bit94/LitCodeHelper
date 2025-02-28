import React from "react"
import Sidebar from "./Sidebar"

interface LayoutProps {
  children: React.ReactNode
  activePage: "home" | "history" | "settings"
  onNavigate: (page: "home" | "history" | "settings") => void
}

const Layout: React.FC<LayoutProps> = ({
  children,
  activePage,
  onNavigate,
}) => {
  return (
    <div className="flex h-screen bg-gray-800 text-white overflow-hidden">
      <Sidebar activePage={activePage} onNavigate={onNavigate} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-14 bg-gray-900 border-b border-gray-700 flex items-center justify-between px-6">
          <div>
            <h2 className="text-lg font-medium">
              {activePage === "home" && "Dashboard"}
              {activePage === "history" && "Solution History"}
              {activePage === "settings" && "Settings"}
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            <button className="text-gray-400 hover:text-white transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <div className="relative">
              <button className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-medium">
                JD
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto bg-gray-800 p-6">{children}</div>
      </div>
    </div>
  )
}

export default Layout
