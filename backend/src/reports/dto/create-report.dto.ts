import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsArray,
  ValidateNested,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

// Espelha o enum ReportType do Prisma, mas exposto como valores de API
export enum ReportTypeEnum {
  ABUSIVE_BEHAVIOR = 'abusive_behavior',
  SCAM = 'scam',
  INAPPROPRIATE_CONTENT = 'inappropriate_content',
  SEXUAL_HARASSMENT = 'sexual_harassment',
  EXPLOITATION = 'exploitation',
  OTHER = 'other',
}

export class EvidenceItemDto {
  @IsString()
  @IsOptional()
  type?: string; // message, screenshot, profile

  @IsString()
  @IsOptional()
  conversationId?: string;

  @IsString()
  @IsOptional()
  messageId?: string;

  @IsString()
  @IsOptional()
  screenshotUrl?: string;
}

export class CreateReportDto {
  @IsString()
  @IsNotEmpty()
  reportedUserId: string;

  @IsEnum(ReportTypeEnum)
  type: ReportTypeEnum;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  description: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => EvidenceItemDto)
  evidence?: EvidenceItemDto[];
}
