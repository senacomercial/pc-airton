import { IsEnum, IsString, IsOptional, MaxLength } from 'class-validator';

// Espelha o enum ModeratorAction do Prisma
export enum ModeratorActionEnum {
  DISMISS = 'dismiss',
  WARNING = 'warning',
  SUSPEND_24H = 'suspend_24h',
  SUSPEND_7D = 'suspend_7d',
  SUSPEND_30D = 'suspend_30d',
  BAN_PERMANENT = 'ban_permanent',
}

export class ResolveReportDto {
  @IsEnum(ModeratorActionEnum)
  action: ModeratorActionEnum;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  moderatorNotes?: string;
}
