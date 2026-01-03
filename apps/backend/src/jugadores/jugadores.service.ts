import { Injectable, NotFoundException } from '@nestjs/common';
import { JugadoresSqlRepository } from '../repositories/sql/jugadores.sql.repository';
import { CreateJugadorDto } from './dto/create-jugador.dto';
import { UpdateJugadorDto } from './dto/update-jugador.dto';
import { buildPagination } from '../common/pagination/pagination';

@Injectable()
export class JugadoresService {
  constructor(private readonly jugadoresRepository: JugadoresSqlRepository) {}

  async findAll(params: { activo?: boolean; q?: string; page?: number; size?: number }) {
    const { skip, take } = buildPagination(params.page, params.size);
    return this.jugadoresRepository.findAll({
      activo: params.activo,
      q: params.q,
      skip,
      take,
    });
  }

  async create(dto: CreateJugadorDto) {
    return this.jugadoresRepository.create(dto.apellidoNombre, dto.activo ?? true);
  }

  async update(id: string, dto: UpdateJugadorDto) {
    const jugador = await this.jugadoresRepository.update(id, dto.apellidoNombre, dto.activo);
    if (!jugador) {
      throw new NotFoundException('Jugador no encontrado');
    }
    return jugador;
  }

  async softDelete(id: string) {
    const jugador = await this.jugadoresRepository.update(id, undefined, false);
    if (!jugador) {
      throw new NotFoundException('Jugador no encontrado');
    }
    return { ok: true };
  }
}
