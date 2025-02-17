import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Team } from 'src/league/entities/team.entity';

@ObjectType()
@Entity()
export class Player {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column()
  @Field()
  name: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  position: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  dateOfBirth: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  nationality: string;

  @ManyToOne(() => Team, (team) => team.players)
  @Field(() => Team)
  team: Team;
}
