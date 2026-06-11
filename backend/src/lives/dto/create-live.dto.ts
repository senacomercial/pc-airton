import {
  IsString,
  IsNotEmpty,
  IsISO8601,
  IsOptional,
  IsInt,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateLiveDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @IsISO8601()
  startTime: string; // ISO 8601 datetime

  @IsInt()
  @Min(15)
  durationMin: number; // Duração mínima em minutos

  @IsString()
  @IsNotEmpty()
  meetUrl: string; // Link do Google Meet
}
