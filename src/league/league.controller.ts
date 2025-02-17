import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { LeagueService } from './league.service';
import { ImportLeagueInput } from './dto/req/league-request.dto';
import { Competition } from './entities/competition.entity';

@Resolver(() => Competition)
export class LeagueResolver {
  constructor(private readonly leagueService: LeagueService) {}

  @Mutation(() => Competition)
  async importLeague(
    @Args('input') input: ImportLeagueInput,
  ): Promise<Competition> {
    return this.leagueService.importLeague(input);
  }

  @Query(() => Competition)
  async getCompetition(
    @Args('leagueCode') leagueCode: string,
  ): Promise<Competition> {
    return this.leagueService.getCompetition(leagueCode);
  }
}
