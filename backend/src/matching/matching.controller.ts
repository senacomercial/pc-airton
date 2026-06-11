import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { MatchingService } from './matching.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { SubscriptionGuard } from '@/chat/guards/subscription.guard';
import { Request } from 'express';

@Controller('api/v1/matches')
@UseGuards(JwtAuthGuard, SubscriptionGuard)
export class MatchingController {
  constructor(private matchingService: MatchingService) {}

  @Get()
  async getMatches(
    @Req() req: Request,
    @Query('limit') limit?: string,
  ) {
    const userId = (req.user as any)?.sub;
    const limitNum = limit ? Math.min(parseInt(limit, 10), 100) : 50;

    const matches = await this.matchingService.getMatches(userId, limitNum);

    return {
      success: true,
      data: matches,
      message: `${matches.totalMatches} matches encontrados`,
    };
  }
}
