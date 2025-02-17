import { Field, ObjectType } from '@nestjs/graphql';
import {
  IsString,
  IsOptional,
  IsDateString,
  IsArray,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

@ObjectType()
export class AreaResponseDto {
  @Field()
  @IsString()
  name: string;
}

@ObjectType()
export class CompetitionResponseDto {
  @Field()
  @IsString()
  code: string;

  @Field()
  @IsString()
  name: string;

  @Field(() => AreaResponseDto)
  @ValidateNested()
  @Type(() => AreaResponseDto)
  area: AreaResponseDto;
}

@ObjectType()
export class CoachResponseDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  nationality?: string;
}

@ObjectType()
export class PlayerResponseDto {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  position: string;

  @Field()
  @IsDateString()
  dateOfBirth: string;

  @Field()
  @IsString()
  nationality: string;
}

@ObjectType()
export class TeamResponseDto {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  tla: string;

  @Field()
  @IsString()
  shortName: string;

  @Field(() => AreaResponseDto)
  @ValidateNested()
  @Type(() => AreaResponseDto)
  area: { name: string };

  @Field()
  @IsString()
  address: string;

  @Field(() => [PlayerResponseDto], { nullable: 'items' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlayerResponseDto)
  squad: PlayerResponseDto[];

  @Field(() => CoachResponseDto, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => CoachResponseDto)
  coach?: CoachResponseDto;
}

@ObjectType()
export class ApiResponseErrorDto {
  @Field()
  @IsString()
  message: string;

  @Field()
  @IsNumber()
  errorCode: number;
}
