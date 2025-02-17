// league/league.service.ts
import { Injectable } from '@nestjs/common';
import { Competition } from './entities/competition.entity';
import { ImportLeagueInput } from './dto/req/league-request.dto';
import {
  CompetitionResponseDto,
  TeamResponseDto,
} from './dto/res/league-response.dto';
import { ApiService } from 'src/api/api.service';
import { LeagueDbService } from './league-db.service';

@Injectable()
export class LeagueService {
  constructor(
    private readonly leagueDbService: LeagueDbService,
    private readonly apiService: ApiService,
  ) {}

  async importLeague(input: ImportLeagueInput): Promise<Competition> {
    const { leagueCode } = input;

    let competition =
      await this.leagueDbService.getCompetitionByCode(leagueCode);
    if (competition) {
      throw new Error(`Competition with code ${leagueCode} already exists`);
    }

    const competitionData =
      await this.apiService.fetchFromApi<CompetitionResponseDto>(
        `competitions/${leagueCode}`,
      );

    competition = await this.leagueDbService.saveCompetition(competitionData);

    const teamsData = await this.apiService.fetchFromApi<{
      teams: TeamResponseDto[];
    }>(`competitions/${leagueCode}/teams`);

    await this.processTeams(teamsData.teams, competition);

    return competition;
  }

  private async processTeams(
    teams: TeamResponseDto[],
    competition: Competition,
  ): Promise<void> {
    for (const teamData of teams) {
      const team = await this.leagueDbService.saveTeam(teamData);

      if (teamData.squad && teamData.squad.length > 0) {
        await this.leagueDbService.savePlayers(teamData.squad, team);
      } else if (teamData.coach) {
        await this.leagueDbService.saveCoach(teamData.coach, team);
      }

      if (!competition.teams) {
        competition.teams = [];
      }

      if (
        !competition.teams.some((existingTeam) => existingTeam.id === team.id)
      ) {
        competition.teams.push(team);
      }
    }
  }

  async getCompetition(): Promise<Competition[]> {
    return await this.leagueDbService.getCompetitions();
  }
}
