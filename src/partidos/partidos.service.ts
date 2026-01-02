import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePartidoDto } from './dto/create-partido.dto';
import { UpdatePartidoDto } from './dto/update-partido.dto';
import { buildPagination } from '../common/pagination/pagination';

@Injectable()
export class PartidosService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: { from?: string; to?: string; page?: number; size?: number }) {
    const { skip, take } = buildPagination(params.page, params.size);
    const from = params.from ? new Date(params.from) : undefined;
    const to = params.to ? new Date(params.to) : undefined;

    return this.prisma.partido.findMany({
      where: {
        fecha: {
          gte: from,
          lte: to,
        },
      },
      orderBy: {
        fecha: 'desc',
      },
      skip,
      take,
    });
  }

  async create(dto: CreatePartidoDto) {
    return this.prisma.partido.create({
      data: {
        fecha: new Date(dto.fecha),
        cancha: dto.cancha,
        notas: dto.notas,
      },
    });
  }

  async update(id: string, dto: UpdatePartidoDto) {
    await this.ensureExists(id);
    return this.prisma.partido.update({
      where: { id },
      data: {
        fecha: dto.fecha ? new Date(dto.fecha) : undefined,
        cancha: dto.cancha,
        notas: dto.notas,
      },
    });
  }

  async remove(id: string) {
    const exists = await this.ensureExists(id);
    const relations = await this.prisma.partido.findUnique({
      where: { id },
      include: {
        participaciones: true,
        goles: true,
        resultado: true,
      },
    });

    if (relations && (relations.participaciones.length || relations.goles.length || relations.resultado)) {
      throw new BadRequestException(
        'No se puede eliminar partido con participaciones, goles o resultado',
      );
    }

    await this.prisma.partido.delete({ where: { id: exists.id } });
    return { ok: true };
  }

  private async ensureExists(id: string) {
    const partido = await this.prisma.partido.findUnique({ where: { id } });
    if (!partido) {
      throw new NotFoundException('Partido no encontrado');
    }
    return partido;
  }
}
