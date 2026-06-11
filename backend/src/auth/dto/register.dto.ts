import {
  IsEmail,
  IsString,
  IsEnum,
  IsDate,
  MinLength,
  Matches,
  IsPhoneNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum UserTypeEnum {
  SUGAR_DADDY = 'sugar_daddy',
  SUGAR_BABY = 'sugar_baby',
  SUGAR_MOMMY = 'sugar_mommy',
}

export enum GenderEnum {
  M = 'M',
  F = 'F',
  NB = 'NB',
  OTHER = 'Other',
}

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(10)
  password: string;

  @IsPhoneNumber('BR')
  phone: string;

  @IsString()
  firstName: string;

  @IsEnum(UserTypeEnum)
  userType: UserTypeEnum;

  @Type(() => Date)
  @IsDate()
  birthDate: Date;

  @IsEnum(GenderEnum)
  gender: GenderEnum;
}
