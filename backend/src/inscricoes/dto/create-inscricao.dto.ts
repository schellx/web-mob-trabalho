import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class CreateInscricaoDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  participanteId!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  eventoId!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  loteId!: number;
}