import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';
import { DbService } from '../../db/db.service';
import { GolItemDto } from '../../goles/dto/bulk-gol.dto';
import { EstadoParticipacion } from '../../participaciones/dto/bulk-participacion.dto';

type GolRow = {
  id: string;
  partidoId: string;
  jugadorId: string;
  goles: number;
  createdAt: string;
  updatedAt: string;
  jugador?: string;
};

@Injectable()
export class GolesSqlRepository {
  constructor(private readonly db: DbService) {}

  async findByPartido(partidoId: string): Promise<GolRow[]> {
    return this.db.query<GolRow>(
      `
        SELECT
          g.id,
          g."partidoId",
          g."jugadorId",
          g.goles,
          g."createdAt",
          g."updatedAt",
          j."apellidoNombre" AS jugador
        FROM "Gol" g
        JOIN "Jugador" j ON j.id = g."jugadorId"
        WHERE g."partidoId" = $1
        ORDER BY j."apellidoNombre" ASC
      `,
      [partidoId],
    );
  }

  async findById(id: string): Promise<{ id: string; partidoId: string; jugadorId: string } | null> {
    return this.db.one<{ id: string; partidoId: string; jugadorId: string }>(
      `SELECT id, "partidoId", "jugadorId" FROM "Gol" WHERE id = $1`,
      [id],
    );
  }

  async update(id: string, goles: number): Promise<GolRow | null> {
    return this.db.one<GolRow>(
      `
        UPDATE "Gol"
        SET goles = $2,
            "updatedAt" = now()
        WHERE id = $1
        RETURNING id, "partidoId", "jugadorId", goles, "createdAt", "updatedAt"
      `,
      [id, goles],
    );
  }

  async remove(id: string): Promise<void> {
    await this.db.query(`DELETE FROM "Gol" WHERE id = $1`, [id]);
  }

  async bulkUpsert(partidoId: string, items: GolItemDto[]): Promise<number> {
    return this.db.tx(async (client: PoolClient) => {
      for (const item of items) {
        await client.query(
          `
            INSERT INTO "Gol"(id, "partidoId", "jugadorId", goles)
            VALUES (uuid_generate_v4(), $1, $2, $3)
            ON CONFLICT ("partidoId", "jugadorId")
            DO UPDATE SET
              goles = EXCLUDED.goles,
              "updatedAt" = now()
          `,
          [partidoId, item.jugadorId, item.goles],
        );
      }
      return items.length;
    });
  }

  async findJugadoresQueJugaron(partidoId: string, jugadorIds: string[]) {
    if (!jugadorIds.length) {
      return [];
    }
    return this.db.query<{ jugadorId: string }>(
      `
        SELECT "jugadorId"
        FROM "Participacion"
        WHERE "partidoId" = $1
          AND "jugadorId" = ANY($2::uuid[])
          AND estado = $3::"EstadoParticipacion"
      `,
      [partidoId, jugadorIds, EstadoParticipacion.JUGO],
    );
  }
}
