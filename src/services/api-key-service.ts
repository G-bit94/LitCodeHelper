// src/services/api-key-service.ts
import ElectronStore from 'electron-store';
import { dbService } from '../database/database';
import { Anthropic } from '@anthropic-ai/sdk';

interface ApiKeyStore {
  apiKey?: string;
}

// Create a secure store with encryption
const store = new ElectronStore<ApiKeyStore>({
  name: 'api-keys',
  encryptionKey: 'your-secure-encryption-key', // Replace with a secure key in production
});

export class ApiKeyService {
  private static instance: ApiKeyService;
  private apiKey: string | null = null;

  private constructor() {
    // Initialize API key from store
    this.apiKey = store.get('apiKey') || null;
  }

  public static getInstance(): ApiKeyService {
    if (!ApiKeyService.instance) {
      ApiKeyService.instance = new ApiKeyService();
    }
    return ApiKeyService.instance;
  }

  public async getApiKey(): Promise<string | null> {
    // Try to get from memory first
    if (this.apiKey) {
      return this.apiKey;
    }

    // Try to get from local store
    const storedKey = store.get('apiKey');
    if (storedKey) {
      this.apiKey = storedKey;
      return storedKey;
    }

    // Try to get from database
    try {
      const dbKey = await dbService.getApiKey();
      if (dbKey) {
        this.apiKey = dbKey;
        store.set('apiKey', dbKey);
        return dbKey;
      }
    } catch (error) {
      console.error('Error retrieving API key from database:', error);
    }

    return null;
  }

  public async saveApiKey(apiKey: string): Promise<boolean> {
    try {
      // Validate the API key before saving
      const isValid = await this.validateApiKey(apiKey);
      if (!isValid) {
        return false;
      }

      // Save to memory
      this.apiKey = apiKey;

      // Save to local store
      store.set('apiKey', apiKey);

      // Save to database if connected
      if (dbService.isConnectedToDatabase()) {
        await dbService.updateApiKey(apiKey);
      }

      return true;
    } catch (error) {
      console.error('Error saving API key:', error);
      return false;
    }
  }

  public async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      // Create a client with the API key
      const anthropic = new Anthropic({ apiKey });

      // Make a lightweight request to verify the key
      await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 10,
        messages: [
          {
            role: 'user',
            content: 'Say hello'
          }
        ],
      });

      return true;
    } catch (error) {
      console.error('API key validation failed:', error);
      return false;
    }
  }

  public clearApiKey(): void {
    this.apiKey = null;
    store.delete('apiKey');
  }
}

export const apiKeyService = ApiKeyService.getInstance();