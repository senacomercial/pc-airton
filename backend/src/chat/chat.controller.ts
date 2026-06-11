import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { SubscriptionGuard } from './guards/subscription.guard';
import { SendMessageDto, CreateConversationDto } from './dto/send-message.dto';

@Controller('api/v1/chat')
@UseGuards(JwtAuthGuard, SubscriptionGuard)
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('conversations')
  async listConversations(@Req() req: Request) {
    const user = req.user as any;
    return this.chatService.listConversations(user.sub);
  }

  @Post('conversations')
  async createConversation(
    @Req() req: Request,
    @Body() dto: CreateConversationDto,
  ) {
    const user = req.user as any;
    return this.chatService.createConversation(user.sub, dto);
  }

  @Get('conversations/:id/messages')
  async getMessages(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) conversationId: string,
    @Query('limit') limit?: string,
    @Query('before') before?: string,
  ) {
    const user = req.user as any;
    return this.chatService.getMessages(
      user.sub,
      conversationId,
      limit ? parseInt(limit) : 50,
      before ? new Date(before) : undefined,
    );
  }

  @Post('messages')
  async sendMessage(@Req() req: Request, @Body() dto: SendMessageDto) {
    const user = req.user as any;
    return this.chatService.sendMessage(user.sub, dto);
  }

  @Post('conversations/:id/read')
  async markAsRead(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) conversationId: string,
  ) {
    const user = req.user as any;
    return this.chatService.markAsRead(user.sub, conversationId);
  }
}
