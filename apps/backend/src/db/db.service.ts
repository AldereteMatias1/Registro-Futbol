import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Pool, PoolClient, QueryResult } from 'pg';

@Injectable()
export class DbService implements OnModuleDestroy {
  private readonly pool: Pool;
  private readonly logger = new Logger(DbService.name);

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  async query<T>(sql: string, params: unknown[] = []): Promise<T[]> {
    try {
      const result: QueryResult<T> = await this.pool.query(sql, params);
      return result.rows;
    } catch (error) {
      this.logError('query', error);
      throw error;
    }
  }

  async one<T>(sql: string, params: unknown[] = []): Promise<T | null> {
    const rows = await this.query<T>(sql, params);
    return rows[0] ?? null;
  }

  async tx<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await fn(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      this.logError('transaction', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  private logError(context: string, error: unknown) {
    if (error instanceof Error) {
      this.logger.error(`[${context}] ${error.message}`);
    } else {
      this.logger.error(`[${context}] Unknown database error`);
    }
  }
}
