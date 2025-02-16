import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Field } from '@nestjs/graphql';
import { Team } from 'src/team/entities/team.entity';

@Entity()
export class Competition {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column({ unique: true })
  @Field()
  code: string;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  areaName: string;

  @ManyToMany(() => Team, (team) => team.competitions)
  @Field(() => [Team], { nullable: true })
  teams: Team[];
}
