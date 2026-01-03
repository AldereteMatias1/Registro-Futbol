import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ParticipacionesSqlRepository } from '../repositories/sql/participaciones.sql.repository';
import { BulkParticipacionDto, EstadoParticipacion } from './dto/bulk-participacion.dto';
import { UpdateParticipacionDto } from './dto/update-participacion.dto';

@Injectable()
export class ParticipacionesService {
  constructor(private readonly participacionesRepository: ParticipacionesSqlRepository) {}

  async findByPartido(partidoId: string) {
    return this.participacionesRepository.findByPartido(partidoId);
  }

  async bulkUpsert(partidoId: string, dto: BulkParticipacionDto) {
    for (const item of dto.items) {
      if (item.estado === EstadoParticipacion.JUGO && !item.equipo) {
        throw new BadRequestException('Equipo requerido si estado es JUGO');
      }
    }

    const count = await this.participacionesRepository.bulkUpsert(partidoId, dto.items);
    return { ok: true, count };
  }

async update(id: string, dto: UpdateParticipacionDto) {
  if (dto.estado === EstadoParticipacion.JUGO && !dto.equipo) {
    throw new BadRequestException('Equipo requerido si estado es JUGO');
  }

  await this.ensureExists(id);

  return this.participacionesRepository.update(
    id,
    dto.equipo ?? null,
    dto.estado ?? null,
    dto.motivoBaja ?? null,
    dto.comentarios ?? null,
  );
}


  async remove(id: string) {
    await this.ensureExists(id);
    await this.participacionesRepository.remove(id);
    return { ok: true };
  }

  private async ensureExists(id: string) {
    const participacion = await this.participacionesRepository.findById(id);
    if (!participacion) {
      throw new NotFoundException('Participacion no encontrada');
    }
    return participacion;
  }
}
