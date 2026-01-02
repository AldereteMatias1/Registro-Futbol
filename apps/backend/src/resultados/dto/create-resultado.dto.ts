import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class CreateResultadoDto {
  @ApiProperty({ minimum: 0 })
  @IsInt()
  @Min(0)
  golesA: number;

  @ApiProperty({ minimum: 0 })
  @IsInt()
  @Min(0)
  golesB: number;
}
