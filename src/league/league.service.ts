import { Injectable } from '@nestjs/common';
import { Competition } from './entities/competition.entity';
import { ImportLeagueInput } from './dto/req/league-request.dto';
import {
  CompetitionResponseDto,
  TeamResponseDto,
} from './dto/res/league-response.dto';
import { ApiService } from 'src/api/api.service';
import { LeagueDbService } from './league-db.service';
import { Player } from './entities/player.entity';
import { Coach } from './entities/coach.entity';
import { Team } from './entities/team.entity';

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

      // If the team has a squad, save the players associated with the team
      if (teamData.squad && teamData.squad.length > 0) {
        await this.leagueDbService.savePlayers(teamData.squad, team);
      }
      // If the team does not have a squad but has a coach, save the coach data
      else if (teamData.coach) {
        await this.leagueDbService.saveCoach(teamData.coach, team);
      }

      // Check if the team is already part of the competition's teams list
      // If not, add the team to the competition
      if (
        !competition.teams.some((existingTeam) => existingTeam.id === team.id)
      ) {
        competition.teams.push(team);
      }
    }

    // Update the competition with the newly added teams
    await this.leagueDbService.updateCompetitionTeams(
      competition,
      competition.teams,
    );
  }

  async getPlayersOrCoaches(
    leagueCode: string,
    teamName?: string,
    onlyPlayers: boolean = false,
  ): Promise<(Player | Coach)[]> {
    const competition =
      await this.leagueDbService.getCompetitionByCode(leagueCode);

    if (!competition) {
      throw new Error('League not found');
    }

    const teams = competition.teams;
    const playersOrCoaches: (Player | Coach)[] = [];
    let hasPlayers = false;

    for (const team of teams) {
      // Skip teams that do not match the teamName filter (if provided)
      if (teamName && team.name !== teamName) {
        continue;
      }

      const players = await this.leagueDbService.getPlayersByTeam(team.id);
      if (players.length > 0) {
        playersOrCoaches.push(...players);
        hasPlayers = true;
      }
    }

    if (!hasPlayers) {
      for (const team of teams) {
        if (teamName && team.name !== teamName) {
          continue;
        }

        const coaches = await this.leagueDbService.getCoachesByTeam(team.id);
        playersOrCoaches.push(...coaches);
      }
    }

    return onlyPlayers
      ? playersOrCoaches.filter((p) => p instanceof Player)
      : playersOrCoaches;
  }

  async getTeamWithDetails(teamName: string): Promise<Team | null> {
    const team = await this.leagueDbService.getTeamByName(teamName, true);

    if (!team) {
      throw new Error(`Team with name "${teamName}" not found`);
    }

    if (team.players?.length === 0 && team.coach) {
      team.players = [team.coach as unknown as Player];
    }
    return team;
  }
}
