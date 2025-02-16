import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Competition {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column()
  areaName: string;
}
