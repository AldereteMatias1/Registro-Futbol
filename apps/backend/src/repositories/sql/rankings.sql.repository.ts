import { Injectable } from '@nestjs/common';
import { DbService } from '../../db/db.service';

type RankingGoleadorRow = {
  jugadorId: string;
  apellidoNombre: string;
  golesTotales: number;
  partidosJugados: number;
  promedioGolesPorJuego: number | null;
};

type RankingGanadorRow = {
  jugadorId: string;
  apellidoNombre: string;
  victorias: number;
  empates: number;
  derrotas: number;
  puntos: number;
};

type RankingAsistenciaRow = {
  jugadorId: string;
  apellidoNombre: string;
  asistenciasMes?: number;
  asistenciasAnio?: number;
};

@Injectable()
export class RankingsSqlRepository {
  constructor(private readonly db: DbService) {}

  async goleadores(): Promise<RankingGoleadorRow[]> {
    return this.db.query<RankingGoleadorRow>(
      `
        SELECT
          "jugadorId",
          "apellidoNombre",
          "golesTotales",
          "partidosJugados",
          "promedioGolesPorJuego"
        FROM v_ranking_goleadores
        ORDER BY "golesTotales" DESC, "promedioGolesPorJuego" DESC, "apellidoNombre" ASC
      `,
    );
  }

  async ganadores(): Promise<RankingGanadorRow[]> {
    return this.db.query<RankingGanadorRow>(
      `
        SELECT
          "jugadorId",
          "apellidoNombre",
          "victorias",
          "empates",
          "derrotas",
          "puntos"
        FROM v_ranking_ganadores
        ORDER BY "puntos" DESC, "victorias" DESC, "apellidoNombre" ASC
      `,
    );
  }

  async asistenciaMensual(year: number, month: number): Promise<RankingAsistenciaRow[]> {
    return this.db.query<RankingAsistenciaRow>(
      `
        SELECT
          j.id AS "jugadorId",
          j."apellidoNombre" AS "apellidoNombre",
          COUNT(*)::int AS "asistenciasMes"
        FROM "Participacion" p
        JOIN "Partido" pa ON pa.id = p."partidoId"
        JOIN "Jugador" j ON j.id = p."jugadorId"
        WHERE p.estado = 'JUGO'::"EstadoParticipacion"
          AND EXTRACT(YEAR FROM pa.fecha) = $1
          AND EXTRACT(MONTH FROM pa.fecha) = $2
        GROUP BY j.id, j."apellidoNombre"
        ORDER BY "asistenciasMes" DESC, "apellidoNombre" ASC
      `,
      [year, month],
    );
  }

  async asistenciaAnual(year: number): Promise<RankingAsistenciaRow[]> {
    return this.db.query<RankingAsistenciaRow>(
      `
        SELECT
          j.id AS "jugadorId",
          j."apellidoNombre" AS "apellidoNombre",
          COUNT(*)::int AS "asistenciasAnio"
        FROM "Participacion" p
        JOIN "Partido" pa ON pa.id = p."partidoId"
        JOIN "Jugador" j ON j.id = p."jugadorId"
        WHERE p.estado = 'JUGO'::"EstadoParticipacion"
          AND EXTRACT(YEAR FROM pa.fecha) = $1
        GROUP BY j.id, j."apellidoNombre"
        ORDER BY "asistenciasAnio" DESC, "apellidoNombre" ASC
      `,
      [year],
    );
  }
}
