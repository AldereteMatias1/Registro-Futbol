import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { GolesSqlRepository } from '../repositories/sql/goles.sql.repository';
import { BulkGolDto } from './dto/bulk-gol.dto';
import { UpdateGolDto } from './dto/update-gol.dto';
import { EstadoParticipacion } from '../participaciones/dto/bulk-participacion.dto';

@Injectable()
export class GolesService {
  constructor(private readonly golesRepository: GolesSqlRepository) {}

  async findByPartido(partidoId: string) {
    return this.golesRepository.findByPartido(partidoId);
  }

  async bulkUpsert(partidoId: string, dto: BulkGolDto) {
    await this.ensureJugadoresJugaron(partidoId, dto.items.map((item) => item.jugadorId));

    const count = await this.golesRepository.bulkUpsert(partidoId, dto.items);
    return { ok: true, count };
  }

  async update(id: string, dto: UpdateGolDto) {
    const gol = await this.ensureExists(id);
    await this.ensureJugadoresJugaron(gol.partidoId, [gol.jugadorId]);
    return this.golesRepository.update(id, dto.goles);
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.golesRepository.remove(id);
    return { ok: true };
  }

  private async ensureJugadoresJugaron(partidoId: string, jugadorIds: string[]) {
    const participaciones = await this.golesRepository.findJugadoresQueJugaron(
      partidoId,
      jugadorIds,
    );

    const jugadoresConJuego = new Set(participaciones.map((p) => p.jugadorId));
    const faltantes = jugadorIds.filter((id) => !jugadoresConJuego.has(id));
    if (faltantes.length) {
      throw new BadRequestException('No se pueden asignar goles a jugadores que no jugaron');
    }
  }

  private async ensureExists(id: string) {
    const gol = await this.golesRepository.findById(id);
    if (!gol) {
      throw new NotFoundException('Gol no encontrado');
    }
    return gol;
  }
}
