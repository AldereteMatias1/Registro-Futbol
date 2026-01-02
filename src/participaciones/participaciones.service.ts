import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BulkParticipacionDto, EstadoParticipacion } from './dto/bulk-participacion.dto';
import { UpdateParticipacionDto } from './dto/update-participacion.dto';

@Injectable()
export class ParticipacionesService {
  constructor(private readonly prisma: PrismaService) {}

  async findByPartido(partidoId: string) {
    return this.prisma.participacion.findMany({
      where: { partidoId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async bulkUpsert(partidoId: string, dto: BulkParticipacionDto) {
    for (const item of dto.items) {
      if (item.estado === EstadoParticipacion.JUGO && !item.equipo) {
        throw new BadRequestException('Equipo requerido si estado es JUGO');
      }
    }

    const ops = dto.items.map((item) =>
      this.prisma.participacion.upsert({
        where: {
          partidoId_jugadorId: {
            partidoId,
            jugadorId: item.jugadorId,
          },
        },
        create: {
          partidoId,
          jugadorId: item.jugadorId,
          equipo: item.equipo ?? null,
          estado: item.estado,
          motivoBaja: item.motivoBaja,
          comentarios: item.comentarios,
        },
        update: {
          equipo: item.equipo ?? null,
          estado: item.estado,
          motivoBaja: item.motivoBaja,
          comentarios: item.comentarios,
        },
      }),
    );

    await this.prisma.$transaction(ops);
    return { ok: true, count: dto.items.length };
  }

  async update(id: string, dto: UpdateParticipacionDto) {
    if (dto.estado === EstadoParticipacion.JUGO && !dto.equipo) {
      throw new BadRequestException('Equipo requerido si estado es JUGO');
    }

    await this.ensureExists(id);
    return this.prisma.participacion.update({
      where: { id },
      data: {
        equipo: dto.equipo ?? null,
        estado: dto.estado,
        motivoBaja: dto.motivoBaja,
        comentarios: dto.comentarios,
      },
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.participacion.delete({ where: { id } });
    return { ok: true };
  }

  private async ensureExists(id: string) {
    const participacion = await this.prisma.participacion.findUnique({ where: { id } });
    if (!participacion) {
      throw new NotFoundException('Participacion no encontrada');
    }
    return participacion;
  }
}
