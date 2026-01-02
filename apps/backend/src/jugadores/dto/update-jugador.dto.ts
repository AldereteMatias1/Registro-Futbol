import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class UpdateJugadorDto {
  @ApiPropertyOptional({ minLength: 3, maxLength: 80 })
  @IsOptional()
  @IsString()
  @Length(3, 80)
  apellidoNombre?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
