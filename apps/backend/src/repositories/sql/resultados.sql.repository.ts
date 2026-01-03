import { Injectable } from '@nestjs/common';
import { DbService } from '../../db/db.service';

type ResultadoRow = {
  id: string;
  partidoId: string;
  golesA: number;
  golesB: number;
  ganador: string;
};

@Injectable()
export class ResultadosSqlRepository {
  constructor(private readonly db: DbService) {}

  async findByPartido(partidoId: string): Promise<ResultadoRow | null> {
    return this.db.one<ResultadoRow>(
      `
        SELECT id, "partidoId", "golesA", "golesB", ganador::text AS ganador
        FROM "Resultado"
        WHERE "partidoId" = $1
      `,
      [partidoId],
    );
  }

  async upsert(
    partidoId: string,
    golesA: number,
    golesB: number,
    ganador: string,
  ): Promise<ResultadoRow | null> {
    return this.db.one<ResultadoRow>(
      `
        INSERT INTO "Resultado"(id, "partidoId", "golesA", "golesB", ganador)
        VALUES (uuid_generate_v4(), $1, $2, $3, $4::"GanadorResultado")
        ON CONFLICT ("partidoId")
        DO UPDATE SET
          "golesA" = EXCLUDED."golesA",
          "golesB" = EXCLUDED."golesB",
          ganador = EXCLUDED.ganador,
          "updatedAt" = now()
        RETURNING id, "partidoId", "golesA", "golesB", ganador::text AS ganador
      `,
      [partidoId, golesA, golesB, ganador],
    );
  }

  async remove(partidoId: string): Promise<void> {
    await this.db.query(`DELETE FROM "Resultado" WHERE "partidoId" = $1`, [partidoId]);
  }
}
