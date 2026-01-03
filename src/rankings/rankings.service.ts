import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, EstadoParticipacion, GanadorResultado } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RankingsService {
  constructor(private readonly prisma: PrismaService) {}

  async goleadores(from?: string, to?: string) {
    const dateFilter = this.buildDateFilter(from, to);

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
        END as "promedioGolesPorJuego"
      FROM "Jugador" j
      LEFT JOIN "Participacion" p ON p."jugadorId" = j.id
      LEFT JOIN "Partido" pa ON pa.id = p."partidoId"
      LEFT JOIN "Gol" g ON g."jugadorId" = j.id AND g."partidoId" = p."partidoId"
      ${dateFilter}
      GROUP BY j.id
      ORDER BY "golesTotales" DESC, "promedioGolesPorJuego" DESC, j."apellidoNombre" ASC
    `;

    return this.prisma.$queryRaw(query);
  }

  async asistenciaMensual(year: number, month: number) {
    if (month < 1 || month > 12) {
      throw new BadRequestException('Mes invalido');
    }

    return this.prisma.$queryRaw(
      Prisma.sql`
        SELECT
          j.id as "jugadorId",
          j."apellidoNombre" as "apellidoNombre",
          COUNT(CASE WHEN p.estado = ${EstadoParticipacion.JUGO}::"EstadoParticipacion" THEN 1 END) as "asistenciasMes"
        FROM "Jugador" j
        LEFT JOIN "Participacion" p ON p."jugadorId" = j.id
        LEFT JOIN "Partido" pa ON pa.id = p."partidoId"
        WHERE EXTRACT(YEAR FROM pa.fecha) = ${year}
          AND EXTRACT(MONTH FROM pa.fecha) = ${month}
        GROUP BY j.id
        ORDER BY "asistenciasMes" DESC, j."apellidoNombre" ASC
      `,
    );
  }

  async asistenciaAnual(year: number) {
    return this.prisma.$queryRaw(
      Prisma.sql`
        SELECT
          j.id as "jugadorId",
          j."apellidoNombre" as "apellidoNombre",
          COUNT(CASE WHEN p.estado = ${EstadoParticipacion.JUGO}::"EstadoParticipacion" THEN 1 END) as "asistenciasAnio"
        FROM "Jugador" j
        LEFT JOIN "Participacion" p ON p."jugadorId" = j.id
        LEFT JOIN "Partido" pa ON pa.id = p."partidoId"
        WHERE EXTRACT(YEAR FROM pa.fecha) = ${year}
        GROUP BY j.id
        ORDER BY "asistenciasAnio" DESC, j."apellidoNombre" ASC
      `,
    );
  }

  async ganadores(from?: string, to?: string) {
    const dateFilter = this.buildDateFilter(from, to);

    const query = Prisma.sql`
      SELECT
        j.id as "jugadorId",
        j."apellidoNombre" as "apellidoNombre",
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
      LEFT JOIN "Resultado" r ON r."partidoId" = p."partidoId"
      ${dateFilter}
      GROUP BY j.id
      ORDER BY "puntos" DESC, "victorias" DESC, j."apellidoNombre" ASC
    `;

    return this.prisma.$queryRaw(query);
  }

  private buildDateFilter(from?: string, to?: string) {
    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;

    if (!fromDate && !toDate) {
      return Prisma.empty;
    }
    if (fromDate && toDate) {
      return Prisma.sql`WHERE pa.fecha >= ${fromDate} AND pa.fecha <= ${toDate}`;
    }
    if (fromDate) {
      return Prisma.sql`WHERE pa.fecha >= ${fromDate}`;
    }
    return Prisma.sql`WHERE pa.fecha <= ${toDate}`;
  }
}
