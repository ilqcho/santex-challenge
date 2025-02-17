import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Team } from 'src/league/entities/team.entity';

@ObjectType()
@Entity()
export class Coach {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  name: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  dateOfBirth: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  nationality: string;

  @ManyToOne(() => Team, (team) => team.coach, { nullable: true })
  @Field(() => Team, { nullable: true })
  team: Team;
}
