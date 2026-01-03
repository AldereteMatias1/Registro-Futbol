import { Module } from '@nestjs/common';
import { ResultadosController } from './resultados.controller';
import { ResultadosService } from './resultados.service';
import { DbModule } from '../db/db.module';
import { ResultadosSqlRepository } from '../repositories/sql/resultados.sql.repository';

@Module({
  imports: [DbModule],
  controllers: [ResultadosController],
  providers: [ResultadosService, ResultadosSqlRepository],
})
export class ResultadosModule {}
