import { IsString, Length, IsPhoneNumber } from 'class-validator';

export class SendPhoneCodeDto {
  @IsPhoneNumber('BR')
  phone: string;
}

export class VerifyPhoneDto {
  @IsString()
  @Length(6, 6)
  code: string;
}
