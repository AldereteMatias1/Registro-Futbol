import { Injectable } from '@nestjs/common';
import { DbService } from '../../db/db.service';

type JugadorRow = {
  id: string;
  apellidoNombre: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
};

@Injectable()
export class JugadoresSqlRepository {
  constructor(private readonly db: DbService) {}

  async findAll(params: {
    activo?: boolean;
    q?: string;
    skip?: number;
    take?: number;
  }): Promise<JugadorRow[]> {
    const conditions: string[] = [];
    const values: unknown[] = [];

    if (params.activo !== undefined) {
      values.push(params.activo);
      conditions.push(`activo = $${values.length}`);
    }

    if (params.q) {
      values.push(`%${params.q}%`);
      conditions.push(`"apellidoNombre" ILIKE $${values.length}`);
    }

    let sql = `
      SELECT id, "apellidoNombre", activo, "createdAt", "updatedAt"
      FROM "Jugador"
    `;

    if (conditions.length) {
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }

    sql += ` ORDER BY "apellidoNombre" ASC`;

    if (params.take !== undefined) {
      values.push(params.take);
      sql += ` LIMIT $${values.length}`;
    }

    if (params.skip !== undefined) {
      values.push(params.skip);
      sql += ` OFFSET $${values.length}`;
    }

    return this.db.query<JugadorRow>(sql, values);
  }

  async findById(id: string): Promise<JugadorRow | null> {
    return this.db.one<JugadorRow>(
      `SELECT id, "apellidoNombre", activo, "createdAt", "updatedAt" FROM "Jugador" WHERE id = $1`,
      [id],
    );
  }

  async create(apellidoNombre: string, activo: boolean): Promise<JugadorRow | null> {
    return this.db.one<JugadorRow>(
      `
        INSERT INTO "Jugador"(id, "apellidoNombre", activo)
        VALUES (uuid_generate_v4(), $1, $2)
        RETURNING id, "apellidoNombre", activo, "createdAt", "updatedAt"
      `,
      [apellidoNombre, activo],
    );
  }

  async update(
    id: string,
    apellidoNombre?: string,
    activo?: boolean,
  ): Promise<JugadorRow | null> {
    return this.db.one<JugadorRow>(
      `
        UPDATE "Jugador"
        SET "apellidoNombre" = COALESCE($2, "apellidoNombre"),
            activo = COALESCE($3, activo),
            "updatedAt" = now()
        WHERE id = $1
        RETURNING id, "apellidoNombre", activo, "createdAt", "updatedAt"
      `,
      [id, apellidoNombre ?? null, activo ?? null],
    );
  }
}
