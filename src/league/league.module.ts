import { Module } from '@nestjs/common';
import { LeagueService } from './league.service';
import { LeagueResolver } from './league.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Competition } from './entities/competition.entity';
import { Team } from './entities/team.entity';
import { Coach } from './entities/coach.entity';
import { Player } from './entities/player.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Competition, Team, Coach, Player])],
  providers: [LeagueService, LeagueResolver],
})
export class LeagueModule {}
