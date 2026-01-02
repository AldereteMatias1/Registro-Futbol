import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StatsService } from './stats.service';

@ApiTags('Estadisticas')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('jugadores')
  getStats(@Query('from') from?: string, @Query('to') to?: string) {
    return this.statsService.getStats(from, to);
  }
}
