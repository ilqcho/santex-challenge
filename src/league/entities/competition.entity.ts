import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { Team } from 'src/league/entities/team.entity';

@ObjectType()
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

  @ManyToMany(() => Team, (team) => team.competitions, { cascade: true })
  @Field(() => [Team], { nullable: true })
  teams: Team[];
}
