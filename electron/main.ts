// electron/main.ts
import { app, BrowserWindow, ipcMain, screen } from "electron"
import path from "path"
import { ScreenshotHelper } from "./screenshot"

// App state
let mainWindow: BrowserWindow | null = null
let screenshotHelper: ScreenshotHelper | null = null
const isDev = !app.isPackaged

console.log("Main process starting")
console.log("Development mode:", isDev)

async function createWindow() {
  console.log("Creating window")
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.workAreaSize

  // Create the browser window
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: isDev
        ? path.join(__dirname, "../dist-electron/preload.js")
        : path.join(__dirname, "preload.js"),
    },
    // Use a solid background color first to verify content loading
    backgroundColor: "#1a1a1a",
    show: false, // We'll show it once ready
  })

  // Show window when ready to avoid blank flashes
  mainWindow.once("ready-to-show", () => {
    mainWindow.show()
  })

  // Initialize the screenshot helper
  screenshotHelper = new ScreenshotHelper(app.getPath("userData"))

  // Load the app
  if (isDev) {
    console.log("Loading development URL: http://localhost:3000")
    await mainWindow.loadURL("http://localhost:3000")
    // Open DevTools immediately
    mainWindow.webContents.openDevTools()
  } else {
    const htmlPath = path.join(__dirname, "../dist/index.html")
    console.log("Loading production file:", htmlPath)
    await mainWindow.loadFile(htmlPath)
  }

  // Log any errors in the renderer console
  mainWindow.webContents.on(
    "did-fail-load",
    (event, errorCode, errorDescription) => {
      console.error("Failed to load:", errorCode, errorDescription)
    }
  )

  // Handle window closed
  mainWindow.on("closed", () => {
    mainWindow = null
  })
}

// Create window when Electron is ready
app.whenReady().then(() => {
  createWindow()
  setupIpcHandlers()

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

// Set up IPC handlers
function setupIpcHandlers() {
  try {
    console.log("Starting to set up IPC handlers")

    // Take a screenshot
    ipcMain.handle("take-screenshot", async () => {
      console.log("IPC: take-screenshot handler registered")

      if (!screenshotHelper) {
        console.error("Screenshot helper not initialized")
        return { success: false, error: "Screenshot helper not initialized" }
      }

      try {
        const result = await screenshotHelper.captureScreenshot()
        console.log("Screenshot captured:", result)

        if (!result.success) {
          return result
        }

        const preview = await screenshotHelper.getImagePreview(result.path)
        console.log("Preview generated")

        // Send screenshot-taken event to renderer
        if (mainWindow) {
          console.log("Sending screenshot-taken event to renderer")
          mainWindow.webContents.send("screenshot-taken", {
            path: result.path,
            preview,
          })
        }

        return { success: true, path: result.path, preview }
      } catch (error) {
        console.error("Error taking screenshot:", error)
        return {
          success: false,
          error: error.message || "Failed to take screenshot",
        }
      }
    })

    // Get all screenshots
    ipcMain.handle("get-screenshots", async () => {
      console.log("IPC: get-screenshots called")

      if (!screenshotHelper) {
        console.error("Screenshot helper not initialized")
        return []
      }

      try {
        const screenshots = await screenshotHelper.getScreenshots()
        console.log(`Retrieved ${screenshots.length} screenshots`)

        const result = await Promise.all(
          screenshots.map(async (path) => ({
            path,
            preview: await screenshotHelper.getImagePreview(path),
          }))
        )

        return result
      } catch (error) {
        console.error("Error getting screenshots:", error)
        return []
      }
    })

    // Delete a screenshot
    ipcMain.handle("delete-screenshot", async (_, path) => {
      console.log("IPC: delete-screenshot called for path:", path)

      if (!screenshotHelper) {
        console.error("Screenshot helper not initialized")
        return { success: false, error: "Screenshot helper not initialized" }
      }

      try {
        const result = await screenshotHelper.deleteScreenshot(path)
        console.log("Delete result:", result)
        return result
      } catch (error) {
        console.error("Error deleting screenshot:", error)
        return {
          success: false,
          error: error.message || "Failed to delete screenshot",
        }
      }
    })

    // Process screenshots with Claude
    ipcMain.handle("process-screenshots", async (_, apiKey) => {
      console.log("IPC: process-screenshots called")

      if (!screenshotHelper) {
        console.error("Screenshot helper not initialized")
        return { success: false, error: "Screenshot helper not initialized" }
      }

      try {
        const screenshots = await screenshotHelper.getScreenshots()

        if (screenshots.length === 0) {
          console.log("No screenshots to process")
          if (mainWindow) {
            mainWindow.webContents.send("processing-no-screenshots")
          }
          return { success: false, error: "No screenshots to process" }
        }

        console.log(`Processing ${screenshots.length} screenshots`)

        if (mainWindow) {
          mainWindow.webContents.send("processing-start")
        }

        const result = await screenshotHelper.processScreenshots(apiKey)
        console.log("Processing result:", result.success ? "Success" : "Failed")

        if (mainWindow) {
          if (result.success) {
            mainWindow.webContents.send("processing-success", result.data)
          } else {
            mainWindow.webContents.send("processing-error", result.error)
          }
        }

        return result
      } catch (error) {
        console.error("Error processing screenshots:", error)

        if (mainWindow) {
          mainWindow.webContents.send(
            "processing-error",
            error.message || "Unknown error"
          )
        }

        return {
          success: false,
          error: error.message || "Failed to process screenshots",
        }
      }
    })
    console.log("IPC handlers setup completed successfully")
  } catch (error) {
    console.error("ERROR SETTING UP IPC HANDLERS:", error)
  }
}
