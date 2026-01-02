import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResultadosService } from './resultados.service';
import { CreateResultadoDto } from './dto/create-resultado.dto';

@ApiTags('Resultados')
@Controller('partidos/:partidoId/resultado')
export class ResultadosController {
  constructor(private readonly resultadosService: ResultadosService) {}

  @Get()
  find(@Param('partidoId') partidoId: string) {
    return this.resultadosService.findByPartido(partidoId);
  }

  @Put()
  upsert(@Param('partidoId') partidoId: string, @Body() dto: CreateResultadoDto) {
    return this.resultadosService.upsert(partidoId, dto);
  }

  @Delete()
  remove(@Param('partidoId') partidoId: string) {
    return this.resultadosService.remove(partidoId);
  }
}
