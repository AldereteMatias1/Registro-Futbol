import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GolesService } from './goles.service';
import { BulkGolDto } from './dto/bulk-gol.dto';
import { UpdateGolDto } from './dto/update-gol.dto';

@ApiTags('Goles')
@Controller()
export class GolesController {
  constructor(private readonly golesService: GolesService) {}

  @Get('partidos/:partidoId/goles')
  findByPartido(@Param('partidoId') partidoId: string) {
    return this.golesService.findByPartido(partidoId);
  }

  @Post('partidos/:partidoId/goles/bulk')
  bulkUpsert(@Param('partidoId') partidoId: string, @Body() dto: BulkGolDto) {
    return this.golesService.bulkUpsert(partidoId, dto);
  }

  @Patch('goles/:id')
  update(@Param('id') id: string, @Body() dto: UpdateGolDto) {
    return this.golesService.update(id, dto);
  }

  @Delete('goles/:id')
  remove(@Param('id') id: string) {
    return this.golesService.remove(id);
  }
}
