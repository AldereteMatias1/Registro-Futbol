import { Injectable } from '@nestjs/common';
import { DbService } from '../../db/db.service';

type StatsRow = {
  jugadorId: string;
  apellidoNombre: string;
  golesTotales: number;
  partidosJugados: number;
  promedioGolesPorJuego: number | null;
  asistencias: number;
  bajas: number;
  anotado: number;
  victorias: number;
  empates: number;
  derrotas: number;
  puntos: number;
};

@Injectable()
export class StatsSqlRepository {
  constructor(private readonly db: DbService) {}

  async getStats(): Promise<StatsRow[]> {
    return this.db.query<StatsRow>(
      `
        SELECT
          "jugadorId",
          "apellidoNombre",
          "golesTotales",
          "partidosJugados",
          "promedioGolesPorJuego",
          "asistencias",
          "bajas",
          "anotado",
          "victorias",
          "empates",
          "derrotas",
          "puntos"
        FROM v_stats_jugadores
        ORDER BY "puntos" DESC, "golesTotales" DESC, "apellidoNombre" ASC
      `,
    );
  }
}
