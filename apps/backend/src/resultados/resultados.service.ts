import { Injectable } from '@nestjs/common';
import { ResultadosSqlRepository } from '../repositories/sql/resultados.sql.repository';
import { CreateResultadoDto } from './dto/create-resultado.dto';

@Injectable()
export class ResultadosService {
  constructor(private readonly resultadosRepository: ResultadosSqlRepository) {}

  async findByPartido(partidoId: string) {
    return this.resultadosRepository.findByPartido(partidoId);
  }

  async upsert(partidoId: string, dto: CreateResultadoDto) {
    const ganador = this.computeWinner(dto.golesA, dto.golesB);
    return this.resultadosRepository.upsert(partidoId, dto.golesA, dto.golesB, ganador);
  }

  async remove(partidoId: string) {
    await this.resultadosRepository.remove(partidoId);
    return { ok: true };
  }

  private computeWinner(golesA: number, golesB: number) {
    if (golesA > golesB) {
      return 'A';
    }
    if (golesB > golesA) {
      return 'B';
    }
    return 'EMPATE';
  }
}
