import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, Length } from 'class-validator';

export class CreatePartidoDto {
  @ApiProperty({ description: 'ISO8601' })
  @IsDateString()
  fecha: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Length(0, 80)
  cancha?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notas?: string;
}
