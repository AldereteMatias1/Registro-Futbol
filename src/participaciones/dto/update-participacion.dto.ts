import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { Equipo, EstadoParticipacion } from './bulk-participacion.dto';

export class UpdateParticipacionDto {
  @ApiPropertyOptional({ enum: Equipo })
  @IsOptional()
  @IsEnum(Equipo)
  equipo?: Equipo;

  @ApiPropertyOptional({ enum: EstadoParticipacion })
  @IsOptional()
  @IsEnum(EstadoParticipacion)
  estado?: EstadoParticipacion;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(0, 120)
  motivoBaja?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  comentarios?: string;
}
