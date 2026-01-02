import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class CreateJugadorDto {
  @ApiProperty({ minLength: 3, maxLength: 80 })
  @IsString()
  @Length(3, 80)
  apellidoNombre: string;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
