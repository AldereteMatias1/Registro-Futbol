import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EstadoParticipacion, GanadorResultado, Prisma } from '@prisma/client';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(from?: string, to?: string) {
    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;

    const dateFilter = this.buildDateFilter(fromDate, toDate);

    const query = Prisma.sql`
      SELECT
        j.id as "jugadorId",
        j."apellidoNombre" as "apellidoNombre",
        COALESCE(SUM(g.goles), 0) as "golesTotales",
        COUNT(CASE WHEN p.estado = ${EstadoParticipacion.JUGO}::"EstadoParticipacion" THEN 1 END) as "partidosJugados",
        CASE
          WHEN COUNT(CASE WHEN p.estado = ${EstadoParticipacion.JUGO}::"EstadoParticipacion" THEN 1 END) = 0 THEN NULL
          ELSE COALESCE(SUM(g.goles), 0)::decimal
            / COUNT(CASE WHEN p.estado = ${EstadoParticipacion.JUGO}::"EstadoParticipacion" THEN 1 END)
        END as "promedioGolesPorJuego",
        COUNT(CASE WHEN p.estado = ${EstadoParticipacion.JUGO}::"EstadoParticipacion" THEN 1 END) as "asistencias",
        COUNT(CASE WHEN p.estado = ${EstadoParticipacion.BAJA}::"EstadoParticipacion" THEN 1 END) as "bajas",
        COUNT(CASE WHEN p.estado = ${EstadoParticipacion.ANOTADO}::"EstadoParticipacion" THEN 1 END) as "anotado",
        COUNT(
          CASE
            WHEN p.estado = ${EstadoParticipacion.JUGO}::"EstadoParticipacion"
              AND r.ganador::text = p.equipo::text
              THEN 1
          END
        ) as "victorias",
        COUNT(
          CASE
            WHEN p.estado = ${EstadoParticipacion.JUGO}::"EstadoParticipacion"
              AND r.ganador = ${GanadorResultado.EMPATE}::"GanadorResultado"
              THEN 1
          END
        ) as "empates",
        COUNT(
          CASE
            WHEN p.estado = ${EstadoParticipacion.JUGO}::"EstadoParticipacion"
              AND r.ganador IN (
                ${GanadorResultado.A}::"GanadorResultado",
                ${GanadorResultado.B}::"GanadorResultado"
              )
              AND r.ganador::text <> p.equipo::text
              THEN 1
          END
        ) as "derrotas",
        (COUNT(
          CASE
            WHEN p.estado = ${EstadoParticipacion.JUGO}::"EstadoParticipacion"
              AND r.ganador::text = p.equipo::text
              THEN 1
          END
        ) * 3
          + COUNT(
            CASE
              WHEN p.estado = ${EstadoParticipacion.JUGO}::"EstadoParticipacion"
                AND r.ganador = ${GanadorResultado.EMPATE}::"GanadorResultado"
                THEN 1
            END
          )) as "puntos"
      FROM "Jugador" j
      LEFT JOIN "Participacion" p ON p."jugadorId" = j.id
      LEFT JOIN "Partido" pa ON pa.id = p."partidoId"
      LEFT JOIN "Gol" g ON g."jugadorId" = j.id AND g."partidoId" = p."partidoId"
      LEFT JOIN "Resultado" r ON r."partidoId" = p."partidoId"
      ${dateFilter}
      GROUP BY j.id
      ORDER BY "puntos" DESC, "golesTotales" DESC, j."apellidoNombre" ASC
    `;

    return this.prisma.$queryRaw(query);
  }

  private buildDateFilter(from?: Date, to?: Date) {
    if (!from && !to) {
      return Prisma.empty;
    }
    if (from && to) {
      return Prisma.sql`WHERE pa.fecha >= ${from} AND pa.fecha <= ${to}`;
    }
    if (from) {
      return Prisma.sql`WHERE pa.fecha >= ${from}`;
    }
    return Prisma.sql`WHERE pa.fecha <= ${to}`;
  }
}
