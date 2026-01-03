import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PartidosSqlRepository } from '../repositories/sql/partidos.sql.repository';
import { CreatePartidoDto } from './dto/create-partido.dto';
import { UpdatePartidoDto } from './dto/update-partido.dto';
import { buildPagination } from '../common/pagination/pagination';

@Injectable()
export class PartidosService {
  constructor(private readonly partidosRepository: PartidosSqlRepository) {}

  async findAll(params: { from?: string; to?: string; page?: number; size?: number }) {
    const { skip, take } = buildPagination(params.page, params.size);
    const from = params.from ? new Date(params.from) : undefined;
    const to = params.to ? new Date(params.to) : undefined;

    return this.partidosRepository.findAll({ from, to, skip, take });
  }

  async create(dto: CreatePartidoDto) {
    return this.partidosRepository.create(new Date(dto.fecha), dto.cancha, dto.notas);
  }

  async update(id: string, dto: UpdatePartidoDto) {
    const partido = await this.partidosRepository.update(
      id,
      dto.fecha ? new Date(dto.fecha) : undefined,
      dto.cancha,
      dto.notas,
    );
    if (!partido) {
      throw new NotFoundException('Partido no encontrado');
    }
    return partido;
  }

  async remove(id: string) {
    const exists = await this.ensureExists(id);
    const relations = await this.partidosRepository.findRelations(id);

    if (relations && (relations.participaciones || relations.goles || relations.resultado)) {
      throw new BadRequestException(
        'No se puede eliminar partido con participaciones, goles o resultado',
      );
    }

    await this.partidosRepository.remove(exists.id);
    return { ok: true };
  }

  private async ensureExists(id: string) {
    const partido = await this.partidosRepository.findById(id);
    if (!partido) {
      throw new NotFoundException('Partido no encontrado');
    }
    return partido;
  }
}
