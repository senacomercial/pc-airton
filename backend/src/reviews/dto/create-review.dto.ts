import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  Max,
  IsObject,
  IsOptional,
  IsBoolean,
  MaxLength,
} from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty()
  conversationId: string; // Prova de relacionamento

  @IsString()
  @IsNotEmpty()
  reviewedUserId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsObject()
  dimensions: {
    respect?: number; // 1-5: respeitou limites e consentimento?
    communication?: number; // 1-5: comunicação clara e honesta?
    safety?: number; // 1-5: se sentiu seguro/a?
    honesty?: number; // 1-5: foi honesto sobre intenções?
    discretion?: number; // 1-5: manteve privacidade?
  };

  @IsString()
  @IsOptional()
  @MaxLength(500)
  comment?: string;

  @IsBoolean()
  @IsOptional()
  anonymous?: boolean;
}
