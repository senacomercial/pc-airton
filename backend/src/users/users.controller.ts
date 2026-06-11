import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@Controller('api/v1/users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  async getProfile(@Req() req: Request) {
    const user = req.user as any;
    return this.usersService.getUserById(user.sub);
  }

  @Get('profile')
  async getDetailedProfile(@Req() req: Request) {
    const user = req.user as any;
    return this.usersService.getUserProfile(user.sub);
  }

  @Put('profile')
  async updateProfile(
    @Req() req: Request,
    @Body() updateData: any,
  ) {
    const user = req.user as any;

    // Validações básicas
    if (updateData.bio && updateData.bio.length > 500) {
      throw new BadRequestException('Bio deve ter no máximo 500 caracteres');
    }

    if (updateData.interests && updateData.interests.length > 15) {
      throw new BadRequestException(
        'Máximo 15 interesses permitidos',
      );
    }

    return this.usersService.updateUserProfile(user.sub, updateData);
  }
}
