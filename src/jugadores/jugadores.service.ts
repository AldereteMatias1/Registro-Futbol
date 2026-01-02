import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJugadorDto } from './dto/create-jugador.dto';
import { UpdateJugadorDto } from './dto/update-jugador.dto';
import { buildPagination } from '../common/pagination/pagination';

@Injectable()
export class JugadoresService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: { activo?: boolean; q?: string; page?: number; size?: number }) {
    const { skip, take } = buildPagination(params.page, params.size);
    return this.prisma.jugador.findMany({
      where: {
        activo: params.activo,
        apellidoNombre: params.q
          ? {
              contains: params.q,
              mode: 'insensitive',
            }
          : undefined,
      },
      orderBy: {
        apellidoNombre: 'asc',
      },
      skip,
      take,
    });
  }

  async create(dto: CreateJugadorDto) {
    return this.prisma.jugador.create({
      data: {
        apellidoNombre: dto.apellidoNombre,
        activo: dto.activo ?? true,
      },
    });
  }

  async update(id: string, dto: UpdateJugadorDto) {
    await this.ensureExists(id);
    return this.prisma.jugador.update({
      where: { id },
      data: dto,
    });
  }

  async softDelete(id: string) {
    await this.ensureExists(id);
    await this.prisma.jugador.update({
      where: { id },
      data: { activo: false },
    });
    return { ok: true };
  }

  private async ensureExists(id: string) {
    const jugador = await this.prisma.jugador.findUnique({ where: { id } });
    if (!jugador) {
      throw new NotFoundException('Jugador no encontrado');
    }
  }
}
