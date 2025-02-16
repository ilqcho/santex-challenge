import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './entities/team.entity';
import { ImportInput } from 'src/common/dto/import-input.dto';
import { Competition } from 'src/competition/entities/competition.entity';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,

    @InjectRepository(Competition)
    private competitionRepository: Repository<Competition>,
  ) {}

  async importTeams(input: ImportInput): Promise<Team[]> {
    const { leagueCode } = input;
    const apiToken = process.env.FOOTBALL_API_TOKEN;

    if (!apiToken) {
      throw new Error('FOOTBALL_API_TOKEN is not defined');
    }

    const response = await fetch(
      `https://api.football-data.org/v4/competitions/${leagueCode}/teams`,
      {
        headers: new Headers({
          'X-Auth-Token': apiToken,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch teams: ${response.status} ${response.statusText}`,
      );
    }

    const data = (await response.json()) as {
      teams: {
        name: string;
        tla: string;
        shortName: string;
        area: { name: string };
        address: string;
      }[];
    };

    const competition = await this.competitionRepository.findOne({
      where: { code: leagueCode },
    });

    if (!competition) {
      throw new Error(
        `Competition with code ${leagueCode} not found in the database`,
      );
    }

    const teams: Team[] = [];

    for (const teamData of data.teams) {
      let team = await this.teamRepository.findOne({
        where: { tla: teamData.tla },
      });

      if (!team) {
        team = this.teamRepository.create({
          name: teamData.name,
          tla: teamData.tla,
          shortName: teamData.shortName,
          areaName: teamData.area.name,
          address: teamData.address,
        });
        await this.teamRepository.save(team);
      }

      await this.teamRepository
        .createQueryBuilder()
        .relation(Team, 'competitions')
        .of(team)
        .add(competition);

      teams.push(team);
    }

    return teams;
  }

  async getTeams(): Promise<Team[]> {
    return this.teamRepository.find({ relations: ['competitions'] });
  }

  async getTeamByName(name: string): Promise<Team | null> {
    return this.teamRepository.findOne({
      where: { name },
      relations: ['competitions'],
    });
  }
}
