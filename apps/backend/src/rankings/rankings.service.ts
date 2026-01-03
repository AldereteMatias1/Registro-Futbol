import { BadRequestException, Injectable } from '@nestjs/common';
import { RankingsSqlRepository } from '../repositories/sql/rankings.sql.repository';

@Injectable()
export class RankingsService {
  constructor(private readonly rankingsRepository: RankingsSqlRepository) {}

  async goleadores(from?: string, to?: string) {
    void from;
    void to;
    return this.rankingsRepository.goleadores();
  }

  async asistenciaMensual(year: number, month: number) {
    if (month < 1 || month > 12) {
      throw new BadRequestException('Mes invalido');
    }

    return this.rankingsRepository.asistenciaMensual(year, month);
  }

  async asistenciaAnual(year: number) {
    return this.rankingsRepository.asistenciaAnual(year);
  }

  async ganadores(from?: string, to?: string) {
    void from;
    void to;
    return this.rankingsRepository.ganadores();
  }
}
