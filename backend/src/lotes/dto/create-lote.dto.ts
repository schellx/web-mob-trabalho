import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
} from 'class-validator';

export class CreateLoteDto {
  @IsString()
  @IsNotEmpty()
  nome!: string;

  @IsInt()
  @Min(1)
  quantidade!: number;

  @IsDateString()
  inicio!: string;

  @IsDateString()
  fim!: string;
}