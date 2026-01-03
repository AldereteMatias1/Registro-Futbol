import { Injectable } from '@nestjs/common';
import { StatsSqlRepository } from '../repositories/sql/stats.sql.repository';

@Injectable()
export class StatsService {
  constructor(private readonly statsRepository: StatsSqlRepository) {}

  async getStats(from?: string, to?: string) {
    void from;
    void to;
    return this.statsRepository.getStats();
  }
}
