import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TeamService } from './team.service';
import { TeamDTO } from './dto/team.dto';
import { ImportInput } from 'src/common/dto/import-input.dto';

@Resolver(() => TeamDTO)
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Mutation(() => [TeamDTO])
  importTeams(@Args('input') input: ImportInput) {
    return this.teamService.importTeams(input);
  }

  @Query(() => [TeamDTO])
  getTeams() {
    return this.teamService.getTeams();
  }

  @Query(() => TeamDTO, { nullable: true })
  getTeamByName(@Args('name') name: string) {
    return this.teamService.getTeamByName(name);
  }
}
