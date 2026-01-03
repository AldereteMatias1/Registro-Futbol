import { Module } from '@nestjs/common';
import { GolesController } from './goles.controller';
import { GolesService } from './goles.service';
import { DbModule } from '../db/db.module';
import { GolesSqlRepository } from '../repositories/sql/goles.sql.repository';

@Module({
  imports: [DbModule],
  controllers: [GolesController],
  providers: [GolesService, GolesSqlRepository],
})
export class GolesModule {}
