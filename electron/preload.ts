// electron/preload.ts
import { contextBridge, ipcRenderer } from "electron"

console.log("Preload script running")

// Define the API exposed to the renderer process
const api = {
  // Screenshot methods
  takeScreenshot: () => {
    console.log("Preload: takeScreenshot called")
    return ipcRenderer.invoke("take-screenshot")
  },
  getScreenshots: () => {
    console.log("Preload: getScreenshots called")
    return ipcRenderer.invoke("get-screenshots")
  },
  deleteScreenshot: (path: string) => {
    console.log("Preload: deleteScreenshot called for path:", path)
    return ipcRenderer.invoke("delete-screenshot", path)
  },

  // Processing methods
  processScreenshots: (apiKey: string) => {
    console.log("Preload: processScreenshots called")
    return ipcRenderer.invoke("process-screenshots", apiKey)
  },

  // Event listeners
  onScreenshotTaken: (
    callback: (data: { path: string; preview: string }) => void
  ) => {
    console.log("Preload: Setting up onScreenshotTaken listener")
    const subscription = (_: any, data: { path: string; preview: string }) => {
      console.log("Preload: screenshot-taken event received", data.path)
      callback(data)
    }
    ipcRenderer.on("screenshot-taken", subscription)
    return () => {
      console.log("Preload: Removing onScreenshotTaken listener")
      ipcRenderer.removeListener("screenshot-taken", subscription)
    }
  },

  onProcessingStart: (callback: () => void) => {
    console.log("Preload: Setting up onProcessingStart listener")
    const subscription = () => {
      console.log("Preload: processing-start event received")
      callback()
    }
    ipcRenderer.on("processing-start", subscription)
    return () => {
      console.log("Preload: Removing onProcessingStart listener")
      ipcRenderer.removeListener("processing-start", subscription)
    }
  },

  onProcessingSuccess: (callback: (data: any) => void) => {
    console.log("Preload: Setting up onProcessingSuccess listener")
    const subscription = (_: any, data: any) => {
      console.log("Preload: processing-success event received")
      callback(data)
    }
    ipcRenderer.on("processing-success", subscription)
    return () => {
      console.log("Preload: Removing onProcessingSuccess listener")
      ipcRenderer.removeListener("processing-success", subscription)
    }
  },

  onProcessingError: (callback: (error: string) => void) => {
    console.log("Preload: Setting up onProcessingError listener")
    const subscription = (_: any, error: string) => {
      console.log("Preload: processing-error event received:", error)
      callback(error)
    }
    ipcRenderer.on("processing-error", subscription)
    return () => {
      console.log("Preload: Removing onProcessingError listener")
      ipcRenderer.removeListener("processing-error", subscription)
    }
  },

  onProcessingNoScreenshots: (callback: () => void) => {
    console.log("Preload: Setting up onProcessingNoScreenshots listener")
    const subscription = () => {
      console.log("Preload: processing-no-screenshots event received")
      callback()
    }
    ipcRenderer.on("processing-no-screenshots", subscription)
    return () => {
      console.log("Preload: Removing onProcessingNoScreenshots listener")
      ipcRenderer.removeListener("processing-no-screenshots", subscription)
    }
  },
}

// Before exposing the API
console.log("About to expose electronAPI to window")

// Expose the API to the renderer process
contextBridge.exposeInMainWorld("electronAPI", api)

// Define the type for the API
declare global {
  interface Window {
    electronAPI: typeof api
  }
}

console.log("Preload script completed, API exposed")
