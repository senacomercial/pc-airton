import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { LivesService } from './lives.service';
import { CreateLiveDto } from './dto/create-live.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { LiveStatus } from '@prisma/client';
import { Request } from 'express';

@Controller('api/v1/lives')
@UseGuards(JwtAuthGuard)
export class LivesController {
  constructor(private livesService: LivesService) {}

  @Post()
  async createLive(@Req() req: Request, @Body() dto: CreateLiveDto) {
    const hostId = (req.user as any)?.sub;
    // TODO: Validar que o usuário é admin/moderador
    const result = await this.livesService.createLive(hostId, dto);
    return { success: true, data: result };
  }

  @Get('upcoming')
  async getUpcomingLives(@Query('limit') limit?: string) {
    const limitNum = limit ? Math.min(parseInt(limit, 10), 100) : 50;
    const lives = await this.livesService.getUpcomingLives(limitNum);
    return { success: true, data: lives };
  }

  @Get(':id')
  async getLiveDetail(@Param('id') id: string) {
    const live = await this.livesService.getLiveDetail(id);
    return { success: true, data: live };
  }

  @Post(':id/register')
  async registerForLive(@Req() req: Request, @Param('id') id: string) {
    const userId = (req.user as any)?.sub;
    const result = await this.livesService.registerForLive(userId, id);
    return { success: true, data: result };
  }

  @Post(':id/attended')
  async markAttended(@Req() req: Request, @Param('id') id: string) {
    const userId = (req.user as any)?.sub;
    const result = await this.livesService.markAttended(userId, id);
    return { success: true, data: result };
  }

  @Get('me/registrations')
  async getMyRegistrations(@Req() req: Request) {
    const userId = (req.user as any)?.sub;
    const registrations = await this.livesService.getMyLiveRegistrations(userId);
    return { success: true, data: registrations };
  }

  @Patch(':id/status')
  async updateStatus(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: { status: LiveStatus },
  ) {
    const hostId = (req.user as any)?.sub;
    const result = await this.livesService.updateLiveStatus(hostId, id, body.status);
    return { success: true, data: result };
  }
}
