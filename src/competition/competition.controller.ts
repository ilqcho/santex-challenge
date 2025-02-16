import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { CompetitionService } from './competition.service';
import { CompetitionDTO, ImportLeagueInput } from './dto/competition.dto';

@Resolver(() => CompetitionDTO)
export class CompetitionController {
  constructor(private readonly competitionService: CompetitionService) {}

  @Mutation(() => CompetitionDTO)
  importLeague(@Args('input') input: ImportLeagueInput) {
    return this.competitionService.importLeague(input);
  }

  @Query(() => [CompetitionDTO])
  getAllCompetitions() {
    return this.competitionService.getAllCompetitions();
  }
}
