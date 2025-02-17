import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { Competition } from 'src/league/entities/competition.entity';
import { Coach } from 'src/league/entities/coach.entity';
import { Player } from 'src/league/entities/player.entity';

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

  @OneToMany(() => Coach, (coach) => coach.team, {
    cascade: true,
  })
  @Field(() => Coach, { nullable: true })
  coach: Coach;

  @OneToMany(() => Player, (player) => player.team, {
    cascade: true,
  })
  @Field(() => Player, { nullable: true })
  player: Player;
}
