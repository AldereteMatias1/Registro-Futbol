import { Injectable } from '@nestjs/common';
import { DbService } from '../../db/db.service';

type PartidoRow = {
  id: string;
  fecha: string;
  cancha: string | null;
  notas: string | null;
  createdAt: string;
  updatedAt: string;
};

type PartidoRelations = {
  participaciones: boolean;
  goles: boolean;
  resultado: boolean;
};

@Injectable()
export class PartidosSqlRepository {
  constructor(private readonly db: DbService) {}

  async findAll(params: {
    from?: Date;
    to?: Date;
    skip?: number;
    take?: number;
  }): Promise<PartidoRow[]> {
    const conditions: string[] = [];
    const values: unknown[] = [];

    if (params.from) {
      values.push(params.from);
      conditions.push(`fecha >= $${values.length}`);
    }

    if (params.to) {
      values.push(params.to);
      conditions.push(`fecha <= $${values.length}`);
    }

    let sql = `
      SELECT id, fecha, cancha, notas, "createdAt", "updatedAt"
      FROM "Partido"
    `;

    if (conditions.length) {
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }

    sql += ` ORDER BY fecha DESC`;

    if (params.take !== undefined) {
      values.push(params.take);
      sql += ` LIMIT $${values.length}`;
    }

    if (params.skip !== undefined) {
      values.push(params.skip);
      sql += ` OFFSET $${values.length}`;
    }

    return this.db.query<PartidoRow>(sql, values);
  }

  async findById(id: string): Promise<PartidoRow | null> {
    return this.db.one<PartidoRow>(
      `SELECT id, fecha, cancha, notas, "createdAt", "updatedAt" FROM "Partido" WHERE id = $1`,
      [id],
    );
  }

  async create(fecha: Date, cancha?: string, notas?: string): Promise<PartidoRow | null> {
    return this.db.one<PartidoRow>(
      `
        INSERT INTO "Partido"(id, fecha, cancha, notas)
        VALUES (uuid_generate_v4(), $1, $2, $3)
        RETURNING id, fecha, cancha, notas, "createdAt", "updatedAt"
      `,
      [fecha, cancha ?? null, notas ?? null],
    );
  }

  async update(
    id: string,
    fecha?: Date,
    cancha?: string,
    notas?: string,
  ): Promise<PartidoRow | null> {
    return this.db.one<PartidoRow>(
      `
        UPDATE "Partido"
        SET fecha = COALESCE($2, fecha),
            cancha = COALESCE($3, cancha),
            notas = COALESCE($4, notas),
            "updatedAt" = now()
        WHERE id = $1
        RETURNING id, fecha, cancha, notas, "createdAt", "updatedAt"
      `,
      [id, fecha ?? null, cancha ?? null, notas ?? null],
    );
  }

  async remove(id: string): Promise<void> {
    await this.db.query(`DELETE FROM "Partido" WHERE id = $1`, [id]);
  }

  async findRelations(id: string): Promise<PartidoRelations | null> {
    return this.db.one<PartidoRelations>(
      `
        SELECT
          EXISTS(SELECT 1 FROM "Participacion" WHERE "partidoId" = $1) AS participaciones,
          EXISTS(SELECT 1 FROM "Gol" WHERE "partidoId" = $1) AS goles,
          EXISTS(SELECT 1 FROM "Resultado" WHERE "partidoId" = $1) AS resultado
      `,
      [id],
    );
  }
}
