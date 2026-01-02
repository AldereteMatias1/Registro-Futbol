import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PartidosService } from './partidos.service';
import { CreatePartidoDto } from './dto/create-partido.dto';
import { UpdatePartidoDto } from './dto/update-partido.dto';

@ApiTags('Partidos')
@Controller('partidos')
export class PartidosController {
  constructor(private readonly partidosService: PartidosService) {}

  @Get()
  findAll(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('page') page?: string,
    @Query('size') size?: string,
  ) {
    return this.partidosService.findAll({
      from,
      to,
      page: page ? Number(page) : undefined,
      size: size ? Number(size) : undefined,
    });
  }

  @Post()
  create(@Body() dto: CreatePartidoDto) {
    return this.partidosService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePartidoDto) {
    return this.partidosService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.partidosService.remove(id);
  }
}
