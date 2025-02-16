import { Module } from '@nestjs/common';
import { CompetitionController } from './competition.controller';
import { CompetitionService } from './competition.service';
import { Competition } from './entities/competition.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Competition])],
  providers: [CompetitionController, CompetitionService],
})
export class CompetitionModule {}
