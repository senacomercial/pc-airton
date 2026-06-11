import {
  IsString,
  IsOptional,
  IsArray,
  MaxLength,
  ArrayMaxSize,
  IsIn,
} from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'Bio deve ter no máximo 500 caracteres' })
  bio?: string;

  @IsArray()
  @IsOptional()
  @ArrayMaxSize(15, { message: 'Máximo 15 interesses permitidos' })
  @IsString({ each: true })
  interests?: string[];

  @IsString()
  @IsOptional()
  @MaxLength(200)
  lookingFor?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  education?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  profession?: string;

  @IsString()
  @IsOptional()
  @IsIn(['1k-5k', '5k-15k', '15k-50k', '50k+'], {
    message: 'incomeRange inválido',
  })
  incomeRange?: string;

  @IsString()
  @IsOptional()
  @IsIn(['single', 'open_relationship', 'married_open'], {
    message: 'relationshipStatus inválido',
  })
  relationshipStatus?: string;

  @IsString()
  @IsOptional()
  profilePhotoUrl?: string;

  @IsArray()
  @IsOptional()
  @ArrayMaxSize(9, { message: 'Máximo 9 fotos adicionais' })
  @IsString({ each: true })
  additionalPhotos?: string[];
}
