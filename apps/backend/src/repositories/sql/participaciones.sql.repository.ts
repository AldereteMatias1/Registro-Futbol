import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';
import { DbService } from '../../db/db.service';
import { ParticipacionItemDto } from '../../participaciones/dto/bulk-participacion.dto';

type ParticipacionRow = {
  id: string;
  partidoId: string;
  jugadorId: string;
  equipo: string | null;
  estado: string;
  motivoBaja: string | null;
  comentarios: string | null;
  createdAt: string;
  updatedAt: string;
  jugador?: string;
};

@Injectable()
export class ParticipacionesSqlRepository {
  constructor(private readonly db: DbService) {}

  async findByPartido(partidoId: string): Promise<ParticipacionRow[]> {
    return this.db.query<ParticipacionRow>(
      `
        SELECT
          p.id,
          p."partidoId",
          p."jugadorId",
          p.equipo::text AS equipo,
          p.estado::text AS estado,
          p."motivoBaja",
          p.comentarios,
          p."createdAt",
          p."updatedAt",
          j."apellidoNombre" AS jugador
        FROM "Participacion" p
        JOIN "Jugador" j ON j.id = p."jugadorId"
        WHERE p."partidoId" = $1
        ORDER BY j."apellidoNombre" ASC
      `,
      [partidoId],
    );
  }

  async findById(id: string): Promise<{ id: string; partidoId: string; jugadorId: string } | null> {
    return this.db.one<{ id: string; partidoId: string; jugadorId: string }>(
      `SELECT id, "partidoId", "jugadorId" FROM "Participacion" WHERE id = $1`,
      [id],
    );
  }

  async update(
    id: string,
    equipo: string | null,
    estado: string,
    motivoBaja?: string,
    comentarios?: string,
  ): Promise<ParticipacionRow | null> {
    return this.db.one<ParticipacionRow>(
      `
        UPDATE "Participacion"
        SET equipo = $2::"Equipo",
            estado = $3::"EstadoParticipacion",
            "motivoBaja" = $4,
            comentarios = $5,
            "updatedAt" = now()
        WHERE id = $1
        RETURNING id,
                  "partidoId",
                  "jugadorId",
                  equipo::text AS equipo,
                  estado::text AS estado,
                  "motivoBaja",
                  comentarios,
                  "createdAt",
                  "updatedAt"
      `,
      [id, equipo, estado, motivoBaja ?? null, comentarios ?? null],
    );
  }

  async remove(id: string): Promise<void> {
    await this.db.query(`DELETE FROM "Participacion" WHERE id = $1`, [id]);
  }

  async bulkUpsert(partidoId: string, items: ParticipacionItemDto[]): Promise<number> {
    return this.db.tx(async (client: PoolClient) => {
      for (const item of items) {
        await client.query(
          `
            INSERT INTO "Participacion"(
              id,
              "partidoId",
              "jugadorId",
              equipo,
              estado,
              "motivoBaja",
              comentarios
            )
            VALUES (uuid_generate_v4(), $1, $2, $3::"Equipo", $4::"EstadoParticipacion", $5, $6)
            ON CONFLICT ("partidoId", "jugadorId")
            DO UPDATE SET
              equipo = EXCLUDED.equipo,
              estado = EXCLUDED.estado,
              "motivoBaja" = EXCLUDED."motivoBaja",
              comentarios = EXCLUDED.comentarios,
              "updatedAt" = now()
          `,
          [
            partidoId,
            item.jugadorId,
            item.equipo ?? null,
            item.estado,
            item.motivoBaja ?? null,
            item.comentarios ?? null,
          ],
        );
      }
      return items.length;
    });
  }
}
