import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsUUID, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class GolItemDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  jugadorId: string;

  @ApiProperty({ minimum: 0 })
  @IsInt()
  @Min(0)
  goles: number;
}

export class BulkGolDto {
  @ApiProperty({ type: [GolItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GolItemDto)
  items: GolItemDto[];
}
