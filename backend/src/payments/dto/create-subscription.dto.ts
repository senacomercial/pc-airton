import { IsEnum } from 'class-validator';

export enum PlanTypeEnum {
  BABY = 'baby',
  DADDY_MOMMY = 'daddy_mommy',
}

export class CreateSubscriptionDto {
  @IsEnum(PlanTypeEnum)
  planType: PlanTypeEnum;
}
