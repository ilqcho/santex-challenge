import { Module } from '@nestjs/common';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { Competition } from 'src/competition/entities/competition.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Team, Competition])],
  providers: [TeamController, TeamService],
  exports: [TeamService],
})
export class TeamModule {}
