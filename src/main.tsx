// src/main.tsx
import React from "react"
import ReactDOM from "react-dom/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import App from "./App"
import "./index.css"
import { dbService } from "./database/database"

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      gcTime: Infinity,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

// Initialize database connection
dbService
  .connect()
  .then((success) => {
    console.log(success ? "MongoDB connected" : "MongoDB connection failed")
  })
  .catch((error) => {
    console.error("Error initializing database:", error)
  })

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
)
