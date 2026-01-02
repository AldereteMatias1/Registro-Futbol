import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BulkGolDto } from './dto/bulk-gol.dto';
import { UpdateGolDto } from './dto/update-gol.dto';
import { EstadoParticipacion } from '../participaciones/dto/bulk-participacion.dto';

@Injectable()
export class GolesService {
  constructor(private readonly prisma: PrismaService) {}

  async findByPartido(partidoId: string) {
    return this.prisma.gol.findMany({
      where: { partidoId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async bulkUpsert(partidoId: string, dto: BulkGolDto) {
    await this.ensureJugadoresJugaron(partidoId, dto.items.map((item) => item.jugadorId));

    const ops = dto.items.map((item) =>
      this.prisma.gol.upsert({
        where: {
          partidoId_jugadorId: {
            partidoId,
            jugadorId: item.jugadorId,
          },
        },
        create: {
          partidoId,
          jugadorId: item.jugadorId,
          goles: item.goles,
        },
        update: {
          goles: item.goles,
        },
      }),
    );

    await this.prisma.$transaction(ops);
    return { ok: true, count: dto.items.length };
  }

  async update(id: string, dto: UpdateGolDto) {
    const gol = await this.ensureExists(id);
    await this.ensureJugadoresJugaron(gol.partidoId, [gol.jugadorId]);
    return this.prisma.gol.update({
      where: { id },
      data: { goles: dto.goles },
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.gol.delete({ where: { id } });
    return { ok: true };
  }

  private async ensureJugadoresJugaron(partidoId: string, jugadorIds: string[]) {
    const participaciones = await this.prisma.participacion.findMany({
      where: {
        partidoId,
        jugadorId: { in: jugadorIds },
        estado: EstadoParticipacion.JUGO,
      },
      select: { jugadorId: true },
    });

    const jugadoresConJuego = new Set(participaciones.map((p) => p.jugadorId));
    const faltantes = jugadorIds.filter((id) => !jugadoresConJuego.has(id));
    if (faltantes.length) {
      throw new BadRequestException('No se pueden asignar goles a jugadores que no jugaron');
    }
  }

  private async ensureExists(id: string) {
    const gol = await this.prisma.gol.findUnique({ where: { id } });
    if (!gol) {
      throw new NotFoundException('Gol no encontrado');
    }
    return gol;
  }
}
