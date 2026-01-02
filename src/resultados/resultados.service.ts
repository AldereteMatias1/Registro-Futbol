import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResultadoDto } from './dto/create-resultado.dto';
import { GanadorResultado } from '@prisma/client';

@Injectable()
export class ResultadosService {
  constructor(private readonly prisma: PrismaService) {}

  async findByPartido(partidoId: string) {
    return this.prisma.resultado.findUnique({ where: { partidoId } });
  }

  async upsert(partidoId: string, dto: CreateResultadoDto) {
    const ganador = this.computeWinner(dto.golesA, dto.golesB);
    return this.prisma.resultado.upsert({
      where: { partidoId },
      create: {
        partidoId,
        golesA: dto.golesA,
        golesB: dto.golesB,
        ganador,
      },
      update: {
        golesA: dto.golesA,
        golesB: dto.golesB,
        ganador,
      },
    });
  }

  async remove(partidoId: string) {
    await this.prisma.resultado.delete({ where: { partidoId } });
    return { ok: true };
  }

  private computeWinner(golesA: number, golesB: number) {
    if (golesA > golesB) {
      return GanadorResultado.A;
    }
    if (golesB > golesA) {
      return GanadorResultado.B;
    }
    return GanadorResultado.EMPATE;
  }
}
