import { Module } from '@nestjs/common';
import { ResultadosController } from './resultados.controller';
import { ResultadosService } from './resultados.service';

@Module({
  controllers: [ResultadosController],
  providers: [ResultadosService],
})
export class ResultadosModule {}
