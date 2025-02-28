// src/components/ApiKeyInput.tsx
import React, { useState } from "react"

interface ApiKeyInputProps {
  apiKey: string
  onSave: (apiKey: string) => void
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ apiKey, onSave }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(apiKey)
  const [isVisible, setIsVisible] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(inputValue)
    setIsEditing(false)
  }

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="flex items-center px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
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
          <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
        </svg>
        {apiKey ? "API Key ••••••••" : "Set API Key"}
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center">
      <div className="relative">
        <input
          type={isVisible ? "text" : "password"}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter Claude API Key"
          className="w-72 px-3 py-1.5 text-sm bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:border-primary-500"
          autoFocus
        />
        <button
          type="button"
          onClick={() => setIsVisible(!isVisible)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
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
          >
            {isVisible ? (
              <>
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </>
            ) : (
              <>
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </>
            )}
          </svg>
        </button>
      </div>
      <div className="flex ml-2 space-x-2">
        <button
          type="submit"
          className="px-3 py-1.5 text-sm bg-primary-600 hover:bg-primary-700 rounded-md transition-colors"
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default ApiKeyInput
