import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import { Request } from 'express';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Controller('api/v1/subscriptions')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createSubscription(
    @Req() req: Request,
    @Body() dto: CreateSubscriptionDto,
  ) {
    const user = req.user as any;
    return this.paymentsService.createSubscription(user.sub, dto);
  }

  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(@Body() payload: any) {
    return this.paymentsService.processWebhook(payload);
  }
}
