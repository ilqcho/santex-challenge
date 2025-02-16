import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { CompetitionService } from './competition.service';
import { CompetitionDTO } from './dto/competition.dto';
import { ImportInput } from 'src/common/dto/import-input.dto';

@Resolver(() => CompetitionDTO)
export class CompetitionController {
  constructor(private readonly competitionService: CompetitionService) {}

  @Mutation(() => CompetitionDTO)
  importLeague(@Args('input') input: ImportInput) {
    return this.competitionService.importLeague(input);
  }

  @Query(() => [CompetitionDTO])
  getCompetitions() {
    return this.competitionService.getCompetitions();
  }
}
