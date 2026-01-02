import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ParticipacionesService } from './participaciones.service';
import { BulkParticipacionDto } from './dto/bulk-participacion.dto';
import { UpdateParticipacionDto } from './dto/update-participacion.dto';

@ApiTags('Participaciones')
@Controller()
export class ParticipacionesController {
  constructor(private readonly participacionesService: ParticipacionesService) {}

  @Get('partidos/:partidoId/participaciones')
  findByPartido(@Param('partidoId') partidoId: string) {
    return this.participacionesService.findByPartido(partidoId);
  }

  @Post('partidos/:partidoId/participaciones/bulk')
  bulkUpsert(@Param('partidoId') partidoId: string, @Body() dto: BulkParticipacionDto) {
    return this.participacionesService.bulkUpsert(partidoId, dto);
  }

  @Patch('participaciones/:id')
  update(@Param('id') id: string, @Body() dto: UpdateParticipacionDto) {
    return this.participacionesService.update(id, dto);
  }

  @Delete('participaciones/:id')
  remove(@Param('id') id: string) {
    return this.participacionesService.remove(id);
  }
}
