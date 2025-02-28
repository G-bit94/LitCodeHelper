// src/database/database.ts
import mongoose from 'mongoose';
import { IUser, ISolution, IScreenshot, User, Solution, Screenshot } from './models';
import { v4 as uuidv4 } from 'uuid';
import { app } from 'electron';
import path from 'path';
import fs from 'fs';
import ElectronStore from 'electron-store';

// Create secure store for connection string
const store = new ElectronStore({
  name: 'database-config',
  encryptionKey: 'your-encryption-key', // Replace with a secure key in production
});

export class DatabaseService {
  private isConnected = false;
  private connectionString: string;
  private userId: string;

  constructor() {
    this.connectionString = store.get('mongoConnectionString') as string || '';
    this.userId = store.get('userId') as string || '';
  }

  public async connect(connectionString?: string): Promise<boolean> {
    try {
      if (connectionString) {
        this.connectionString = connectionString;
        store.set('mongoConnectionString', connectionString);
      }

      if (!this.connectionString) {
        console.error('No MongoDB connection string provided');
        return false;
      }

      if (this.isConnected) {
        console.log('Already connected to MongoDB');
        return true;
      }

      await mongoose.connect(this.connectionString);
      console.log('Connected to MongoDB');
      this.isConnected = true;

      // Initialize or retrieve user ID
      if (!this.userId) {
        this.userId = uuidv4();
        store.set('userId', this.userId);
        
        // Create user in database
        await User.findOneAndUpdate(
          { userId: this.userId },
          { userId: this.userId },
          { upsert: true, new: true }
        );
      }

      return true;
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      this.isConnected = false;
      return false;
    }
  }

  public async disconnect(): Promise<void> {
    if (this.isConnected) {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('Disconnected from MongoDB');
    }
  }

  public async updateApiKey(apiKey: string): Promise<boolean> {
    try {
      if (!this.isConnected) await this.connect();
      if (!this.isConnected) return false;

      await User.findOneAndUpdate(
        { userId: this.userId },
        { apiKey, updatedAt: new Date() },
        { upsert: true }
      );

      return true;
    } catch (error) {
      console.error('Error updating API key:', error);
      return false;
    }
  }

  public async getApiKey(): Promise<string | null> {
    try {
      if (!this.isConnected) await this.connect();
      if (!this.isConnected) return null;

      const user = await User.findOne({ userId: this.userId });
      return user?.apiKey || null;
    } catch (error) {
      console.error('Error getting API key:', error);
      return null;
    }
  }

  public async saveSolution(solution: Omit<ISolution, 'userId' | '_id'>): Promise<string | null> {
    try {
      if (!this.isConnected) await this.connect();
      if (!this.isConnected) return null;

      const newSolution = new Solution({
        ...solution,
        userId: this.userId
      });

      const savedSolution = await newSolution.save();
      return savedSolution._id.toString();
    } catch (error) {
      console.error('Error saving solution:', error);
      return null;
    }
  }

  public async getSolutions(limit: number = 10): Promise<ISolution[]> {
    try {
      if (!this.isConnected) await this.connect();
      if (!this.isConnected) return [];

      const solutions = await Solution.find({ userId: this.userId })
        .sort({ createdAt: -1 })
        .limit(limit);
      
      return solutions;
    } catch (error) {
      console.error('Error getting solutions:', error);
      return [];
    }
  }

  public async searchSolutions(query: string): Promise<ISolution[]> {
    try {
      if (!this.isConnected) await this.connect();
      if (!this.isConnected) return [];

      const solutions = await Solution.find({
        userId: this.userId,
        $or: [
          { problemStatement: { $regex: query, $options: 'i' } },
          { code: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } }
        ]
      }).sort({ createdAt: -1 });
      
      return solutions;
    } catch (error) {
      console.error('Error searching solutions:', error);
      return [];
    }
  }

  public async saveScreenshot(screenshotId: string, path: string, preview: string): Promise<boolean> {
    try {
      if (!this.isConnected) await this.connect();
      if (!this.isConnected) return false;

      const screenshot = new Screenshot({
        screenshotId,
        userId: this.userId,
        path,
        preview
      });

      await screenshot.save();
      return true;
    } catch (error) {
      console.error('Error saving screenshot:', error);
      return false;
    }
  }

  public async getScreenshots(): Promise<IScreenshot[]> {
    try {
      if (!this.isConnected) await this.connect();
      if (!this.isConnected) return [];

      const screenshots = await Screenshot.find({ userId: this.userId })
        .sort({ createdAt: -1 });
      
      return screenshots;
    } catch (error) {
      console.error('Error getting screenshots:', error);
      return [];
    }
  }

  public async deleteScreenshot(screenshotId: string): Promise<boolean> {
    try {
      if (!this.isConnected) await this.connect();
      if (!this.isConnected) return false;

      await Screenshot.deleteOne({ screenshotId, userId: this.userId });
      return true;
    } catch (error) {
      console.error('Error deleting screenshot:', error);
      return false;
    }
  }

  public async deleteSolution(solutionId: string): Promise<boolean> {
    try {
      if (!this.isConnected) await this.connect();
      if (!this.isConnected) return false;

      await Solution.deleteOne({ _id: solutionId, userId: this.userId });
      return true;
    } catch (error) {
      console.error('Error deleting solution:', error);
      return false;
    }
  }

  public isConnectedToDatabase(): boolean {
    return this.isConnected;
  }
}

// Create singleton instance
export const dbService = new DatabaseService();