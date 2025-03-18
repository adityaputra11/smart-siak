import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { PerplexityResponse } from '../interfaces/perplexity-response.interface';

@Injectable()
export class PerplexityApiService {
  private readonly logger = new Logger(PerplexityApiService.name);
  private readonly apiKey: string;
  private readonly apiUrl = 'https://api.perplexity.ai/chat/completions';

  constructor() {
    this.apiKey = process.env.PERPLEXITY_API_KEY;
    if (!this.apiKey) {
      this.logger.warn(
        'Perplexity API key is not set. AI recommendations will not work.',
      );
    }
  }

  async generateCompletion(prompt: string, model = 'r1-1776'): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Perplexity API key is not configured');
    }

    try {
      const response = await axios.post<PerplexityResponse>(
        this.apiUrl,
        {
          model,
          messages: [
            {
              role: 'system',
              content:
                'You are an AI academic advisor specialized in creating personalized study plans based on student motivation and learning preferences.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 2000,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      this.logger.error(`Error calling Perplexity API: ${error.message}`);
      if (error.response) {
        this.logger.error(
          `Response data: ${JSON.stringify(error.response.data)}`,
        );
      }
      throw new Error(`Failed to generate AI recommendation: ${error.message}`);
    }
  }
}
