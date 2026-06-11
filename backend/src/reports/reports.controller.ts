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
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { ResolveReportDto } from './dto/resolve-report.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { ModeratorGuard } from './guards/moderator.guard';
import { ReportStatus } from '@prisma/client';
import { Request } from 'express';

@Controller('api/v1/reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  // ---- Endpoints de usuário ----

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Req() req: Request, @Body() dto: CreateReportDto) {
    const userId = (req.user as any)?.sub;
    const result = await this.reportsService.createReport(userId, dto);
    return { success: true, data: result };
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  async myReports(@Req() req: Request) {
    const userId = (req.user as any)?.sub;
    const reports = await this.reportsService.getMyReports(userId);
    return { success: true, data: reports };
  }

  // ---- Endpoints de moderação ----

  @Get('queue')
  @UseGuards(JwtAuthGuard, ModeratorGuard)
  async queue(@Query('status') status?: ReportStatus) {
    const result = await this.reportsService.getModerationQueue(status);
    return { success: true, data: result };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, ModeratorGuard)
  async detail(@Param('id') id: string) {
    const report = await this.reportsService.getReportDetail(id);
    return { success: true, data: report };
  }

  @Patch(':id/resolve')
  @UseGuards(JwtAuthGuard, ModeratorGuard)
  async resolve(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: ResolveReportDto,
  ) {
    const moderatorId = (req.user as any)?.sub;
    const result = await this.reportsService.resolveReport(moderatorId, id, dto);
    return { success: true, data: result };
  }
}
