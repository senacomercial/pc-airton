import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';

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
    @Body() updateData: UpdateProfileDto,
  ) {
    const user = req.user as any;
    // Validações ficam no UpdateProfileDto (class-validator)
    return this.usersService.updateUserProfile(user.sub, updateData);
  }
}
