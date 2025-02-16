import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CompetitionDTO {
  @Field()
  id: number;

  @Field()
  code: string;

  @Field()
  name: string;

  @Field()
  areaName: string;
}

@InputType()
export class ImportLeagueInput {
  @Field()
  leagueCode: string;
}
