import { Injectable, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiService {
  constructor(private readonly configService: ConfigService) {}

  async fetchFromApi<T>(endpoint: string): Promise<T> {
    const apiToken = this.configService.get<string>('FOOTBALL_API_TOKEN');

    if (!apiToken) {
      throw new Error('FOOTBALL_API_TOKEN is not defined');
    }

    const response = await fetch(
      `https://api.football-data.org/v4/${endpoint}`,
      {
        headers: { 'X-Auth-Token': apiToken },
      },
    );

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new HttpException(
        errorResponse.message || 'API request failed',
        response.status,
      );
    }

    return response.json() as Promise<T>;
  }
}
