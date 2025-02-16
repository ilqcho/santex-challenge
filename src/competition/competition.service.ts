import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Competition } from './entities/competition.entity';
import { ImportLeagueInput } from './dto/competition.dto';

@Injectable()
export class CompetitionService {
  constructor(
    @InjectRepository(Competition)
    private competitionRepository: Repository<Competition>,
  ) {}

  async importLeague(input: ImportLeagueInput): Promise<Competition> {
    const { leagueCode } = input;
    const apiToken = process.env.FOOTBALL_API_TOKEN;

    if (!apiToken) {
      throw new Error('FOOTBALL_API_TOKEN is not defined');
    }

    const response = await fetch(
      `https://api.football-data.org/v4/competitions/${leagueCode}`,
      {
        headers: new Headers({
          'X-Auth-Token': apiToken,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch competition data: ${response.status} ${response.statusText}`,
      );
    }

    const data = (await response.json()) as {
      name: string;
      code: string;
      area: { name: string };
    };

    let competition = await this.competitionRepository.findOne({
      where: { code: data.code },
    });

    if (!competition) {
      competition = this.competitionRepository.create({
        name: data.name,
        code: data.code,
        areaName: data.area.name,
      });
      await this.competitionRepository.save(competition);
    }

    return competition;
  }

  async getAllCompetitions(): Promise<Competition[]> {
    return this.competitionRepository.find();
  }
}
