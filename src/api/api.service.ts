import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RateLimiterMemory } from 'rate-limiter-flexible';

@Injectable()
export class ApiService {
  private rateLimiter: RateLimiterMemory;

  constructor(private readonly configService: ConfigService) {
    this.rateLimiter = new RateLimiterMemory({
      points: 10, // 10 requests
      duration: 60, // per minute
    });
  }

  async fetchFromApi<T>(endpoint: string): Promise<T> {
    const apiToken = this.configService.get<string>('FOOTBALL_API_TOKEN');

    if (!apiToken) {
      throw new Error('FOOTBALL_API_TOKEN is not defined');
    }

    try {
      await this.rateLimiter.consume('football-api');

      const response = await fetch(
        `https://api.football-data.org/v4/${endpoint}`,
        {
          headers: { 'X-Auth-Token': apiToken },
        },
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'API request failed');
      }

      return response.json() as Promise<T>;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }

      throw new Error(
        'Rate limit exceeded, please wait before making more requests.',
      );
    }
  }
}
