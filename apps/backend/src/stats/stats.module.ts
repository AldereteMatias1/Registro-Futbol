import { Module } from '@nestjs/common';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { DbModule } from '../db/db.module';
import { StatsSqlRepository } from '../repositories/sql/stats.sql.repository';

@Module({
  imports: [DbModule],
  controllers: [StatsController],
  providers: [StatsService, StatsSqlRepository],
})
export class StatsModule {}
