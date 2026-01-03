import { Module } from '@nestjs/common';
import { RankingsController } from './rankings.controller';
import { RankingsService } from './rankings.service';
import { DbModule } from '../db/db.module';
import { RankingsSqlRepository } from '../repositories/sql/rankings.sql.repository';

@Module({
  imports: [DbModule],
  controllers: [RankingsController],
  providers: [RankingsService, RankingsSqlRepository],
})
export class RankingsModule {}
