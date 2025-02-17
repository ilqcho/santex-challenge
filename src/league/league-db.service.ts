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
    return this.competitionRepository.findOne({
      where: { code: leagueCode },
      relations: ['teams'],
    });
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
      });
    } else {
      competition.name = data.name;
      competition.areaName = data.area.name;
    }

    return this.competitionRepository.save(competition);
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

  async getCompetitions(): Promise<Competition[]> {
    return this.competitionRepository.find({
      relations: ['teams'],
    });
  }
}
