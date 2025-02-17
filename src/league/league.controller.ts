import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { LeagueService } from './league.service';
import { ImportLeagueInput } from './dto/req/league-request.dto';
import { Competition } from './entities/competition.entity';
import { Player } from './entities/player.entity';
import { Coach } from './entities/coach.entity';
import { Team } from './entities/team.entity';

@Resolver(() => Competition)
export class LeagueResolver {
  constructor(private readonly leagueService: LeagueService) {}

  @Mutation(() => Competition)
  async importLeague(
    @Args('input') input: ImportLeagueInput,
  ): Promise<Competition> {
    return await this.leagueService.importLeague(input);
  }

  @Query(() => [Player], { nullable: 'items' })
  async getPlayers(
    @Args('leagueCode') leagueCode: string,
    @Args('teamName', { type: () => String, nullable: true }) teamName?: string,
  ): Promise<(Player | Coach)[]> {
    try {
      const playersOrCoaches = await this.leagueService.getPlayersOrCoaches(
        leagueCode,
        teamName,
        true,
      );

      if (playersOrCoaches.length === 0) {
        return await this.leagueService.getPlayersOrCoaches(
          leagueCode,
          teamName,
          false,
        );
      }

      return playersOrCoaches;
    } catch (error) {
      throw new Error(`Error fetching players: ${error.message}`);
    }
  }

  @Query(() => Team, { nullable: true })
  async getTeam(@Args('teamName') teamName: string): Promise<Team | null> {
    try {
      const team = await this.leagueService.getTeamWithDetails(teamName);
      return team;
    } catch (error) {
      throw new Error(`Error fetching team: ${error.message}`);
    }
  }
}
