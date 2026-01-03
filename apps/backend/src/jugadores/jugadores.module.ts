import { Module } from '@nestjs/common';
import { JugadoresController } from './jugadores.controller';
import { JugadoresService } from './jugadores.service';
import { DbModule } from '../db/db.module';
import { JugadoresSqlRepository } from '../repositories/sql/jugadores.sql.repository';

@Module({
  imports: [DbModule],
  controllers: [JugadoresController],
  providers: [JugadoresService, JugadoresSqlRepository],
})
export class JugadoresModule {}
