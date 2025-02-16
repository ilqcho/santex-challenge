import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ImportInput {
  @Field()
  leagueCode: string;
}
