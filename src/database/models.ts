// src/database/models.ts
import mongoose, { Document, Schema } from 'mongoose';

// User model
export interface IUser extends Document {
  userId: string;
  email?: string;
  apiKey?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  userId: { type: String, required: true, unique: true },
  email: { type: String },
  apiKey: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Solution model
export interface ISolution extends Document {
  userId: string;
  problemStatement: string;
  code: string;
  language: string;
  thoughts: string[];
  timeComplexity: string;
  spaceComplexity: string;
  screenshotIds: string[];
  createdAt: Date;
  tags?: string[];
}

const SolutionSchema = new Schema<ISolution>({
  userId: { type: String, required: true },
  problemStatement: { type: String, required: true },
  code: { type: String, required: true },
  language: { type: String, required: true },
  thoughts: [{ type: String }],
  timeComplexity: { type: String },
  spaceComplexity: { type: String },
  screenshotIds: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  tags: [{ type: String }]
});

// Screenshot model
export interface IScreenshot extends Document {
  screenshotId: string;
  userId: string;
  path: string;
  preview: string;
  createdAt: Date;
}

const ScreenshotSchema = new Schema<IScreenshot>({
  screenshotId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  path: { type: String, required: true },
  preview: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Initialize models
export const User = mongoose.model<IUser>('User', UserSchema);
export const Solution = mongoose.model<ISolution>('Solution', SolutionSchema);
export const Screenshot = mongoose.model<IScreenshot>('Screenshot', ScreenshotSchema);