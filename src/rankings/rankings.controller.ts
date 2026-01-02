import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RankingsService } from './rankings.service';

@ApiTags('Rankings')
@Controller('rankings')
export class RankingsController {
  constructor(private readonly rankingsService: RankingsService) {}

  @Get('goleadores')
  goleadores(@Query('from') from?: string, @Query('to') to?: string) {
    return this.rankingsService.goleadores(from, to);
  }

  @Get('asistencia/mensual')
  asistenciaMensual(@Query('year') year?: string, @Query('month') month?: string) {
    return this.rankingsService.asistenciaMensual(Number(year), Number(month));
  }

  @Get('asistencia/anual')
  asistenciaAnual(@Query('year') year?: string) {
    return this.rankingsService.asistenciaAnual(Number(year));
  }

  @Get('ganadores')
  ganadores(@Query('from') from?: string, @Query('to') to?: string) {
    return this.rankingsService.ganadores(from, to);
  }
}
