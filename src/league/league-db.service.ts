import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Competition } from './entities/competition.entity';
import { Team } from './entities/team.entity';
import { Coach } from './entities/coach.entity';
import { Player } from './entities/player.entity';
import {
  CompetitionResponseDto,
  TeamResponseDto,
  PlayerResponseDto,
  CoachResponseDto,
} from './dto/res/league-response.dto';

@Injectable()
export class LeagueDbService {
  constructor(
    @InjectRepository(Competition)
    private competitionRepository: Repository<Competition>,
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
    @InjectRepository(Coach)
    private coachRepository: Repository<Coach>,
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
  ) {}

  async getCompetitionByCode(leagueCode: string): Promise<Competition | null> {
    return this.competitionRepository
      .createQueryBuilder('competition')
      .leftJoinAndSelect('competition.teams', 'team')
      .where('competition.code = :leagueCode', { leagueCode })
      .getOne();
  }

  async saveCompetition(data: CompetitionResponseDto): Promise<Competition> {
    let competition = await this.competitionRepository.findOne({
      where: { code: data.code },
    });

    if (!competition) {
      competition = this.competitionRepository.create({
        code: data.code,
        name: data.name,
        areaName: data.area.name,
        teams: [],
      });
    } else {
      competition.name = data.name;
      competition.areaName = data.area.name;
    }

    return this.competitionRepository.save(competition);
  }

  async updateCompetitionTeams(competition: Competition, teams: Team[]) {
    await this.competitionRepository
      .createQueryBuilder()
      .relation(Competition, 'teams')
      .of(competition)
      .add(teams);
  }

  async saveTeam(teamData: TeamResponseDto): Promise<Team> {
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
        competitions: [],
      });
      await this.teamRepository.save(team);
    }

    return team;
  }

  async savePlayers(players: PlayerResponseDto[], team: Team): Promise<void> {
    for (const playerData of players) {
      const player = this.playerRepository.create({
        name: playerData.name,
        position: playerData.position,
        dateOfBirth: playerData.dateOfBirth,
        nationality: playerData.nationality,
        team: team,
      });
      await this.playerRepository.save(player);
    }
  }

  async saveCoach(
    coachData: Partial<CoachResponseDto>,
    team: Team,
  ): Promise<void> {
    const coach = this.coachRepository.create({
      name: coachData.name,
      dateOfBirth: coachData.dateOfBirth,
      nationality: coachData.nationality,
      team: team,
    });
    await this.coachRepository.save(coach);
  }

  async getPlayersByTeam(teamId: number): Promise<Player[]> {
    return this.playerRepository
      .createQueryBuilder('player')
      .leftJoinAndSelect('player.team', 'team')
      .where('player.teamId = :teamId', { teamId })
      .getMany();
  }

  async getCoachesByTeam(teamId: number): Promise<Coach[]> {
    return this.coachRepository
      .createQueryBuilder('coach')
      .leftJoinAndSelect('coach.team', 'team')
      .where('coach.teamId = :teamId', { teamId })
      .getMany();
  }

  async getTeamByName(
    teamName: string,
    includePlayersOrCoaches: boolean = false,
  ): Promise<Team | null> {
    const query = this.teamRepository
      .createQueryBuilder('team')
      .where('LOWER(team.name) = LOWER(:teamName)', { teamName });

    if (includePlayersOrCoaches) {
      query
        .leftJoinAndSelect('team.players', 'players')
        .leftJoinAndSelect('team.coach', 'coach');
    }

    return query.getOne();
  }
}
