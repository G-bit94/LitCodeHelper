// electron/screenshot.ts
import { desktopCapturer, screen } from "electron";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import Anthropic from "@anthropic-ai/sdk";

export class ScreenshotHelper {
  private screenshotDir: string;
  private readonly MAX_SCREENSHOTS = 5;

  constructor(userDataPath: string) {
    // Initialize the screenshots directory
    this.screenshotDir = path.join(userDataPath, "screenshots");
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
    }
    console.log("Screenshot directory initialized:", this.screenshotDir);
  }

  // Capture a screenshot
  public async captureScreenshot(): Promise<{ path: string, success: boolean, error?: string }> {
    // Get primary display dimensions
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.size;

    try {
      console.log("Capturing screenshot...");
      console.log("Display size:", width, "x", height);
      
      // Capture desktop sources
      const sources = await desktopCapturer.getSources({
        types: ["screen"],
        thumbnailSize: { width, height }
      });

      console.log("Sources found:", sources.length);
      
      // Get primary display source
      const primarySource = sources.find(
        source => source.display_id === primaryDisplay.id.toString()
      ) || sources[0];

      if (!primarySource || !primarySource.thumbnail) {
        console.error("No valid source or thumbnail found");
        return { 
          path: "", 
          success: false, 
          error: "Failed to capture primary display" 
        };
      }

      // Generate a unique filename
      const screenshotPath = path.join(this.screenshotDir, `${uuidv4()}.png`);
      console.log("Saving screenshot to:", screenshotPath);
      
      // Save the screenshot
      fs.writeFileSync(screenshotPath, primarySource.thumbnail.toPNG());
      console.log("Screenshot saved successfully");
      
      // Manage screenshots (keep only MAX_SCREENSHOTS)
      await this.manageScreenshots();
      
      return { 
        path: screenshotPath,
        success: true
      };
    } catch (error) {
      console.error("Error capturing screenshot:", error);
      return { 
        path: "", 
        success: false, 
        error: error.message || "Unknown error capturing screenshot" 
      };
    }
  }

  // Get a preview of an image
  public async getImagePreview(filepath: string): Promise<string> {
    try {
      const data = fs.readFileSync(filepath);
      return `data:image/png;base64,${data.toString("base64")}`;
    } catch (error) {
      console.error("Error reading image:", error);
      throw error;
    }
  }

  // Get all screenshots
  public async getScreenshots(): Promise<string[]> {
    try {
      const files = fs.readdirSync(this.screenshotDir);
      return files
        .filter(file => file.endsWith(".png"))
        .map(file => path.join(this.screenshotDir, file))
        .sort((a, b) => {
          // Sort by creation time (most recent first)
          return fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs;
        });
    } catch (error) {
      console.error("Error getting screenshots:", error);
      return [];
    }
  }

  // Delete a screenshot
  public async deleteScreenshot(filepath: string): Promise<{ success: boolean, error?: string }> {
    try {
      console.log("Deleting screenshot:", filepath);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
        console.log("Screenshot deleted successfully");
        return { success: true };
      } else {
        console.error("Screenshot file does not exist:", filepath);
        return { success: false, error: "File does not exist" };
      }
    } catch (error) {
      console.error("Error deleting screenshot:", error);
      return { success: false, error: error.message || "Unknown error deleting screenshot" };
    }
  }

  // Process screenshots with Claude API
  public async processScreenshots(apiKey: string): Promise<{ success: boolean, data?: any, error?: string }> {
    try {
      const screenshots = await this.getScreenshots();
      if (screenshots.length === 0) {
        return { success: false, error: "No screenshots to process" };
      }

      console.log("Processing screenshots with Claude API...");
      console.log("Number of screenshots:", screenshots.length);

      // Convert screenshots to base64
      const screenshotsBase64 = await Promise.all(
        screenshots.map(async (screenshot) => {
          const data = fs.readFileSync(screenshot);
          return data.toString("base64");
        })
      );

      // Create Anthropic client
      const anthropic = new Anthropic({ apiKey });

      // Create a messages request
      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 4000,
        system: `You are a helpful coding assistant that analyzes screenshots of coding problems and generates solutions.
        
        The user will provide screenshots of a coding problem. Your task is to:
        1. Extract and understand the problem statement
        2. Generate a clear, efficient solution in code
        3. Explain your approach and thought process
        4. Analyze the time and space complexity
        
        Format your response as a JSON object with the following structure:
        {
          "problem_statement": "The extracted problem statement",
          "thoughts": ["Step 1 of your approach", "Step 2 of your approach", ...],
          "code": "Your solution code as a string",
          "time_complexity": "The time complexity of your solution (e.g., O(n))",
          "space_complexity": "The space complexity of your solution (e.g., O(1))"
        }
        
        Make sure your JSON is valid and properly formatted. The "code" field should contain a complete, runnable solution.`,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "I'm working on a coding problem. Here are screenshots of the problem. Please analyze them and provide a solution."
              },
              ...screenshotsBase64.map(base64 => ({
                type: "image",
                source: {
                  type: "base64",
                  media_type: "image/png",
                  data: base64
                }
              }))
            ]
          }
        ]
      });

      console.log("Claude API response received");

      // Parse the response content
      const responseText = response.content[0].text;
      let jsonMatch = responseText.match(/```json([\s\S]*?)```/);
      let jsonData;
      
      if (jsonMatch && jsonMatch[1]) {
        // Extract JSON from code block
        console.log("Found JSON in code block");
        jsonData = JSON.parse(jsonMatch[1].trim());
      } else {
        // Try to parse the entire response as JSON
        try {
          console.log("Attempting to parse entire response as JSON");
          jsonData = JSON.parse(responseText);
        } catch (e) {
          console.log("Failed to parse as JSON, creating basic structure");
          // If all else fails, create a basic structure with the text response
          jsonData = {
            problem_statement: "Could not extract problem statement",
            thoughts: ["Analysis based on provided screenshots"],
            code: responseText,
            time_complexity: "Unknown",
            space_complexity: "Unknown"
          };
        }
      }

      console.log("Processing completed successfully");
      return { success: true, data: jsonData };
    } catch (error) {
      console.error("Error processing screenshots with Claude:", error);
      return { success: false, error: error.message || "Unknown error processing screenshots" };
    }
  }

  // Keep only the most recent MAX_SCREENSHOTS
  private async manageScreenshots(): Promise<void> {
    try {
      const screenshots = await this.getScreenshots();
      
      if (screenshots.length > this.MAX_SCREENSHOTS) {
        console.log(`Managing screenshots: keeping only ${this.MAX_SCREENSHOTS} most recent`);
        // Delete oldest screenshots
        const screenshotsToDelete = screenshots.slice(this.MAX_SCREENSHOTS);
        for (const screenshot of screenshotsToDelete) {
          await this.deleteScreenshot(screenshot);
        }
      }
    } catch (error) {
      console.error("Error managing screenshots:", error);
    }
  }
}