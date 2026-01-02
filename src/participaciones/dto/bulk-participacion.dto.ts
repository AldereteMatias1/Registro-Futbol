import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString, IsUUID, ValidateNested, Length } from 'class-validator';
import { Type } from 'class-transformer';

export enum Equipo {
  A = 'A',
  B = 'B',
}

export enum EstadoParticipacion {
  ANOTADO = 'ANOTADO',
  JUGO = 'JUGO',
  BAJA = 'BAJA',
}

export class ParticipacionItemDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  jugadorId: string;

  @ApiProperty({ required: false, enum: Equipo })
  @IsOptional()
  @IsEnum(Equipo)
  equipo?: Equipo;

  @ApiProperty({ enum: EstadoParticipacion })
  @IsEnum(EstadoParticipacion)
  estado: EstadoParticipacion;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Length(0, 120)
  motivoBaja?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  comentarios?: string;
}

export class BulkParticipacionDto {
  @ApiProperty({ type: [ParticipacionItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ParticipacionItemDto)
  items: ParticipacionItemDto[];
}
