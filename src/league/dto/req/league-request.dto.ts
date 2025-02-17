import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class ImportLeagueInput {
  @Field()
  @IsString()
  leagueCode: string;
}
