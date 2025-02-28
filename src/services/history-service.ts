// src/services/history-service.ts
import { dbService } from '../database/database';
import { ISolution } from '../database/models';
import fs from 'fs';
import path from 'path';
import { app, dialog } from 'electron';
import { v4 as uuidv4 } from 'uuid';
import { SolutionData } from '../App';

export class HistoryService {
  private static instance: HistoryService;

  private constructor() {}

  public static getInstance(): HistoryService {
    if (!HistoryService.instance) {
      HistoryService.instance = new HistoryService();
    }
    return HistoryService.instance;
  }

  public async getSolutionHistory(limit: number = 20): Promise<ISolution[]> {
    return await dbService.getSolutions(limit);
  }

  public async searchSolutions(query: string): Promise<ISolution[]> {
    return await dbService.searchSolutions(query);
  }

  public async saveSolution(
    solution: SolutionData, 
    language: string, 
    screenshotIds: string[] = []
  ): Promise<string | null> {
    try {
      const solutionToSave = {
        problemStatement: solution.problem_statement,
        code: solution.code,
        language,
        thoughts: solution.thoughts,
        timeComplexity: solution.time_complexity,
        spaceComplexity: solution.space_complexity,
        screenshotIds,
        createdAt: new Date(),
      };

      return await dbService.saveSolution(solutionToSave);
    } catch (error) {
      console.error('Error saving solution to history:', error);
      return null;
    }
  }

  public async deleteSolution(solutionId: string): Promise<boolean> {
    return await dbService.deleteSolution(solutionId);
  }

  // Export functions
  public async exportToFile(
    solution: ISolution, 
    format: 'code' | 'markdown' | 'html' | 'pdf'
  ): Promise<string | null> {
    try {
      const downloadsFolder = app.getPath('downloads');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      let extension: string;
      let content: string;
      
      switch (format) {
        case 'code':
          extension = this.getLanguageExtension(solution.language);
          content = solution.code;
          break;
        
        case 'markdown':
          extension = 'md';
          content = this.formatSolutionAsMarkdown(solution);
          break;
        
        case 'html':
          extension = 'html';
          content = this.formatSolutionAsHtml(solution);
          break;
        
        case 'pdf':
          // For PDF we'll use HTML as an intermediate format
          return await this.exportToPdf(solution);
        
        default:
          throw new Error(`Unsupported export format: ${format}`);
      }
      
      const filename = `solution-${timestamp}.${extension}`;
      const filePath = path.join(downloadsFolder, filename);
      
      fs.writeFileSync(filePath, content);
      return filePath;
    } catch (error) {
      console.error('Error exporting solution:', error);
      return null;
    }
  }

  public async exportToPdf(solution: ISolution): Promise<string | null> {
    // For simplicity, we'll use a dialog to save the PDF
    // In a real implementation, you would use a library like electron-pdf or browser's print-to-pdf
    try {
      const { filePath } = await dialog.showSaveDialog({
        title: 'Save Solution as PDF',
        defaultPath: app.getPath('downloads') + `/solution-${Date.now()}.pdf`,
        filters: [
          { name: 'PDF Files', extensions: ['pdf'] }
        ]
      });
      
      if (!filePath) return null;
      
      // For a real implementation, use:
      // const htmlContent = this.formatSolutionAsHtml(solution);
      // Use electron-pdf or similar to convert HTML to PDF
      // For now we'll just create an HTML file as a placeholder
      const htmlContent = this.formatSolutionAsHtml(solution);
      const htmlPath = filePath.replace('.pdf', '.html');
      fs.writeFileSync(htmlPath, htmlContent);
      
      return htmlPath; // In real implementation, return the PDF path
    } catch (error) {
      console.error('Error exporting solution to PDF:', error);
      return null;
    }
  }

  private getLanguageExtension(language: string): string {
    const extensions: {[key: string]: string} = {
      'javascript': 'js',
      'typescript': 'ts',
      'python': 'py',
      'java': 'java',
      'c': 'c',
      'cpp': 'cpp',
      'csharp': 'cs',
      'go': 'go',
      'ruby': 'rb',
      'php': 'php',
      'swift': 'swift',
      'kotlin': 'kt',
      'rust': 'rs',
      'scala': 'scala',
      'dart': 'dart',
      'r': 'r',
      'haskell': 'hs',
      'sql': 'sql'
    };
    
    return extensions[language.toLowerCase()] || 'txt';
  }

  private formatSolutionAsMarkdown(solution: ISolution): string {
    return `# ${solution.problemStatement || 'Coding Solution'}

## Problem Statement
${solution.problemStatement}

## Approach
${solution.thoughts.map(thought => `- ${thought}`).join('\n')}

## Solution
\`\`\`${solution.language}
${solution.code}
\`\`\`

## Complexity
- Time Complexity: ${solution.timeComplexity}
- Space Complexity: ${solution.spaceComplexity}

---
Generated by CodeHelper on ${new Date(solution.createdAt).toLocaleString()}
`;
  }

  private formatSolutionAsHtml(solution: ISolution): string {
    const css = `
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; color: #333; }
      h1 { color: #2563eb; }
      h2 { color: #1d4ed8; margin-top: 30px; }
      pre { background-color: #f7f7f7; padding: 15px; border-radius: 5px; overflow: auto; }
      code { font-family: Menlo, Monaco, 'Courier New', monospace; }
      ul { padding-left: 20px; }
      .complexity { background-color: #f0f4ff; padding: 10px; border-radius: 5px; margin-top: 20px; }
      footer { margin-top: 40px; border-top: 1px solid #eee; padding-top: 10px; color: #666; font-size: 0.9em; }
    `;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${solution.problemStatement || 'Coding Solution'}</title>
  <style>${css}</style>
</head>
<body>
  <h1>${solution.problemStatement || 'Coding Solution'}</h1>
  
  <h2>Problem Statement</h2>
  <p>${solution.problemStatement}</p>
  
  <h2>Approach</h2>
  <ul>
    ${solution.thoughts.map(thought => `<li>${thought}</li>`).join('\n    ')}
  </ul>
  
  <h2>Solution</h2>
  <pre><code>${solution.code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
  
  <div class="complexity">
    <h2>Complexity</h2>
    <ul>
      <li><strong>Time Complexity:</strong> ${solution.timeComplexity}</li>
      <li><strong>Space Complexity:</strong> ${solution.spaceComplexity}</li>
    </ul>
  </div>
  
  <footer>
    Generated by CodeHelper on ${new Date(solution.createdAt).toLocaleString()}
  </footer>
</body>
</html>`;
  }
}

export const historyService = HistoryService.getInstance();