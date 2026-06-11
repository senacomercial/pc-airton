import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { EncryptionService } from './encryption.service';
import { SubscriptionGuard } from './guards/subscription.guard';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret',
    }),
  ],
  providers: [ChatService, ChatGateway, EncryptionService, SubscriptionGuard],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}
