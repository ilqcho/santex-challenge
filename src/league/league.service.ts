// league/league.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Competition } from './entities/competition.entity';
import { Team } from './entities/team.entity';
import { Coach } from './entities/coach.entity';
import { Player } from './entities/player.entity';
import { ImportLeagueInput } from './dto/req/league-request.dto';
import {
  CompetitionResponseDto,
  CoachResponseDto,
  TeamResponseDto,
  PlayerResponseDto,
  ApiResponseErrorDto,
} from './dto/res/league-response.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LeagueService {
  constructor(
    @InjectRepository(Competition)
    private competitionRepository: Repository<Competition>,
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
    @InjectRepository(Coach)
    private coachRepository: Repository<Coach>,
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
    private readonly configService: ConfigService,
  ) {}

  async importLeague(input: ImportLeagueInput): Promise<Competition> {
    const { leagueCode } = input;
    const apiToken = this.configService.get<string>('FOOTBALL_API_TOKEN');

    if (!apiToken) {
      throw new Error('FOOTBALL_API_TOKEN is not defined');
    }

    // Hacer la solicitud a la API para obtener la competición
    const competitionResponse = await fetch(
      `https://api.football-data.org/v4/competitions/${leagueCode}`,
      {
        headers: new Headers({
          'X-Auth-Token': apiToken,
        }),
      },
    );

    const competitionData = (await competitionResponse.json()) as
      | CompetitionResponseDto
      | ApiResponseErrorDto;

    if (
      'message' in competitionData &&
      competitionData.message &&
      competitionData.errorCode === 403
    ) {
      throw new Error(
        'You do not have permission to access this resource. Please check your API key.',
      );
    }

    const typedCompetitionData = competitionData as CompetitionResponseDto;

    // Crear o obtener la competición
    let competition = await this.competitionRepository.findOne({
      where: { code: typedCompetitionData.code },
    });

    if (!competition) {
      competition = this.competitionRepository.create({
        code: typedCompetitionData.code,
        name: typedCompetitionData.name,
        areaName: typedCompetitionData.area.name,
      });
      await this.competitionRepository.save(competition);
    } else {
      // Si la competición ya existe, actualizamos los valores.
      competition.name = typedCompetitionData.name;
      competition.areaName = typedCompetitionData.area.name;
      await this.competitionRepository.save(competition); // Guarda la competencia con los nuevos valores.
    }

    // Obtener los equipos de la competición
    const teamsResponse = await fetch(
      `https://api.football-data.org/v4/competitions/${leagueCode}/teams`,
      {
        headers: new Headers({
          'X-Auth-Token': apiToken,
        }),
      },
    );

    const teamsData = (await teamsResponse.json()) as {
      teams: TeamResponseDto[];
    };

    for (const teamData of teamsData.teams) {
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

        // Verificar si hay jugadores o solo entrenador
        if (teamData.squad && teamData.squad.length > 0) {
          for (const playerData of teamData.squad) {
            const player: PlayerResponseDto = playerData;
            const playerEntity = this.playerRepository.create({
              name: player.name,
              position: player.position,
              dateOfBirth: player.dateOfBirth,
              nationality: player.nationality,
              team: team,
            });
            await this.playerRepository.save(playerEntity);
          }
        } else if (teamData.coach) {
          // Comprobar si el entrenador está definido
          const coachData: Partial<CoachResponseDto> = teamData.coach;
          const coach = this.coachRepository.create({
            name: coachData.name,
            dateOfBirth: coachData.dateOfBirth,
            nationality: coachData.nationality,
            team: team,
          });
          await this.coachRepository.save(coach);
        }
      }

      if (!competition.teams) {
        competition.teams = [];
      }
      // Relacionar el equipo con la competición
      if (
        !competition.teams.some((existingTeam) => existingTeam.id === team.id)
      ) {
        competition.teams.push(team);
      }
    }

    await this.competitionRepository.save(competition);

    return competition;
  }

  async getCompetition(leagueCode: string): Promise<Competition> {
    let competition = await this.competitionRepository.findOne({
      where: { code: leagueCode },
      relations: ['teams'],
    });

    if (!competition) {
      competition = await this.importLeague({ leagueCode });
    }

    return competition;
  }
}
