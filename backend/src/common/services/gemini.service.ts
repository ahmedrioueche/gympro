// src/common/services/gemini.service.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  /**
   * Generate text from a prompt
   */
  async generateText(prompt: string): Promise<string> {
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      this.logger.error(
        `Failed to generate text: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Generate text with streaming
   */
  async *generateTextStream(prompt: string): AsyncGenerator<string> {
    try {
      const result = await this.model.generateContentStream(prompt);
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        yield chunkText;
      }
    } catch (error) {
      this.logger.error(`Failed to stream text: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Chat conversation
   */
  async chat(messages: { role: string; parts: string }[]): Promise<string> {
    try {
      const chat = this.model.startChat({
        history: messages.slice(0, -1).map((msg) => ({
          role: msg.role,
          parts: [{ text: msg.parts }],
        })),
      });

      const lastMessage = messages[messages.length - 1];
      const result = await chat.sendMessage(lastMessage.parts);
      const response = await result.response;
      return response.text();
    } catch (error) {
      this.logger.error(`Failed to chat: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Generate text with vision (image + text)
   */
  async generateWithVision(
    prompt: string,
    imageData: { mimeType: string; data: string },
  ): Promise<string> {
    try {
      const visionModel = this.genAI.getGenerativeModel({
        model: 'gemini-pro-vision',
      });
      const result = await visionModel.generateContent([
        prompt,
        {
          inlineData: imageData,
        },
      ]);
      const response = await result.response;
      return response.text();
    } catch (error) {
      this.logger.error(
        `Failed to generate with vision: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Count tokens in a prompt
   */
  async countTokens(prompt: string): Promise<number> {
    try {
      const result = await this.model.countTokens(prompt);
      return result.totalTokens;
    } catch (error) {
      this.logger.error(
        `Failed to count tokens: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Generate structured output with JSON schema
   */
  async generateStructured<T>(prompt: string, schema: any): Promise<T> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-pro',
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: schema,
        },
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return JSON.parse(response.text());
    } catch (error) {
      this.logger.error(
        `Failed to generate structured output: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
