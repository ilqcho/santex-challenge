import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { Competition } from 'src/competition/entities/competition.entity';

@ObjectType()
@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column()
  @Field()
  name: string;

  @Column({ unique: true })
  @Field()
  tla: string;

  @Column()
  @Field()
  shortName: string;

  @Column()
  @Field()
  areaName: string;

  @Column()
  @Field()
  address: string;

  @ManyToMany(() => Competition, (competition) => competition.teams)
  @JoinTable()
  @Field(() => [Competition], { nullable: true })
  competitions: Competition[];
}
