import { Module } from '@nestjs/common';
import { LeagueService } from './league.service';
import { LeagueDbService } from './league-db.service';
import { LeagueResolver } from './league.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Competition } from './entities/competition.entity';
import { Team } from './entities/team.entity';
import { Coach } from './entities/coach.entity';
import { Player } from './entities/player.entity';
import { ApiModule } from 'src/api/api.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Competition, Team, Coach, Player]),
    ApiModule,
  ],
  providers: [LeagueService, LeagueResolver, LeagueDbService],
  exports: [LeagueService],
})
export class LeagueModule {}
