// src/components/Toast.tsx
import React, { useEffect } from "react"

interface ToastProps {
  message: string
  type: "success" | "error" | "info"
  onClose: () => void
  duration?: number
}

const Toast: React.FC<ToastProps> = ({
  message,
  type,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const getIcon = () => {
    switch (type) {
      case "success":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-green-500"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        )
      case "error":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-red-500"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        )
      case "info":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-blue-500"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        )
    }
  }

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "bg-green-500 bg-opacity-10"
      case "error":
        return "bg-red-500 bg-opacity-10"
      case "info":
        return "bg-blue-500 bg-opacity-10"
    }
  }

  const getBorderColor = () => {
    switch (type) {
      case "success":
        return "border-green-500"
      case "error":
        return "border-red-500"
      case "info":
        return "border-blue-500"
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md animate-fadeIn">
      <div
        className={`flex items-center p-4 rounded-md border ${getBorderColor()} ${getBackgroundColor()}`}
        role="alert"
      >
        <div className="flex-shrink-0 mr-3">{getIcon()}</div>
        <div className="text-sm font-medium">{message}</div>
        <button
          onClick={onClose}
          className="ml-4 text-gray-400 hover:text-gray-200"
          aria-label="Close"
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
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Toast
