import { Field, ObjectType } from '@nestjs/graphql';
import { CompetitionDTO } from 'src/competition/dto/competition.dto';

@ObjectType()
export class TeamDTO {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  tla: string;

  @Field()
  shortName: string;

  @Field()
  areaName: string;

  @Field()
  address: string;

  @Field(() => [CompetitionDTO], { nullable: true })
  competitions: CompetitionDTO[];
}
