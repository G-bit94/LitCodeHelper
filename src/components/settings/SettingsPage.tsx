import React, { useState, useEffect } from "react"
import { apiKeyService } from "../../services/api-key-service"
import { dbService } from "../../database/database"

const SettingsPage: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>("")
  const [isApiKeyVisible, setIsApiKeyVisible] = useState<boolean>(false)
  const [connectionString, setConnectionString] = useState<string>("")
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [isValidating, setIsValidating] = useState<boolean>(false)
  const [statusMessage, setStatusMessage] = useState<{
    text: string
    type: "success" | "error" | "info"
  } | null>(null)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      // Load API key
      const savedApiKey = await apiKeyService.getApiKey()
      setApiKey(savedApiKey || "")

      // Check database connection
      setIsConnected(dbService.isConnectedToDatabase())
    } catch (error) {
      console.error("Error loading settings:", error)
      setStatusMessage({
        text: "Error loading settings",
        type: "error",
      })
    }
  }

  const validateAndSaveApiKey = async () => {
    if (!apiKey.trim()) {
      setStatusMessage({
        text: "Please enter an API key",
        type: "error",
      })
      return
    }

    setIsValidating(true)
    setStatusMessage({
      text: "Validating API key...",
      type: "info",
    })

    try {
      const isValid = await apiKeyService.validateApiKey(apiKey)

      if (isValid) {
        await apiKeyService.saveApiKey(apiKey)
        setStatusMessage({
          text: "API key saved successfully",
          type: "success",
        })
      } else {
        setStatusMessage({
          text: "Invalid API key. Please check and try again.",
          type: "error",
        })
      }
    } catch (error) {
      console.error("Error validating API key:", error)
      setStatusMessage({
        text: "Error validating API key",
        type: "error",
      })
    } finally {
      setIsValidating(false)
    }
  }

  const connectToDatabase = async () => {
    if (!connectionString.trim()) {
      setStatusMessage({
        text: "Please enter a MongoDB connection string",
        type: "error",
      })
      return
    }

    setIsValidating(true)
    setStatusMessage({
      text: "Connecting to database...",
      type: "info",
    })

    try {
      const connected = await dbService.connect(connectionString)

      if (connected) {
        setIsConnected(true)
        setStatusMessage({
          text: "Connected to database successfully",
          type: "success",
        })
      } else {
        setStatusMessage({
          text: "Failed to connect to database. Please check your connection string.",
          type: "error",
        })
      }
    } catch (error) {
      console.error("Error connecting to database:", error)
      setStatusMessage({
        text: "Error connecting to database",
        type: "error",
      })
    } finally {
      setIsValidating(false)
    }
  }

  const disconnectFromDatabase = async () => {
    try {
      await dbService.disconnect()
      setIsConnected(false)
      setStatusMessage({
        text: "Disconnected from database",
        type: "info",
      })
    } catch (error) {
      console.error("Error disconnecting from database:", error)
      setStatusMessage({
        text: "Error disconnecting from database",
        type: "error",
      })
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        {statusMessage && (
          <div
            className={`p-3 mb-6 rounded-md ${
              statusMessage.type === "success"
                ? "bg-green-900/50 text-green-100"
                : statusMessage.type === "error"
                ? "bg-red-900/50 text-red-100"
                : "bg-blue-900/50 text-blue-100"
            }`}
          >
            {statusMessage.text}
          </div>
        )}
      </div>

      {/* API Key Section */}
      <div className="bg-gray-700 rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Claude API Key</h2>
        <p className="text-gray-300 text-sm mb-4">
          Enter your Claude API key to use for processing screenshots and
          generating solutions. You can get an API key from the{" "}
          <a
            href="https://console.anthropic.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            Claude API Console
          </a>
          .
        </p>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="apiKey"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              API Key
            </label>
            <div className="flex relative">
              <input
                type={isApiKeyVisible ? "text" : "password"}
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1 bg-gray-800 border border-gray-600 rounded-l-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="sk-ant-api03-..."
              />
              <button
                type="button"
                onClick={() => setIsApiKeyVisible(!isApiKeyVisible)}
                className="px-3 bg-gray-600 border-y border-r border-gray-600 rounded-r-md"
              >
                {isApiKeyVisible ? (
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
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                      clipRule="evenodd"
                    />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={validateAndSaveApiKey}
            disabled={isValidating || !apiKey.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed rounded-md text-white"
          >
            {isValidating ? "Validating..." : "Save API Key"}
          </button>
        </div>
      </div>

      {/* Database Section */}
      <div className="bg-gray-700 rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Database Connection</h2>
        <p className="text-gray-300 text-sm mb-4">
          Connect to MongoDB to sync your settings and history across multiple
          devices. This is optional - if not connected, all data will be stored
          locally.
        </p>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="connectionString"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              MongoDB Connection String
            </label>
            <input
              type="text"
              id="connectionString"
              value={connectionString}
              onChange={(e) => setConnectionString(e.target.value)}
              disabled={isConnected}
              className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-900 disabled:cursor-not-allowed"
              placeholder="mongodb+srv://..."
            />
          </div>

          {isConnected ? (
            <button
              type="button"
              onClick={disconnectFromDatabase}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-md text-white"
            >
              Disconnect
            </button>
          ) : (
            <button
              type="button"
              onClick={connectToDatabase}
              disabled={isValidating || !connectionString.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed rounded-md text-white"
            >
              {isValidating ? "Connecting..." : "Connect"}
            </button>
          )}
        </div>

        <div className="mt-4 flex items-center text-sm text-gray-300">
          <div
            className={`h-2 w-2 rounded-full mr-2 ${
              isConnected ? "bg-green-500" : "bg-yellow-500"
            }`}
          ></div>
          <span>
            {isConnected ? "Connected to MongoDB" : "Using local storage only"}
          </span>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-gray-700 rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">About CodeHelper</h2>
        <p className="text-gray-300 text-sm">
          Version 1.0.0 - Built with Electron, React, and Claude AI
        </p>
        <p className="text-gray-300 text-sm mt-2">
          &copy; 2025 - All rights reserved
        </p>
      </div>
    </div>
  )
}

export default SettingsPage
