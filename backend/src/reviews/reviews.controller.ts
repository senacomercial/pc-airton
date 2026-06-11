import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { TrustScoreDto } from './dto/trust-score.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('api/v1/reviews')
@UseGuards(JwtAuthGuard)
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Post()
  async create(@Req() req: Request, @Body() dto: CreateReviewDto) {
    const reviewerId = (req.user as any)?.sub;
    const result = await this.reviewsService.createReview(reviewerId, dto);
    return { success: true, data: result };
  }

  @Get('user/:userId')
  async getUserTrustScore(@Param('userId') userId: string): Promise<{ success: boolean; data: TrustScoreDto }> {
    const trustScore = await this.reviewsService.getUserTrustScore(userId);
    return { success: true, data: trustScore as TrustScoreDto };
  }

  @Get('user/:userId/received')
  async getReceivedReviews(
    @Param('userId') userId: string,
    @Query('limit') limit?: string,
  ) {
    const limitNum = limit ? Math.min(parseInt(limit, 10), 100) : 50;
    const reviews = await this.reviewsService.getReceivedReviews(userId, limitNum);
    return { success: true, data: reviews };
  }

  @Get('mine')
  async getMyReviews(
    @Req() req: Request,
    @Query('limit') limit?: string,
  ) {
    const userId = (req.user as any)?.sub;
    const limitNum = limit ? Math.min(parseInt(limit, 10), 100) : 50;
    const reviews = await this.reviewsService.getSubmittedReviews(userId, limitNum);
    return { success: true, data: reviews };
  }
}
