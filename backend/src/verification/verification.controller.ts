import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { VerificationService } from './verification.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { SendPhoneCodeDto, VerifyPhoneDto } from './dto/verify-phone.dto';
import { VerifyLivenessDto } from './dto/verify-liveness.dto';

@Controller('api/v1/verification')
@UseGuards(JwtAuthGuard)
export class VerificationController {
  constructor(private verificationService: VerificationService) {}

  @Post('send-phone-code')
  async sendPhoneCode(
    @Req() req: Request,
    @Body() dto: SendPhoneCodeDto,
  ) {
    const user = req.user as any;
    return this.verificationService.sendPhoneCode(user.sub, dto);
  }

  @Post('verify-phone')
  async verifyPhone(
    @Req() req: Request,
    @Body() dto: VerifyPhoneDto,
  ) {
    const user = req.user as any;
    return this.verificationService.verifyPhoneCode(user.sub, dto);
  }

  @Post('liveness')
  async verifyLiveness(
    @Req() req: Request,
    @Body() dto: VerifyLivenessDto,
  ) {
    const user = req.user as any;
    return this.verificationService.verifyLiveness(user.sub, dto);
  }
}
