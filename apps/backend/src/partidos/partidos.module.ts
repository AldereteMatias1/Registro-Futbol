import { Module } from '@nestjs/common';
import { PartidosController } from './partidos.controller';
import { PartidosService } from './partidos.service';
import { DbModule } from '../db/db.module';
import { PartidosSqlRepository } from '../repositories/sql/partidos.sql.repository';

@Module({
  imports: [DbModule],
  controllers: [PartidosController],
  providers: [PartidosService, PartidosSqlRepository],
})
export class PartidosModule {}
