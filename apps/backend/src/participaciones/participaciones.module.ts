import { Module } from '@nestjs/common';
import { ParticipacionesController } from './participaciones.controller';
import { ParticipacionesService } from './participaciones.service';
import { DbModule } from '../db/db.module';
import { ParticipacionesSqlRepository } from '../repositories/sql/participaciones.sql.repository';

@Module({
  imports: [DbModule],
  controllers: [ParticipacionesController],
  providers: [ParticipacionesService, ParticipacionesSqlRepository],
})
export class ParticipacionesModule {}
